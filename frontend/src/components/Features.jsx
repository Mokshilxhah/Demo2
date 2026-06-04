import React from 'react';

const cells = [
  {
    key: 'a', cls: 'bento-a',
    emoji: '📡', title: 'Real-Time Queue Tracking',
    desc: 'Watch your project move live through our transparent pipeline. No guessing — always know your exact position.',
    gradFrom: 'rgba(139,92,246,0.15)', gradTo: 'rgba(59,130,246,0.05)',
  },
  {
    key: 'b', cls: 'bento-b',
    emoji: '💰', title: 'Instant Budget Estimation',
    desc: 'Receive a precise breakdown of cost and time the moment your project is reviewed.',
    gradFrom: 'rgba(236,72,153,0.15)', gradTo: 'rgba(245,158,11,0.05)',
  },
  {
    key: 'c', cls: 'bento-c',
    emoji: '🔔', title: 'WhatsApp Alerts',
    desc: 'Get notified on every status change directly to your phone.',
    gradFrom: 'rgba(16,185,129,0.15)', gradTo: 'transparent',
  },
  {
    key: 'd', cls: 'bento-d',
    emoji: '🔒', title: 'Secure & Scalable',
    desc: 'Enterprise-grade code standards on every single build.',
    gradFrom: 'rgba(245,158,11,0.15)', gradTo: 'transparent',
  },
  {
    key: 'e', cls: 'bento-e',
    emoji: '⚡', title: 'Rapid Delivery',
    desc: 'Tight deadlines. Zero compromise on quality.',
    gradFrom: 'rgba(6,182,212,0.15)', gradTo: 'transparent',
  },
];

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="wrap">
        <div className="section-header">
          <span className="label">Core Advantages</span>
          <h2 className="heading-lg">Why Choose BuildQueue</h2>
          <p className="body-md">Every feature is designed so you can focus on your business, not on chasing updates.</p>
        </div>

        <div className="bento">
          {cells.map(c => (
            <div
              key={c.key}
              className={`glass bento-cell ${c.cls}`}
              style={{ background: `linear-gradient(135deg,${c.gradFrom},${c.gradTo})` }}
            >
              <div className="cell-icon">{c.emoji}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div className="cell-bg">{c.emoji}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
