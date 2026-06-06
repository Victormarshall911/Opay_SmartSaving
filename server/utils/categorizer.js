/**
 * Keyword-based transaction categorizer for Nigerian transactions
 */

const categoryKeywords = {
  "Airtime & Data": /airtime|data|mtn|glo|airtel|9mobile|smile/i,
  "Transport": /uber|bolt|okada|transport|bus|taxi|danfo|keke|ride/i,
  "Food & Snacks": /kfc|chicken|food|eat|snack|restaurant|cafe|suya|pepper|iya|mama\s*put|buka|domino|pizza|shawarma|cold\s*stone|shoprite|grocer/i,
  "Transfers": /transfer|send\s*money|payment|bank/i,
  "Shopping": /jumia|konga|shop|fashion|cloth|shoe|bag|market|zara|order|purchase/i,
  "Education": /school|tuition|lesson|course|book|textbook|coursera|udemy/i,
  "Entertainment": /netflix|spotify|showmax|games|bet|sport|bet9ja|sportybet|cinema|silverbird/i,
  "Personal Care": /salon|barb|laundry|gym|membership/i,
};

/**
 * Categorize a single transaction description
 * @param {string} description - Transaction description
 * @returns {string} Category name
 */
function categorizeTransaction(description) {
  for (const [category, regex] of Object.entries(categoryKeywords)) {
    if (regex.test(description)) {
      return category;
    }
  }
  return "Others";
}

/**
 * Categorize an array of transactions and compute category totals
 * @param {Array} transactions - Array of {date, desc, amount, type}
 * @returns {Object} { categorizedTransactions, categories, incomeEstimate, totalSpending }
 */
function categorizeAll(transactions) {
  const categoryTotals = {};
  let totalSpending = 0;
  let incomeEstimate = 0;

  const categorized = transactions.map(tx => {
    const category = categorizeTransaction(tx.desc || tx.description || '');
    const amount = Math.abs(parseFloat(tx.amount) || 0);

    if (tx.type === 'credit' || parseFloat(tx.amount) > 0) {
      if (amount > incomeEstimate) {
        incomeEstimate = amount;
      }
    } else {
      totalSpending += amount;
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
      }
      categoryTotals[category] += amount;
    }

    return { ...tx, category };
  });

  // Build categories array with percentages
  const categories = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Sum all credits for total income
  const totalIncome = transactions
    .filter(tx => tx.type === 'credit' || parseFloat(tx.amount) > 0)
    .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount) || 0), 0);

  return {
    categorizedTransactions: categorized,
    categories,
    incomeEstimate: totalIncome || incomeEstimate,
    totalSpending,
  };
}

module.exports = { categorizeTransaction, categorizeAll };
