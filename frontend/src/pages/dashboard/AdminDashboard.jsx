import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard, Layers, FileCode, Tag, Bell, CreditCard,
  Search, Plus, Trash2, CheckCircle2, XCircle, Send,
  Calendar, DollarSign, AlertCircle, ExternalLink, Eye,
  BookOpen, Clock, Settings, User, LogOut, RefreshCw,
  FileText, Download, Menu, X, ArrowRight, Sparkles, Sun, Moon,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import '../../styles/admin.css';

const STAGES = ['Submitted', 'Estimated', 'Review', 'Planning', 'Building', 'Testing', 'Final Checks', 'Completed', 'Rejected'];
const COLUMN_PHASES = ['Review', 'Planning', 'Building', 'Testing', 'Final Checks'];

const COLUMN_ICONS = {
  'Review': '🔍',
  'Planning': '📋',
  'Building': '🏗️',
  'Testing': '🧪',
  'Final Checks': '🚀'
};

const COLUMN_COLORS = {
  'Review': '#0ea5e9',      // Sky
  'Planning': '#eab308',    // Amber
  'Building': '#a855f7',    // Purple
  'Testing': '#ec4899',     // Pink
  'Final Checks': '#10b981' // Emerald
};

const STAGE_PROGRESS = {
  'Submitted': 5,
  'Estimated': 10,
  'Review': 20,
  'Planning': 40,
  'Building': 60,
  'Testing': 80,
  'Final Checks': 95,
  'Completed': 100,
  'Rejected': 0
};

export default function AdminDashboard() {
  const { user, logout, toast } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Selection states
  const [selectedProject, setSelectedProject] = useState(null);

  // Form states
  const [estimateInput, setEstimateInput] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [bargainActionLoading, setBargainActionLoading] = useState(false);

  // Coupon Form
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [couponMaxUsers, setCouponMaxUsers] = useState('100');
  const [couponStartDate, setCouponStartDate] = useState('');
  const [couponEndDate, setCouponEndDate] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // Offer Form
  const [offerDiscount, setOfferDiscount] = useState('');
  const [offerStartDate, setOfferStartDate] = useState('');
  const [offerEndDate, setOfferEndDate] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerActive, setOfferActive] = useState(true);
  const [offerLoading, setOfferLoading] = useState(false);

  // Custom Alert Form
  const [alertUserId, setAlertUserId] = useState('');
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('email');
  const [alertLoading, setAlertLoading] = useState(false);

  // AI Tab State
  const [aiTab, setAiTab] = useState('brief');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);

  // Navigation Items
  const navigationItems = [
    { label: 'Dashboard', key: 'dashboard', icon: LayoutDashboard },
    { label: 'View Projects', key: 'projects', icon: Layers },
    { label: 'View Requirements', key: 'requirements', icon: FileCode },
    { label: 'Prices & Coupons', key: 'prices', icon: Tag },
    { label: 'Request Alerts', key: 'alerts', icon: Bell },
    { label: 'Payments Ledger', key: 'payments', icon: CreditCard }
  ];

  // Fetch telemetry
  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const projRes = await fetch('/api/projects/admin', { credentials: 'include' });
      const projData = await projRes.json();
      if (projData.success) {
        setProjects(projData.projects || []);
        if (projData.projects?.length > 0 && !selectedProject) {
          setSelectedProject(projData.projects[0]);
        }
      }

      const clientsRes = await fetch('/api/projects/admin/users', { credentials: 'include' });
      const clientsData = await clientsRes.json();
      if (clientsData.success) {
        setClients(clientsData.users || []);
        if (clientsData.users?.length > 0 && !alertUserId) {
          setAlertUserId(clientsData.users[0]._id);
        }
      }

      const notifRes = await fetch('/api/projects/notifications', { credentials: 'include' });
      const notifData = await notifRes.json();
      if (notifData.success) {
        setNotifications(notifData.notifications || []);
      }

      const coupRes = await fetch('/api/projects/admin/coupons', { credentials: 'include' });
      const coupData = await coupRes.json();
      if (coupData.success) {
        setCoupons(coupData.coupons || []);
      }

      const offRes = await fetch('/api/projects/admin/offers', { credentials: 'include' });
      const offData = await offRes.json();
      if (offData.success) {
        setOffers(offData.offers || []);
      }
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
      toast.error('Telemetry download failed. Backend connection offline.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(true);
    }, 15000); // Poll telemetry every 15s
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData(true);
  };

  useEffect(() => {
    if (selectedProject) {
      setEstimateInput(selectedProject.estimatedPrice || '');
      setAiTab('brief');
      setAiAnalysisResult(null);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (!showNotifications) return;
    const handleClose = () => setShowNotifications(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [showNotifications]);

  const toggleNotifications = async () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);
    if (nextState) {
      try {
        await fetch('/api/projects/notifications/read', { method: 'PUT', credentials: 'include' });
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      } catch (err) {
        console.error('Failed to mark notifications as read:', err);
      }
    }
  };

  // Quick changing projects phase
  const handleUpdateStage = async (projectId, nextStage) => {
    try {
      const res = await fetch(`/api/projects/admin/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ stage: nextStage })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Project stage moved to "${nextStage}"`);
        setProjects(prev => prev.map(p => p._id === projectId ? { ...p, stage: nextStage } : p));
        if (selectedProject?._id === projectId) {
          setSelectedProject(prev => ({ ...prev, stage: nextStage }));
        }
        fetchData(true);
      } else {
        toast.error(data.message || 'Stage modification failed');
      }
    } catch (err) {
      toast.error('Network failure updating pipeline stage');
    }
  };

  // Move stage left or right in Kanban sequence
  const handleMoveStage = (projectId, currentStage, direction) => {
    const kanbanPhases = ['Review', 'Planning', 'Building', 'Testing', 'Final Checks'];
    let currentIdx = -1;
    if (currentStage === 'Submitted' || currentStage === 'Estimated' || currentStage === 'Review') {
      currentIdx = 0;
    } else {
      currentIdx = kanbanPhases.indexOf(currentStage);
    }
    
    if (currentIdx === -1) return;
    
    let nextIdx = currentIdx + direction;
    if (nextIdx >= 0 && nextIdx < kanbanPhases.length) {
      const nextStage = kanbanPhases[nextIdx];
      handleUpdateStage(projectId, nextStage);
    } else if (nextIdx === kanbanPhases.length && direction === 1) {
      handleUpdateStage(projectId, 'Completed');
    }
  };

  // Submit Price Estimate
  const handleSaveEstimate = async () => {
    if (!selectedProject) return;
    if (!estimateInput || isNaN(estimateInput)) {
      toast.error('Please enter a valid numeric estimate');
      return;
    }
    try {
      const res = await fetch(`/api/projects/admin/estimate/${selectedProject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ estimatedPrice: Number(estimateInput) })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Estimate of ₹${Number(estimateInput).toLocaleString()} dispatched to client!`);
        fetchData(true);
        setSelectedProject(prev => ({
          ...prev,
          estimatedPrice: Number(estimateInput),
          priceEstimated: true,
          stage: 'Estimated'
        }));
      } else {
        toast.error(data.message || 'Estimate submission failed');
      }
    } catch (err) {
      toast.error('Connection failure transmitting estimate');
    }
  };

  // Bargaining Action Handler
  const handleBargainAction = async (action) => {
    if (!selectedProject) return;
    setBargainActionLoading(true);
    try {
      const res = await fetch(`/api/projects/admin/bargain/${selectedProject._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(action === 'accept' ? 'Bargained counter-offer accepted!' : 'Bargained counter-offer declined!');
        fetchData(true);
        setSelectedProject(data.project);
      } else {
        toast.error(data.message || 'Bargaining resolution failed');
      }
    } catch (err) {
      toast.error('Connection failure transmitting bargain action');
    } finally {
      setBargainActionLoading(false);
    }
  };

  // Generate Coupon
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode || !couponDiscount || !couponStartDate || !couponEndDate) {
      toast.error('Please fill all coupon details');
      return;
    }
    setCouponLoading(true);
    try {
      const res = await fetch('/api/projects/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          code: couponCode,
          discountPercent: Number(couponDiscount),
          maxUsers: Number(couponMaxUsers),
          startDate: couponStartDate,
          endDate: couponEndDate
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Coupon code "${couponCode.toUpperCase()}" generated successfully!`);
        setCoupons(prev => [data.coupon, ...prev]);
        setCouponCode('');
        setCouponDiscount('');
        setCouponMaxUsers('100');
        setCouponStartDate('');
        setCouponEndDate('');
      } else {
        toast.error(data.message || 'Coupon generation failed');
      }
    } catch (err) {
      toast.error('Network failure writing coupon details');
    } finally {
      setCouponLoading(false);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (id) => {
    try {
      const res = await fetch(`/api/projects/admin/coupons/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Coupon removed successfully.');
        setCoupons(prev => prev.filter(c => c._id !== id));
      } else {
        toast.error(data.message || 'Coupon deletion failed');
      }
    } catch (err) {
      toast.error('Network failure deleting coupon');
    }
  };

  // Save promotional offer
  const handleSaveOffer = async (e) => {
    e.preventDefault();
    if (!offerDiscount || !offerStartDate || !offerEndDate) {
      toast.error('Please fill all offer fields');
      return;
    }
    setOfferLoading(true);
    try {
      const res = await fetch('/api/projects/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          discountPercent: Number(offerDiscount),
          startDate: offerStartDate,
          endDate: offerEndDate,
          description: offerDescription,
          active: offerActive
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Promotion updated to apply ${offerDiscount}% discount!`);
        setOffers(prev => [data.offer, ...prev]);
        setOfferDiscount('');
        setOfferStartDate('');
        setOfferEndDate('');
        setOfferDescription('');
      } else {
        toast.error(data.message || 'Failed to save offer');
      }
    } catch (err) {
      toast.error('Connection error saving offer details');
    } finally {
      setOfferLoading(false);
    }
  };

  // Dispatch manual alert broadcast
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!alertUserId || !alertTitle || !alertMessage) {
      toast.error('User selection, title and messages are required');
      return;
    }
    setAlertLoading(true);
    try {
      const res = await fetch('/api/projects/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: alertUserId,
          title: alertTitle,
          message: alertMessage,
          type: alertType
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Broadcast notification dispatched to client successfully!');
        setNotifications(prev => [data.notification, ...prev]);
        setAlertTitle('');
        setAlertMessage('');
      } else {
        toast.error(data.message || 'Alert dispatch failed');
      }
    } catch (err) {
      toast.error('Network failure sending custom alert');
    } finally {
      setAlertLoading(false);
    }
  };

  // Run AI analysis compiler
  const runAiAnalysis = async () => {
    if (!selectedProject) return;
    setAiAnalyzing(true);
    try {
      const res = await fetch(`/api/projects/admin/ai-summary/${selectedProject._id}`, { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setAiAnalysisResult(data.summary);
        toast.success('AI Specifications Analysis completed successfully!');
      } else {
        toast.error(data.message || 'AI summary failed');
      }
    } catch (err) {
      toast.error('Network failure executing AI analysis');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const formatRequirements = (rawReqs) => {
    if (!rawReqs) return { description: 'No description brief submitted.' };
    try {
      const parsed = JSON.parse(rawReqs);
      return {
        tagline: parsed.tagline || '',
        description: parsed.description || rawReqs,
        deployPlatform: parsed.deployPlatform || '',
        deadline: parsed.deadline || '',
        priority: parsed.priority || '',
        needsAi: parsed.needsAi ? 'Yes' : 'No'
      };
    } catch (e) {
      return { description: rawReqs };
    }
  };

  const downloadBriefText = (project) => {
    const reqs = formatRequirements(project.requirements);
    const content = `REQWORKS PROJECT BRIEF: ${project.projectName}
==================================================
Client Name:      ${project.clientName}
Tech Stack:       ${project.stack}
Budget:           ${project.budget}
Stage:            ${project.stage}

PROJECT DETAILS
--------------------------------------------------
Tagline:          ${reqs.tagline || 'N/A'}
Description:      ${reqs.description || 'N/A'}
Deployment Host:  ${reqs.deployPlatform || 'N/A'}
Target Deadline:  ${reqs.deadline || 'N/A'}
Priority:         ${reqs.priority || 'Normal'}
Needs AI Modules: ${reqs.needsAi || 'No'}
==================================================
Generated on:     ${new Date().toLocaleString()}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.projectName.replace(/\s+/g, '_')}_Brief.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper stats values
  const totalProjectsCount = projects.length;
  const inReviewCount = projects.filter(p => p.stage === 'Submitted' || p.stage === 'Estimated').length;
  const inPlanningCount = projects.filter(p => p.stage === 'Planning' || p.stage === 'Review').length;
  const completedCount = projects.filter(p => p.stage === 'Completed').length;

  const totalRevenue = projects
    .filter(p => p.depositPaid)
    .reduce((sum, p) => {
      const price = p.estimatedPrice || 0;
      const paid = p.finalPaid ? price : Math.round(price * 0.25);
      return sum + paid;
    }, 0);

  const pendingRevenue = projects
    .filter(p => p.depositPaid && !p.finalPaid)
    .reduce((sum, p) => {
      const price = p.estimatedPrice || 0;
      return sum + Math.round(price * 0.75);
    }, 0);

  // SVG network map elements positioning
  const mapNodes = [
    { name: 'Review', x: 50, y: 120, count: projects.filter(p => p.stage === 'Review' || p.stage === 'Submitted' || p.stage === 'Estimated').length },
    { name: 'Planning', x: 140, y: 50, count: projects.filter(p => p.stage === 'Planning').length },
    { name: 'Building', x: 230, y: 120, count: projects.filter(p => p.stage === 'Building').length },
    { name: 'Testing', x: 320, y: 50, count: projects.filter(p => p.stage === 'Testing').length },
    { name: 'Handoff', x: 410, y: 120, count: projects.filter(p => p.stage === 'Final Checks' || p.stage === 'Completed').length }
  ];

  // Weekly Stats calculation
  const getWeeklyStatsHeight = () => {
    const counts = [12, 18, 15, 24, 28, 14, 9];
    const actualCounts = Array(7).fill(0);
    projects.forEach(p => {
      const day = new Date(p.createdAt).getDay();
      const idx = day === 0 ? 6 : day - 1;
      actualCounts[idx]++;
    });
    return actualCounts.map((val, i) => Math.max(val * 24, counts[i]));
  };

  const weeklyBarsHeight = getWeeklyStatsHeight();

  // Filter clients based on search
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-spinner" />
        <span style={{ fontSize: '0.9rem', color: '#718096', fontWeight: 600 }}>Downloading Reqworks Control Telemetry...</span>
      </div>
    );
  }

  const renderSidebarContent = () => (
    <>
      <div className="dash-sidebar-header">
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: '2px', background: '#fff' }}>
          <img src="/images/logo.png" alt="Reqworks" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
        </div>
        <span className="dash-logo-text">Reqworks Admin</span>
      </div>

      <nav className="dash-sidebar-menu">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              className={`dash-menu-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.key);
                setSidebarOpen(false);
              }}
              style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
            >
              <IconComponent size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="dash-sidebar-footer">
        <div className="dash-user-card">
          <div className="dash-user-avatar" style={{ border: '2px solid var(--dash-accent)', color: 'var(--dash-accent)' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="dash-user-info">
            <div className="dash-user-name">{user?.name || 'Admin'}</div>
            <div className="dash-cid-badge" style={{ background: 'var(--dash-accent)', color: '#fff', fontSize: '0.65rem' }}>
              OPERATIONS
            </div>
          </div>
        </div>
        <button 
          onClick={logout}
          className="dash-menu-item"
          style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', marginTop: '12px', cursor: 'pointer' }}
        >
          <LogOut size={18} />
          <span>Exit Console</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="dash-shell admin-panel" data-theme={theme}>
      
      {/* 1. Desktop Sidebar */}
      <aside className="dash-sidebar">
        {renderSidebarContent()}
      </aside>

      {/* 2. Slide-over Mobile Sidebar Drawer */}
      <div 
        className={`dash-drawer-overlay ${sidebarOpen ? 'open' : ''}`} 
        onClick={() => setSidebarOpen(false)} 
      />
      <div className={`dash-drawer ${sidebarOpen ? 'open' : ''}`}>
        <button className="dash-drawer-close" onClick={() => setSidebarOpen(false)}>
          <X size={20} />
        </button>
        {renderSidebarContent()}
      </div>

      {/* 3. Main Area */}
      <div className="dash-main-container">
        
        {/* Topbar */}
        <header className="dash-topbar">
          <div className="dash-topbar-left">
            <button className="dash-menu-toggle" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h1 className="dash-page-title">
              {navigationItems.find(item => item.key === activeTab)?.label || 'Admin Portal'}
            </h1>
          </div>

          <div className="dash-topbar-right">
            {/* Sync Telemetry */}
            <button 
              className="dash-icon-btn" 
              onClick={handleRefresh} 
              disabled={refreshing}
              title="Sync Telemetry"
            >
              <RefreshCw size={16} className={refreshing ? 'admin-spinner' : ''} />
            </button>

            {/* Theme Toggle */}
            <button className="dash-icon-btn" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
              <button 
                className="dash-icon-btn" 
                onClick={toggleNotifications}
                title="Notifications"
                style={{ position: 'relative', border: 'none', cursor: 'pointer' }}
              >
                <Bell size={18} />
                {notifications.some(n => !n.read) && <div className="dash-badge-dot" />}
              </button>

              {showNotifications && (
                <div 
                  className="dash-notifications-dropdown"
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: '0',
                    width: '320px',
                    maxHeight: '380px',
                    backgroundColor: 'var(--dash-card)',
                    border: '1px solid var(--dash-border)',
                    borderRadius: '12px',
                    boxShadow: 'var(--dash-shadow)',
                    zIndex: 100,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--dash-text)' }}>Alerts & Updates</span>
                    {notifications.some(n => !n.read) && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--dash-accent)', fontWeight: 600 }}>New updates</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div 
                          key={n._id} 
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid var(--dash-border)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            backgroundColor: n.read ? 'transparent' : 'var(--dash-card-sec)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--dash-text)' }}>{n.title}</span>
                            {!n.read && (
                              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--dash-accent)', flexShrink: 0, marginTop: '5px' }} />
                            )}
                          </div>
                          <span style={{ fontSize: '0.78rem', color: 'var(--dash-text-sec)', lineHeight: 1.4, wordBreak: 'break-word' }}>{n.message}</span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--dash-text-sec)', opacity: 0.7 }}>
                            {new Date(n.sentAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--dash-text-sec)', fontStyle: 'italic' }}>
                        No alerts in your dashboard inbox.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Avatar Pill */}
            <div className="dash-user-avatar" style={{ width: '36px', height: '36px', border: 'none', background: 'var(--dash-accent)', color: '#141210' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Page Content View */}
        <main className="dash-content-body">

        {/* ── TAB 1: DASHBOARD (SAME THEME & WIDGETS AS USER PANEL) ── */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
            
            {/* 1. Welcome Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px', marginBottom: '8px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--dash-font-display)', fontSize: '2.2rem', fontWeight: 700, margin: 0, color: 'var(--dash-text)' }}>
                  Welcome, {user?.name ? user.name.split(' ')[0] : 'Admin'}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                  <span className="dash-cid-badge" style={{ margin: 0, background: 'var(--dash-accent)', color: '#fff', padding: '4px 10px' }}>OPERATIONS</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--dash-text-sec)', fontWeight: 500 }}>
                    • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              
              <div className="dash-card" style={{ padding: '16px 24px', background: 'var(--dash-warning-bg)', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--dash-accent)', borderRadius: '16px' }}>
                <Clock size={22} style={{ color: 'var(--dash-accent)' }} />
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--dash-text-sec)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Sprint Speed</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dash-accent)', marginTop: '2px' }}>~12.8 Days/Sprint</div>
                </div>
              </div>
            </div>

            {/* 2. Stats Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px'
            }}>
              {[
                { label: 'Total Requests', val: totalProjectsCount, icon: Layers, color: 'var(--dash-text)' },
                { label: 'Active Pipelines', val: projects.filter(p => p.stage === 'Building' || p.stage === 'Planning').length, icon: Clock, color: 'var(--dash-warning)' },
                { label: 'Delivered Builds', val: completedCount, icon: CheckCircle2, color: 'var(--dash-success)' },
                { label: 'Under Review', val: inReviewCount, icon: Eye, color: 'var(--dash-info)' }
              ].map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div key={idx} className="dash-card dash-card-hover" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px 24px' }}>
                    <div>
                      <span style={{ fontSize: '0.82rem', color: 'var(--dash-text-sec)', fontWeight: 600 }}>{card.label}</span>
                      <div style={{ fontSize: '2.25rem', fontWeight: 800, color: card.color, marginTop: '8px', lineHeight: 1 }}>{card.val}</div>
                    </div>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'var(--dash-card-sec)', display: 'grid', placeItems: 'center',
                      color: card.color, border: '1px solid var(--dash-border)'
                    }}>
                      <Icon size={22} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. Global Sprint Pipeline Status */}
            <div className="dash-card" style={{ borderLeft: '5px solid var(--dash-accent)', padding: '32px' }}>
              <h3 style={{ fontFamily: 'var(--dash-font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', color: 'var(--dash-text)' }}>Global Sprint Pipeline Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <span style={{ fontSize: '0.95rem', color: 'var(--dash-text-sec)', fontWeight: 500 }}>
                    There are currently <strong>{projects.filter(p => p.stage !== 'Completed' && p.stage !== 'Rejected').length}</strong> active pipelines in the sprint cycle.
                  </span>
                  <span style={{ fontFamily: 'var(--dash-font-mono)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--dash-accent)' }}>
                    Avg. Review: &lt;24h
                  </span>
                </div>
                
                <div style={{ height: '12px', background: 'var(--dash-card-sec)', borderRadius: '99px', overflow: 'hidden', border: '1px solid var(--dash-border)' }}>
                  <div style={{
                    width: `${totalProjectsCount > 0 ? Math.round((completedCount / totalProjectsCount) * 100) : 0}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--dash-accent), #f59e0b)',
                    borderRadius: '99px'
                  }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--dash-text-sec)', fontWeight: 500 }}>
                  <span>Sprint Completion Rate: {totalProjectsCount > 0 ? Math.round((completedCount / totalProjectsCount) * 100) : 0}%</span>
                  <span>Est. Speed per Sprint: ~12.8 days</span>
                </div>
              </div>
            </div>

            {/* 4. Recent Project Requests Activity */}
            <div className="dash-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontFamily: 'var(--dash-font-display)', fontSize: '1.3rem', fontWeight: 700, margin: 0, color: 'var(--dash-text)' }}>Recent Project Pipelines</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--dash-text-sec)', margin: '6px 0 0' }}>Latest updates on administrative builds.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('projects')}
                  style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--dash-accent)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px' }}
                >
                  <span>Detailed Sprints</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {projects.length > 0 ? (
                <div className="dash-table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Project Name</th>
                        <th>Client</th>
                        <th>Tech Stack</th>
                        <th>Stage</th>
                        <th>Budget Quote</th>
                        <th>Decision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.slice(0, 5).map((p) => (
                        <tr key={p._id}>
                          <td style={{ fontWeight: 700 }}>{p.projectName}</td>
                          <td>{p.clientName}</td>
                          <td>
                            <span style={{ fontFamily: 'var(--dash-font-mono)', fontSize: '0.78rem', background: 'var(--dash-card-sec)', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--dash-border)' }}>{p.stack}</span>
                          </td>
                          <td>
                            {p.stage === 'Completed' && <span className="dash-badge dash-badge-success">Completed</span>}
                            {p.stage === 'Rejected' && <span className="dash-badge dash-badge-danger">Rejected</span>}
                            {p.stage === 'Submitted' && <span className="dash-badge dash-badge-muted">Submitted</span>}
                            {p.stage === 'Estimated' && <span className="dash-badge dash-badge-info">Quoted</span>}
                            {p.stage !== 'Completed' && p.stage !== 'Rejected' && p.stage !== 'Submitted' && p.stage !== 'Estimated' && (
                              <span className="dash-badge dash-badge-warning">{p.stage}</span>
                            )}
                          </td>
                          <td style={{ fontFamily: 'var(--dash-font-mono)', fontWeight: 700 }}>
                            {p.priceEstimated ? `₹${p.estimatedPrice.toLocaleString()}` : <span style={{ color: 'var(--dash-text-muted)', fontWeight: 500 }}>Pending Quote</span>}
                          </td>
                          <td>
                            {p.userDecision === 'Bargained' && <span className="dash-badge dash-badge-warning">Counter Offer</span>}
                            {p.userDecision === 'Booked' && <span className="dash-badge dash-badge-success">Paid Advance</span>}
                            {p.userDecision === 'None' && p.priceEstimated && <span className="dash-badge dash-badge-info">Awaiting Review</span>}
                            {p.userDecision === 'None' && !p.priceEstimated && <span className="dash-badge dash-badge-muted">Pending Review</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--dash-text-sec)', fontSize: '0.95rem', fontStyle: 'italic' }}>
                  No active project pipelines found.
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── OTHER TABS (RENDERED INSIDE ELEGANT MOCKUP WHITE CARDS) ── */}
        

        {/* VIEW PROJECTS BOARD */}
        {activeTab === 'projects' && (
          <div className="admin-mockup-card" style={{ gap: '24px' }}>
            <div className="admin-section-title">
              <span>Sprint Pipelines Kanban Board</span>
              <p style={{ fontSize: '0.8rem', color: '#718096', margin: 0 }}>Manage sprint cycles dynamically. Click a card to view detailed progress specs and remaining notes below.</p>
            </div>
            
            <div className="phases-board">
              {COLUMN_PHASES.map(phase => {
                const phaseProjects = projects.filter(p => {
                  if (phase === 'Review') return p.stage === 'Submitted' || p.stage === 'Estimated' || p.stage === 'Review';
                  return p.stage === phase;
                });
                
                const colColor = COLUMN_COLORS[phase] || '#FF6B35';
                const colIcon = COLUMN_ICONS[phase] || '📋';
                const colBudget = phaseProjects.reduce((sum, p) => sum + (p.estimatedPrice || 0), 0);

                return (
                  <div key={phase} className="phase-column" style={{ '--column-color': colColor }}>
                    <div className="phase-column-title">
                      <div className="column-header-info">
                        <span className="column-header-icon">{colIcon}</span>
                        <span className="column-header-title-text">{phase}</span>
                      </div>
                      <span className="column-count-badge">
                        {phaseProjects.length}
                      </span>
                    </div>

                    <div className="column-stats-summary">
                      ₹{colBudget.toLocaleString()} Value
                    </div>

                    <div className="column-cards-container">
                      {phaseProjects.map(p => {
                        const isSelected = selectedProject?._id === p._id;
                        const progressPercent = STAGE_PROGRESS[p.stage] || 20;
                        const clientInitial = p.clientName ? p.clientName.charAt(0).toUpperCase() : 'C';
                        
                        const avatarBgs = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
                        const avatarBg = avatarBgs[p.clientName.length % avatarBgs.length];

                        return (
                          <div 
                            key={p._id} 
                            className={`phase-project-card ${isSelected ? 'selected' : ''}`}
                            style={{ 
                              '--project-color': colColor,
                              '--project-avatar-bg': avatarBg
                            }}
                            onClick={() => setSelectedProject(p)}
                          >
                            <div className="card-top-row">
                              <div className="card-project-title">{p.projectName}</div>
                            </div>

                            <div className="card-client-row">
                              <div className="card-client-avatar" style={{ background: avatarBg }}>
                                {clientInitial}
                              </div>
                              <div className="card-client-name">{p.clientName}</div>
                            </div>

                            <div className="card-tech-row">
                              <span className="card-tech-badge">{p.stack}</span>
                            </div>

                            <div className="card-progress-section">
                              <div className="card-progress-labels">
                                <span>Progress</span>
                                <span>{progressPercent}%</span>
                              </div>
                              <div className="card-progress-bar-container">
                                <div 
                                  className="card-progress-bar-fill"
                                  style={{ width: `${progressPercent}%`, background: `linear-gradient(90deg, ${colColor} 0%, var(--dash-accent) 100%)` }}
                                />
                              </div>
                            </div>

                            <div className="card-footer-badges">
                              <span className="card-badge-budget">
                                ₹{(p.estimatedPrice || 0).toLocaleString()}
                              </span>
                              
                              {p.needsAi && (
                                <span className="card-badge-ai" title="Requires AI integration modules">
                                  <Sparkles size={11} style={{ display: 'inline' }} /> AI
                                </span>
                              )}

                              {p.userDecision === 'Bargained' && (
                                <span className="card-badge-bargain" title={`Counter-offer: ₹${p.bargainPrice?.toLocaleString()}`}>
                                  Bargain
                                </span>
                              )}
                            </div>

                            <div className="card-shift-controls" onClick={(e) => e.stopPropagation()}>
                              <button 
                                className="shift-btn" 
                                disabled={phase === 'Review'} 
                                title="Move back a stage"
                                onClick={() => handleMoveStage(p._id, p.stage, -1)}
                              >
                                <ChevronLeft size={14} />
                              </button>
                              <button 
                                className="shift-btn" 
                                title={phase === 'Final Checks' ? 'Mark Completed' : 'Move forward a stage'}
                                onClick={() => handleMoveStage(p._id, p.stage, 1)}
                              >
                                <ChevronRight size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {phaseProjects.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: '#A0AEC0', fontSize: '0.78rem', fontStyle: 'italic' }}>
                          Empty stage queue
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedProject ? (
              <div className="dash-card admin-project-detail-grid" style={{ padding: '32px', gap: '32px', border: '1px solid var(--dash-border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 className="admin-section-title" style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
                      {selectedProject.projectName}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: 'var(--dash-text-sec)', marginTop: '6px', fontWeight: 500 }}>
                      Customer Account: <span style={{ fontWeight: 700, color: 'var(--dash-accent)' }}>{selectedProject.userId?.name || selectedProject.clientName}</span> ({selectedProject.userId?.email || 'N/A'})
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '4px' }}>
                    <div style={{ background: 'var(--dash-card-sec)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--dash-border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--dash-text-sec)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Framework Stack</span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '6px', fontFamily: 'var(--dash-font-mono)', color: 'var(--dash-text)' }}>{selectedProject.stack}</div>
                    </div>
                    <div style={{ background: 'var(--dash-card-sec)', padding: '16px 20px', borderRadius: '12px', border: '1px solid var(--dash-border)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--dash-text-sec)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Project Phase Stage</span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, marginTop: '6px', color: 'var(--dash-accent)' }}>{selectedProject.stage}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--dash-text-sec)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Brief Specifications</span>
                    <p style={{ fontSize: '0.9rem', color: 'var(--dash-text)', background: 'var(--dash-card-sec)', padding: '18px', borderRadius: '12px', margin: 0, whiteSpace: 'pre-line', border: '1px solid var(--dash-border)', maxHeight: '220px', overflowY: 'auto', lineHeight: 1.5 }}>
                      {selectedProject.requirements || 'No specifications provided.'}
                    </p>
                  </div>
                </div>

                <div style={{ background: 'var(--dash-card-sec)', border: '1px solid var(--dash-border)', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'var(--dash-card)', border: '1px solid var(--dash-border)', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--dash-accent)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quick Phase Transition</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
                      {STAGES.slice(2, 8).map(s => (
                        <button 
                          key={s} 
                          className="dash-btn dash-btn-secondary dash-btn-sm" 
                          style={{ 
                            fontSize: '0.75rem', 
                            padding: '6px 12px', 
                            borderRadius: '8px',
                            backgroundColor: selectedProject.stage === s ? 'var(--dash-accent)' : 'var(--dash-card-sec)',
                            color: selectedProject.stage === s ? '#FFFFFF' : 'var(--dash-text)',
                            borderColor: selectedProject.stage === s ? 'var(--dash-accent)' : 'var(--dash-border)'
                          }}
                          onClick={() => handleUpdateStage(selectedProject._id, s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#718096', fontStyle: 'italic' }}>
                Select a project card from the board above to edit remaining logs/notes.
              </div>
            )}
          </div>
        )}

        {/* VIEW REQUIREMENTS AI */}
        {activeTab === 'requirements' && (
          <div className="admin-mockup-card" style={{ padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <div className="requirements-grid">
              
              <div className="admin-mockup-card" style={{ padding: '24px' }}>
                <div className="admin-section-title" style={{ marginBottom: '12px' }}>
                  <span>Sprint Pipelines Spec Queue</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--dash-text-sec)', fontWeight: 500 }}>
                    {projects.length} Proposals Submitted
                  </span>
                </div>
                
                <div className="requirements-carousel">
                  {projects.map(p => {
                    const isSelected = selectedProject?._id === p._id;
                    const projectColor = COLUMN_COLORS[p.stage] || '#FF6B35';
                    
                    return (
                      <div 
                        key={p._id} 
                        className={`carousel-project-card ${isSelected ? 'active' : ''}`}
                        style={{ '--project-color': projectColor }}
                        onClick={() => setSelectedProject(p)}
                      >
                        <div className="carousel-project-header">
                          <div className="carousel-project-name" title={p.projectName}>{p.projectName}</div>
                          {p.needsAi && (
                            <span className="dash-badge dash-badge-warning" style={{ fontSize: '0.55rem', padding: '2px 4px' }}>AI</span>
                          )}
                        </div>
                        
                        <div className="carousel-project-client">
                          Client: {p.clientName}
                        </div>
                        
                        <div className="carousel-project-footer">
                          <span>{p.stack}</span>
                          <span style={{ fontWeight: 700, color: projectColor }}>{p.stage}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {selectedProject ? (
                <div className="admin-mockup-card">
                  <div className="ai-pill-tabs">
                    <button 
                      className={`ai-pill-tab ${aiTab === 'brief' ? 'active' : ''}`}
                      onClick={() => setAiTab('brief')}
                    >
                      <BookOpen size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                      <span>User Brief Spec</span>
                    </button>
                    <button 
                      className={`ai-pill-tab ai-mode ${aiTab === 'ai' ? 'active' : ''}`}
                      onClick={() => {
                        setAiTab('ai');
                        if (!aiAnalysisResult && !aiAnalyzing) {
                          runAiAnalysis();
                        }
                      }}
                    >
                      <span>⚡ AI Assist Summary</span>
                    </button>
                  </div>

                  {aiTab === 'brief' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--dash-text)', margin: 0 }}>User Brief Specifications</h3>
                          <button 
                            className="dash-btn dash-btn-secondary dash-btn-sm"
                            style={{ padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--dash-border)', background: 'var(--dash-card-sec)', color: 'var(--dash-text)', cursor: 'pointer' }}
                            onClick={() => downloadBriefText(selectedProject)}
                          >
                            <Download size={14} />
                            <span>Download Brief</span>
                          </button>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--dash-text)', background: 'var(--dash-card-sec)', padding: '18px', borderRadius: '12px', border: '1px solid var(--dash-border)', margin: 0, minHeight: '180px', maxHeight: '240px', overflowY: 'auto', lineHeight: 1.5 }}>
                          {(() => {
                            const reqs = formatRequirements(selectedProject.requirements);
                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {reqs.tagline && (
                                  <div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--dash-accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Project Tagline</span>
                                    <p style={{ margin: '4px 0 0 0', fontWeight: 700, fontSize: '0.95rem', color: 'var(--dash-text)' }}>"{reqs.tagline}"</p>
                                  </div>
                                )}
                                <div>
                                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--dash-text-sec)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description Brief</span>
                                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', lineHeight: 1.5, whiteSpace: 'pre-line', color: 'var(--dash-text)' }}>{reqs.description}</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginTop: '4px', borderTop: '1px solid var(--dash-border)', paddingTop: '12px' }}>
                                  {reqs.deployPlatform && (
                                    <div>
                                      <span style={{ fontSize: '0.7rem', color: 'var(--dash-text-sec)', fontWeight: 600 }}>Host Platform</span>
                                      <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px', color: 'var(--dash-text)' }}>{reqs.deployPlatform}</div>
                                    </div>
                                  )}
                                  {reqs.deadline && (
                                    <div>
                                      <span style={{ fontSize: '0.7rem', color: 'var(--dash-text-sec)', fontWeight: 600 }}>Deadline Target</span>
                                      <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px', color: 'var(--dash-text)' }}>{reqs.deadline}</div>
                                    </div>
                                  )}
                                  {reqs.priority && (
                                    <div>
                                      <span style={{ fontSize: '0.7rem', color: 'var(--dash-text-sec)', fontWeight: 600 }}>Priority Level</span>
                                      <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px', color: 'var(--dash-text)' }}>{reqs.priority}</div>
                                    </div>
                                  )}
                                  <div>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--dash-text-sec)', fontWeight: 600 }}>Needs AI Modules</span>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '2px', color: reqs.needsAi === 'Yes' ? 'var(--dash-warning)' : 'var(--dash-text)' }}>{reqs.needsAi}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--dash-text-sec)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>Uploaded Specifications Documents</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '2px' }}>
                          {selectedProject.files?.map((f, idx) => (
                            <div key={idx} className="mockup-item" style={{ padding: '10px 14px', borderRadius: '10px' }}>
                              <div className="mockup-item-info">
                                <FileText size={18} style={{ color: 'var(--dash-accent)' }} />
                                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dash-text)' }}>{f.originalname}</span>
                              </div>
                              <a 
                                href={`/api/projects/download/${f.filename}`}
                                download 
                                className="dash-btn dash-btn-secondary dash-btn-sm" 
                                style={{ padding: '6px 12px', borderRadius: '8px' }}
                              >
                                <Download size={14} />
                              </a>
                            </div>
                          ))}
                          {(!selectedProject.files || selectedProject.files.length === 0) && (
                            <div style={{ fontStyle: 'italic', fontSize: '0.82rem', color: 'var(--dash-text-muted)', padding: '4px' }}>No spec documents attached to this project.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {aiTab === 'ai' && (
                    <div style={{ flex: 1 }}>
                      {aiAnalyzing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '220px', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                          <div className="admin-spinner" />
                          <span style={{ fontSize: '0.85rem', color: 'var(--dash-text-sec)', fontWeight: 600 }}>AI semantic models parsing specs...</span>
                        </div>
                      ) : aiAnalysisResult ? (
                        <div className="requirements-ai-summary-card" style={{ padding: '24px', borderRadius: '16px' }}>
                          <span className="dash-badge dash-badge-warning" style={{ fontSize: '0.65rem', padding: '4px 8px' }}>Reqworks AI Summary</span>
                          
                          <h4 style={{ fontFamily: 'var(--dash-font-display)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--dash-accent)', marginTop: '16px', marginBottom: 0 }}>
                            {aiAnalysisResult.slogan}
                          </h4>

                          <div style={{ display: 'flex', gap: '8px', margin: '16px 0', flexWrap: 'wrap' }}>
                            <span className="dash-badge dash-badge-warning" style={{ fontSize: '0.68rem', padding: '4px 8px' }}>
                              {aiAnalysisResult.difficulty} Difficulty
                            </span>
                            <span className="dash-badge dash-badge-info" style={{ fontSize: '0.68rem', padding: '4px 8px' }}>{aiAnalysisResult.timeRec} Build</span>
                          </div>

                          <div style={{ marginTop: '16px' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--dash-text-sec)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Key System Features Extracted</span>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '8px', fontSize: '0.88rem', color: 'var(--dash-text-sec)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {aiAnalysisResult.features.map((feat, i) => (
                                <li key={i}>{feat}</li>
                              ))}
                            </ul>
                          </div>

                          <div style={{ background: 'var(--dash-card)', border: '1px solid var(--dash-border)', borderRadius: '12px', padding: '14px 20px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--dash-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Suggested Price Quote</span>
                              <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dash-text)', marginTop: '4px' }}>{aiAnalysisResult.priceRec}</div>
                            </div>
                            
                            <button 
                              className="dash-btn dash-btn-primary dash-btn-sm"
                              style={{ background: 'var(--dash-accent)', color: '#FFFFFF', fontWeight: 700, padding: '8px 16px', borderRadius: '8px' }}
                              onClick={() => {
                                  setEstimateInput(aiAnalysisResult.priceVal);
                                  setActiveTab('prices');
                                  toast.info('Price suggestion auto-filled into estimation console!');
                              }}
                            >
                              <span>Apply Price</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--dash-text-muted)', fontSize: '0.88rem', fontStyle: 'italic' }}>Click "AI Assist Summary" button above to run local ML parser.</div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="admin-mockup-card" style={{ textAlign: 'center', padding: '40px', color: '#718096', fontStyle: 'italic' }}>
                  Select a project from the specifications queue on the left to read user documents.
                </div>
              )}

            </div>
          </div>
        )}

        {/* PRICING & COUPONS */}
        {activeTab === 'prices' && (
          <div className="admin-mockup-card" style={{ padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Bargaining counter-offers box */}
                <div className="admin-mockup-card">
                  <div className="admin-section-title">
                    <span>Active Bargaining Requests</span>
                    <span className="dash-badge dash-badge-warning" style={{ fontSize: '0.65rem' }}>Bargain Proposals</span>
                  </div>
                  {projects.filter(p => p.userDecision === 'Bargained').length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--dash-text-muted)', fontSize: '0.92rem', fontStyle: 'italic' }}>
                      No active client bargaining counter-offers submitted.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {projects.filter(p => p.userDecision === 'Bargained').map(p => (
                        <div key={p._id} style={{ background: 'var(--dash-card-sec)', border: '1.5px solid var(--dash-accent)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                            <div>
                              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--dash-text)' }}>{p.projectName}</span>
                              <div style={{ fontSize: '0.82rem', color: 'var(--dash-text-sec)', marginTop: '4px' }}>Submitted by client: {p.clientName}</div>
                            </div>
                            <span className="dash-badge dash-badge-warning" style={{ fontSize: '0.65rem', fontWeight: 800, padding: '4px 8px' }}>BARGAIN CARD</span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--dash-card)', padding: '14px 20px', borderRadius: '12px', border: '1px solid var(--dash-border)' }}>
                            <div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--dash-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Original Estimate</span>
                              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--dash-text-sec)', textDecoration: 'line-through', marginTop: '2px' }}>₹{p.estimatedPrice?.toLocaleString()}</div>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--dash-accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>User Proposed Price</span>
                              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--dash-accent)', marginTop: '2px' }}>₹{p.bargainPrice?.toLocaleString()}</div>
                            </div>
                          </div>

                          {p.bargainMessage && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--dash-text-sec)', fontStyle: 'italic', background: 'var(--dash-card)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--dash-border)', lineHeight: 1.4 }}>
                              "{p.bargainMessage}"
                            </div>
                          )}

                          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                            <button 
                              className="dash-btn dash-btn-primary dash-btn-sm" 
                              style={{ flex: 1, background: 'var(--dash-accent)', color: '#FFFFFF', fontWeight: 700, padding: '8px 16px', borderRadius: '8px' }}
                              disabled={bargainActionLoading}
                              onClick={() => {
                                setSelectedProject(p);
                                handleBargainAction('accept');
                              }}
                            >
                              <span>Accept Offer</span>
                            </button>
                            <button 
                              className="dash-btn dash-btn-secondary dash-btn-sm" 
                              style={{ flex: 1, backgroundColor: 'var(--dash-danger-bg)', color: 'var(--dash-danger)', border: '1px solid var(--dash-danger)', fontWeight: 700, padding: '8px 16px', borderRadius: '8px' }}
                              disabled={bargainActionLoading}
                              onClick={() => {
                                setSelectedProject(p);
                                handleBargainAction('reject');
                              }}
                            >
                              <span>Decline Offer</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Project estimation setter */}
                <div className="admin-mockup-card">
                  <div className="admin-section-title">Dispatched Price Estimations</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="dash-input-group" style={{ margin: 0 }}>
                      <label className="dash-label">Select Project to Estimate</label>
                      <select 
                        className="dash-input"
                        value={selectedProject?._id || ''}
                        onChange={(e) => {
                          const found = projects.find(p => p._id === e.target.value);
                          if (found) setSelectedProject(found);
                        }}
                      >
                        {projects.map(p => (
                          <option key={p._id} value={p._id}>{p.projectName} (Estimate: ₹{p.estimatedPrice?.toLocaleString() || 'None'})</option>
                        ))}
                      </select>
                    </div>

                    {selectedProject && (
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', background: 'var(--dash-card-sec)', padding: '24px', borderRadius: '16px', border: '1px solid var(--dash-border)', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <label className="dash-label">Set Price (₹ INR)</label>
                          <div style={{ position: 'relative' }}>
                            <DollarSign size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--dash-text-muted)' }} />
                            <input 
                              type="number" 
                              className="dash-input" 
                              style={{ paddingLeft: '38px', background: 'var(--dash-card)', color: 'var(--dash-text)', border: '1px solid var(--dash-border)' }}
                              placeholder="e.g. 240000"
                              value={estimateInput}
                              onChange={(e) => setEstimateInput(e.target.value)}
                            />
                          </div>
                        </div>
                        <button 
                          className="dash-btn dash-btn-primary" 
                          style={{ background: 'var(--dash-accent)', color: '#FFFFFF', fontWeight: 700, padding: '12px 24px', borderRadius: '10px' }}
                          onClick={handleSaveEstimate}
                        >
                          <span>Dispatch Estimate</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              {/* Divider / spacing handled by parent gap */}
                
                {/* Coupon generator */}
                <form className="admin-mockup-card" onSubmit={handleCreateCoupon}>
                  <div className="admin-section-title">Generate Discount Coupon</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                      <div>
                        <label className="dash-label">Coupon Code</label>
                        <input 
                          type="text" 
                          className="dash-input" 
                          placeholder="e.g. SUMMERSALE30" 
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          required 
                        />
                      </div>
                      <div>
                        <label className="dash-label">Discount (%)</label>
                        <input 
                          type="number" 
                          className="dash-input" 
                          placeholder="e.g. 30" 
                          value={couponDiscount}
                          onChange={(e) => setCouponDiscount(e.target.value)}
                          min="1" max="100" required 
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                      <div>
                        <label className="dash-label">Start Date</label>
                        <input 
                          type="date" 
                          className="dash-input" 
                          value={couponStartDate}
                          onChange={(e) => setCouponStartDate(e.target.value)}
                          required 
                        />
                      </div>
                      <div>
                        <label className="dash-label">End Date</label>
                        <input 
                          type="date" 
                          className="dash-input" 
                          value={couponEndDate}
                          onChange={(e) => setCouponEndDate(e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div>
                      <label className="dash-label">Usage Limit (Number of Users)</label>
                      <input 
                        type="number" 
                        className="dash-input" 
                        value={couponMaxUsers}
                        onChange={(e) => setCouponMaxUsers(e.target.value)}
                        placeholder="e.g. 100" 
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="dash-btn dash-btn-primary" 
                      style={{ width: '100%', marginTop: '6px', background: 'var(--dash-accent)', color: '#FFFFFF', fontWeight: 700 }}
                      disabled={couponLoading}
                    >
                      {couponLoading ? <div className="admin-spinner" /> : 'Generate Active Coupon Code'}
                    </button>

                  </div>
                </form>

                <div className="admin-mockup-card">
                  <div className="admin-section-title">Generated Coupons Records</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '180px' }}>
                    {coupons.map(c => (
                      <div key={c._id} className="mockup-item" style={{ padding: '12px 16px', borderRadius: '10px' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--dash-text)' }}>{c.code} ({c.discountPercent}% OFF)</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--dash-text-sec)', marginTop: '4px' }}>Redeemed: {c.usageCount}/{c.maxUsers} times</div>
                        </div>
                        <button 
                          className="dash-btn dash-btn-secondary dash-btn-sm" 
                          style={{ padding: '6px', backgroundColor: 'var(--dash-danger-bg)', color: 'var(--dash-danger)', border: '1px solid var(--dash-danger)', borderRadius: '6px' }}
                          onClick={() => handleDeleteCoupon(c._id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {coupons.length === 0 && (
                      <div style={{ fontStyle: 'italic', fontSize: '0.82rem', color: 'var(--dash-text-muted)', textAlign: 'center', padding: '10px' }}>No custom coupons generated.</div>
                    )}
                  </div>
                </div>

                <form className="admin-mockup-card" onSubmit={handleSaveOffer}>
                  <div className="admin-section-title">Configure Dates Promotions</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label className="dash-label">Offer Discount (%)</label>
                        <input 
                          type="number" 
                          className="dash-input" 
                          placeholder="e.g. 15" 
                          value={offerDiscount}
                          onChange={(e) => setOfferDiscount(e.target.value)}
                          min="1" max="100" required
                        />
                      </div>
                      <div>
                        <label className="dash-label">Description</label>
                        <input 
                          type="text" 
                          className="dash-input" 
                          placeholder="e.g. Festive Offer" 
                          value={offerDescription}
                          onChange={(e) => setOfferDescription(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label className="dash-label">Start Date</label>
                        <input 
                          type="date" 
                          className="dash-input" 
                          value={offerStartDate}
                          onChange={(e) => setOfferStartDate(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="dash-label">End Date</label>
                        <input 
                          type="date" 
                          className="dash-input" 
                          value={offerEndDate}
                          onChange={(e) => setOfferEndDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                      <input 
                        type="checkbox" 
                        id="offer-active"
                        checked={offerActive}
                        onChange={(e) => setOfferActive(e.target.checked)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--dash-accent)' }}
                      />
                      <label htmlFor="offer-active" className="dash-label" style={{ margin: 0, cursor: 'pointer', fontSize: '0.85rem' }}>Apply immediately if dates match</label>
                    </div>

                    <button 
                      type="submit" 
                      className="dash-btn dash-btn-primary" 
                      style={{ width: '100%', marginTop: '6px', background: 'var(--dash-accent)', color: '#FFFFFF', fontWeight: 700 }}
                      disabled={offerLoading}
                    >
                      {offerLoading ? <div className="admin-spinner" /> : 'Apply Promotion Campaign'}
                    </button>

                  </div>
                </form>

            </div>
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="admin-mockup-card" style={{ padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <div className="admin-grid-12-1">
              
              <div className="admin-mockup-card">
                <div className="admin-section-title">Dispatched Notifications Log</div>
                <div className="dash-table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Recipient</th>
                        <th>Channel</th>
                        <th>Alert Title</th>
                        <th>Message</th>
                        <th>Sent Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notifications.map(n => (
                        <tr key={n._id}>
                          <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>{n.recipient}</td>
                          <td>
                            <span className={`dash-badge ${n.type === 'telegram' ? 'dash-badge-success' : n.type === 'whatsapp' ? 'dash-badge-warning' : 'dash-badge-info'}`}>
                              {n.type}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, fontSize: '0.8rem' }}>{n.title}</td>
                          <td style={{ fontSize: '0.78rem', opacity: 0.85, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.message}</td>
                          <td style={{ fontSize: '0.72rem' }}>{new Date(n.sentAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {notifications.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '24px 0', color: 'var(--dash-text-muted)' }}>No notification logs found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <form className="admin-mockup-card" onSubmit={handleSendBroadcast}>
                <div className="admin-section-title">Send Broadcast Alert</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  
                  <div>
                    <label className="dash-label">Select Target Client User</label>
                    <select 
                      className="dash-input"
                      value={alertUserId}
                      onChange={(e) => setAlertUserId(e.target.value)}
                      required
                    >
                      {clients.map(c => (
                        <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="dash-label">Alert Channel</label>
                    <select 
                      className="dash-input"
                      value={alertType}
                      onChange={(e) => setAlertType(e.target.value)}
                    >
                      <option value="email">📧 Email Notification</option>
                      <option value="telegram">📱 Telegram Broadcast (To Admin)</option>
                    </select>
                  </div>

                  <div>
                    <label className="dash-label">Alert Title</label>
                    <input 
                      type="text" 
                      className="dash-input" 
                      placeholder="e.g. Sprint Roadmap Updated" 
                      value={alertTitle}
                      onChange={(e) => setAlertTitle(e.target.value)}
                      required 
                    />
                  </div>

                  <div>
                    <label className="dash-label">Message Content</label>
                    <textarea 
                      className="dash-input" 
                      style={{ height: '120px', resize: 'none', lineHeight: 1.5 }}
                      placeholder="Write client message details..."
                      value={alertMessage}
                      onChange={(e) => setAlertMessage(e.target.value)}
                      required 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="dash-btn dash-btn-primary" 
                    style={{ width: '100%', marginTop: '6px', background: 'var(--dash-accent)', color: '#FFFFFF', fontWeight: 700 }}
                    disabled={alertLoading}
                  >
                    {alertLoading ? <div className="admin-spinner" /> : (
                      <>
                        <Send size={16} />
                        <span>Dispatch Custom Notification</span>
                      </>
                    )}
                  </button>

                </div>
              </form>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="admin-mockup-card" style={{ padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div className="admin-mockup-card admin-stat-card orange" style={{ padding: '28px' }}>
                  <div className="admin-stat-icon-wrapper" style={{ width: '52px', height: '52px' }}>
                    <DollarSign size={26} />
                  </div>
                  <div>
                    <div className="admin-stat-value" style={{ fontSize: '1.6rem' }}>₹{totalRevenue.toLocaleString()}</div>
                    <div className="admin-stat-label" style={{ fontSize: '0.85rem' }}>Total Revenue Collected</div>
                  </div>
                </div>

                <div className="admin-mockup-card admin-stat-card yellow" style={{ padding: '28px' }}>
                  <div className="admin-stat-icon-wrapper" style={{ width: '52px', height: '52px' }}>
                    <Clock size={26} />
                  </div>
                  <div>
                    <div className="admin-stat-value" style={{ fontSize: '1.6rem' }}>₹{pendingRevenue.toLocaleString()}</div>
                    <div className="admin-stat-label" style={{ fontSize: '0.85rem' }}>Pending Pipeline Receivables</div>
                  </div>
                </div>

                <div className="admin-mockup-card admin-stat-card green" style={{ padding: '28px' }}>
                  <div className="admin-stat-icon-wrapper" style={{ width: '52px', height: '52px' }}>
                    <CheckCircle2 size={26} />
                  </div>
                  <div>
                    <div className="admin-stat-value" style={{ fontSize: '1.6rem' }}>98.4%</div>
                    <div className="admin-stat-label" style={{ fontSize: '0.85rem' }}>Payment Gateway Success Rate</div>
                  </div>
                </div>
              </div>

              <div className="admin-mockup-card">
                <div className="admin-section-title">Transactions Ledger</div>
                <div className="dash-table-wrapper">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>Project Name</th>
                        <th>Client Name</th>
                        <th>Total Estimated Price</th>
                        <th>Deposit Paid (25%)</th>
                        <th>Final Paid (75%)</th>
                        <th>Razorpay Order ID</th>
                        <th>Razorpay Payment ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.filter(p => p.depositPaid).map(p => {
                        const advance = Math.round((p.estimatedPrice || 0) * 0.25);
                        const finalAmount = Math.round((p.estimatedPrice || 0) * 0.75);
                        
                        return (
                          <tr key={p._id}>
                            <td style={{ fontWeight: 700 }}>{p.projectName}</td>
                            <td>{p.clientName}</td>
                            <td>₹{(p.estimatedPrice || 0).toLocaleString()}</td>
                            <td>
                              <span className="dash-badge dash-badge-success" style={{ fontSize: '0.7rem' }}>
                                ₹{advance.toLocaleString()} (Paid)
                              </span>
                            </td>
                            <td>
                              {p.finalPaid ? (
                                <span className="dash-badge dash-badge-success" style={{ fontSize: '0.7rem' }}>
                                  ₹{finalAmount.toLocaleString()} (Paid)
                                </span>
                              ) : (
                                <span className="dash-badge dash-badge-warning" style={{ fontSize: '0.7rem' }}>
                                  ₹{finalAmount.toLocaleString()} (Pending)
                                </span>
                              )}
                            </td>
                            <td style={{ fontSize: '0.75rem', fontFamily: 'var(--dash-font-mono)' }}>{p.razorpayOrderId || 'Simulator'}</td>
                            <td style={{ fontSize: '0.75rem', fontFamily: 'var(--dash-font-mono)' }}>{p.razorpayPaymentId || 'Simulator'}</td>
                          </tr>
                        );
                      })}
                      {projects.filter(p => p.depositPaid).length === 0 && (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '24px 0', color: 'var(--dash-text-muted)' }}>No validated payments logs found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        </main>

        {/* 4. Mobile Bottom Nav Bar */}
        <nav className="dash-bottom-nav">
          {navigationItems.slice(0, 5).map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button 
                key={item.key} 
                className={`dash-bottom-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.key)}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <IconComponent size={20} />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

      </div>
      
      {/* Helper Responsive Mobile Classes Injection */}
      <style>{`
        @media (max-width: 1024px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 1025px) {
          .visible-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
}
