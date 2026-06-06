import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import strings from '../utils/strings';

export default function ShareCard({ analysisData }) {
  const { language } = useApp();
  const s = strings[language];
  const cardRef = useRef(null);

  const summary = analysisData?.user_summary || {};
  const nudge = language === 'en' ? analysisData?.nudge_english : analysisData?.nudge_pidgin;

  const handleDownload = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = 'opay-savings-plan.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
  };

  return (
    <motion.div
      className="share-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <div className="share-card-preview" ref={cardRef}>
        <div className="share-card-inner">
          <h2 className="share-card-title">💰 {s.share_card_title}</h2>

          <div className="share-stats">
            <div className="share-stat">
              <span className="share-stat-label">{s.share_income}</span>
              <span className="share-stat-value">₦{(summary.income_estimate || 0).toLocaleString()}</span>
            </div>
            <div className="share-stat">
              <span className="share-stat-label">{s.share_spending}</span>
              <span className="share-stat-value">₦{(summary.total_spending || 0).toLocaleString()}</span>
            </div>
            <div className="share-stat">
              <span className="share-stat-label">{s.share_target}</span>
              <span className="share-stat-value">₦{(analysisData?.savings_plan?.monthly || 0).toLocaleString()}</span>
            </div>
          </div>

          {nudge && <p className="share-nudge">"{nudge}"</p>}

          <div className="share-card-footer">
            <span>{s.share_footer}</span>
            <div className="share-qr-placeholder">QR</div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary btn-full" onClick={handleDownload}>
        📥 {s.share_download}
      </button>
    </motion.div>
  );
}
