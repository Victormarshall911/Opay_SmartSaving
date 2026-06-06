import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import strings from '../utils/strings';

export default function LoadingScreen({ onComplete }) {
  const { language, mode } = useApp();
  const s = strings[language];
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const prefix = mode === 'demo' ? 'loading_demo_' : 'loading_upload_';
  const steps = [
    s[`${prefix}1`],
    s[`${prefix}2`],
    s[`${prefix}3`],
    s[`${prefix}4`],
    s[`${prefix}5`],
  ];

  useEffect(() => {
    const stepDuration = 2500;
    const totalDuration = stepDuration * steps.length;
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(pct);
    }, 50);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, stepDuration);

    const timeout = setTimeout(() => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      setProgress(100);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }, totalDuration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <motion.div
          className="loading-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="opay-logo-large">SmartSavings</span>
        </motion.div>

        <div className="loading-steps">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className={`loading-step ${i < currentStep ? 'completed' : ''} ${i === currentStep ? 'active' : ''} ${i > currentStep ? 'pending' : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: i <= currentStep ? 1 : 0.3,
                x: i <= currentStep ? 0 : -20,
              }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <span className="step-indicator">
                {i < currentStep ? '✅' : i === currentStep ? (
                  <span className="spinner"></span>
                ) : '○'}
              </span>
              <span className="step-text">{step}</span>
            </motion.div>
          ))}
        </div>

        <div className="progress-bar-container">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
        <span className="progress-text">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
