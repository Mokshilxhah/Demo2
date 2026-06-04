# 📄 DOC 2 — Auth System: Pages, API & Implementation Guide

> **Covers:** User Register · User Login · Admin Login · JWT Flows · Protected Routes · Middleware · Email Verification

---

## 1. Auth Architecture Overview

```
┌───────────────────────────────────────────────────────┐
│  CLIENT (React)                                       │
│                                                       │
│  /register   →  POST /api/auth/register               │
│  /login      →  POST /api/auth/login                  │
│  /admin      →  POST /api/auth/admin/login            │
│                                                       │
│  Token stored in: httpOnly Cookie (recommended)       │
│                   OR localStorage (simpler)           │
└───────────────────┬───────────────────────────────────┘
                    │ JWT
┌───────────────────▼───────────────────────────────────┐
│  SERVER (Node.js / Express)                           │
│                                                       │
│  authRoutes.js                                        │
│    POST /api/auth/register                            │
│    POST /api/auth/login                               │
│    POST /api/auth/admin/login                         │
│    POST /api/auth/logout                              │
│    GET  /api/auth/me                                  │
│    POST /api/auth/verify-email                        │
│                                                       │
│  middleware/                                          │
│    authMiddleware.js   ← verifyToken                  │
│    adminMiddleware.js  ← requireAdmin                 │
└───────────────────┬───────────────────────────────────┘
                    │
┌───────────────────▼───────────────────────────────────┐
│  DATABASE (MongoDB)                                   │
│  Collection: users                                    │
│    { _id, name, email, password(hashed),              │
│      role: 'user'|'admin',                            │
│      isVerified, createdAt, ... }                     │
└───────────────────────────────────────────────────────┘
```

---

## 2. Database Schema

```js
// models/User.js
const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String, required: true, trim: true, minlength: 2, maxlength: 50
  },
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true
  },
  password: {
    type: String, required: true, minlength: 8, select: false
    // select: false → not returned in queries by default
  },
  role: {
    type: String, enum: ['user', 'admin'], default: 'user'
  },
  isEmailVerified: {
    type: Boolean, default: false
  },
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  passwordResetToken: String,
  passwordResetExpiry: Date,
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  profilePhoto: { type: String, default: '' },
  projectsSubmitted: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Project'
  }],
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
})

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare method
UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

module.exports = mongoose.model('User', UserSchema)
```

---

## 3. Backend — Auth Routes

### 3.1 Setup (authRoutes.js)

```js
const express  = require('express')
const router   = express.Router()
const jwt      = require('jsonwebtoken')
const crypto   = require('crypto')
const User     = require('../models/User')
const { sendVerificationEmail } = require('../services/emailService')

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' })

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
}
```

---

### 3.2 API 1: User Register

```
POST /api/auth/register
Body: { name, email, password, phone? }
```

```js
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    // Validation
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required' })
    if (password.length < 8)
      return res.status(400).json({ success: false, message: 'Password min 8 characters' })

    // Check duplicate
    const existing = await User.findOne({ email })
    if (existing)
      return res.status(409).json({ success: false, message: 'Email already registered' })

    // Create verification token
    const verifyToken = crypto.randomBytes(32).toString('hex')

    // Create user
    const user = await User.create({
      name, email, password, phone,
      emailVerificationToken: verifyToken,
      emailVerificationExpiry: Date.now() + 24 * 60 * 60 * 1000 // 24h
    })

    // Send verification email
    await sendVerificationEmail(user.email, user.name, verifyToken)

    // Generate JWT
    const token = generateToken({ id: user._id, role: user.role })

    res
      .status(201)
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        message: 'Account created. Please verify your email.',
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      })

  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})
```

---

### 3.3 API 2: User Login

```
POST /api/auth/login
Body: { email, password }
```

```js
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' })

    // Fetch user WITH password
    const user = await User.findOne({ email }).select('+password')
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const isMatch = await user.comparePassword(password)
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid credentials' })

    // Update lastLogin
    user.lastLogin = new Date()
    await user.save()

    const token = generateToken({ id: user._id, role: user.role })

    res
      .cookie('token', token, cookieOptions)
      .json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified }
      })

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})
```

---

### 3.4 API 3: Admin Login

```
POST /api/auth/admin/login
Body: { email, password }
```

```js
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email, role: 'admin' }).select('+password')

    // Same message regardless of whether user not found or wrong role
    if (!user)
      return res.status(401).json({ success: false, message: 'Admin credentials invalid' })

    const isMatch = await user.comparePassword(password)
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Admin credentials invalid' })

    user.lastLogin = new Date()
    await user.save()

    const token = generateToken({ id: user._id, role: 'admin' })

    res
      .cookie('token', token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 }) // 8h session for admin
      .json({
        success: true,
        admin: { id: user._id, name: user.name, email: user.email, role: 'admin' }
      })

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
})
```

---

### 3.5 Email Verification

```
GET /api/auth/verify-email/:token
```

```js
router.get('/verify-email/:token', async (req, res) => {
  const user = await User.findOne({
    emailVerificationToken: req.params.token,
    emailVerificationExpiry: { $gt: Date.now() }
  })
  if (!user)
    return res.status(400).json({ success: false, message: 'Token invalid or expired' })

  user.isEmailVerified = true
  user.emailVerificationToken = undefined
  user.emailVerificationExpiry = undefined
  await user.save()

  res.json({ success: true, message: 'Email verified. You can now log in.' })
})
```

---

### 3.6 Get Current User (Protected)

```
GET /api/auth/me
Headers: Cookie: token=...
```

```js
router.get('/me', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')
  res.json({ success: true, user })
})
```

---

### 3.7 Logout

```js
router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ success: true, message: 'Logged out' })
})
```

---

## 4. Middleware

### 4.1 verifyToken (authMiddleware.js)

```js
const jwt  = require('jsonwebtoken')
const User = require('../models/User')

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

    if (!token)
      return res.status(401).json({ success: false, message: 'Not authenticated' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' })
  }
}

module.exports = { verifyToken }
```

### 4.2 requireAdmin (adminMiddleware.js)

```js
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Admin access required' })
  next()
}

module.exports = { requireAdmin }
// Usage: router.get('/admin/data', verifyToken, requireAdmin, handler)
```

---

## 5. Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/devqueue

# JWT
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d

# Email (Nodemailer / Resend)
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=465
EMAIL_USER=resend
EMAIL_PASS=re_your_api_key
EMAIL_FROM=noreply@devqueue.studio

# Admin seed (for first-time setup)
ADMIN_EMAIL=admin@devqueue.studio
ADMIN_PASSWORD=SuperSecureAdminPass123!

# WhatsApp (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
ADMIN_WHATSAPP=whatsapp:+91XXXXXXXXXX

# Frontend URL
CLIENT_URL=http://localhost:3000
```

---

## 6. Frontend — Auth Pages (React)

### 6.1 Register Page (`/register`)

```jsx
// pages/auth/RegisterPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: form, 2: success
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await register(form)
      setStep(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (step === 2) return <VerifyEmailPrompt email={form.email} />

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card glass">
        <div className="auth-logo">DevQueue</div>
        <h1>Create Your Account</h1>
        <p className="auth-sub">Join the queue. Start building.</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <InputField
            label="Full Name"
            name="name"
            placeholder="Aryan Mehta"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            required
          />
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            required
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Min 8 characters"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
            showStrength
            required
          />
          <InputField
            label="Phone (optional)"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={e => setForm({...form, phone: e.target.value})}
          />

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? <Spinner /> : 'Create Account →'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
```

---

### 6.2 Login Page (`/login`)

```jsx
// pages/auth/LoginPage.jsx
export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const user = await login(form)
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card glass">
        <div className="auth-logo">DevQueue</div>
        <h1>Welcome Back</h1>
        <p className="auth-sub">Sign in to your account</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <InputField label="Email" type="email" name="email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <InputField label="Password" type="password" name="password"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} />

          <div className="auth-options">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="link-muted">Forgot password?</Link>
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? <Spinner /> : 'Sign In →'}
          </button>
        </form>

        <p className="auth-switch">
          New here? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  )
}
```

---

### 6.3 Admin Login Page (`/admin`)

```jsx
// pages/auth/AdminLoginPage.jsx
// Separate, not linked publicly — accessed via direct URL
export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)
      window.location.href = '/admin/dashboard'
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page admin-auth">
      <div className="admin-badge">⚙ Admin Portal</div>
      <div className="auth-card glass admin-card">
        <div className="auth-logo">DevQueue <span className="admin-tag">Admin</span></div>
        <h1>Admin Access</h1>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <InputField label="Admin Email" type="email" name="email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <InputField label="Password" type="password" name="password"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          <button type="submit" className="btn-primary btn-full btn-admin" disabled={loading}>
            {loading ? <Spinner /> : 'Access Dashboard →'}
          </button>
        </form>
      </div>
    </div>
  )
}
```

---

## 7. Auth Context (React)

```jsx
// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check session on mount
  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (data.success) setUser(data.user)
      })
      .finally(() => setLoading(false))
  }, [])

  const register = async (form) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    setUser(data.user)
    return data.user
  }

  const login = async (form) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form)
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.message)
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

---

## 8. Protected Route Components

```jsx
// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export function AdminRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/admin" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

// Usage in App.jsx:
// <Route path="/dashboard/*" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
// <Route path="/admin/*"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />
```

---

## 9. Auth Page UI / CSS

```css
/* === Auth Pages === */
.auth-page {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-void);
  padding: 2rem;
}
.auth-bg {
  position: fixed; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 70% 50% at 20% 20%, rgba(108,99,255,0.12), transparent),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(0,212,255,0.07), transparent);
}
.auth-card {
  width: 100%; max-width: 440px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  padding: 2.5rem;
  backdrop-filter: blur(20px);
  position: relative; z-index: 1;
}
.auth-card h1 {
  font: 600 1.8rem 'Clash Display'; color: var(--text-primary);
  margin: 0.5rem 0 0.25rem;
}
.auth-sub { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; }
.auth-logo { font: 700 1.1rem 'Clash Display'; color: var(--accent-primary); letter-spacing: 0.05em; }

/* Input Fields */
.input-group { margin-bottom: 1.2rem; }
.input-group label { display: block; font: 500 0.8rem 'Satoshi'; color: var(--text-muted); margin-bottom: 0.4rem; }
.input-group input {
  width: 100%; padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  color: var(--text-primary);
  font: 400 0.95rem 'Satoshi';
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}
.input-group input:focus {
  border-color: rgba(108,99,255,0.6);
  box-shadow: 0 0 0 3px rgba(108,99,255,0.15);
}

/* Password Strength Bar */
.strength-bar { display: flex; gap: 4px; margin-top: 6px; }
.strength-segment {
  flex: 1; height: 3px; border-radius: 2px;
  background: rgba(255,255,255,0.1);
  transition: background 0.3s;
}
.strength-segment.active-1 { background: var(--error); }
.strength-segment.active-2 { background: var(--warning); }
.strength-segment.active-3 { background: var(--accent-secondary); }
.strength-segment.active-4 { background: var(--success); }

/* Buttons */
.btn-primary {
  width: 100%; padding: 0.85rem;
  background: linear-gradient(135deg, var(--accent-primary), #8b5cf6);
  border: none; border-radius: 10px;
  color: #fff; font: 600 0.95rem 'Satoshi';
  cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 20px rgba(108,99,255,0.3);
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(108,99,255,0.5);
}
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

/* Error Banner */
.error-banner {
  background: rgba(255,68,102,0.1);
  border: 1px solid rgba(255,68,102,0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #ff7799;
  font: 400 0.85rem 'Satoshi';
  margin-bottom: 1rem;
}

/* Admin card accent */
.admin-card { border-color: rgba(0,212,255,0.2); }
.admin-tag {
  font-size: 0.7rem; background: rgba(0,212,255,0.15);
  color: var(--accent-secondary); padding: 2px 8px;
  border-radius: 20px; margin-left: 8px; vertical-align: middle;
}
.btn-admin {
  background: linear-gradient(135deg, #0ea5e9, #00d4ff);
  box-shadow: 0 4px 20px rgba(0,212,255,0.25);
}

/* Auth switch line */
.auth-switch { text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: 1.5rem; }
.auth-switch a { color: var(--accent-primary); text-decoration: none; font-weight: 500; }
```

---

## 10. Input Field Component with Password Strength

```jsx
// components/ui/InputField.jsx
import { useState } from 'react'

function getStrength(password) {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

export default function InputField({ label, type = 'text', showStrength, ...props }) {
  const [show, setShow] = useState(false)
  const strength = showStrength ? getStrength(props.value || '') : 0

  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <div className="input-wrap" style={{ position: 'relative' }}>
        <input type={type === 'password' ? (show ? 'text' : 'password') : type} {...props} />
        {type === 'password' && (
          <button type="button" className="toggle-show" onClick={() => setShow(!show)}>
            {show ? '🙈' : '👁'}
          </button>
        )}
      </div>
      {showStrength && props.value && (
        <div className="strength-bar">
          {[1,2,3,4].map(i => (
            <div key={i} className={`strength-segment ${strength >= i ? `active-${strength}` : ''}`} />
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 11. Seeding First Admin

```js
// scripts/seedAdmin.js
require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI)
  const existing = await User.findOne({ role: 'admin' })
  if (existing) { console.log('Admin exists'); process.exit() }

  await User.create({
    name: 'DevQueue Admin',
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    role: 'admin',
    isEmailVerified: true
  })
  console.log('✅ Admin seeded')
  process.exit()
}

seedAdmin()
// Run: node scripts/seedAdmin.js
```

---

## 12. Validation Layer (express-validator)

```js
// middleware/validate.js
const { body, validationResult } = require('express-validator')

const registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password min 8 chars')
    .matches(/[A-Z]/).withMessage('Include at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Include at least one number'),
]

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
]

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return res.status(422).json({ success: false, errors: errors.array() })
  next()
}

module.exports = { registerRules, loginRules, validate }
// Usage: router.post('/register', registerRules, validate, registerHandler)
```

---

## 13. Rate Limiting (Security)

```js
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit')

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts per window
  message: { success: false, message: 'Too many attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = { authLimiter }
// Usage: router.post('/login', authLimiter, loginRules, validate, loginHandler)
```

---

## 14. Auth Page Routes Summary

| Route | Component | Auth Required | Role |
|-------|-----------|---------------|------|
| `/register` | RegisterPage | No | — |
| `/login` | LoginPage | No | — |
| `/admin` | AdminLoginPage | No | — |
| `/dashboard` | UserDashboard | ✅ Yes | user |
| `/admin/dashboard` | AdminDashboard | ✅ Yes | admin |
| `/api/auth/register` | POST | No | — |
| `/api/auth/login` | POST | No | — |
| `/api/auth/admin/login` | POST | No | — |
| `/api/auth/me` | GET | ✅ Token | any |
| `/api/auth/logout` | POST | ✅ Token | any |
| `/api/auth/verify-email/:token` | GET | No | — |
