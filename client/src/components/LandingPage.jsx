import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import strings from '../utils/strings';

const testimonials = [
  { text: "E help me save ₦15,000 for my laptop!", name: "Tunde", city: "Lagos" },
  { text: "I never know I dey waste money on data like this", name: "Amaka", city: "Abuja" },
  { text: "The Pidgin mode na me favorite part 😂", name: "Biodun", city: "Ibadan" },
];

const features = ['feature_ai', 'feature_pidgin', 'feature_owealth', 'feature_secure'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function LandingPage({ onDemoClick, onUploadClick }) {
  const { language } = useApp();
  const s = strings[language];

  return (
    <div className="landing-page">
      {/* Hero */}
      <motion.section
        className="hero"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="hero-title" variants={itemVariants}>
          {s.hero_title}
        </motion.h1>
        <motion.p className="hero-subtitle" variants={itemVariants}>
          {s.hero_subtitle}
        </motion.p>

        {/* CTA Cards */}
        <div className="cta-grid">
          <motion.div
            className="cta-card cta-demo"
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,168,89,0.2)' }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="cta-badge demo-badge">{s.demo_badge}</span>
            <div className="cta-icon">🔗</div>
            <h3>{s.demo_title}</h3>
            <p>{s.demo_subtitle}</p>
            <button className="btn btn-primary" onClick={onDemoClick}>
              {s.demo_btn}
            </button>
          </motion.div>

          <motion.div
            className="cta-card cta-upload"
            variants={itemVariants}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,168,89,0.15)' }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="cta-badge upload-badge">{s.upload_badge}</span>
            <div className="cta-icon">📄</div>
            <h3>{s.upload_title}</h3>
            <p>{s.upload_subtitle}</p>
            <button className="btn btn-outline" onClick={onUploadClick}>
              {s.upload_btn}
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Feature Strip */}
      <motion.div
        className="feature-strip"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {features.map((f) => (
          <span key={f} className="feature-item">{s[f]}</span>
        ))}
      </motion.div>

      {/* Testimonials */}
      <motion.section
        className="testimonials"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="section-title">What People Are Saying</h2>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              className="testimonial-card"
              variants={itemVariants}
            >
              <p className="testimonial-text">"{t.text}"</p>
              <span className="testimonial-author">— {t.name}, {t.city}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
