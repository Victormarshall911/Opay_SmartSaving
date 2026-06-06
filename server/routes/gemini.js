const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const router = express.Router();

const SYSTEM_PROMPT = `You are Smart Savings Coach, a warm and friendly AI financial advisor. You help Nigerian students and low-income earners build smart saving habits.

Your personality:
- Like a financially savvy older sibling
- Never shame users about spending — only motivate
- Specific with numbers, never vague
- Natural Nigerian English + authentic Pidgin (not fake pidgin)

Analyze the provided transaction data and return ONLY valid JSON 
(no markdown, no backticks, no explanation) in this exact structure:

{
  "user_summary": {
    "income_estimate": 0,
    "total_spending": 0,
    "savings_gap": 0
  },
  "categories": [
    {
      "name": "",
      "amount": 0,
      "percentage": 0,
      "color": ""
    }
  ],
  "insights": [
    {
      "category": "",
      "current_spend": 0,
      "tip_english": "",
      "tip_pidgin": "",
      "potential_saving": 0,
      "icon": ""
    }
  ],
  "savings_plan": {
    "weekly": 0,
    "monthly": 0,
    "goal": "",
    "goal_amount": 0,
    "timeline_months": 0
  },
  "nudge_english": "",
  "nudge_pidgin": "",
  "fun_fact": "",
  "auto_save_suggestion": 0
}

Rules:
- Use ₦ mentally but return raw numbers (frontend adds ₦)
- categories[].color must be a valid hex color (use greens, golds, blues)
- insights[].icon must be a single emoji
- nudge_pidgin must be authentic Nigerian Pidgin, max 15 words, encouraging and fun
- auto_save_suggestion = smallest weekly amount user can start with
- If data is unclear, make reasonable estimates
- Always find at least 3 spending categories to improve`;

// Fallback mock analysis for when Gemini fails
const FALLBACK_ANALYSIS = {
  user_summary: {
    income_estimate: 45000,
    total_spending: 82100,
    savings_gap: 37100,
  },
  categories: [
    { name: "Food & Snacks", amount: 20100, percentage: 24, color: "#FF6B35" },
    { name: "Shopping", amount: 16000, percentage: 19, color: "#E91E63" },
    { name: "Transport", amount: 12200, percentage: 15, color: "#2196F3" },
    { name: "Entertainment", amount: 12500, percentage: 15, color: "#9C27B0" },
    { name: "Transfers", amount: 8500, percentage: 10, color: "#00BCD4" },
    { name: "Airtime & Data", amount: 6300, percentage: 8, color: "#4CAF50" },
    { name: "Education", amount: 5500, percentage: 7, color: "#FF9800" },
    { name: "Personal Care", amount: 5300, percentage: 6, color: "#795548" },
  ],
  insights: [
    {
      category: "Food & Snacks",
      current_spend: 20100,
      tip_english: "You're spending ₦20,100 on food — try cooking more at home. A simple meal prep on Sundays could save you ₦8,000/month easily.",
      tip_pidgin: "Bros, ₦20K dey go for food o! If you cook house food 3 times a week, you go save like ₦8K. Na small thing.",
      potential_saving: 8000,
      icon: "🍔",
    },
    {
      category: "Entertainment",
      current_spend: 12500,
      tip_english: "₦3,500 went to betting this month. If you auto-save that amount instead, you'll have ₦42,000 extra in a year!",
      tip_pidgin: "Betting dey chop ₦3,500 every month. If you lock am for your Vault, one year you go see ₦42K! Think am well.",
      potential_saving: 3500,
      icon: "🎮",
    },
    {
      category: "Transport",
      current_spend: 12200,
      tip_english: "Transport is eating ₦12,200. Consider carpooling or using BRT for regular routes — could save ₦4,000 monthly.",
      tip_pidgin: "Transport dey take ₦12K! Try BRT or share ride with your paddy. You fit save ₦4K easy.",
      potential_saving: 4000,
      icon: "🚗",
    },
  ],
  savings_plan: {
    weekly: 2000,
    monthly: 8000,
    goal: "Emergency Fund",
    goal_amount: 50000,
    timeline_months: 7,
  },
  nudge_english: "Start small, stay consistent. Even ₦500 a week builds real wealth over time! 💚",
  nudge_pidgin: "Oya start small! ₦500 every week, before you know, money don stack! 💚",
  fun_fact: "If you save ₦2,000 weekly in your Smart Vault at 15% annual interest, you'll have ₦112,000 in just one year!",
  auto_save_suggestion: 500,
};

router.post('/analyze', async (req, res) => {
  try {
    const { mode, data, rawText } = req.body;

    let userMessage = '';

    if (mode === 'demo') {
      userMessage = `Here are the user's transactions from their bank account (last 30 days):\n\n${JSON.stringify(data, null, 2)}\n\nAnalyze these transactions and provide a comprehensive savings plan.`;
    } else if (mode === 'upload' && rawText) {
      // PDF mode — raw text
      userMessage = `Here is the raw text extracted from a user's bank statement PDF:\n\n${rawText}\n\nParse the transactions from this text, categorize them, and provide a comprehensive savings plan.`;
    } else if (mode === 'upload' && data) {
      // CSV mode — structured data
      userMessage = `Here are the user's parsed transactions from their bank statement:\n\n${JSON.stringify(data, null, 2)}\n\nAnalyze these transactions and provide a comprehensive savings plan.`;
    } else {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    // Check API key
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_key_here') {
      console.log('No Gemini API key configured, using fallback analysis');
      return res.json(FALLBACK_ANALYSIS);
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ],
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });

    const responseText = result.response.text();

    // Strip markdown code block if present
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    const analysis = JSON.parse(cleanJson);
    return res.json(analysis);
  } catch (err) {
    console.error('Gemini API error:', err.message);
    // Return fallback analysis silently
    return res.json(FALLBACK_ANALYSIS);
  }
});

module.exports = router;
