export const mockTransactions = [
  // INCOME
  { date: "2025-05-01", desc: "Salary Credit - Part Time", amount: 35000, type: "credit" },
  { date: "2025-05-15", desc: "Pocket Money from Dad", amount: 10000, type: "credit" },
  // AIRTIME & DATA
  { date: "2025-05-02", desc: "MTN Data Bundle 1GB", amount: -500, type: "debit" },
  { date: "2025-05-04", desc: "Airtel Airtime Recharge", amount: -300, type: "debit" },
  { date: "2025-05-06", desc: "Glo Data Bundle 2GB", amount: -1000, type: "debit" },
  { date: "2025-05-09", desc: "MTN Airtime", amount: -200, type: "debit" },
  { date: "2025-05-11", desc: "9mobile Data", amount: -500, type: "debit" },
  { date: "2025-05-14", desc: "Airtel Data Bundle", amount: -1500, type: "debit" },
  { date: "2025-05-18", desc: "MTN Data Bundle", amount: -500, type: "debit" },
  { date: "2025-05-22", desc: "Glo Airtime", amount: -300, type: "debit" },
  { date: "2025-05-26", desc: "MTN Data 3GB", amount: -1500, type: "debit" },
  // FOOD
  { date: "2025-05-02", desc: "Chicken Republic Lekki", amount: -2800, type: "debit" },
  { date: "2025-05-04", desc: "Mama Put - Iya Basira", amount: -600, type: "debit" },
  { date: "2025-05-06", desc: "Shoprite Groceries", amount: -3500, type: "debit" },
  { date: "2025-05-08", desc: "KFC Maryland", amount: -3200, type: "debit" },
  { date: "2025-05-10", desc: "Shawarma Joint VI", amount: -1500, type: "debit" },
  { date: "2025-05-13", desc: "Cold Stone Creamery", amount: -2000, type: "debit" },
  { date: "2025-05-17", desc: "Dominos Pizza", amount: -4500, type: "debit" },
  { date: "2025-05-21", desc: "Local Buka Yaba", amount: -500, type: "debit" },
  { date: "2025-05-25", desc: "Suya Spot Surulere", amount: -1500, type: "debit" },
  // TRANSPORT
  { date: "2025-05-03", desc: "Bolt Ride Ikeja", amount: -1200, type: "debit" },
  { date: "2025-05-05", desc: "Uber Lagos Island", amount: -2500, type: "debit" },
  { date: "2025-05-07", desc: "Bolt Ride VI", amount: -900, type: "debit" },
  { date: "2025-05-12", desc: "Uber Surulere", amount: -1800, type: "debit" },
  { date: "2025-05-16", desc: "Bolt Ride Lekki", amount: -1500, type: "debit" },
  { date: "2025-05-20", desc: "Uber Airport", amount: -3500, type: "debit" },
  { date: "2025-05-24", desc: "Bolt Ride Yaba", amount: -800, type: "debit" },
  // TRANSFERS
  { date: "2025-05-03", desc: "Transfer to Emeka Obi", amount: -2000, type: "debit" },
  { date: "2025-05-10", desc: "Send Money to Blessing", amount: -1500, type: "debit" },
  { date: "2025-05-19", desc: "Transfer to Tunde", amount: -3000, type: "debit" },
  { date: "2025-05-28", desc: "Send Money to Mum", amount: -2000, type: "debit" },
  // SHOPPING
  { date: "2025-05-05", desc: "Jumia Fashion Order", amount: -4500, type: "debit" },
  { date: "2025-05-13", desc: "Zara Online Purchase", amount: -8500, type: "debit" },
  { date: "2025-05-23", desc: "Konga Electronics", amount: -3000, type: "debit" },
  // ENTERTAINMENT
  { date: "2025-05-01", desc: "Netflix Subscription", amount: -4600, type: "debit" },
  { date: "2025-05-01", desc: "Spotify Premium", amount: -900, type: "debit" },
  { date: "2025-05-08", desc: "Bet9ja Deposit", amount: -2000, type: "debit" },
  { date: "2025-05-15", desc: "SportyBet Deposit", amount: -1500, type: "debit" },
  { date: "2025-05-22", desc: "Cinema Silverbird", amount: -3500, type: "debit" },
  // EDUCATION
  { date: "2025-05-10", desc: "Coursera Subscription", amount: -3000, type: "debit" },
  { date: "2025-05-20", desc: "Textbook Purchase", amount: -2500, type: "debit" },
  // MISCELLANEOUS
  { date: "2025-05-09", desc: "Salon/Barbing", amount: -1500, type: "debit" },
  { date: "2025-05-18", desc: "Laundry Service", amount: -800, type: "debit" },
  { date: "2025-05-26", desc: "Gym Membership", amount: -3000, type: "debit" },
  { date: "2025-05-29", desc: "Airtime Gift to Sister", amount: -500, type: "debit" },
];

export const mockNotifications = [
  { id: 1, text: "You've spent ₦6,300 on data this month", icon: "🔔", time: "2h ago" },
  { id: 2, text: "You're ₦8,000 away from your savings goal", icon: "🔔", time: "5h ago" },
  { id: 3, text: "Oya! Drop ₦500 into your vault today 💚", icon: "🔔", time: "1d ago" },
];
