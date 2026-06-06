const Papa = require('papaparse');

/**
 * Parse CSV content into normalized transaction objects
 * @param {Buffer} fileBuffer - CSV file buffer
 * @returns {Array} Array of {date, desc, amount, type}
 */
function parseCSV(fileBuffer) {
  const csvText = fileBuffer.toString('utf-8');
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (result.errors.length > 0) {
    console.warn('CSV parse warnings:', result.errors.slice(0, 3));
  }

  return result.data.map(row => {
    // Try common column name variations
    const date = row.Date || row.date || row.DATE || row['Transaction Date'] || row.trans_date || '';
    const desc = row.Description || row.description || row.DESC || row.Narration || row.narration || row.Details || '';
    const rawAmount = row.Amount || row.amount || row.AMOUNT || row.Value || 0;
    const amount = parseFloat(rawAmount) || 0;
    const type = row.Type || row.type || row.TYPE || (amount >= 0 ? 'credit' : 'debit');

    return {
      date: String(date).trim(),
      desc: String(desc).trim(),
      amount: Math.abs(amount),
      type: type === 'credit' || amount > 0 ? 'credit' : 'debit',
    };
  }).filter(tx => tx.desc && tx.amount > 0);
}

/**
 * Parse PDF content and extract raw text
 * @param {Buffer} fileBuffer - PDF file buffer
 * @returns {string} Raw extracted text
 */
async function parsePDF(fileBuffer) {
  const pdfParse = require('pdf-parse');
  const data = await pdfParse(fileBuffer);
  return data.text;
}

module.exports = { parseCSV, parsePDF };
