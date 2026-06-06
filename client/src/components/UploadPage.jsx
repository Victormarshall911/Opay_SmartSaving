import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import strings from '../utils/strings';

export default function UploadPage({ onAnalyze }) {
  const { language } = useApp();
  const s = strings[language];
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    validateAndSet(dropped);
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    validateAndSet(selected);
  };

  const validateAndSet = (f) => {
    setError('');
    if (!f) return;
    const ext = f.name.split('.').pop().toLowerCase();
    if (!['pdf', 'csv'].includes(ext)) {
      setError('Only PDF and CSV files are supported');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('Please upload a file smaller than 5MB');
      return;
    }
    setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('statement', file);

      const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const uploadResult = await res.json();
      onAnalyze(uploadResult);
    } catch (err) {
      setError(err.message || 'Failed to process file. Try again.');
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="upload-page">
      <motion.div
        className="upload-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileInputRef.current?.click()}
        >
          {!file ? (
            <>
              <div className="upload-icon">📄</div>
              <h3>{s.upload_drop}</h3>
              <p className="upload-subtext">{s.upload_drop_sub}</p>
              <button
                className="btn btn-outline"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                {s.upload_browse}
              </button>
              <div className="upload-formats">
                <span className="format-badge">.pdf</span>
                <span className="format-badge">.csv</span>
              </div>
            </>
          ) : (
            <div className="file-selected">
              <span className="file-check">✅</span>
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatSize(file.size)}</span>
              </div>
              <button
                className="btn-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                ✕
              </button>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.csv"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {error && (
          <motion.div
            className="upload-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        <motion.button
          className={`btn btn-primary btn-full btn-analyze ${!file || uploading ? 'disabled' : ''}`}
          disabled={!file || uploading}
          onClick={handleAnalyze}
          whileHover={file && !uploading ? { scale: 1.02 } : {}}
          whileTap={file && !uploading ? { scale: 0.98 } : {}}
        >
          {uploading ? 'Processing...' : s.upload_analyze}
        </motion.button>
      </motion.div>
    </div>
  );
}
