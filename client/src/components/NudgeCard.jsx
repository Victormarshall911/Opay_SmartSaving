import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function NudgeCard({ nudgeEnglish, nudgePidgin }) {
  const { language } = useApp();
  const s = language === 'en' ? nudgeEnglish : nudgePidgin;

  return (
    <motion.div
      className="nudge-card"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.6 }}
    >
      <p className="nudge-text">{s}</p>
      <button className="btn btn-nudge-share">
        📤 {language === 'en' ? 'Share This' : 'Share Am'}
      </button>
    </motion.div>
  );
}
