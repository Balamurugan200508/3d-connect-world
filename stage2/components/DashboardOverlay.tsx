"use client";

import React, { useState } from 'react';

export default function DashboardOverlay({ onOpenMgmt, onOpenTech }: { onOpenMgmt: () => void, onOpenTech: () => void }) {
  const [activeTab, setActiveTab] = useState<'none' | 'mgmt' | 'tech'>('none');

  return (
    <div className="overlay-wrap pointer-events-auto">
      <div className="dashboard">
        <div className="dash-title">⬡ Respective Department ⬡</div>

        <div className="dept-tabs">
          <button 
            className={`dept-btn ${activeTab === 'mgmt' ? 'active-mgmt' : ''}`} 
            onClick={() => setActiveTab('mgmt')}
          >
            🏢 Management
          </button>
          <button 
            className={`dept-btn ${activeTab === 'tech' ? 'active-tech' : ''}`} 
            onClick={() => setActiveTab('tech')}
          >
            💻 Technical
          </button>
        </div>

        {activeTab === 'none' && (
          <div id="default-msg" className="placeholder">✦ Select a department above ✦</div>
        )}

        <div id="panel-mgmt" className={`panel mgmt-panel ${activeTab === 'mgmt' ? 'visible' : ''}`}>
          <div className="flex justify-between items-center mb-2">
            <div className="section-label mgmt">▸ Management Department</div>
            <button 
              onClick={onOpenMgmt}
              className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/50 rounded text-[10px] uppercase tracking-wider transition-colors"
            >
              Login
            </button>
          </div>
          <div className="sep"></div>

          <button className="role-btn">
            <span className="emoji">👑</span>
            <span className="text-wrap">
              <span className="abbr">CEO</span>
              <span className="full">Chief Executive Officer</span>
            </span>
            <span className="tag">Executive</span>
          </button>

          <button className="role-btn">
            <span className="emoji">🎯</span>
            <span className="text-wrap">
              <span className="abbr">MD</span>
              <span className="full">Managing Director</span>
            </span>
            <span className="tag">Director</span>
          </button>

          <button className="role-btn">
            <span className="emoji">💰</span>
            <span className="text-wrap">
              <span className="abbr">CFO</span>
              <span className="full">Chief Financial Officer</span>
            </span>
            <span className="tag">Finance</span>
          </button>

          <button className="role-btn">
            <span className="emoji">⚙️</span>
            <span className="text-wrap">
              <span className="abbr">COO</span>
              <span className="full">Chief Operational Officer</span>
            </span>
            <span className="tag">Operations</span>
          </button>
        </div>

        <div id="panel-tech" className={`panel tech-panel ${activeTab === 'tech' ? 'visible' : ''}`}>
          <div className="flex justify-between items-center mb-2">
            <div className="section-label tech">▸ Technical Department</div>
            <button 
              onClick={onOpenTech}
              className="px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/50 rounded text-[10px] uppercase tracking-wider transition-colors"
            >
              Login
            </button>
          </div>
          <div className="sep"></div>

          <button className="role-btn">
            <span className="emoji">🎨</span>
            <span className="text-wrap">
              <span className="abbr">Frontend</span>
              <span className="full">Frontend Developer</span>
            </span>
            <span className="tag">UI / UX</span>
          </button>

          <button className="role-btn">
            <span className="emoji">🔧</span>
            <span className="text-wrap">
              <span className="abbr">Backend</span>
              <span className="full">Backend Developer</span>
            </span>
            <span className="tag">Server</span>
          </button>

          <button className="role-btn">
            <span className="emoji">🚀</span>
            <span className="text-wrap">
              <span className="abbr">Fullstack</span>
              <span className="full">Fullstack Developer</span>
            </span>
            <span className="tag">Full Scope</span>
          </button>
        </div>
      </div>
    </div>
  );
}
