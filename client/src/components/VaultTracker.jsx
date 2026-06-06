import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import strings from '../utils/strings';

export default function VaultTracker({ savingsPlan, autoSaveSuggestion }) {
  const { language, vaultBalance, addToVault } = useApp();
  const s = strings[language];
  const [customAmount, setCustomAmount] = useState('');
  const [toast, setToast] = useState(null);
  const [animatedBalance, setAnimatedBalance] = useState(0);
  const btnRef = useRef(null);

  const goalAmount = savingsPlan?.goal_amount || 50000;
  const goalName = savingsPlan?.goal || 'Emergency Fund';
  const timelineMonths = savingsPlan?.timeline_months || 7;
  const progressPct = Math.min((vaultBalance / goalAmount) * 100, 100);

  // Animate balance count-up
  useEffect(() => {
    const duration = 1500;
    const start = Date.now();
    const startVal = animatedBalance;
    const endVal = vaultBalance;
    
    const animate = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setAnimatedBalance(Math.round(startVal + (endVal - startVal) * eased));
      if (pct < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [vaultBalance]);

  // Calculate estimated completion date
  const completionDate = new Date();
  completionDate.setMonth(completionDate.getMonth() + timelineMonths);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const completionStr = `${monthNames[completionDate.getMonth()]} ${completionDate.getFullYear()}`;

  const handleAutoSave = (amount) => {
    addToVault(amount);

    // Confetti burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00A859', '#FFD700', '#E8F5EE', '#003D1F'],
    });

    setToast(`₦${amount.toLocaleString()} ${s.vault_toast}`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCustomSave = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      handleAutoSave(amount);
      setCustomAmount('');
    }
  };

  return (
    <motion.div
      className="vault-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <h3 className="vault-title">{s.vault_title}</h3>

      <div className="vault-goal-info">
        <span className="vault-goal-name">{goalName}</span>
        <span className="vault-goal-amount">₦{goalAmount.toLocaleString()}</span>
      </div>

      <div className="vault-progress-container">
        <motion.div
          className="vault-progress-bar"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
        />
      </div>

      <div className="vault-progress-text">
        <span>₦{animatedBalance.toLocaleString()} {s.vault_saved} ₦{goalAmount.toLocaleString()} {s.vault_goal}</span>
      </div>

      <p className="vault-timeline">{s.vault_track} {completionStr}</p>

      <motion.button
        ref={btnRef}
        className="btn btn-primary btn-full btn-autosave"
        onClick={() => handleAutoSave(autoSaveSuggestion || 500)}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {s.autosave_btn} ₦{(autoSaveSuggestion || 500).toLocaleString()} {s.autosave_now}
      </motion.button>

      <div className="vault-custom">
        <span className="vault-custom-label">{s.vault_custom_label}</span>
        <div className="vault-custom-input">
          <span className="currency-prefix">₦</span>
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="1000"
            min="0"
          />
          <button className="btn btn-sm btn-outline" onClick={handleCustomSave}>
            {s.vault_custom_btn}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <motion.div
          className="vault-toast"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          🎉 {toast}
        </motion.div>
      )}
    </motion.div>
  );
}
