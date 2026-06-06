import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import strings from '../utils/strings';
import SpendingChart from './SpendingChart';
import InsightCard from './InsightCard';
import VaultTracker from './VaultTracker';
import NudgeCard from './NudgeCard';
import TransactionList from './TransactionList';
import ShareCard from './ShareCard';

function CountUp({ target, duration = 1500, prefix = '₦' }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const animate = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setValue(Math.round(target * eased));
      if (pct < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration]);

  return <span className="count-up">{prefix}{value.toLocaleString()}</span>;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Dashboard({ transactions }) {
  const { language, mode, analysisData } = useApp();
  const s = strings[language];
  const [highlightCategory, setHighlightCategory] = useState(null);

  if (!analysisData) return null;

  const { user_summary, categories, insights, savings_plan, nudge_english, nudge_pidgin, fun_fact, auto_save_suggestion } = analysisData;

  const greeting = mode === 'demo' ? s.greeting_demo : s.greeting_upload;
  const badge = mode === 'demo' ? s.badge_demo : s.badge_upload;
  const badgeClass = mode === 'demo' ? 'badge-demo' : 'badge-upload';

  return (
    <motion.div
      className="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Greeting */}
      <motion.div className="greeting-card" variants={cardVariants}>
        <div className="greeting-top">
          <h2 className="greeting-text">{greeting}</h2>
          <span className={`mode-badge ${badgeClass}`}>{badge}</span>
        </div>
        {mode === 'demo' && (
          <div className="balance-chip">
            <span className="balance-label">Bank Balance</span>
            <span className="balance-value">₦12,450</span>
          </div>
        )}
      </motion.div>

      {/* Summary Strip */}
      <motion.div className="summary-strip" variants={cardVariants}>
        <div className="summary-item">
          <span className="summary-label">{s.total_spending}</span>
          <CountUp target={user_summary?.total_spending || 0} />
        </div>
        <div className="summary-item highlight">
          <span className="summary-label">{s.potential_savings}</span>
          <CountUp target={
            insights ? insights.reduce((sum, ins) => sum + (ins.potential_saving || 0), 0) : 0
          } />
          <span className="summary-suffix">{s.per_month}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">{s.savings_goal}</span>
          <span className="count-up">{savings_plan?.timeline_months || '—'} {s.months_away}</span>
        </div>
      </motion.div>

      {/* Spending Chart */}
      <SpendingChart
        categories={categories}
        onCategoryClick={(name) => setHighlightCategory(name === highlightCategory ? null : name)}
      />

      {/* Insights */}
      <motion.div className="insights-section" variants={cardVariants}>
        <h3 className="section-heading">{s.insights_title}</h3>
        <div className="insights-grid">
          {insights && insights.map((insight, i) => (
            <InsightCard key={i} insight={insight} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Vault Tracker */}
      <VaultTracker
        savingsPlan={savings_plan}
        autoSaveSuggestion={auto_save_suggestion}
      />

      {/* Nudge */}
      <NudgeCard
        nudgeEnglish={nudge_english}
        nudgePidgin={nudge_pidgin}
      />

      {/* Fun Fact */}
      {fun_fact && (
        <motion.div className="fun-fact-card" variants={cardVariants}>
          <span className="fun-fact-icon">💡</span>
          <p>{fun_fact}</p>
        </motion.div>
      )}

      {/* Transaction List */}
      <TransactionList transactions={transactions} />

      {/* Share Card */}
      <ShareCard analysisData={analysisData} />
    </motion.div>
  );
}
