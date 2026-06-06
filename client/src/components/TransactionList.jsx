import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import strings from '../utils/strings';

const FILTER_CATEGORIES = ['All', 'Food', 'Transport', 'Data', 'Shopping', 'Entertainment', 'Transfers'];

export default function TransactionList({ transactions }) {
  const { language } = useApp();
  const s = strings[language];
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx) => {
      const desc = (tx.desc || tx.description || '').toLowerCase();
      const matchesSearch = !search || desc.includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'All' || 
        (tx.category || '').toLowerCase().includes(activeFilter.toLowerCase()) ||
        desc.includes(activeFilter.toLowerCase());
      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, activeFilter]);

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
    } catch {
      return dateStr;
    }
  };

  return (
    <motion.div
      className="tx-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <h3 className="tx-title">{s.tx_title}</h3>

      <div className="tx-search">
        <input
          type="text"
          placeholder={s.tx_search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="tx-search-input"
        />
      </div>

      <div className="tx-filters">
        {FILTER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${activeFilter === cat ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat === 'All' ? s.tx_all : cat}
          </button>
        ))}
      </div>

      <div className="tx-list">
        {filtered.length === 0 ? (
          <p className="tx-empty">No transactions found</p>
        ) : (
          filtered.map((tx, i) => {
            const isCredit = tx.type === 'credit';
            const amount = Math.abs(parseFloat(tx.amount) || 0);
            return (
              <motion.div
                key={i}
                className="tx-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
              >
                <span className="tx-date">{formatDate(tx.date)}</span>
                <span className="tx-desc">{tx.desc || tx.description}</span>
                <span className={`tx-amount ${isCredit ? 'credit' : 'debit'}`}>
                  {isCredit ? '+' : '-'}₦{amount.toLocaleString()}
                </span>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
