import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import strings from '../utils/strings';

export default function OAuthModal({ isOpen, onClose, onAllow }) {
  const { language } = useApp();
  const s = strings[language];
  const [phone, setPhone] = useState('08012345678');
  const [step, setStep] = useState('select_bank'); // 'select_bank' or 'auth'

  if (!isOpen) return null;

  const banks = [
    { name: 'OPay', available: true },
    { name: 'Access Bank', available: false },
    { name: 'GTBank', available: false },
    { name: 'Kuda', available: false },
    { name: 'Moniepoint', available: false },
  ];

  const handleBankClick = (bank) => {
    if (bank.available) {
      setStep('auth');
    } else {
      alert('Coming Soon!');
    }
  };

  const handleClose = () => {
    setStep('select_bank');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          className="oauth-modal"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="oauth-header">
            <div className="oauth-logo">
              <span className="opay-logo-text">
                {step === 'select_bank' ? 'Select Bank' : 'Bank Login'}
              </span>
            </div>
          </div>

          <div className="oauth-body">
            {step === 'select_bank' ? (
              <>
                <h3 className="oauth-title">Choose your bank to connect:</h3>
                <div className="bank-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {banks.map(bank => (
                    <button
                      key={bank.name}
                      onClick={() => handleBankClick(bank)}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        background: bank.available ? '#E8F5EE' : '#FFF',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontFamily: 'Sora',
                        fontWeight: '600',
                        fontSize: '15px',
                        color: '#003D1F',
                      }}
                    >
                      {bank.name}
                      {!bank.available && <span style={{ fontSize: '11px', background: '#F0F0F0', padding: '4px 8px', borderRadius: '8px', color: '#666' }}>Coming Soon</span>}
                      {bank.available && <span style={{ fontSize: '11px', background: '#00A859', color: '#FFF', padding: '4px 8px', borderRadius: '8px' }}>Works</span>}
                    </button>
                  ))}
                </div>
                <button className="btn-link" onClick={handleClose}>
                  {s.oauth_cancel}
                </button>
              </>
            ) : (
              <>
                <h3 className="oauth-title">{s.oauth_header}</h3>

                <div className="oauth-permissions">
                  <div className="perm-item">
                    <span className="perm-check">✓</span>
                    <span>{s.oauth_perm1}</span>
                  </div>
                  <div className="perm-item">
                    <span className="perm-check">✓</span>
                    <span>{s.oauth_perm2}</span>
                  </div>
                  <div className="perm-item">
                    <span className="perm-check">✓</span>
                    <span>{s.oauth_perm3}</span>
                  </div>
                </div>

                <div className="oauth-phone">
                  <label>Phone Number</label>
                  <div className="phone-input">
                    <span className="phone-prefix">+234</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="08012345678"
                    />
                  </div>
                </div>

                <button className="btn btn-primary btn-full" onClick={onAllow}>
                  {s.oauth_allow}
                </button>

                <button className="btn-link" onClick={() => setStep('select_bank')}>
                  Back to Banks
                </button>

                <p className="oauth-privacy">
                  🔒 {s.oauth_privacy}
                </p>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
