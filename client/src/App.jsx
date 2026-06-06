import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import OAuthModal from './components/OAuthModal';
import LoadingScreen from './components/LoadingScreen';
import UploadPage from './components/UploadPage';
import Dashboard from './components/Dashboard';
import LanguageToggle from './components/LanguageToggle';
import NotificationBell from './components/NotificationBell';
import { mockTransactions } from './utils/mockData';
import strings from './utils/strings';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

function AppContent() {
  const {
    language, mode, setMode, currentPage, setCurrentPage,
    analysisData, setAnalysisData, resetApp,
  } = useApp();
  const s = strings[language];

  const [showOAuth, setShowOAuth] = useState(false);
  const [transactions, setTransactions] = useState([]);

  // === OPTION A: Demo Flow ===
  const handleDemoClick = () => {
    setShowOAuth(true);
  };

  const handleOAuthAllow = async () => {
    setShowOAuth(false);
    setMode('demo');
    setTransactions(mockTransactions);
    setCurrentPage('loading');

    // Fire off Gemini analysis in background
    try {
      const res = await fetch(`${API_BASE}/api/gemini/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'demo', data: mockTransactions }),
      });
      const data = await res.json();
      setAnalysisData(data);
    } catch (err) {
      console.error('Gemini analysis failed:', err);
      // Fallback will be handled by server
      try {
        const res = await fetch(`${API_BASE}/api/gemini/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'demo', data: mockTransactions }),
        });
        const data = await res.json();
        setAnalysisData(data);
      } catch {
        // Use inline fallback
        setAnalysisData(getFallbackData());
      }
    }
  };

  // === OPTION B: Upload Flow ===
  const handleUploadClick = () => {
    setMode('upload');
    setCurrentPage('upload');
  };

  const handleUploadAnalyze = async (uploadResult) => {
    setCurrentPage('loading');

    // Prepare data for Gemini
    let geminiBody = {};
    if (uploadResult.mode === 'csv') {
      setTransactions(uploadResult.transactions);
      geminiBody = {
        mode: 'upload',
        data: uploadResult.transactions,
      };
    } else if (uploadResult.mode === 'pdf') {
      geminiBody = {
        mode: 'upload',
        rawText: uploadResult.rawText,
      };
    }

    try {
      const res = await fetch(`${API_BASE}/api/gemini/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody),
      });
      const data = await res.json();
      setAnalysisData(data);

      // If PDF mode, extract transactions from Gemini categories
      if (uploadResult.mode === 'pdf' && !transactions.length) {
        setTransactions([]);
      }
    } catch (err) {
      console.error('Gemini analysis failed:', err);
      setAnalysisData(getFallbackData());
    }
  };

  const handleLoadingComplete = () => {
    setCurrentPage('dashboard');
  };

  const handleGoHome = () => {
    resetApp();
    setShowOAuth(false);
    setTransactions([]);
  };

  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="nav-left" onClick={handleGoHome} style={{ cursor: 'pointer' }}>
            <span className="nav-logo">SmartSavings</span>
            <span className="nav-title">{s.nav_title}</span>
          </div>
          <div className="nav-right">
            <LanguageToggle />
            <NotificationBell />
          </div>
        </div>
      </nav>

      {/* Pages */}
      <main className="main-content">
        {currentPage === 'landing' && (
          <LandingPage
            onDemoClick={handleDemoClick}
            onUploadClick={handleUploadClick}
          />
        )}

        {currentPage === 'upload' && (
          <UploadPage onAnalyze={handleUploadAnalyze} />
        )}

        {currentPage === 'loading' && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}

        {currentPage === 'dashboard' && (
          <Dashboard transactions={transactions} />
        )}
      </main>

      {/* OAuth Modal */}
      <OAuthModal
        isOpen={showOAuth}
        onClose={() => setShowOAuth(false)}
        onAllow={handleOAuthAllow}
      />
    </div>
  );
}

function getFallbackData() {
  return {
    user_summary: { income_estimate: 45000, total_spending: 82100, savings_gap: 37100 },
    categories: [
      { name: "Food & Snacks", amount: 20100, percentage: 24, color: "#FF6B35" },
      { name: "Shopping", amount: 16000, percentage: 19, color: "#E91E63" },
      { name: "Transport", amount: 12200, percentage: 15, color: "#2196F3" },
      { name: "Entertainment", amount: 12500, percentage: 15, color: "#9C27B0" },
      { name: "Transfers", amount: 8500, percentage: 10, color: "#00BCD4" },
      { name: "Airtime & Data", amount: 6300, percentage: 8, color: "#4CAF50" },
      { name: "Education", amount: 5500, percentage: 7, color: "#FF9800" },
      { name: "Personal Care", amount: 5300, percentage: 6, color: "#795548" },
    ],
    insights: [
      { category: "Food & Snacks", current_spend: 20100, tip_english: "You're spending ₦20,100 on food — try cooking more at home. A simple meal prep on Sundays could save you ₦8,000/month easily.", tip_pidgin: "Bros, ₦20K dey go for food o! If you cook house food 3 times a week, you go save like ₦8K.", potential_saving: 8000, icon: "🍔" },
      { category: "Entertainment", current_spend: 12500, tip_english: "₦3,500 went to betting this month. If you auto-save that amount instead, you'll have ₦42,000 extra in a year!", tip_pidgin: "Betting dey chop ₦3,500 every month. If you lock am for your Vault, one year you go see ₦42K!", potential_saving: 3500, icon: "🎮" },
      { category: "Transport", current_spend: 12200, tip_english: "Transport is eating ₦12,200. Consider carpooling or using BRT for regular routes — could save ₦4,000 monthly.", tip_pidgin: "Transport dey take ₦12K! Try BRT or share ride with your paddy. You fit save ₦4K easy.", potential_saving: 4000, icon: "🚗" },
    ],
    savings_plan: { weekly: 2000, monthly: 8000, goal: "Emergency Fund", goal_amount: 50000, timeline_months: 7 },
    nudge_english: "Start small, stay consistent. Even ₦500 a week builds real wealth over time! 💚",
    nudge_pidgin: "Oya start small! ₦500 every week, before you know, money don stack! 💚",
    fun_fact: "If you save ₦2,000 weekly in your Smart Vault at 15% annual interest, you'll have ₦112,000 in just one year!",
    auto_save_suggestion: 500,
  };
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
