import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { mockNotifications } from '../utils/mockData';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications] = useState(mockNotifications);
  const bellRef = useRef(null);

  return (
    <div className="notif-container" ref={bellRef}>
      <button
        className="notif-bell"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        🔔
        {notifications.length > 0 && (
          <span className="notif-badge">{notifications.length}</span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="notif-dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="notif-header">
              <h4>Notifications</h4>
            </div>
            {notifications.map((n) => (
              <div key={n.id} className="notif-item">
                <span className="notif-icon">{n.icon}</span>
                <div className="notif-content">
                  <p>{n.text}</p>
                  <span className="notif-time">{n.time}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
