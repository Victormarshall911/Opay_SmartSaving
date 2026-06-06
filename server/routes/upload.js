const express = require('express');
const multer = require('multer');
const path = require('path');
const { parseCSV, parsePDF } = require('../utils/parser');
const { categorizeAll } = require('../utils/categorizer');

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and CSV files are supported'));
    }
  },
});

router.post('/upload', upload.single('statement'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext === '.csv') {
      // Parse CSV and categorize
      const transactions = parseCSV(req.file.buffer);
      const { categorizedTransactions, categories, incomeEstimate, totalSpending } = categorizeAll(transactions);

      return res.json({
        mode: 'csv',
        transactions: categorizedTransactions,
        categories,
        incomeEstimate,
        totalSpending,
      });
    }

    if (ext === '.pdf') {
      // Extract raw text — let Gemini handle the parsing
      const rawText = await parsePDF(req.file.buffer);

      if (!rawText || rawText.trim().length < 50) {
        return res.status(400).json({
          error: 'Could not extract enough text from PDF. Try CSV format instead.',
        });
      }

      return res.json({
        mode: 'pdf',
        rawText,
      });
    }

    return res.status(400).json({ error: 'Unsupported file type' });
  } catch (err) {
    console.error('Upload error:', err);

    if (err.message === 'Only PDF and CSV files are supported') {
      return res.status(400).json({ error: err.message });
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Please upload a file smaller than 5MB.' });
    }

    return res.status(500).json({
      error: 'Failed to process your statement. Try CSV format instead.',
    });
  }
});

module.exports = router;
