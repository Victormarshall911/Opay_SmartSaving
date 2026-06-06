import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import strings from '../utils/strings';

export default function InsightCard({ insight, index }) {
  const { language } = useApp();
  const s = strings[language];

  const tip = language === 'en' ? insight.tip_english : insight.tip_pidgin;

  return (
    <motion.div
      className="insight-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 * index }}
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
    >
      <div className="insight-header">
        <span className="insight-icon">{insight.icon}</span>
        <span className="insight-category">{insight.category}</span>
        <span className="insight-spend-badge">
          ₦{insight.current_spend?.toLocaleString()}
        </span>
      </div>

      <p className="insight-tip">{tip}</p>

      <div className="insight-footer">
        <span className="insight-saving">
          {s.potential_saving}: <strong>₦{insight.potential_saving?.toLocaleString()}{s.per_month}</strong>
        </span>
        <button className="btn btn-sm btn-outline">
          {s.apply_tip}
        </button>
      </div>
    </motion.div>
  );
}
