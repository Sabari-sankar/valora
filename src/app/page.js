'use client';

import React, { useState, useEffect } from 'react';
import ThemeToggle from './components/ThemeToggle';
import AnimatedCounter from './components/AnimatedCounter';

import { AreaChart, PieChart, DonutChart, MonthlyBarChart, MonthlyLineChart } from './components/CustomChart';
import TrendChart from './components/TrendChart';
import {
  LogoIcon,
  WalletIcon,
  CoinsIcon,
  ChartIcon,
  TrendUpIcon,
  TrendDownIcon,
  CategoryIcon,
  SettingsIcon,
  PlusIcon,
  TrashIcon,
  RefreshIcon,
  ExportIcon,
  ImportIcon,
  CalendarIcon,
  CheckIcon,
  UserActiveIcon,
  BackspaceIcon,
  EditIcon,
  SVGStyleBlock
} from './components/Icons';
import { getRandomTips } from './data/tips';

// Dedicated SVG Icons for Bottom Dock Actions
const MinusIcon = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const PlusIconCustom = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Presets for Custom Category Color Options
const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4',
  '#3b82f6', '#6366f1', '#8b5cf6', '#ec4899', '#6b7280'
];

// Clean Standard Valid Categories List
const DEFAULT_CATEGORIES = [
  { id: 'c-inc-1', name: 'Salary', type: 'income', color: '#10b981' },
  { id: 'c-inc-2', name: 'Business Profits', type: 'income', color: '#3b82f6' },
  { id: 'c-inc-3', name: 'Rental Income', type: 'income', color: '#f59e0b' },
  { id: 'c-inc-4', name: 'Agriculture Yield', type: 'income', color: '#10b981' },
  { id: 'c-inc-5', name: 'Investment Chit Maturity', type: 'income', color: '#ec4899' },
  { id: 'c-inc-6', name: 'Freelance & Tutoring', type: 'income', color: '#06b6d4' },
  { id: 'c-inc-7', name: 'Other Income', type: 'income', color: '#6b7280' },

  { id: 'c-exp-1', name: 'Food & Dining', type: 'expense', color: '#ef4444' },
  { id: 'c-exp-2', name: 'Petrol & Fuel', type: 'expense', color: '#f97316' },
  { id: 'c-exp-3', name: 'Auto & Metro Travel', type: 'expense', color: '#3b82f6' },
  { id: 'c-exp-4', name: 'Groceries & Provisions', type: 'expense', color: '#10b981' },
  { id: 'c-exp-5', name: 'Electricity & Water Bills', type: 'expense', color: '#06b6d4' },
  { id: 'c-exp-6', name: 'Gold & Asset Chit Savings', type: 'expense', color: '#fbbf24' },
  { id: 'c-exp-7', name: 'Charity & Festivals', type: 'expense', color: '#8b5cf6' },
  { id: 'c-exp-8', name: 'Clothes & Shopping', type: 'expense', color: '#ec4899' },
  { id: 'c-exp-9', name: 'Healthcare & Medical', type: 'expense', color: '#10b981' },
  { id: 'c-exp-10', name: 'PG & House Rent', type: 'expense', color: '#6366f1' },
  { id: 'c-exp-11', name: 'School & Class Fees', type: 'expense', color: '#a855f7' },
  { id: 'c-exp-12', name: 'Other Expenses', type: 'expense', color: '#6b7280' }
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // Database States
  const [existingSaving, setExistingSaving] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  // User Profile States
  const [userInfo, setUserInfo] = useState(null);
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // User Onboarding Input States
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingCity, setOnboardingCity] = useState('Bangalore');
  const [onboardingProfession, setOnboardingProfession] = useState('Software Engineer');
  const [onboardingSex, setOnboardingSex] = useState('Male');
  const [onboardingAge, setOnboardingAge] = useState('');
  const [onboardingPin, setOnboardingPin] = useState('');
  const [onboardingConfirmPin, setOnboardingConfirmPin] = useState('');

  // Profile Update States
  const [profileName, setProfileName] = useState('');
  const [profileCity, setProfileCity] = useState('Bangalore');
  const [profileProfession, setProfileProfession] = useState('Software Engineer');
  const [profileSex, setProfileSex] = useState('Male');
  const [profileAge, setProfileAge] = useState('');

  // PIN Update States
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState('');

  // Navigation / UI states
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'transactions', 'categories', 'tips', 'settings'
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [ledgerViewMode, setLedgerViewMode] = useState('timeline'); // 'timeline', 'table'
  const [dashboardChartType, setDashboardChartType] = useState('combined'); // 'combined', 'area', 'line', 'bar'
  const [chartTimeRange, setChartTimeRange] = useState('all'); // '1w', '1m', '3m', '6m', '1y', '2y', '3y', 'all'
  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState({});
  const [reportViewType, setReportViewType] = useState('timeline'); // 'timeline', 'bar', 'graph'

  // Custom Modal Overlay Confirmation State
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', onConfirm: null });

  // Reset PIN State
  const [isResetPinOpen, setIsResetPinOpen] = useState(false);
  const [resetNameInput, setResetNameInput] = useState('');
  const [resetNewPin, setResetNewPin] = useState('');
  const [resetConfirmPin, setResetConfirmPin] = useState('');
  const [resetError, setResetError] = useState('');

  // Form field validation error states
  const [onboardErrors, setOnboardErrors] = useState({});
  const [resetPinErrors, setResetPinErrors] = useState({});
  const [profileErrors, setProfileErrors] = useState({});
  const [pinUpdateErrors, setPinUpdateErrors] = useState({});
  const [txErrors, setTxErrors] = useState({});
  const [catErrors, setCatErrors] = useState({});
  const [quickCatErrors, setQuickCatErrors] = useState({});

  // Tips States
  const [currentTips, setCurrentTips] = useState({ expense: [], income: [] });
  const [tipFilter, setTipFilter] = useState('expense'); // 'expense' | 'income'

  // Add Transaction Form
  const [txDesc, setTxDesc] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState('expense');
  const [txCategory, setTxCategory] = useState('');
  const [txDate, setTxDate] = useState('');

  // Add Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');
  const [newCatColor, setNewCatColor] = useState(PRESET_COLORS[3]); // Default green

  // Edit Category Form
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatColor, setEditCatColor] = useState('');

  // Edit Transaction Form
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editTxDesc, setEditTxDesc] = useState('');
  const [editTxAmount, setEditTxAmount] = useState('');
  const [editTxType, setEditTxType] = useState('expense');
  const [editTxCategory, setEditTxCategory] = useState('');
  const [editTxDate, setEditTxDate] = useState('');
  const [editTxErrors, setEditTxErrors] = useState({});

  // Search & Filter state (for transaction list)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Load database on mount
  useEffect(() => {
    const initialize = () => {
      try {
        const savedUserInfo = localStorage.getItem('valora_user_info');
        const savedPin = localStorage.getItem('valora_user_pin');
        const localSaving = localStorage.getItem('valora_existing_saving');
        const localTxs = localStorage.getItem('valora_transactions');
        const localCats = localStorage.getItem('valora_categories');

        if (savedUserInfo && savedUserInfo !== 'undefined') {
          try {
            const parsed = JSON.parse(savedUserInfo);
            setUserInfo(parsed);
            setProfileName(parsed.name || '');
            setProfileCity(parsed.city || 'Bangalore');
            setProfileProfession(parsed.profession || 'Software Engineer');
            setProfileSex(parsed.sex || 'Male');
            setProfileAge(parsed.age !== undefined ? parsed.age.toString() : '');
          } catch (e) {
            console.warn('Corrupt user info in storage:', e);
          }
        }

        if (!savedPin) {
          setIsLocked(false);
        } else {
          setIsLocked(true);
        }

        if (localSaving !== null && localSaving !== 'undefined') {
          setExistingSaving(Number(localSaving) || 0);
        }

        if (localTxs !== null && localTxs !== 'undefined') {
          try {
            setTransactions(JSON.parse(localTxs));
          } catch (e) {
            console.warn('Corrupt transactions in storage:', e);
          }
        }

        if (localCats !== null && localCats !== 'undefined') {
          try {
            setCategories(JSON.parse(localCats));
          } catch (e) {
            console.warn('Corrupt categories in storage:', e);
          }
        }

        const savedViewMode = localStorage.getItem('valora_ledger_view');
        if (savedViewMode === 'timeline' || savedViewMode === 'table') {
          setLedgerViewMode(savedViewMode);
        }

        // Initial Tips Batch
        const initialTips = getRandomTips();
        setCurrentTips(initialTips);

        // Default today's date for tx input
        const today = new Date().toISOString().split('T')[0];
        setTxDate(today);
      } catch (err) {
        console.error('Error initializing local database state:', err);
      } finally {
        setMounted(true);
      }
    };

    const timer = setTimeout(initialize, 0);
    return () => clearTimeout(timer);
  }, []);

  // Sync state helpers
  const saveExistingSaving = (val) => {
    setExistingSaving(val);
    localStorage.setItem('valora_existing_saving', val.toString());
  };

  const saveTransactions = (list) => {
    setTransactions(list);
    localStorage.setItem('valora_transactions', JSON.stringify(list));
  };

  const saveCategories = (list) => {
    setCategories(list);
    localStorage.setItem('valora_categories', JSON.stringify(list));
  };

  const handleSetLedgerViewMode = (mode) => {
    setLedgerViewMode(mode);
    localStorage.setItem('valora_ledger_view', mode);
  };

  // Toast Helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const currentSaving = totalIncome - totalExpense;
  const totalActivity = totalIncome + totalExpense;
  const incomePercentage = totalActivity > 0 ? Math.round((totalIncome / totalActivity) * 100) : 0;
  const expensePercentage = totalActivity > 0 ? 100 - incomePercentage : 0;
  const balancePercentage = totalIncome > 0 ? Math.round((currentSaving / totalIncome) * 100) : (totalExpense > 0 ? -100 : 0);

  // Keypad controls for lock screen
  const handleKeypadPress = (digit) => {
    if (pinInput.length < 4) {
      const updatedPin = pinInput + digit;
      setPinInput(updatedPin);

      // Auto-submit if it reaches 4 digits
      if (updatedPin.length === 4) {
        setTimeout(() => {
          const savedPin = localStorage.getItem('valora_user_pin');
          if (updatedPin === savedPin) {
            setIsLocked(false);
            setPinInput('');
            showToast('✓ Access granted!');
          } else {
            showToast('❌ Incorrect PIN');
            setPinInput('');
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 400);
          }
        }, 150);
      }
    }
  };

  const handleKeypadDelete = () => {
    setPinInput(pinInput.slice(0, -1));
  };

  // Onboarding Submit
  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!onboardingName.trim()) {
      errs.name = 'Enter your name';
    }
    const ageNum = Number(onboardingAge);
    if (!onboardingAge || ageNum < 1 || ageNum > 120) {
      errs.age = 'Enter a valid age (1-120)';
    }
    if (onboardingPin.length !== 4) {
      errs.pin = 'Access PIN must be exactly 4 digits';
    }
    if (onboardingConfirmPin.length !== 4) {
      errs.confirmPin = 'Confirm PIN must be exactly 4 digits';
    } else if (onboardingPin !== onboardingConfirmPin) {
      errs.confirmPin = 'PINs do not match! Please re-verify';
    }

    if (Object.keys(errs).length > 0) {
      setOnboardErrors(errs);
      return;
    }
    setOnboardErrors({});

    const info = {
      name: onboardingName.trim(),
      city: onboardingCity,
      profession: onboardingProfession,
      sex: onboardingSex,
      age: Number(onboardingAge),
      baseSavings: 0 // De-prioritized savings config
    };

    try {
      localStorage.setItem('valora_user_info', JSON.stringify(info));
      localStorage.setItem('valora_user_pin', onboardingPin);
    } catch (err) {
      console.warn('Storage write skipped or restricted:', err);
    }

    setUserInfo(info);
    setProfileName(info.name);
    setProfileCity(info.city);
    setProfileProfession(info.profession);
    setProfileSex(info.sex);
    setProfileAge(info.age.toString());
    setIsLocked(false);

    // Fresh install: start with clean empty transactions list
    try {
      saveTransactions([]);
      saveExistingSaving(0);
    } catch (e) {
      console.warn('Error saving initial ledger defaults:', e);
    }

    showToast(`✓ Welcome, ${info.name}!`);
  };

  // Profile Update Submit Handler
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const errs = {};
    if (!profileName.trim()) {
      errs.name = 'Enter your name';
    }
    const ageNum = Number(profileAge);
    if (!profileAge || ageNum < 1 || ageNum > 120) {
      errs.age = 'Enter a valid age (1-120)';
    }

    if (Object.keys(errs).length > 0) {
      setProfileErrors(errs);
      return;
    }
    setProfileErrors({});

    const updatedInfo = {
      name: profileName.trim(),
      city: profileCity,
      profession: profileProfession,
      sex: profileSex,
      age: Number(profileAge),
      baseSavings: userInfo?.baseSavings || 0
    };

    try {
      localStorage.setItem('valora_user_info', JSON.stringify(updatedInfo));
      setUserInfo(updatedInfo);
      showToast('✓ Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      showToast('❌ Failed to update profile');
    }
  };

  // PIN Update Submit Handler
  const handlePinUpdate = (e) => {
    e.preventDefault();
    const savedPin = localStorage.getItem('valora_user_pin');
    const errs = {};

    if (currentPinInput !== savedPin) {
      errs.currentPin = 'Current PIN is incorrect';
    }
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      errs.newPin = 'New PIN must be exactly 4 digits';
    }
    if (newPinInput && confirmNewPinInput && newPinInput !== confirmNewPinInput) {
      errs.confirmNewPin = 'New PINs do not match';
    }

    if (Object.keys(errs).length > 0) {
      setPinUpdateErrors(errs);
      return;
    }
    setPinUpdateErrors({});

    try {
      localStorage.setItem('valora_user_pin', newPinInput);
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmNewPinInput('');
      showToast('✓ Security PIN updated!');
    } catch (err) {
      console.error('Failed to update PIN:', err);
      showToast('❌ Failed to update PIN');
    }
  };

  // Financial Motivational Feedback Generator
  const getMotivationalFeedback = () => {
    if (!transactions || transactions.length === 0) {
      return {
        rating: 'Getting Started 🚀',
        message: `Welcome, ${userInfo?.name || 'User'}! Log your first transaction to unlock smart motivational insights. Every journey begins with a single step!`,
        color: 'var(--primary)'
      };
    }

    const rate = currentSaving <= 0 ? 0 : Math.round((currentSaving / totalIncome) * 100);

    if (totalIncome === 0) {
      return {
        rating: 'Tracking Mode 📝',
        message: `You have logged expenses totaling ₹${totalExpense.toLocaleString('en-IN')}, but no income logged yet. Record some earnings to calculate your savings rate!`,
        color: 'var(--amber)'
      };
    }

    if (currentSaving <= 0) {
      return {
        rating: 'Action Required ⚠️',
        message: `Your monthly expenses exceed or equal your income. Try identifying non-essential items in your groceries or dining and trim them down. Small adjustments compound over time!`,
        color: 'var(--expense-color)'
      };
    }

    if (rate >= 30) {
      return {
        rating: 'Financial Master ⭐',
        message: `Outstanding! You saved ${rate}% of your income. Maintaining a savings rate above 30% puts you in the top tier of financial discipline. Keep building your wealth foundation!`,
        color: 'var(--income-color)'
      };
    }

    return {
      rating: 'Healthy Progress 🌱',
      message: `Great job! You saved ${rate}% of your income this month. You're on track. Try optimizing utility usage or minor shopping habits to push closer to the golden 30% savings milestone!`,
      color: 'var(--primary)'
    };
  };

  // Simple greeting
  const getGreeting = () => 'Hi';

  // Format Date for Ledger Headings (Today, Yesterday, Weekday, etc.)
  const formatDateHeader = (dateStr) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';

    try {
      const parsedDate = new Date(dateStr);
      return parsedDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: parsedDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    } catch (e) {
      return dateStr;
    }
  };
  const getGroupedMonthsData = () => {
    const monthlyGroups = {};
    transactions.forEach(t => {
      if (!t.date) return;
      const [year, month] = t.date.split('-');
      const monthKey = `${year}-${month}`; // e.g. "2026-08"
      if (!monthlyGroups[monthKey]) {
        monthlyGroups[monthKey] = {
          monthKey,
          income: 0,
          expense: 0,
          txs: [],
          categoriesBreakdown: {}
        };
      }
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') {
        monthlyGroups[monthKey].income += amt;
      } else {
        monthlyGroups[monthKey].expense += amt;
      }
      monthlyGroups[monthKey].txs.push(t);

      // Category breakdown
      const cat = t.category;
      if (!monthlyGroups[monthKey].categoriesBreakdown[cat]) {
        monthlyGroups[monthKey].categoriesBreakdown[cat] = {
          name: cat,
          color: (categories.find(c => c.name.toLowerCase() === cat.toLowerCase()) || {}).color || '#6b7280',
          income: 0,
          expense: 0
        };
      }
      if (t.type === 'income') {
        monthlyGroups[monthKey].categoriesBreakdown[cat].income += amt;
      } else {
        monthlyGroups[monthKey].categoriesBreakdown[cat].expense += amt;
      }
    });

    // Convert to sorted array (months descending)
    return Object.values(monthlyGroups).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  };
  // Trigger quick modal open for income / expense
  const openQuickAdd = (type) => {
    setTxType(type);
    setTxDesc('');
    setTxAmount('');
    const today = new Date().toISOString().split('T')[0];
    setTxDate(today);
    const list = categories.filter(c => c.type === type);
    if (list.length > 0) {
      setTxCategory(list[0].name);
    } else {
      setTxCategory('');
    }
    setIsAddTxOpen(true);
  };

  // Add Transaction
  const handleAddTransaction = (e) => {
    e.preventDefault();
    const errs = {};
    if (!txDesc.trim()) {
      errs.desc = 'Enter a transaction description';
    }
    if (!txAmount || Number(txAmount) <= 0) {
      errs.amount = 'Enter a valid amount greater than zero';
    }
    if (!txCategory) {
      errs.category = 'Select a category';
    }
    if (!txDate) {
      errs.date = 'Select a transaction date';
    }

    if (Object.keys(errs).length > 0) {
      setTxErrors(errs);
      return;
    }
    setTxErrors({});

    const newTx = {
      id: `tx-${Date.now()}`,
      description: txDesc.trim(),
      amount: Number(txAmount),
      type: txType,
      category: txCategory,
      date: txDate
    };

    const updated = [newTx, ...transactions];
    saveTransactions(updated);

    // Reset fields
    setTxDesc('');
    setTxAmount('');
    const today = new Date().toISOString().split('T')[0];
    setTxDate(today);
    setIsAddTxOpen(false);
    showToast('✓ Entry logged!');
  };

  // Edit Transaction Submit
  const handleEditTransactionSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!editTxDesc.trim()) {
      errs.desc = 'Enter a transaction description';
    }
    if (!editTxAmount || Number(editTxAmount) <= 0) {
      errs.amount = 'Enter a valid amount greater than zero';
    }
    if (!editTxCategory) {
      errs.category = 'Select a category';
    }
    if (!editTxDate) {
      errs.date = 'Select a transaction date';
    }

    if (Object.keys(errs).length > 0) {
      setEditTxErrors(errs);
      return;
    }
    setEditTxErrors({});

    const updatedTransactions = transactions.map(t => {
      if (t.id === editingTransaction.id) {
        return {
          ...t,
          description: editTxDesc.trim(),
          amount: Number(editTxAmount),
          type: editTxType,
          category: editTxCategory,
          date: editTxDate
        };
      }
      return t;
    });

    saveTransactions(updatedTransactions);
    setEditingTransaction(null);
    showToast('✓ Entry updated!');
  };

  // Edit transaction amount sanitization
  const handleEditAmountChange = (val) => {
    let sanitized = val.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }
    setEditTxAmount(sanitized);
  };

  // Delete Transaction (Custom Modal)
  const handleDeleteTransaction = (id) => {
    setConfirmModal({
      open: true,
      title: 'Delete Ledger Entry',
      message: 'Are you sure you want to delete this transaction record? This cannot be undone.',
      onConfirm: () => {
        const updated = transactions.filter(t => t.id !== id);
        saveTransactions(updated);
        showToast('✓ Entry deleted');
      }
    });
  };

  // Add Custom Category
  const handleAddCategory = (e) => {
    e.preventDefault();
    const errs = {};
    if (!newCatName.trim()) {
      errs.name = 'Enter category name';
    } else {
      const exists = categories.some(
        c => c.name.toLowerCase() === newCatName.trim().toLowerCase() && c.type === newCatType
      );
      if (exists) {
        errs.name = 'Category already exists';
      }
    }

    if (Object.keys(errs).length > 0) {
      setCatErrors(errs);
      return;
    }
    setCatErrors({});

    const newCat = {
      id: `c-${Date.now()}`,
      name: newCatName.trim(),
      type: newCatType,
      color: newCatColor
    };

    const updated = [...categories, newCat];
    saveCategories(updated);
    setNewCatName('');
    setIsAddCategoryOpen(false);
    showToast('✓ Category created!');
  };

  // Quick Add Category from Record Entry Drawer
  const handleQuickAddCategory = (e) => {
    e.preventDefault();
    const errs = {};
    if (!newCatName.trim()) {
      errs.name = 'Enter category name';
    } else {
      const exists = categories.some(
        c => c.name.toLowerCase() === newCatName.trim().toLowerCase() && c.type === newCatType
      );
      if (exists) {
        errs.name = 'Category already exists';
      }
    }

    if (Object.keys(errs).length > 0) {
      setQuickCatErrors(errs);
      return;
    }
    setQuickCatErrors({});

    const addedName = newCatName.trim();
    const newCat = {
      id: `c-${Date.now()}`,
      name: addedName,
      type: newCatType,
      color: newCatColor
    };

    const updated = [...categories, newCat];
    saveCategories(updated);
    setNewCatName('');

    // Select new category in current transaction form
    if (txType !== newCatType) {
      setTxType(newCatType);
    }
    setTxCategory(addedName);
    setIsCategoryDrawerOpen(false);
    showToast(`✓ Category "${addedName}" created & selected!`);
  };

  // Edit Custom Category
  const handleEditCategorySubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!editCatName.trim()) {
      errs.name = 'Enter category name';
    } else {
      const exists = categories.some(
        c => c.id !== editingCategory.id && c.name.toLowerCase() === editCatName.trim().toLowerCase() && c.type === editingCategory.type
      );
      if (exists) {
        errs.name = 'Category name already exists';
      }
    }

    if (Object.keys(errs).length > 0) {
      setCatErrors(errs);
      return;
    }
    setCatErrors({});

    const oldName = editingCategory.name;
    const newName = editCatName.trim();
    const newColor = editCatColor;

    // Update categories list
    const updatedCategories = categories.map(c => {
      if (c.id === editingCategory.id) {
        return { ...c, name: newName, color: newColor };
      }
      return c;
    });
    saveCategories(updatedCategories);

    // Update transaction records referencing this category
    const updatedTransactions = transactions.map(t => {
      if (t.category === oldName && t.type === editingCategory.type) {
        return { ...t, category: newName };
      }
      return t;
    });
    saveTransactions(updatedTransactions);

    setEditingCategory(null);
    setEditCatName('');
    setEditCatColor('');
    showToast('✓ Category updated successfully!');
  };

  // Delete Custom Category (Custom Modal)
  const handleDeleteCategory = (id) => {
    const catToDelete = categories.find(c => c.id === id);
    if (!catToDelete) return;

    // Don't delete system default categories if they are crucial
    const isDefault = DEFAULT_CATEGORIES.some(d => d.id === catToDelete.id);
    if (isDefault) {
      showToast('⚠️ Cannot delete default tags');
      return;
    }

    // Check if category is used in any transactions
    const isUsed = transactions.some(t => t.category.toLowerCase() === catToDelete.name.toLowerCase());
    if (isUsed) {
      showToast('⚠️ Category in active use');
      return;
    }

    setConfirmModal({
      open: true,
      title: 'Remove Category',
      message: `Delete the custom category "${catToDelete.name}"?`,
      onConfirm: () => {
        const updated = categories.filter(c => c.id !== id);
        saveCategories(updated);
        showToast('✓ Category removed');
      }
    });
  };

  // Refresh batch of 5 quotes
  const handleRefreshTips = () => {
    const refreshed = getRandomTips();
    setCurrentTips(refreshed);
    showToast('✓ Advice refreshed!');
  };

  // Import JSON database backup (Custom Modal)
  const handleImportDatabase = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed.transactions || !parsed.categories) {
          throw new Error('Invalid file structure.');
        }

        setConfirmModal({
          open: true,
          title: 'Import Database',
          message: 'Importing this file will overwrite all your current offline records. Proceed?',
          onConfirm: () => {
            saveExistingSaving(Number(parsed.existingSaving) || 0);
            saveTransactions(parsed.transactions);
            saveCategories(parsed.categories);
            showToast('✓ Database restored!');
            setActiveTab('dashboard');
          }
        });
      } catch (err) {
        showToast('❌ Invalid JSON backup file');
      }
    };
    fileReader.readAsText(file);
  };

  // Export JSON database backup
  const handleExportDatabase = () => {
    const dataObj = {
      existingSaving,
      transactions,
      categories
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataObj, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `valora_finance_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('✓ Backup exported!');
  };

  // Reset PIN Handler (Security Verification)
  const handleResetPinSubmit = (e) => {
    e.preventDefault();
    setResetError('');

    const errs = {};
    const existingName = userInfo?.name || '';
    if (resetNameInput.trim().toLowerCase() !== existingName.trim().toLowerCase()) {
      errs.name = 'Verification failed: Name does not match registered profile.';
    }
    if (resetNewPin.length !== 4) {
      errs.pin = 'New PIN must be exactly 4 digits.';
    }
    if (resetNewPin && resetConfirmPin && resetNewPin !== resetConfirmPin) {
      errs.confirmPin = 'New PIN and Confirm PIN do not match.';
    }

    if (Object.keys(errs).length > 0) {
      setResetPinErrors(errs);
      return;
    }
    setResetPinErrors({});

    localStorage.setItem('valora_user_pin', resetNewPin);
    setIsLocked(false);
    setPinInput('');
    setIsResetPinOpen(false);
    setResetNameInput('');
    setResetNewPin('');
    setResetConfirmPin('');
    showToast('✓ Security PIN reset successfully!');
  };

  // Amount input handler to enforce decimal numbers only (blocks 'e', text, symbols)
  const handleAmountChange = (val) => {
    let sanitized = val.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) {
      sanitized = parts[0] + '.' + parts.slice(1).join('');
    }
    setTxAmount(sanitized);
  };

  // Reset database option (Custom Modal)
  const handleResetDatabase = () => {
    setConfirmModal({
      open: true,
      title: 'Factory Reset Valora',
      message: 'CAUTION: This will delete ALL transactions and custom categories, reverting the app to factory settings. Are you absolutely sure?',
      onConfirm: () => {
        saveExistingSaving(0);
        saveTransactions([]);
        saveCategories(DEFAULT_CATEGORIES);
        localStorage.removeItem('valora_user_info');
        localStorage.removeItem('valora_user_pin');
        setUserInfo(null);
        setIsLocked(false);
        setPinInput('');
        showToast('✓ Database cleared!');
        setActiveTab('dashboard');
      }
    });
  };

  // Filtered transactions for view list
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' ? true : t.type === filterType;
    const matchesCategory = filterCategory === 'all' ? true : t.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesType && matchesCategory;
  });

  const pageSize = 25;
  const totalPages = Math.ceil(filteredTransactions.length / pageSize) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterCategory]);

  const getChartDataForRange = (range) => {
    const now = new Date();
    let cutoffDate = null;
    
    if (range === '1w') {
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === '1m') {
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === '3m') {
      cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (range === '6m') {
      cutoffDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    } else if (range === '1y') {
      cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    } else if (range === '2y') {
      cutoffDate = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
    } else if (range === '3y') {
      cutoffDate = new Date(now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000);
    }
    
    if (!cutoffDate) {
      return {
        chartSaving: existingSaving,
        chartTxs: transactions
      };
    }
    
    let computedSaving = Number(existingSaving);
    const beforeCutoff = transactions.filter(t => t.date && new Date(t.date) < cutoffDate);
    beforeCutoff.forEach(t => {
      computedSaving += t.type === 'income' ? Number(t.amount) : -Number(t.amount);
    });
    
    const afterCutoff = transactions.filter(t => t.date && new Date(t.date) >= cutoffDate);
    
    return {
      chartSaving: computedSaving,
      chartTxs: afterCutoff
    };
  };

  // Ensure hydration completion to prevent SSR mismatches
  if (!mounted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--text)', padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <SVGStyleBlock />
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>

        <div style={{ textAlign: 'center', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="app-logo-badge" style={{ width: '120px', height: '120px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogoIcon size={86} className="rotate-forever" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.4rem', letterSpacing: '-0.03em', fontFamily: "'Space Grotesk',sans-serif", color: 'var(--text)' }}>VALORA</h2>
          <p style={{ color: 'var(--text-sub)', fontSize: '0.9rem', marginBottom: '24px', fontWeight: 500 }}>Offline Personal Ledger & Expense Tracker</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
            <LogoIcon size={22} className="rotate-forever" style={{ color: 'var(--primary)' }} />
            <span>Loading application...</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── USER ONBOARDING MODAL OVERLAY ───────────────────────────────────
  if (mounted && !userInfo) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)', padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>

        <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '28px', zIndex: 10, border: '1.5px solid var(--border-strong)' }}>
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div className="app-logo-badge" style={{ margin: '0 auto 12px auto', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogoIcon size={56} className="rotate-forever" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: "'Space Grotesk',sans-serif", margin: 0, color: 'var(--text)' }}>👋 Welcome to Valora</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-sub)', marginTop: '6px', lineHeight: 1.4 }}>Let's customize your profile and security to set up your secure offline finance ledger.</p>
          </div>

          {toast && (
            <div className="error-box" style={{ marginBottom: '14px', animation: 'shake 0.3s ease' }}>
              {toast}
            </div>
          )}

          <form onSubmit={handleOnboardingSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '72vh', overflowY: 'auto', paddingRight: '4px' }} className="no-scrollbar">

            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="onboard-name">Your Name / Nickname</label>
              <input
                type="text"
                id="onboard-name"
                value={onboardingName}
                onChange={(e) => setOnboardingName(e.target.value)}
                className="form-input"
                placeholder="e.g. Sabari, Karthik"
                required
              />
              {onboardErrors.name && <div className="field-error">⚠️ {onboardErrors.name}</div>}
            </div>

            {/* Profession, Sex, Age (Grid Row) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="onboard-profession">Profession</label>
                <select
                  id="onboard-profession"
                  value={onboardingProfession}
                  onChange={(e) => setOnboardingProfession(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="Software Engineer">IT / Software</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Student">Student</option>
                  <option value="Farmer / Agriculture">Farmer / Agri</option>
                  <option value="Homemaker">Homemaker</option>
                  <option value="Retired">Retired</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="onboard-sex">Sex</label>
                <select
                  id="onboard-sex"
                  value={onboardingSex}
                  onChange={(e) => setOnboardingSex(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="onboard-age">Age</label>
                <input
                  type="text"
                  id="onboard-age"
                  value={onboardingAge}
                  onChange={(e) => setOnboardingAge(e.target.value.replace(/\D/g, ''))}
                  className="form-input"
                  placeholder="e.g. 25"
                  required
                  max="120"
                  inputMode="numeric"
                />
                {onboardErrors.age && <div className="field-error">⚠️ {onboardErrors.age}</div>}
              </div>

              {/* City Selection */}
              <div className="form-group">
                <label className="form-label" htmlFor="onboard-city">Select City</label>
                <select
                  id="onboard-city"
                  value={onboardingCity}
                  onChange={(e) => setOnboardingCity(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Kochi">Kochi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="New York">New York</option>
                  <option value="London">London</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Other">Other City</option>
                </select>
              </div>
            </div>

            {/* PIN Setup (Grid Row) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="onboard-pin">Set Access PIN</label>
                <input
                  type="password"
                  id="onboard-pin"
                  value={onboardingPin}
                  onChange={(e) => setOnboardingPin(e.target.value.replace(/\D/g, ''))}
                  className="form-input"
                  placeholder="4 digits"
                  maxLength={4}
                  inputMode="numeric"
                  required
                />
                {onboardErrors.pin && <div className="field-error">⚠️ {onboardErrors.pin}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="onboard-confirm-pin">Confirm PIN</label>
                <input
                  type="password"
                  id="onboard-confirm-pin"
                  value={onboardingConfirmPin}
                  onChange={(e) => setOnboardingConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="form-input"
                  placeholder="Confirm"
                  maxLength={4}
                  inputMode="numeric"
                  required
                />
                {onboardErrors.confirmPin && <div className="field-error">⚠️ {onboardErrors.confirmPin}</div>}
              </div>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '14px 20px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                transition: 'transform 0.15s ease, opacity 0.15s ease'
              }}
            >
              Initialize Ledger & PIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── PIN LOCK SCREEN OVERLAY ─────────────────────────────────────────
  if (mounted && userInfo && isLocked) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg)', padding: '20px', position: 'relative', overflow: 'hidden' }}>
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>

        <div className={`card ${isShaking ? 'shake' : ''}`} style={{ width: '100%', maxWidth: '380px', padding: '32px', zIndex: 10, border: '1.5px solid var(--border-strong)', textAlign: 'center' }}>
          <div style={{ marginBottom: '20px' }}>
            <LogoIcon size={60} className="rotate-forever" style={{ color: 'var(--primary)', marginBottom: '12px' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, letterSpacing: '-0.025em', margin: 0 }}>Valora Secure</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Enter 4-digit PIN to access account</p>
          </div>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '28px' }}>
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  backgroundColor: pinInput.length > idx ? 'var(--primary)' : 'transparent',
                  border: '2px solid var(--primary)',
                  transition: 'background-color 0.15s ease'
                }}
              />
            ))}
          </div>

          {/* Keypad Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', maxWidth: '240px', margin: '0 auto' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num.toString())}
                className="keypad-btn"
              >
                {num}
              </button>
            ))}

            {/* Delete button */}
            <button
              type="button"
              onClick={handleKeypadDelete}
              className="keypad-btn"
              style={{ color: 'var(--color-expense)', border: 'none', background: 'transparent', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Delete last digit"
            >
              <BackspaceIcon size={22} />
            </button>

            {/* Zero button */}
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="keypad-btn"
            >
              0
            </button>

            {/* Lock sign */}
            <div style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: '20px' }}>
              🔒
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button
              onClick={() => {
                setResetError('');
                setResetNameInput('');
                setResetNewPin('');
                setResetConfirmPin('');
                setIsResetPinOpen(true);
              }}
              style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--text-faint)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Forgot PIN / Reset App
            </button>
          </div>
        </div>

        {confirmModal.open && (
          <div className="modal-overlay" onClick={() => setConfirmModal({ open: false })}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
              <div className="modal-handle" />
              <div className="modal-title" style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>
                {confirmModal.title}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '22px', lineHeight: '1.4' }}>
                {confirmModal.message}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setConfirmModal({ open: false })} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal({ open: false });
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1, background: 'var(--color-expense)', color: '#ffffff' }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {isResetPinOpen && (
          <div className="modal-overlay" onClick={() => { setIsResetPinOpen(false); setResetPinErrors({}); }}>
            <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
              <div className="modal-handle" />
              <div className="modal-title" style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>
                Reset Security PIN
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: '1.4' }}>
                Verify your identity by entering your registered name to configure a new PIN without clearing ledger logs.
              </p>



              <form onSubmit={handleResetPinSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="reset-name">Registered Name</label>
                  <input
                    type="text"
                    id="reset-name"
                    value={resetNameInput}
                    onChange={(e) => setResetNameInput(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Sabari"
                    required
                  />
                  {resetPinErrors.name && <div className="field-error">⚠️ {resetPinErrors.name}</div>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reset-new-pin">New 4-digit PIN</label>
                    <input
                      type="password"
                      id="reset-new-pin"
                      value={resetNewPin}
                      onChange={(e) => setResetNewPin(e.target.value.replace(/\D/g, ''))}
                      className="form-input"
                      placeholder="New PIN"
                      maxLength={4}
                      inputMode="numeric"
                      required
                    />
                    {resetPinErrors.pin && <div className="field-error">⚠️ {resetPinErrors.pin}</div>}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reset-confirm-pin">Confirm PIN</label>
                    <input
                      type="password"
                      id="reset-confirm-pin"
                      value={resetConfirmPin}
                      onChange={(e) => setResetConfirmPin(e.target.value.replace(/\D/g, ''))}
                      className="form-input"
                      placeholder="Confirm"
                      maxLength={4}
                      inputMode="numeric"
                      required
                    />
                    {resetPinErrors.confirmPin && <div className="field-error">⚠️ {resetPinErrors.confirmPin}</div>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => { setIsResetPinOpen(false); setResetPinErrors({}); }} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Reset PIN
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── STANDARD APPLICATION SHELL ──────────────────────────────────────
  return (
    <div className="app-container">
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <SVGStyleBlock />

      {/* FIXED TOP HEADER */}
      <header className="header">
        <div className="header-inner">
          <div className="header-title">
            <div className="app-logo-badge" title="Valora Mobile App">
              {/* <LogoIcon size={20} className="rotate-forever" style={{ color: '#ffffff' }} /> */}
              <LogoIcon size={52} className="nav-icon-svg rotate-forever"
                style={{ filter: activeTab === 'dashboard' ? 'drop-shadow(0 0 4px var(--primary))' : 'none', transition: 'all .2s' }}
              />
            </div>
            <span style={{ fontWeight: 700, letterSpacing: '-0.025em', fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.15rem' }}>Valora</span>
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => { setIsLocked(true); showToast('Locked.'); }}
              className="btn btn-secondary btn-sm btn-icon"
              title="Lock Application"
              style={{ borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              🔒
            </button>
            <ThemeToggle />
            {userInfo && (
              <button
                onClick={() => setActiveTab('settings')}
                title="View Profile"
                style={{
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'transform 0.2s'
                }}
                className="hover-scale"
              >
                <UserActiveIcon size={32} name={userInfo.name} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="page">
        <div className="page-inner">

          {/* ── TAB 1: DASHBOARD ──────────────────────────────── */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Greeting */}
              <div style={{ paddingBottom: 2, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <UserActiveIcon size={30} name={userInfo.name} />
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1.15, margin: 0 }}>
                      {getGreeting()}, {userInfo.name}!
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsAdviceModalOpen(true)}
                    className="btn btn-secondary btn-sm"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      borderRadius: 20,
                      padding: '6px 14px',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      border: '1.5px solid var(--border-strong)',
                      cursor: 'pointer'
                    }}
                  >
                    💡 Advice
                  </button>
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-sub)', marginTop: 2 }}>
                  {userInfo.profession} · {userInfo.sex}, {userInfo.age} · {userInfo.city}
                </p>
              </div>

              {/* ── Hero Stat Cards ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

                <div className="hero-card income">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span className="lbl">Income</span>
                    <span style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'var(--income-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1.5px solid var(--income-border)',
                      boxShadow: '0 0 10px var(--income-border)',
                      flexShrink: 0
                    }}>
                      <TrendUpIcon size={20} />
                    </span>
                  </div>
                  <span className="amount" style={{ fontSize: '1.65rem', color: 'var(--income-color)' }}>
                    ₹<AnimatedCounter value={totalIncome} />
                  </span>
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 500 }}>
                      <AnimatedCounter value={transactions.filter(t => t.type === 'income').length} /> entr{transactions.filter(t => t.type === 'income').length === 1 ? 'y' : 'ies'}
                    </span>
                  </div>
                </div>

                <div className="hero-card expense">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span className="lbl">Expenses</span>
                    <span style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'var(--expense-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1.5px solid var(--expense-border)',
                      boxShadow: '0 0 10px var(--expense-border)',
                      flexShrink: 0
                    }}>
                      <TrendDownIcon size={20} />
                    </span>
                  </div>
                  <span className="amount" style={{ fontSize: '1.65rem', color: 'var(--expense-color)' }}>
                    ₹<AnimatedCounter value={totalExpense} />
                  </span>
                  <div style={{ marginTop: 6 }}>
                    <span style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 500 }}>
                      <AnimatedCounter value={transactions.filter(t => t.type === 'expense').length} /> bill{transactions.filter(t => t.type === 'expense').length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Net Flow Card ── */}
              <div
                className="net-flow-card"
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-lg)',
                  padding: '24px 22px 20px',
                  boxShadow: 'var(--sh-card)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.3s',
                  animation: 'fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both'
                }}
                onClick={() => setActiveTab('report')}
              >
                {/* Background glow orbs */}
                <div style={{
                  position: 'absolute', top: '-40%', right: '-15%',
                  width: '180px', height: '180px', borderRadius: '50%',
                  background: currentSaving >= 0 ? '#00FF88' : '#FF3366',
                  opacity: 0.03, filter: 'blur(50px)', pointerEvents: 'none'
                }}></div>
                <div style={{
                  position: 'absolute', bottom: '-30%', left: '-10%',
                  width: '140px', height: '140px', borderRadius: '50%',
                  background: currentSaving >= 0 ? '#60F5D0' : '#FF7E9F',
                  opacity: 0.015, filter: 'blur(40px)', pointerEvents: 'none'
                }}></div>

                {/* Top row: Label + Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', justifyContent: 'space-between', marginBottom: 16, zIndex: 1, position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: currentSaving >= 0
                        ? 'linear-gradient(135deg, rgba(0,255,136,0.18), rgba(96,245,208,0.06))'
                        : 'linear-gradient(135deg, rgba(255,51,102,0.18), rgba(255,126,159,0.06))',
                      border: `1px solid ${currentSaving >= 0 ? 'rgba(0,255,136,0.25)' : 'rgba(255,51,102,0.25)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <WalletIcon size={18} style={{ color: currentSaving >= 0 ? '#00FF88' : '#FF3366' }} />
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                        letterSpacing: '0.08em', color: 'var(--text-muted)'
                      }}>Net Cash Flow</div>
                    </div>
                  </div>

                  <div style={{
                    padding: '3px 10px', borderRadius: 20,
                    background: currentSaving >= 0
                      ? 'linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,255,136,0.05))'
                      : 'linear-gradient(135deg, rgba(255,51,102,0.15), rgba(255,51,102,0.05))',
                    border: `1px solid ${currentSaving >= 0 ? 'rgba(0,255,136,0.3)' : 'rgba(255,51,102,0.3)'}`,
                    fontSize: '0.65rem', fontWeight: 700,
                    color: currentSaving >= 0 ? '#00FF88' : '#FF3366',
                    display: 'flex', alignItems: 'center', gap: 4
                  }}>
                    <span>{currentSaving >= 0 ? '▲' : '▼'}</span>
                    {currentSaving >= 0 ? 'Surplus' : 'Deficit'}
                  </div>
                </div>

                {/* Big Amount */}
                <div style={{ position: 'relative', zIndex: 1, marginBottom: 16 }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: currentSaving >= 0 ? '#00FF88' : '#FF3366',
                    display: 'block',
                    textShadow: currentSaving >= 0
                      ? '0 0 30px rgba(0,255,136,0.35)' : '0 0 30px rgba(255,51,102,0.35)'
                  }}>
                    {currentSaving >= 0 ? '+' : '-'}₹<AnimatedCounter value={Math.abs(currentSaving)} />
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: 4, display: 'block' }}>
                    {currentSaving >= 0 ? 'Wealth accumulated across' : 'Overspending across'}{' '}
                    <span style={{ color: 'var(--text-sub)', fontWeight: 600 }}><AnimatedCounter value={transactions.length} /></span> records
                  </span>
                </div>

                {/* Savings Rate Bar */}
                {totalIncome > 0 && (
                  <div style={{ position: 'relative', zIndex: 1, marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)' }}>Savings Rate</span>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700,
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: currentSaving >= 0 ? '#00FF88' : '#FF3366'
                      }}>
                        {Math.max(0, Math.round((currentSaving / totalIncome) * 100))}%
                      </span>
                    </div>
                    <div style={{
                      height: 5, borderRadius: 3,
                      background: 'var(--surface)',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%', borderRadius: 3,
                        width: `${Math.min(100, Math.max(0, (currentSaving / totalIncome) * 100))}%`,
                        background: currentSaving >= 0
                          ? 'linear-gradient(90deg, #00FF88, #60F5D0)'
                          : 'linear-gradient(90deg, #FF3366, #FF7E9F)',
                        boxShadow: currentSaving >= 0
                          ? '0 0 8px rgba(0,255,136,0.5)' : '0 0 8px rgba(255,51,102,0.5)',
                        transition: 'width 0.8s cubic-bezier(.16,1,.3,1)'
                      }} />
                    </div>
                  </div>
                )}

                {/* Income / Expense / Balance share mini stats */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6,
                  position: 'relative', zIndex: 1
                }}>
                  <div style={{
                    padding: '10px 6px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #00C853 0%, #008E3C 100%)',
                    border: '1px solid rgba(0, 200, 83, 0.2)',
                    textAlign: 'center',
                    boxShadow: '0 4px 10px rgba(0, 200, 83, 0.15)'
                  }}>
                    <div style={{ fontSize: '0.56rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3, whiteSpace: 'nowrap' }}>
                      Income Share
                    </div>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF'
                    }}>
                      <AnimatedCounter value={incomePercentage} />%
                    </span>
                  </div>
                  <div style={{
                    padding: '10px 6px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #FF3366 0%, #D81B60 100%)',
                    border: '1px solid rgba(255, 51, 102, 0.2)',
                    textAlign: 'center',
                    boxShadow: '0 4px 10px rgba(255, 51, 102, 0.15)'
                  }}>
                    <div style={{ fontSize: '0.56rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3, whiteSpace: 'nowrap' }}>
                      Expense Share
                    </div>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF'
                    }}>
                      <AnimatedCounter value={expensePercentage} />%
                    </span>
                  </div>
                  <div style={{
                    padding: '10px 6px', borderRadius: 12,
                    background: currentSaving >= 0
                      ? 'linear-gradient(135deg, #00C853 0%, #008E3C 100%)'
                      : 'linear-gradient(135deg, #FF3366 0%, #D81B60 100%)',
                    border: currentSaving >= 0
                      ? '1px solid rgba(0, 200, 83, 0.2)'
                      : '1px solid rgba(255, 51, 102, 0.2)',
                    textAlign: 'center',
                    boxShadow: currentSaving >= 0
                      ? '0 4px 10px rgba(0, 200, 83, 0.15)'
                      : '0 4px 10px rgba(255, 51, 102, 0.15)'
                  }}>
                    <div style={{ fontSize: '0.56rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.8)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3, whiteSpace: 'nowrap' }}>
                      Net Balance
                    </div>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF'
                    }}>
                      {balancePercentage >= 0 ? '+' : '-'}<AnimatedCounter value={Math.abs(balancePercentage)} />%
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Pizza Chart Card ── */}
              <div className="card" style={{ paddingBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '-0.015em' }}>Spending Breakdown</h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>Tap a slice to inspect</p>
                  </div>
                  <span style={{ fontSize: 22 }}>🍕</span>
                </div>
                <PieChart transactions={transactions} categories={categories} mode="expense" />
              </div>

              {/* ── Balance Trend — New TrendChart ── */}
              <div className="card">
                <TrendChart existingSaving={existingSaving} transactions={transactions} />
              </div>

              {/* ── Recent Activity ── */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>Recent Activity</h3>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'background .15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-glow)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    See All →
                  </button>
                </div>

                {transactions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                    No entries yet — use the + button below to add income or expenses!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(t => {
                      const catObj = categories.find(c => c.name.toLowerCase() === t.category.toLowerCase()) || {};
                      const catColor = catObj.color || '#6b7280';
                      const isIncome = t.type === 'income';
                      return (
                        <div key={t.id} style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '13px 15px',
                          background: isIncome ? 'rgba(45,212,191,0.04)' : 'rgba(251,113,133,0.04)',
                          border: `1px solid ${isIncome ? 'rgba(45,212,191,0.1)' : 'rgba(251,113,133,0.1)'}`,
                          borderRadius: 12,
                          transition: 'transform .15s, box-shadow .15s',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(3px)'; e.currentTarget.style.boxShadow = isIncome ? 'var(--sh-teal)' : 'var(--sh-coral)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                        >
                          <div style={{
                            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                            background: `${catColor}18`,
                            border: `1px solid ${catColor}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17
                          }}>
                            {isIncome ? '💵' : '💸'}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.description}</p>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 4, marginTop: 2 }}>
                              <span style={{ color: catColor, fontWeight: 600 }}>{t.category}</span>
                              <span>·</span>
                              <span>{new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          </div>
                          <span style={{
                            fontSize: 13.5, fontWeight: 700, letterSpacing: '-0.01em',
                            color: isIncome ? 'var(--income-color)' : 'var(--expense-color)',
                            fontFamily: "'Space Grotesk',sans-serif",
                            whiteSpace: 'nowrap',
                            marginLeft: 10
                          }}>
                            {isIncome ? '+' : '−'}₹{Number(t.amount).toLocaleString('en-IN')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── Smart Advice ── */}
              {currentTips.expense && currentTips.expense.length > 0 && (
                <div style={{
                  padding: '14px 16px',
                  background: 'linear-gradient(135deg, rgba(45,212,191,.08) 0%, rgba(91,141,238,.06) 100%)',
                  border: '1px solid rgba(45,212,191,.18)',
                  borderLeft: '3px solid var(--income-color)',
                  borderRadius: 14,
                  display: 'flex', flexDirection: 'column', gap: 6,
                  animation: 'fadeUp .5s cubic-bezier(.16,1,.3,1) both'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--income-color)' }}>💡 Smart Advice</span>
                    <button onClick={handleRefreshTips} style={{ padding: 4, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 6 }}>
                      <RefreshIcon size={13} />
                    </button>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
                    &quot;{currentTips.expense[0].tip}&quot;
                  </p>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{currentTips.expense[0].category}</span>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: DETAILED TRANSACTIONS LEDGER */}
          {activeTab === 'transactions' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Account Ledger</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Search and filter offline transaction records</p>
                </div>
                <div className="segmented-control" style={{ display: 'flex', gap: 4, width: '185px', margin: 0, padding: 3, borderRadius: 12, background: 'var(--surface-hover)', border: '1.5px solid var(--border-strong)' }}>
                  <button
                    onClick={() => handleSetLedgerViewMode('timeline')}
                    className={`segmented-button ${ledgerViewMode === 'timeline' ? 'active-income' : ''}`}
                    style={{
                      padding: '6px 10px',
                      fontSize: '0.74rem',
                      borderRadius: 9,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    ⏱️ Timeline
                  </button>
                  <button
                    onClick={() => handleSetLedgerViewMode('table')}
                    className={`segmented-button ${ledgerViewMode === 'table' ? 'active-income' : ''}`}
                    style={{
                      padding: '6px 10px',
                      fontSize: '0.74rem',
                      borderRadius: 9,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 4,
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    📊 Table
                  </button>
                </div>
              </div>

              {/* Filtering Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--surface)', padding: 12, borderRadius: 10, border: '1px solid var(--border)' }}>
                <input
                  type="text"
                  placeholder="Search ledger details or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-input"
                />

                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="form-input"
                    style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}
                  >
                    <option value="all">All Types</option>
                    <option value="income">Incomes Only</option>
                    <option value="expense">Expenses Only</option>
                  </select>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="form-input"
                    style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}
                  >
                    <option value="all">All Categories</option>
                    {Array.from(new Set(categories.map(c => c.name))).sort((a, b) => a.localeCompare(b)).map((catName) => (
                      <option key={catName} value={catName}>{catName}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ledger List */}
              {filteredTransactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <p style={{ fontWeight: 500 }}>No matching ledger entries found.</p>
                  <span style={{ fontSize: '0.8rem' }}>Adjust filters or tap buttons on screen to add records.</span>
                </div>
              ) : ledgerViewMode === 'table' ? (
                <div className="ledger-table-container">
                  <table className="ledger-table">
                    <thead>
                      <tr>
                        <th style={{ width: 50 }}>Type</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th style={{ textAlign: 'right' }}>Amount</th>
                        <th style={{ width: 80, textAlign: 'center' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((t) => {
                        const catObj = categories.find(c => c.name.toLowerCase() === t.category.toLowerCase()) || {};
                        const catColor = catObj.color || '#6b7280';
                        return (
                          <tr key={t.id}>
                            <td style={{ width: 44, paddingRight: 0 }}>
                              <div style={{
                                backgroundColor: `${catColor}15`,
                                color: catColor,
                                width: 32,
                                height: 32,
                                borderRadius: '8px',
                                border: `1px solid ${catColor}30`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 14
                              }}>
                                {t.type === 'income' ? '💵' : '💸'}
                              </div>
                            </td>
                            <td style={{ fontWeight: 600, color: 'var(--text)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={t.description}>
                              {t.description}
                            </td>
                            <td style={{ width: 90 }}>
                              <span
                                className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}
                                style={{
                                  backgroundColor: `${catColor}15`,
                                  color: catColor,
                                  border: `1.5px solid ${catColor}30`,
                                  padding: '2px 8px',
                                  fontSize: 8.5,
                                  fontWeight: 700,
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {t.category}
                              </span>
                            </td>
                            <td style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', fontSize: '0.74rem', width: 95 }}>
                              {new Date(t.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td style={{
                              textAlign: 'right',
                              fontWeight: 700,
                              color: t.type === 'income' ? 'var(--color-growth)' : 'var(--color-expense)',
                              fontFamily: "'Space Grotesk',sans-serif",
                              whiteSpace: 'nowrap',
                              paddingLeft: 12
                            }}>
                              {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                            </td>
                            <td style={{ width: 70, paddingLeft: 0 }}>
                              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                                <button
                                  onClick={() => {
                                    setEditingTransaction(t);
                                    setEditTxDesc(t.description);
                                    setEditTxAmount(t.amount.toString());
                                    setEditTxType(t.type);
                                    setEditTxCategory(t.category);
                                    setEditTxDate(t.date);
                                    setEditTxErrors({});
                                  }}
                                  style={{
                                    background: 'var(--surface)',
                                    border: '1.5px solid var(--border-strong)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-sub)',
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    transition: 'all 0.15s'
                                  }}
                                  className="action-hover-btn"
                                  title="Edit entry"
                                >
                                  <EditIcon size={11} />
                                </button>

                                <button
                                  onClick={() => handleDeleteTransaction(t.id)}
                                  style={{
                                    background: 'var(--surface)',
                                    border: '1.5px solid var(--border-strong)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-expense)',
                                    width: 24,
                                    height: 24,
                                    borderRadius: '50%',
                                    transition: 'all 0.15s'
                                  }}
                                  className="action-hover-btn spin-hover"
                                  title="Delete entry"
                                >
                                  <TrashIcon size={11} style={{ color: 'var(--color-expense)' }} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {(() => {
                    // Group transactions by date
                    const groupedTransactions = {};
                    paginatedTransactions.forEach(t => {
                      const dateKey = t.date;
                      if (!groupedTransactions[dateKey]) {
                        groupedTransactions[dateKey] = [];
                      }
                      groupedTransactions[dateKey].push(t);
                    });

                    // Sort dates descending
                    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

                    return sortedDates.map(dateKey => {
                      const dayTxs = groupedTransactions[dateKey];
                      return (
                        <div key={dateKey} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {/* Date Header Group Heading */}
                          <div style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                            paddingLeft: 6,
                            paddingRight: 6,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <span>📅 {formatDateHeader(dateKey)}</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', opacity: 0.8 }}>
                              {dayTxs.length} {dayTxs.length === 1 ? 'item' : 'items'}
                            </span>
                          </div>

                          {/* Unified Card Group Container */}
                          <div style={{
                            background: 'var(--surface-hover)',
                            border: '1px solid var(--border-strong)',
                            borderRadius: 14,
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column'
                          }}>
                            {dayTxs.map((t, idx) => {
                              const catObj = categories.find(c => c.name.toLowerCase() === t.category.toLowerCase()) || {};
                              const catColor = catObj.color || '#6b7280';
                              return (
                                <div
                                  key={t.id}
                                  className="ledger-list-item"
                                  style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'auto 1fr auto',
                                    gridTemplateRows: 'auto auto',
                                    rowGap: '6px',
                                    columnGap: '16px',
                                    alignItems: 'center',
                                    padding: '14px 16px',
                                    borderBottom: idx === dayTxs.length - 1 ? 'none' : '1.5px solid var(--border-strong)',
                                    transition: 'background 0.15s ease',
                                    cursor: 'default'
                                  }}
                                >
                                  {/* Col 1: Image / Icon (Spanning both rows) */}
                                  <div style={{
                                    gridColumn: '1',
                                    gridRow: 'span 2',
                                    backgroundColor: `${catColor}15`,
                                    color: catColor,
                                    width: 38,
                                    height: 38,
                                    borderRadius: '10px',
                                    border: `1.5px solid ${catColor}30`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    {t.type === 'income' ? '💵' : '💸'}
                                  </div>

                                  {/* Col 2, Row 1: Text / Description */}
                                  <div style={{
                                    gridColumn: '2',
                                    gridRow: '1',
                                    minWidth: 0
                                  }}>
                                    <p style={{
                                      fontSize: '0.88rem',
                                      fontWeight: 600,
                                      color: 'var(--text)',
                                      margin: 0,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}>
                                      {t.description}
                                    </p>
                                  </div>

                                  {/* Col 2, Row 2: Category Badge & Actions */}
                                  <div style={{
                                    gridColumn: '2',
                                    gridRow: '2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    flexWrap: 'wrap',
                                    justifySelf: 'start'
                                  }}>
                                    <span
                                      className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}
                                      style={{
                                        backgroundColor: `${catColor}15`,
                                        color: catColor,
                                        border: `1.5px solid ${catColor}30`,
                                        padding: '2px 8px',
                                        fontSize: 8.5,
                                        fontWeight: 700,
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      {t.category}
                                    </span>

                                    {/* Action Buttons */}
                                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                      <button
                                        onClick={() => {
                                          setEditingTransaction(t);
                                          setEditTxDesc(t.description);
                                          setEditTxAmount(t.amount.toString());
                                          setEditTxType(t.type);
                                          setEditTxCategory(t.category);
                                          setEditTxDate(t.date);
                                          setEditTxErrors({});
                                        }}
                                        style={{
                                          background: 'var(--surface)',
                                          border: '1.5px solid var(--border-strong)',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: 'var(--text-sub)',
                                          width: 24,
                                          height: 24,
                                          borderRadius: '50%',
                                          transition: 'all 0.15s'
                                        }}
                                        className="action-hover-btn"
                                        title="Edit entry"
                                      >
                                        <EditIcon size={11} />
                                      </button>

                                      <button
                                        onClick={() => handleDeleteTransaction(t.id)}
                                        style={{
                                          background: 'var(--surface)',
                                          border: '1.5px solid var(--border-strong)',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          color: 'var(--color-expense)',
                                          width: 24,
                                          height: 24,
                                          borderRadius: '50%',
                                          transition: 'all 0.15s'
                                        }}
                                        className="action-hover-btn spin-hover"
                                        title="Delete entry"
                                      >
                                        <TrashIcon size={11} style={{ color: 'var(--color-expense)' }} />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Col 3, Row 1: Value / Amount */}
                                  <div style={{
                                    gridColumn: '3',
                                    gridRow: '1',
                                    justifySelf: 'end'
                                  }}>
                                    <span style={{
                                      fontSize: '0.94rem',
                                      fontWeight: 700,
                                      color: t.type === 'income' ? 'var(--color-growth)' : 'var(--color-expense)'
                                    }}>
                                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                                    </span>
                                  </div>

                                  {/* Col 3, Row 2: Date and Time */}
                                  <div style={{
                                    gridColumn: '3',
                                    gridRow: '2',
                                    justifySelf: 'end'
                                  }}>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                                      {new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
              {/* Pagination Controls */}
              {filteredTransactions.length > pageSize && (() => {
                const startIdx = (currentPage - 1) * pageSize + 1;
                const endIdx = Math.min(currentPage * pageSize, filteredTransactions.length);

                const getPageNumbers = () => {
                  const pages = [];
                  const maxVisible = 5;
                  if (totalPages <= maxVisible) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    pages.push(1);
                    let start = Math.max(2, currentPage - 1);
                    let end = Math.min(totalPages - 1, currentPage + 1);
                    if (currentPage <= 2) {
                      end = 4;
                    } else if (currentPage >= totalPages - 1) {
                      start = totalPages - 3;
                    }
                    if (start > 2) pages.push('...');
                    for (let i = start; i <= end; i++) pages.push(i);
                    if (end < totalPages - 1) pages.push('...');
                    pages.push(totalPages);
                  }
                  return pages;
                };

                return (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderTop: '1.5px solid var(--border-strong)',
                    marginTop: '16px',
                    flexWrap: 'wrap',
                    gap: 16,
                    background: 'var(--surface-hover)',
                    borderBottomLeftRadius: 14,
                    borderBottomRightRadius: 14
                  }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Showing <strong style={{ color: 'var(--text)' }}>{startIdx}–{endIdx}</strong> of <strong style={{ color: 'var(--text)' }}>{filteredTransactions.length.toLocaleString('en-IN')}</strong> entries
                    </span>
                    
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        style={{
                          height: 32,
                          padding: '0 10px',
                          borderRadius: 8,
                          border: '1px solid var(--border-strong)',
                          background: 'var(--surface)',
                          color: 'var(--text)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          opacity: currentPage === 1 ? 0.45 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.15s'
                        }}
                      >
                        ‹ Prev
                      </button>

                      {getPageNumbers().map((p, idx) => {
                        if (p === '...') {
                          return (
                            <span key={`dots-${idx}`} style={{ padding: '0 4px', color: 'var(--text-muted)', fontSize: '0.8rem', userSelect: 'none', fontWeight: 700 }}>
                              ...
                            </span>
                          );
                        }
                        const isActive = p === currentPage;
                        return (
                          <button
                            key={`page-${p}`}
                            onClick={() => setCurrentPage(p)}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: 8,
                              border: isActive ? 'none' : '1px solid var(--border-strong)',
                              background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' : 'var(--surface)',
                              color: isActive ? '#ffffff' : 'var(--text-sub)',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease',
                              boxShadow: isActive ? '0 0 10px var(--primary-glow)' : 'none'
                            }}
                          >
                            {p}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{
                          height: 32,
                          padding: '0 10px',
                          borderRadius: 8,
                          border: '1px solid var(--border-strong)',
                          background: 'var(--surface)',
                          color: 'var(--text)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          opacity: currentPage === totalPages ? 0.45 : 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.15s'
                        }}
                      >
                        Next ›
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: CATEGORY BUILDER */}
          {activeTab === 'categories' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Categories Registry</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Default built-in and custom budget targets</p>
                </div>
                <button
                  onClick={() => setIsAddCategoryOpen(true)}
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: 12 }}
                >
                  <PlusIcon size={14} /> New Category
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid-2">

                {/* Income Categories */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-growth)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📈 Income Tags
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '440px', overflowY: 'auto' }} className="no-scrollbar">
                    {categories.filter(c => c.type === 'income').map(cat => {
                      const isDefault = DEFAULT_CATEGORIES.some(d => d.id === cat.id);
                      const txCount = transactions.filter(t => t.category === cat.name && t.type === 'income').length;
                      return (
                        <div key={cat.id} className="category-item-card" style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid var(--border-strong)',
                          background: 'var(--surface-hover)',
                          transition: 'all 0.15s ease'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: '8px',
                              backgroundColor: `${cat.color}15`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: `1.5px solid ${cat.color}30`,
                              color: cat.color
                            }}>
                              <span style={{ fontSize: '0.85rem' }}>🏷️</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text)' }}>
                                {cat.name}
                              </span>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-sub)' }}>
                                {txCount} {txCount === 1 ? 'entry' : 'entries'} {isDefault && '• System'}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setEditCatName(cat.name);
                                setEditCatColor(cat.color);
                              }}
                              style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--text-sub)', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', width: 24, height: 24, borderRadius: '50%',
                                transition: 'all 0.15s'
                              }}
                              className="action-hover-btn"
                              title="Edit category"
                            >
                              <EditIcon size={12} />
                            </button>
                            {!isDefault ? (
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                style={{
                                  background: 'none', border: 'none', cursor: 'pointer',
                                  color: 'var(--color-expense)', display: 'flex', alignItems: 'center',
                                  justifyContent: 'center', width: 24, height: 24, borderRadius: '50%',
                                  fontSize: 16, transition: 'all 0.15s'
                                }}
                                className="action-hover-btn"
                                title="Remove category"
                              >
                                &times;
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', padding: '0 4px' }} title="System category (cannot delete)">
                                🔒
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expense Categories */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-expense)', display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    📉 Expense Tags
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '440px', overflowY: 'auto' }} className="no-scrollbar">
                    {categories.filter(c => c.type === 'expense').map(cat => {
                      const isDefault = DEFAULT_CATEGORIES.some(d => d.id === cat.id);
                      const txCount = transactions.filter(t => t.category === cat.name && t.type === 'expense').length;
                      return (
                        <div key={cat.id} className="category-item-card" style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: '1px solid var(--border-strong)',
                          background: 'var(--surface-hover)',
                          transition: 'all 0.15s ease'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: '8px',
                              backgroundColor: `${cat.color}15`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              border: `1.5px solid ${cat.color}30`,
                              color: cat.color
                            }}>
                              <span style={{ fontSize: '0.85rem' }}>🏷️</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text)' }}>
                                {cat.name}
                              </span>
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-sub)' }}>
                                {txCount} {txCount === 1 ? 'entry' : 'entries'} {isDefault && '• System'}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setEditCatName(cat.name);
                                setEditCatColor(cat.color);
                              }}
                              style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: 'var(--text-sub)', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', width: 24, height: 24, borderRadius: '50%',
                                transition: 'all 0.15s'
                              }}
                              className="action-hover-btn"
                              title="Edit category"
                            >
                              <EditIcon size={12} />
                            </button>
                            {!isDefault ? (
                              <button
                                onClick={() => handleDeleteCategory(cat.id)}
                                style={{
                                  background: 'none', border: 'none', cursor: 'pointer',
                                  color: 'var(--color-expense)', display: 'flex', alignItems: 'center',
                                  justifyContent: 'center', width: 24, height: 24, borderRadius: '50%',
                                  fontSize: 16, transition: 'all 0.15s'
                                }}
                                className="action-hover-btn"
                                title="Remove category"
                              >
                                &times;
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-faint)', padding: '0 4px' }} title="System category (cannot delete)">
                                🔒
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: MONTH-WISE TIMELINE & REPORTS */}
          {activeTab === 'report' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Report Timeline</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Month-wise financial summaries and reviews</p>
                </div>
                
                {transactions.length > 0 && (
                  <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', padding: 3, borderRadius: 8, border: '1px solid var(--border)' }}>
                    {[
                      { id: 'timeline', label: 'Timeline', icon: '📅' },
                      { id: 'bar', label: 'Bar Chart', icon: '📊' },
                      { id: 'graph', label: 'Graph', icon: '📈' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setReportViewType(t.id)}
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '5px 10px',
                          borderRadius: 6,
                          border: 'none',
                          background: reportViewType === t.id ? 'var(--primary)' : 'transparent',
                          color: reportViewType === t.id ? '#ffffff' : 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.15s'
                        }}
                      >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {transactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <p style={{ fontWeight: 500 }}>No ledger entries recorded yet.</p>
                  <span style={{ fontSize: '0.8rem' }}>Add transactions on the dashboard to see monthly timeline reports.</span>
                </div>
              ) : reportViewType === 'bar' ? (
                <div className="chart-container" style={{ minHeight: '260px' }}>
                  <MonthlyBarChart transactions={transactions} />
                </div>
              ) : reportViewType === 'graph' ? (
                <div className="chart-container" style={{ minHeight: '260px' }}>
                  <MonthlyLineChart transactions={transactions} existingSaving={existingSaving} />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {(() => {
                    const monthlyData = getGroupedMonthsData();
                    return monthlyData.map((group) => {
                      const isExpanded = !!expandedMonths[group.monthKey];
                      const [year, month] = group.monthKey.split('-');
                      const displayMonth = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
                      const netFlow = group.income - group.expense;

                      // Progress bar calculations
                      const expenseRatio = group.income > 0 ? (group.expense / group.income) * 100 : (group.expense > 0 ? 100 : 0);

                      return (
                        <div key={group.monthKey} style={{
                          border: '1px solid var(--border-strong)',
                          borderRadius: 14,
                          background: 'var(--surface-hover)',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          {/* Accordion Trigger Header */}
                          <div
                            onClick={() => setExpandedMonths(prev => ({ ...prev, [group.monthKey]: !prev[group.monthKey] }))}
                            style={{
                              padding: '14px 16px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 10,
                              background: isExpanded ? 'var(--surface-card)' : 'transparent',
                              borderBottom: isExpanded ? '1px solid var(--border-strong)' : 'none',
                              transition: 'background 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.94rem', fontWeight: 700, color: 'var(--text)' }}>
                                📅 {displayMonth}
                              </span>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                {isExpanded ? '▲ Hide Details' : '▼ View Report'}
                              </span>
                            </div>

                            {/* Summary Totals Row */}
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.8rem', fontWeight: 600 }}>
                              <span style={{ color: 'var(--color-growth)' }}>
                                Income: +₹<AnimatedCounter value={group.income} />
                              </span>
                              <span style={{ color: 'var(--color-expense)' }}>
                                Expenses: -₹<AnimatedCounter value={group.expense} />
                              </span>
                              <span style={{ color: netFlow >= 0 ? 'var(--color-growth)' : 'var(--color-expense)', opacity: 0.95 }}>
                                Net: {netFlow >= 0 ? '+' : '-'}₹<AnimatedCounter value={Math.abs(netFlow)} />
                              </span>
                            </div>
                          </div>

                          {/* Accordion Expanded Content */}
                          {isExpanded && (
                            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 18, background: 'var(--surface-card)' }}>

                              {/* 1. Ratio Progress Bar */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                  <span>Income Spent Ratio</span>
                                  <span>{expenseRatio.toFixed(1)}%</span>
                                </div>
                                <div style={{ width: '100%', height: 6, background: 'var(--border-strong)', borderRadius: 3, overflow: 'hidden' }}>
                                  <div style={{
                                    width: `${Math.min(expenseRatio, 100)}%`,
                                    height: '100%',
                                    background: expenseRatio > 100 ? 'var(--color-expense)' : (expenseRatio > 70 ? 'var(--color-amber)' : 'var(--color-growth)'),
                                    borderRadius: 3,
                                    transition: 'width 0.3s ease'
                                  }} />
                                </div>
                                <span style={{ fontSize: '0.68rem', color: 'var(--text-faint)' }}>
                                  {expenseRatio > 100
                                    ? '⚠️ You spent more than your monthly earnings!'
                                    : `You saved ${(100 - expenseRatio).toFixed(1)}% of your income this month.`}
                                </span>
                              </div>

                              <hr style={{ border: 'none', borderBottom: '1px solid var(--border-strong)', margin: 0 }} />

                              {/* 2. Category Breakdown */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                                  Category Review
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                  {Object.values(group.categoriesBreakdown).map((cat) => {
                                    const isCatIncome = cat.income > cat.expense;
                                    const catAmt = isCatIncome ? cat.income : cat.expense;
                                    return (
                                      <div key={cat.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cat.color }} />
                                          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{cat.name}</span>
                                        </div>
                                        <span style={{
                                          fontWeight: 700,
                                          color: isCatIncome ? 'var(--color-growth)' : 'var(--color-expense)'
                                        }}>
                                          {isCatIncome ? '+' : '-'}₹<AnimatedCounter value={catAmt} />
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>

                              <hr style={{ border: 'none', borderBottom: '1px solid var(--border-strong)', margin: 0 }} />

                              {/* 3. Transaction Entry Mini Ledger */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <h4 style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-sub)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                                  Monthly Entries ({group.txs.length})
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '200px', overflowY: 'auto' }} className="no-scrollbar">
                                  {group.txs.map((t) => (
                                    <div key={t.id} style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: '8px 10px',
                                      background: 'var(--surface-hover)',
                                      borderRadius: 8,
                                      fontSize: '0.76rem'
                                    }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                                        <span style={{ fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                          {t.description}
                                        </span>
                                        <span style={{ fontSize: '0.65rem', color: 'var(--text-faint)' }}>
                                          {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {t.category}
                                        </span>
                                      </div>
                                      <span style={{
                                        fontWeight: 700,
                                        color: t.type === 'income' ? 'var(--color-growth)' : 'var(--color-expense)',
                                        whiteSpace: 'nowrap'
                                      }}>
                                        {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PROFILE & SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Profile Card Header */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px var(--primary-glow-strong)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1.4rem',
                    fontFamily: "'Space Grotesk', 'Inter', sans-serif"
                  }}>
                    {userInfo?.name ? userInfo.name.trim().charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{userInfo?.name}</h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-sub)', margin: '4px 0 0 0' }}>
                      {userInfo?.profession} · {userInfo?.sex}, {userInfo?.age} years old
                    </p>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      📍 {userInfo?.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Motivational Insights Panel */}
              {(() => {
                const feedback = getMotivationalFeedback();
                return (
                  <div className="card" style={{
                    borderLeft: `4px solid ${feedback.color}`,
                    padding: '16px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    background: 'var(--surface)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="lbl" style={{ color: feedback.color, fontWeight: 700, fontSize: '0.72rem' }}>
                        Financial Feedback
                      </span>
                      <span className="badge" style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: feedback.color,
                        borderWidth: '1px',
                        color: feedback.color,
                        padding: '2px 8px',
                        fontSize: '0.68rem'
                      }}>
                        {feedback.rating}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)', lineHeight: '1.45', margin: 0 }}>
                      {feedback.message}
                    </p>
                  </div>
                );
              })()}

              {/* Edit Profile Fields Form */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Update Profile Details</h4>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>Edit your personal information without resetting your data</p>
                </div>

                <form onSubmit={handleProfileUpdate} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-edit-name">Your Name</label>
                    <input
                      type="text"
                      id="profile-edit-name"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="form-input"
                      required
                    />
                    {profileErrors.name && <div className="field-error">⚠️ {profileErrors.name}</div>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-edit-profession">Profession</label>
                      <select
                        id="profile-edit-profession"
                        value={profileProfession}
                        onChange={(e) => setProfileProfession(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="Software Engineer">IT / Software</option>
                        <option value="Business Owner">Business Owner</option>
                        <option value="Student">Student</option>
                        <option value="Farmer / Agriculture">Farmer / Agri</option>
                        <option value="Homemaker">Homemaker</option>
                        <option value="Retired">Retired</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-edit-sex">Sex</label>
                      <select
                        id="profile-edit-sex"
                        value={profileSex}
                        onChange={(e) => setProfileSex(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-edit-age">Age</label>
                      <input
                        type="text"
                        id="profile-edit-age"
                        value={profileAge}
                        onChange={(e) => setProfileAge(e.target.value.replace(/\D/g, ''))}
                        className="form-input"
                        inputMode="numeric"
                        required
                      />
                      {profileErrors.age && <div className="field-error">⚠️ {profileErrors.age}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="profile-edit-city">City</label>
                      <select
                        id="profile-edit-city"
                        value={profileCity}
                        onChange={(e) => setProfileCity(e.target.value)}
                        className="form-input"
                        required
                      >
                        <option value="Bangalore">Bangalore</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Madurai">Madurai</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Kochi">Kochi</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Delhi">Delhi</option>
                        <option value="New York">New York</option>
                        <option value="London">London</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Other">Other City</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: 6, borderRadius: 12 }}>
                    ✓ Update Profile
                  </button>
                </form>
              </div>

              {/* Dedicated PIN Update Section */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Security Settings</h4>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>Change your 4-digit ledger access PIN</p>
                </div>

                <form onSubmit={handlePinUpdate} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="pin-edit-current">Current 4-Digit PIN</label>
                    <input
                      type="password"
                      id="pin-edit-current"
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value.replace(/\D/g, ''))}
                      className="form-input"
                      placeholder="Enter current PIN"
                      maxLength={4}
                      inputMode="numeric"
                      required
                    />
                    {pinUpdateErrors.currentPin && <div className="field-error">⚠️ {pinUpdateErrors.currentPin}</div>}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="pin-edit-new">New 4-Digit PIN</label>
                      <input
                        type="password"
                        id="pin-edit-new"
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                        className="form-input"
                        placeholder="New PIN"
                        maxLength={4}
                        inputMode="numeric"
                        required
                      />
                      {pinUpdateErrors.newPin && <div className="field-error">⚠️ {pinUpdateErrors.newPin}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="pin-edit-confirm">Confirm New PIN</label>
                      <input
                        type="password"
                        id="pin-edit-confirm"
                        value={confirmNewPinInput}
                        onChange={(e) => setConfirmNewPinInput(e.target.value.replace(/\D/g, ''))}
                        className="form-input"
                        placeholder="Confirm"
                        maxLength={4}
                        inputMode="numeric"
                        required
                      />
                      {pinUpdateErrors.confirmNewPin && <div className="field-error">⚠️ {pinUpdateErrors.confirmNewPin}</div>}
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ marginTop: 6, borderRadius: 12 }}>
                    🔒 Change Security PIN
                  </button>
                </form>
              </div>

              {/* Data Import / Export */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, margin: 0 }}>Backup & Restore</h4>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>Export or import offline ledger database backup JSON files</p>
                </div>

                <div className="grid-2">
                  <button onClick={handleExportDatabase} className="btn btn-secondary">
                    <ExportIcon size={16} /> Export JSON
                  </button>

                  <div style={{ position: 'relative' }}>
                    <input
                      type="file"
                      accept=".json"
                      id="import-db-input"
                      onChange={handleImportDatabase}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="import-db-input" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', height: '100%' }}>
                      <ImportIcon size={16} /> Import JSON
                    </label>
                  </div>
                </div>
              </div>

              {/* Factory reset / danger zone */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-expense)', margin: 0 }}>Danger Zone</h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>Wipe all local ledger data, profiles, and transaction records from this device.</p>
                <button onClick={handleResetDatabase} className="btn btn-danger btn-sm" style={{ alignSelf: 'flex-start' }}>
                  Factory Reset Valora
                </button>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* FLOATING ACTION BUTTONS — minus left, plus right */}
      <button
        onClick={() => openQuickAdd('expense')}
        className="fab-floating minus"
        title="Record Expense"
        style={{ left: 'max(16px, calc((100vw - 520px) / 2 + 16px))' }}
      >
        <MinusIcon size={18} />
      </button>

      <button
        onClick={() => openQuickAdd('income')}
        className="fab-floating plus"
        title="Record Income"
        style={{ right: 'max(16px, calc((100vw - 520px) / 2 + 16px))' }}
      >
        <PlusIconCustom size={18} />
      </button>

      {/* FLOATING ROUNDED DOCK FOOTER NAVIGATION */}
      <nav className="bottom-nav">
        <button onClick={() => setActiveTab('dashboard')} className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}>
          <LogoIcon size={activeTab === 'dashboard' ? 22 : 20} className="nav-icon-svg rotate-forever"
            style={{ filter: activeTab === 'dashboard' ? 'drop-shadow(0 0 4px var(--primary))' : 'none', transition: 'all .2s' }}
          />
          <span className="nav-label">Overview</span>
        </button>

        <button onClick={() => setActiveTab('transactions')} className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}>
          <WalletIcon size={activeTab === 'transactions' ? 22 : 20} className="nav-icon-svg"
            style={{ filter: activeTab === 'transactions' ? 'drop-shadow(0 0 4px var(--primary))' : 'none', transition: 'all .2s' }}
          />
          <span className="nav-label">Ledger</span>
        </button>

        <button onClick={() => setActiveTab('categories')} className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`}>
          <CategoryIcon size={activeTab === 'categories' ? 22 : 20} className="nav-icon-svg"
            style={{ filter: activeTab === 'categories' ? 'drop-shadow(0 0 4px var(--primary))' : 'none', transition: 'all .2s' }}
          />
          <span className="nav-label">Categories</span>
        </button>

        <button onClick={() => setActiveTab('report')} className={`nav-item ${activeTab === 'report' ? 'active' : ''}`}>
          <ChartIcon size={activeTab === 'report' ? 22 : 20} className="nav-icon-svg"
            style={{ filter: activeTab === 'report' ? 'drop-shadow(0 0 4px var(--primary))' : 'none', transition: 'all .2s' }}
          />
          <span className="nav-label">Report</span>
        </button>

        <button onClick={() => setActiveTab('settings')} className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
          <SettingsIcon size={activeTab === 'settings' ? 22 : 20} className="nav-icon-svg"
            style={{ filter: activeTab === 'settings' ? 'drop-shadow(0 0 4px var(--primary))' : 'none', transition: 'all .2s' }}
          />
          <span className="nav-label">Profile</span>
        </button>
      </nav>

      {/* MODAL: WEALTH ADVICE OVERLAY */}
      {isAdviceModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAdviceModalOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600 }}>Wealth Advice</span>
              <button onClick={() => setIsAdviceModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Random offline finance suggestions to grow savings</p>
                <button
                  onClick={handleRefreshTips}
                  className="btn btn-growth btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', fontSize: '0.72rem', borderRadius: 8 }}
                >
                  <RefreshIcon size={12} /> Refresh
                </button>
              </div>

              {/* Segmented Controller */}
              <div className="segmented-control" style={{ margin: 0 }}>
                <button
                  onClick={() => setTipFilter('expense')}
                  className={`segmented-button ${tipFilter === 'expense' ? 'active-expense' : ''}`}
                >
                  Reduce Expenses
                </button>
                <button
                  onClick={() => setTipFilter('income')}
                  className={`segmented-button ${tipFilter === 'income' ? 'active-income' : ''}`}
                >
                  Increase Income
                </button>
              </div>

              {/* Advices List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: '350px', overflowY: 'auto' }} className="no-scrollbar">
                {(tipFilter === 'expense' ? currentTips.expense : currentTips.income)?.map((item, idx) => (
                  <div
                    key={item.id}
                    className="list-row"
                    style={{
                      cursor: 'default',
                      borderLeft: `4px solid ${tipFilter === 'expense' ? 'var(--color-expense)' : 'var(--color-growth)'}`,
                      padding: '12px 16px',
                      background: 'var(--surface-hover)'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--text-faint)', textTransform: 'uppercase' }}>
                          Advice #{idx + 1}
                        </span>
                        <span className="badge badge-amber" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                          {item.category}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text)', lineHeight: '1.4', margin: 0 }}>
                        &quot;{item.tip}&quot;
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setIsAdviceModalOpen(false)}
                className="btn btn-secondary btn-md"
                style={{ borderRadius: 12, marginTop: 4 }}
              >
                Close Advice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD TRANSACTION RECORD FORM */}
      {isAddTxOpen && (
        <div className="modal-overlay" onClick={() => { setIsAddTxOpen(false); setTxErrors({}); }}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600 }}>Record Entry</span>
              <button onClick={() => { setIsAddTxOpen(false); setTxErrors({}); }} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleAddTransaction} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Type Switcher */}
              <div className="form-group">
                <label className="form-label">Transaction Type</label>
                <div className="segmented-control" style={{ margin: 0 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setTxType('expense');
                      const list = categories.filter(c => c.type === 'expense');
                      if (list.length > 0) setTxCategory(list[0].name);
                    }}
                    className={`segmented-button ${txType === 'expense' ? 'active-expense' : ''}`}
                    style={{ flex: 1 }}
                  >
                    <MinusIcon size={14} style={{ marginRight: 4, display: 'inline-block', verticalAlign: 'middle' }} /> Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTxType('income');
                      const list = categories.filter(c => c.type === 'income');
                      if (list.length > 0) setTxCategory(list[0].name);
                    }}
                    className={`segmented-button ${txType === 'income' ? 'active-income' : ''}`}
                    style={{ flex: 1 }}
                  >
                    <PlusIconCustom size={14} style={{ marginRight: 4, display: 'inline-block', verticalAlign: 'middle' }} /> Income
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div className="form-group">
                <label className="form-label" htmlFor="tx-amount-input">Amount (INR ₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--text-muted)' }}>₹</span>
                  <input
                    type="text"
                    id="tx-amount-input"
                    value={txAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: 24 }}
                    placeholder="0.00"
                    required
                    inputMode="decimal"
                  />
                </div>
                {txErrors.amount && <div className="field-error">⚠️ {txErrors.amount}</div>}
              </div>

              {/* Description input */}
              <div className="form-group">
                <label className="form-label" htmlFor="tx-desc-input">Description / Note</label>
                <input
                  type="text"
                  id="tx-desc-input"
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Filter Coffee, Petrol, Vegetables..."
                  required
                />
                {txErrors.desc && <div className="field-error">⚠️ {txErrors.desc}</div>}
              </div>

              {/* Category selector */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label className="form-label" htmlFor="tx-category-select" style={{ margin: 0 }}>Category</label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCatName('');
                      setNewCatType(txType);
                      setNewCatColor(PRESET_COLORS[3]);
                      setIsCategoryDrawerOpen(true);
                    }}
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--primary-2)',
                      background: 'var(--primary-glow)',
                      border: '1px solid var(--primary-glow-strong)',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <PlusIcon size={12} /> Add New Category
                  </button>
                </div>
                <select
                  id="tx-category-select"
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="form-input"
                  required
                >
                  {categories.filter(c => c.type === txType).sort((a, b) => a.name.localeCompare(b.name)).map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {txErrors.category && <div className="field-error">⚠️ {txErrors.category}</div>}
              </div>

              {/* Date Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="tx-date-input">Transaction Date</label>
                <input
                  type="date"
                  id="tx-date-input"
                  value={txDate}
                  onChange={(e) => setTxDate(e.target.value)}
                  className="form-input"
                  required
                />
                {txErrors.date && <div className="field-error">⚠️ {txErrors.date}</div>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                <button type="button" onClick={() => { setIsAddTxOpen(false); setTxErrors({}); }} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${txType === 'income' ? 'btn-growth' : 'btn-primary'}`}
                  style={{ flex: 2, borderRadius: 14, padding: '12px' }}
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CUSTOM CATEGORY FORM */}
      {isAddCategoryOpen && (
        <div className="modal-overlay" onClick={() => { setIsAddCategoryOpen(false); setCatErrors({}); }}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600 }}>Create Category</span>
              <button onClick={() => { setIsAddCategoryOpen(false); setCatErrors({}); }} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleAddCategory} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="new-cat-name-input">Category Name</label>
                <input
                  type="text"
                  id="new-cat-name-input"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Subscriptions, Pet Care, Crypto..."
                  required
                />
                {catErrors.name && <div className="field-error">⚠️ {catErrors.name}</div>}
              </div>

              {/* Type Selection */}
              <div className="form-group">
                <label className="form-label">Category Type</label>
                <div className="segmented-control" style={{ margin: 0 }}>
                  <button
                    type="button"
                    onClick={() => setNewCatType('expense')}
                    className={`segmented-button ${newCatType === 'expense' ? 'active-expense' : ''}`}
                    style={{ flex: 1 }}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCatType('income')}
                    className={`segmented-button ${newCatType === 'income' ? 'active-income' : ''}`}
                    style={{ flex: 1 }}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Color Preset Palette */}
              <div className="form-group">
                <label className="form-label">Color Theme</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCatColor(color)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: newCatColor === color ? '2.5px solid var(--text-primary)' : '2.5px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-label={`Color ${color}`}
                    >
                      {newCatColor === color && <CheckIcon size={12} style={{ color: '#fff' }} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                <button type="button" onClick={() => { setIsAddCategoryOpen(false); setCatErrors({}); }} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, borderRadius: 14, padding: '12px' }}
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREMIUM CUSTOM CONFIRMATION SHEET MODAL */}
      {confirmModal.open && (
        <div className="modal-overlay" onClick={() => setConfirmModal({ open: false })}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <div className="modal-handle" />
            <div className="modal-title" style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>
              {confirmModal.title}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '22px', lineHeight: '1.4' }}>
              {confirmModal.message}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setConfirmModal({ open: false })} className="btn btn-secondary" style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({ open: false });
                }}
                className="btn btn-primary"
                style={{ flex: 1, background: 'var(--color-expense)', color: '#ffffff' }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: QUICK CATEGORY DRAWER FROM RECORD ENTRY */}
      {isCategoryDrawerOpen && (
        <div className="drawer-overlay" onClick={() => { setIsCategoryDrawerOpen(false); setQuickCatErrors({}); }}>
          <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-handle" />
            <div className="drawer-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                🏷️ Add New Category
              </span>
              <button onClick={() => { setIsCategoryDrawerOpen(false); setQuickCatErrors({}); }} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleQuickAddCategory} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="quick-cat-name-input">Category Name</label>
                <input
                  type="text"
                  id="quick-cat-name-input"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Subscriptions, Pet Care, Crypto..."
                  autoFocus
                  required
                />
                {quickCatErrors.name && <div className="field-error">⚠️ {quickCatErrors.name}</div>}
              </div>

              {/* Type Selection */}
              <div className="form-group">
                <label className="form-label">Category Type</label>
                <div className="segmented-control" style={{ margin: 0 }}>
                  <button
                    type="button"
                    onClick={() => setNewCatType('expense')}
                    className={`segmented-button ${newCatType === 'expense' ? 'active-expense' : ''}`}
                    style={{ flex: 1 }}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCatType('income')}
                    className={`segmented-button ${newCatType === 'income' ? 'active-income' : ''}`}
                    style={{ flex: 1 }}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Color Preset Palette */}
              <div className="form-group">
                <label className="form-label">Color Theme</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCatColor(color)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: newCatColor === color ? '2.5px solid var(--text)' : '2.5px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-label={`Color ${color}`}
                    >
                      {newCatColor === color && <CheckIcon size={12} style={{ color: '#fff' }} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                <button type="button" onClick={() => { setIsCategoryDrawerOpen(false); setQuickCatErrors({}); }} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, borderRadius: 14, padding: '12px' }}
                >
                  Save & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT CUSTOM CATEGORY FORM */}
      {editingCategory && (
        <div className="modal-overlay" onClick={() => { setEditingCategory(null); setCatErrors({}); }}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
            <div className="modal-handle" />
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600 }}>Edit Category</span>
              <button onClick={() => { setEditingCategory(null); setCatErrors({}); }} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleEditCategorySubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-cat-name-input">Category Name</label>
                <input
                  type="text"
                  id="edit-cat-name-input"
                  value={editCatName}
                  onChange={(e) => setEditCatName(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Subscriptions, Pet Care, Crypto..."
                  required
                />
                {catErrors.name && <div className="field-error">⚠️ {catErrors.name}</div>}
              </div>

              {/* Type Selection (Read-only since changing type is unsafe for historical transactions) */}
              <div className="form-group">
                <label className="form-label">Category Type</label>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: editingCategory.type === 'income' ? 'var(--color-growth)' : 'var(--color-expense)', padding: '8px 12px', background: 'var(--surface-hover)', borderRadius: '10px', textTransform: 'capitalize' }}>
                  {editingCategory.type}
                </div>
              </div>

              {/* Color Preset Palette */}
              <div className="form-group">
                <label className="form-label">Color Theme</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setEditCatColor(color)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: color,
                        border: editCatColor === color ? '2.5px solid var(--text)' : '2.5px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-label={`Color ${color}`}
                    >
                      {editCatColor === color && <CheckIcon size={12} style={{ color: '#fff' }} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                <button type="button" onClick={() => { setEditingCategory(null); setCatErrors({}); }} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2, borderRadius: 14, padding: '12px' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT TRANSACTION RECORD FORM */}
      {editingTransaction && (
        <div className="modal-overlay" onClick={() => { setEditingTransaction(null); setEditTxErrors({}); }}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600 }}>Edit Ledger Entry</span>
              <button onClick={() => { setEditingTransaction(null); setEditTxErrors({}); }} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleEditTransactionSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Type Switcher */}
              <div className="form-group">
                <label className="form-label">Transaction Type</label>
                <div className="segmented-control" style={{ margin: 0 }}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditTxType('expense');
                      const list = categories.filter(c => c.type === 'expense');
                      if (list.length > 0) setEditTxCategory(list[0].name);
                    }}
                    className={`segmented-button ${editTxType === 'expense' ? 'active-expense' : ''}`}
                    style={{ flex: 1 }}
                  >
                    <MinusIcon size={14} style={{ marginRight: 4, display: 'inline-block', verticalAlign: 'middle' }} /> Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditTxType('income');
                      const list = categories.filter(c => c.type === 'income');
                      if (list.length > 0) setEditTxCategory(list[0].name);
                    }}
                    className={`segmented-button ${editTxType === 'income' ? 'active-income' : ''}`}
                    style={{ flex: 1 }}
                  >
                    <PlusIconCustom size={14} style={{ marginRight: 4, display: 'inline-block', verticalAlign: 'middle' }} /> Income
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-tx-amount-input">Amount (INR ₹)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: 'var(--text-muted)' }}>₹</span>
                  <input
                    type="text"
                    id="edit-tx-amount-input"
                    value={editTxAmount}
                    onChange={(e) => handleEditAmountChange(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: 24 }}
                    placeholder="0.00"
                    required
                    inputMode="decimal"
                  />
                </div>
                {editTxErrors.amount && <div className="field-error">⚠️ {editTxErrors.amount}</div>}
              </div>

              {/* Description input */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-tx-desc-input">Description / Note</label>
                <input
                  type="text"
                  id="edit-tx-desc-input"
                  value={editTxDesc}
                  onChange={(e) => setEditTxDesc(e.target.value)}
                  className="form-input"
                  placeholder="e.g. Filter Coffee, Petrol, Vegetables..."
                  required
                />
                {editTxErrors.desc && <div className="field-error">⚠️ {editTxErrors.desc}</div>}
              </div>

              {/* Category selector */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-tx-category-select" style={{ marginBottom: 6, display: 'block' }}>Category</label>
                <select
                  id="edit-tx-category-select"
                  value={editTxCategory}
                  onChange={(e) => setEditTxCategory(e.target.value)}
                  className="form-input"
                  required
                >
                  {categories.filter(c => c.type === editTxType).sort((a, b) => a.name.localeCompare(b.name)).map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {editTxErrors.category && <div className="field-error">⚠️ {editTxErrors.category}</div>}
              </div>

              {/* Date Input */}
              <div className="form-group">
                <label className="form-label" htmlFor="edit-tx-date-input">Transaction Date</label>
                <input
                  type="date"
                  id="edit-tx-date-input"
                  value={editTxDate}
                  onChange={(e) => setEditTxDate(e.target.value)}
                  className="form-input"
                  required
                />
                {editTxErrors.date && <div className="field-error">⚠️ {editTxErrors.date}</div>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                <button type="button" onClick={() => { setEditingTransaction(null); setEditTxErrors({}); }} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${editTxType === 'income' ? 'btn-growth' : 'btn-primary'}`}
                  style={{ flex: 2, borderRadius: 14, padding: '12px' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      {toast && (
        <div
          className="toast"
          style={{
            borderColor: toast.startsWith('⚠️') ? '#f59e0b' : toast.startsWith('❌') ? '#ef4444' : '#10b981',
            boxShadow: toast.startsWith('⚠️') ? '0 8px 30px rgba(245, 158, 11, 0.35)' : toast.startsWith('❌') ? '0 8px 30px rgba(239, 68, 68, 0.35)' : '0 8px 30px rgba(16, 185, 129, 0.35)',
            background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
            borderWidth: '1.5px',
            color: '#ffffff',
            fontWeight: '700',
            letterSpacing: '0.015em'
          }}
        >
          {toast}
        </div>
      )}

    </div>
  );
}
