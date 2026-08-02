'use client';

import React, { useState, useEffect } from 'react';
import ThemeToggle from './components/ThemeToggle';
import SpecularButton from './components/SpecularButton';
import { AreaChart, PieChart, DonutChart } from './components/CustomChart';
import {
  LogoIcon,
  WalletIcon,
  CoinsIcon,
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
  { id: 'c-inc-5', name: 'Gold Chit Maturity', type: 'income', color: '#ec4899' },
  { id: 'c-inc-6', name: 'Freelance & Tutoring', type: 'income', color: '#06b6d4' },
  { id: 'c-inc-7', name: 'Other Income', type: 'income', color: '#6b7280' },
  
  { id: 'c-exp-1', name: 'Food & Dining', type: 'expense', color: '#ef4444' },
  { id: 'c-exp-2', name: 'Petrol & Fuel', type: 'expense', color: '#f97316' },
  { id: 'c-exp-3', name: 'Auto & Metro Travel', type: 'expense', color: '#3b82f6' },
  { id: 'c-exp-4', name: 'Kirana & Groceries', type: 'expense', color: '#10b981' },
  { id: 'c-exp-5', name: 'Electricity & Water Bills', type: 'expense', color: '#06b6d4' },
  { id: 'c-exp-6', name: 'Gold Chit Savings', type: 'expense', color: '#fbbf24' },
  { id: 'c-exp-7', name: 'Temple & Festivals', type: 'expense', color: '#8b5cf6' },
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

  // Navigation / UI states
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'transactions', 'categories', 'tips', 'settings'
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [toast, setToast] = useState('');
  
  // Custom Modal Overlay Confirmation State
  const [confirmModal, setConfirmModal] = useState({ open: false, title: '', message: '', onConfirm: null });

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

  // Search & Filter state (for transaction list)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [filterCategory, setFilterCategory] = useState('all');

  // Load database on mount
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('valora_user_info');
    const savedPin = localStorage.getItem('valora_user_pin');
    const localSaving = localStorage.getItem('valora_existing_saving');
    const localTxs = localStorage.getItem('valora_transactions');
    const localCats = localStorage.getItem('valora_categories');

    setTimeout(() => {
      setMounted(true);
      if (savedUserInfo !== null) {
        setUserInfo(JSON.parse(savedUserInfo));
      }
      if (savedPin === null) {
        setIsLocked(false);
      } else {
        setIsLocked(true);
      }
      if (localSaving !== null) setExistingSaving(Number(localSaving));
      if (localTxs !== null) setTransactions(JSON.parse(localTxs));
      if (localCats !== null) setCategories(JSON.parse(localCats));

      // Initial Tips Batch
      const initialTips = getRandomTips();
      setCurrentTips(initialTips);

      // Default today's date for tx input
      const today = new Date().toISOString().split('T')[0];
      setTxDate(today);
    }, 0);
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
    if (!onboardingName.trim()) {
      showToast('⚠️ Enter name');
      return;
    }
    if (!onboardingAge || Number(onboardingAge) < 1 || Number(onboardingAge) > 120) {
      showToast('⚠️ Enter valid age');
      return;
    }
    if (onboardingPin.length !== 4 || !/^\d+$/.test(onboardingPin)) {
      showToast('⚠️ PIN must be 4 digits');
      return;
    }
    if (onboardingPin !== onboardingConfirmPin) {
      showToast('⚠️ PINs do not match');
      return;
    }

    const info = {
      name: onboardingName.trim(),
      city: onboardingCity,
      profession: onboardingProfession,
      sex: onboardingSex,
      age: Number(onboardingAge),
      baseSavings: 0 // De-prioritized savings config
    };

    localStorage.setItem('valora_user_info', JSON.stringify(info));
    localStorage.setItem('valora_user_pin', onboardingPin);
    setUserInfo(info);
    setIsLocked(false);

    // Seed default testing dummy transactions if list is empty to demonstrate UI/flow
    if (transactions.length === 0) {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const dummyTxs = [
        {
          id: 'tx-dummy-1',
          description: 'IT Park Monthly Salary',
          amount: 65000,
          type: 'income',
          category: 'Salary',
          date: yesterdayStr
        },
        {
          id: 'tx-dummy-2',
          description: 'Shell Petrol Fill',
          amount: 1500,
          type: 'expense',
          category: 'Petrol & Fuel',
          date: todayStr
        },
        {
          id: 'tx-dummy-3',
          description: 'South Indian Coffee & Dosa Breakfast',
          amount: 250,
          type: 'expense',
          category: 'Food & Dining',
          date: todayStr
        }
      ];
      saveTransactions(dummyTxs);
    }

    saveExistingSaving(0);
    showToast(`✓ Welcome, ${info.name}!`);
  };

  // Simple greeting
  const getGreeting = () => 'Hi';

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
    if (!txDesc.trim() || !txAmount || Number(txAmount) <= 0 || !txCategory || !txDate) {
      showToast('⚠️ Complete all fields');
      return;
    }

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
    if (!newCatName.trim()) {
      showToast('⚠️ Enter category name');
      return;
    }

    // Prevent duplicate category names for the same type
    const exists = categories.some(
      c => c.name.toLowerCase() === newCatName.trim().toLowerCase() && c.type === newCatType
    );
    if (exists) {
      showToast('⚠️ Category already exists');
      return;
    }

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
    if (!newCatName.trim()) {
      showToast('⚠️ Enter category name');
      return;
    }

    const exists = categories.some(
      c => c.name.toLowerCase() === newCatName.trim().toLowerCase() && c.type === newCatType
    );
    if (exists) {
      showToast('⚠️ Category already exists');
      return;
    }

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

  // Ensure hydration completion to prevent SSR mismatches
  if (!mounted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#13152e', color: '#eef0ff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💎</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem', letterSpacing: '-0.03em', fontFamily: "'Space Grotesk',sans-serif" }}>VALORA</h2>
          <p style={{ color: '#5a6285', fontSize: '0.85rem' }}>Loading your offline ledger...</p>
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
            <LogoIcon size={38} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.025em', margin: 0 }}>Configure Valora</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>South Indian Offline Ledger & Expense Tracker</p>
          </div>

          <form onSubmit={handleOnboardingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '72vh', overflowY: 'auto', paddingRight: '4px' }} className="no-scrollbar">
            
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
                  type="number"
                  id="onboard-age"
                  value={onboardingAge}
                  onChange={(e) => setOnboardingAge(e.target.value)}
                  className="form-input"
                  placeholder="e.g. 25"
                  required
                  min="1"
                  max="120"
                />
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
                  <option value="Bangalore">Bangalore (Namaskara)</option>
                  <option value="Chennai">Chennai (Vanakkam)</option>
                  <option value="Hyderabad">Hyderabad (Namaskaram)</option>
                  <option value="Kochi">Kochi (Namaskaram)</option>
                  <option value="Coimbatore">Coimbatore (Vanakkam)</option>
                  <option value="Madurai">Madurai (Vanakkam)</option>
                  <option value="Mysore">Mysore (Namaskara)</option>
                  <option value="Trichy">Trichy (Vanakkam)</option>
                  <option value="Trivandrum">Trivandrum (Namaskaram)</option>
                  <option value="Kozhikode">Kozhikode (Namaskaram)</option>
                  <option value="Vijayawada">Vijayawada (Namaskaram)</option>
                  <option value="Visakhapatnam">Visakhapatnam (Namaskaram)</option>
                  <option value="Tirupati">Tirupati (Namaskaram)</option>
                  <option value="Pondicherry">Pondicherry (Bonjour)</option>
                  <option value="Other">Other South Indian City</option>
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
                  pattern="\d{4}"
                  required
                />
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
                  pattern="\d{4}"
                  required
                />
              </div>
            </div>

            <SpecularButton type="submit" size="lg" radius={16} lineColor="#818cf8" baseColor="#4f46e5" speed={0.85} followMouse autoAnimate style={{ width: '100%', marginTop: '8px' }}>
              Initialize Ledger & PIN
            </SpecularButton>
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
            <LogoIcon size={38} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
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
              style={{ fontSize: '14px', color: 'var(--color-expense)', border: 'none', background: 'transparent', boxShadow: 'none' }}
            >
              DEL
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
                setConfirmModal({
                  open: true,
                  title: 'Reset Secure App',
                  message: 'Forgotten your PIN? Wiping local data allows reconfiguring the profile, but clears database logs.',
                  onConfirm: () => {
                    handleResetDatabase();
                  }
                });
              }}
              style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--text-faint)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Forgot PIN / Reset App
            </button>
          </div>
        </div>
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
            <LogoIcon size={22} className="rotate-forever" style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 700, letterSpacing: '-0.025em', fontFamily: "'Space Grotesk',sans-serif" }}>Valora</span>
          </div>
          <div className="header-actions" style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { setIsLocked(true); showToast('Locked.'); }}
              className="btn btn-secondary btn-sm btn-icon"
              title="Lock Application"
              style={{ borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              🔒
            </button>
            <ThemeToggle />
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
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <UserActiveIcon size={30} />
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', fontFamily: "'Space Grotesk',sans-serif", lineHeight: 1.15, margin: 0 }}>
                    {getGreeting()}, {userInfo.name}!
                  </h2>
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
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--income-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, border: '1px solid var(--income-border)'
                    }}>💵</span>
                  </div>
                  <span className="amount" style={{ fontSize: '1.65rem', color: 'var(--income-color)' }}>
                    ₹{totalIncome.toLocaleString('en-IN')}
                  </span>
                  <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 500 }}>
                      {transactions.filter(t => t.type === 'income').length} entr{transactions.filter(t => t.type === 'income').length === 1 ? 'y' : 'ies'}
                    </span>
                  </div>
                </div>

                <div className="hero-card expense">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span className="lbl">Expenses</span>
                    <span style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: 'var(--expense-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 16, border: '1px solid var(--expense-border)'
                    }}>💸</span>
                  </div>
                  <span className="amount" style={{ fontSize: '1.65rem', color: 'var(--expense-color)' }}>
                    ₹{totalExpense.toLocaleString('en-IN')}
                  </span>
                  <div style={{ marginTop: 6 }}>
                    <span style={{ fontSize: 9.5, color: 'var(--text-muted)', fontWeight: 500 }}>
                      {transactions.filter(t => t.type === 'expense').length} bill{transactions.filter(t => t.type === 'expense').length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Net Flow Row ── */}
              <div className="flow-row">
                <div>
                  <div className="lbl" style={{ marginBottom: 3 }}>Net Cash Flow</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Income minus expenses</span>
                </div>
                <span className="amount" style={{
                  fontSize: '1.5rem',
                  color: currentSaving >= 0 ? 'var(--income-color)' : 'var(--expense-color)'
                }}>
                  {currentSaving >= 0 ? '+' : ''}₹{currentSaving.toLocaleString('en-IN')}
                </span>
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

              {/* ── Balance Trend ── */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", letterSpacing: '-0.015em' }}>Balance Trend</h3>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>Running net after each transaction</p>
                  </div>
                  <span style={{ fontSize: 20 }}>📈</span>
                </div>
                <div className="chart-container">
                  <AreaChart existingSaving={0} transactions={transactions} />
                </div>
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(t => {
                      const catObj = categories.find(c => c.name.toLowerCase() === t.category.toLowerCase()) || {};
                      const catColor = catObj.color || '#6b7280';
                      const isIncome = t.type === 'income';
                      return (
                        <div key={t.id} style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '11px 13px',
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
                            fontFamily: "'Space Grotesk',sans-serif"
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
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Account Ledger</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Search and filter offline transaction records</p>
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
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {filteredTransactions.map((t) => {
                    const catObj = categories.find(c => c.name.toLowerCase() === t.category.toLowerCase()) || {};
                    const catColor = catObj.color || '#6b7280';
                    return (
                      <div key={t.id} className="list-row" style={{ padding: '12px 14px' }}>
                        <div className="icon-wrap" style={{ backgroundColor: `${catColor}15`, color: catColor }}>
                          {t.type === 'income' ? '💵' : '💸'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text)', margin: 0 }}>
                            {t.description}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                            <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`} style={{ backgroundColor: `${catColor}15`, color: catColor, border: `1.5px solid ${catColor}30`, padding: '2px 8px', fontSize: 9 }}>
                              {t.category}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {new Date(t.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: '0.95rem', fontWeight: 600, color: t.type === 'income' ? 'var(--color-growth)' : 'var(--color-expense)' }}>
                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                          </span>
                          
                          <button
                            onClick={() => handleDeleteTransaction(t.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            className="spin-hover"
                            title="Delete entry"
                          >
                            <TrashIcon size={18} style={{ color: 'var(--color-expense)' }} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                <SpecularButton
                  onClick={() => setIsAddCategoryOpen(true)}
                  size="sm"
                  radius={12}
                  lineColor="#818cf8"
                  baseColor="#4f46e5"
                  speed={0.85}
                  followMouse
                  autoAnimate
                >
                  <PlusIcon size={14} /> New Category
                </SpecularButton>
              </div>

              {/* Categories Grid */}
              <div className="grid-2">
                
                {/* Income Categories */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-growth)', display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    📈 Income Tags
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: '420px', overflowY: 'auto' }} className="no-scrollbar">
                    {categories.filter(c => c.type === 'income').map(cat => {
                      const isDefault = DEFAULT_CATEGORIES.some(d => d.id === cat.id);
                      return (
                        <div key={cat.id} className="list-row" style={{ cursor: 'default', borderLeft: `4px solid ${cat.color}`, padding: '10px 14px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 500, flex: 1 }}>{cat.name}</span>
                          {!isDefault && (
                            <button onClick={() => handleDeleteCategory(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-expense)', fontSize: 16 }} title="Remove category" className="spin-hover">
                              &times;
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expense Categories */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-expense)', display: 'flex', alignItems: 'center', gap: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    📉 Expense Tags
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: '420px', overflowY: 'auto' }} className="no-scrollbar">
                    {categories.filter(c => c.type === 'expense').map(cat => {
                      const isDefault = DEFAULT_CATEGORIES.some(d => d.id === cat.id);
                      return (
                        <div key={cat.id} className="list-row" style={{ cursor: 'default', borderLeft: `4px solid ${cat.color}`, padding: '10px 14px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 500, flex: 1 }}>{cat.name}</span>
                          {!isDefault && (
                            <button onClick={() => handleDeleteCategory(cat.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-expense)', fontSize: 16 }} title="Remove category" className="spin-hover">
                              &times;
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: WEALTH ADVICE */}
          {activeTab === 'tips' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Wealth Advice</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Random offline finance suggestions to grow savings</p>
                </div>
                <button
                  onClick={handleRefreshTips}
                  className="btn btn-growth btn-sm"
                >
                  <RefreshIcon size={14} /> Refresh Quotes
                </button>
              </div>

              {/* Segmented Controller */}
              <div className="segmented-control">
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

              {/* Advices Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {(tipFilter === 'expense' ? currentTips.expense : currentTips.income)?.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className="list-row"
                    style={{
                      cursor: 'default',
                      borderLeft: `4px solid ${tipFilter === 'expense' ? 'var(--color-expense)' : 'var(--color-growth)'}`,
                      padding: '12px 16px'
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
            </div>
          )}

          {/* TAB 5: BACKUP & RESET */}
          {activeTab === 'settings' && (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Offline Data & Settings</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Valora database backup controls</p>
              </div>

              {/* User Profile Info */}
              <div style={{ padding: 14, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserActiveIcon size={24} />
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>
                    User Profile: <strong>{userInfo?.name}</strong>
                  </h4>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Target City: <strong>{userInfo?.city}</strong> <br/>
                  Demographics: <strong>{userInfo?.sex}</strong>, Age <strong>{userInfo?.age}</strong> <br/>
                  Profession: <strong>{userInfo?.profession}</strong>
                </p>
                <button
                  onClick={() => {
                    setConfirmModal({
                      open: true,
                      title: 'Reset User Profile',
                      message: 'Reset your profile configurations and PIN? Your transaction records will remain safe.',
                      onConfirm: () => {
                        localStorage.removeItem('valora_user_info');
                        localStorage.removeItem('valora_user_pin');
                        setUserInfo(null);
                        setIsLocked(false);
                        setPinInput('');
                        showToast('Profile & PIN reset triggered!');
                      }
                    });
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ alignSelf: 'flex-start' }}
                >
                  Edit Profile / PIN Info
                </button>
              </div>

              {/* Backup utilities */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 500 }}>Backup and Restore</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Since Valora keeps your ledger offline on this browser, export a JSON file to transfer or restore backups onto other profiles.
                </p>
                
                <div className="grid-2" style={{ marginTop: 4 }}>
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
                    <label htmlFor="import-db-input" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <ImportIcon size={16} /> Import JSON
                    </label>
                  </div>
                </div>
              </div>

              {/* Factory reset */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-expense)', marginBottom: 4 }}>Danger Zone</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>Wipe all local ledger data stored in this device.</p>
                
                <button onClick={handleResetDatabase} className="btn btn-danger btn-sm">
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

        <button onClick={() => setActiveTab('tips')} className={`nav-item ${activeTab === 'tips' ? 'active' : ''}`}>
          <CoinsIcon size={activeTab === 'tips' ? 22 : 20} className="nav-icon-svg"
            style={{ filter: activeTab === 'tips' ? 'drop-shadow(0 0 4px var(--primary))' : 'none', transition: 'all .2s' }}
          />
          <span className="nav-label">Advice</span>
        </button>

        <button onClick={() => setActiveTab('settings')} className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
          <SettingsIcon size={activeTab === 'settings' ? 22 : 20} className="nav-icon-svg rotate-forever"
            style={{ filter: activeTab === 'settings' ? 'drop-shadow(0 0 4px var(--primary))' : 'none', transition: 'all .2s' }}
          />
          <span className="nav-label">Backup</span>
        </button>
      </nav>

      {/* MODAL 1: ADD TRANSACTION RECORD FORM */}
      {isAddTxOpen && (
        <div className="modal-overlay" onClick={() => setIsAddTxOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600 }}>Record Entry</span>
              <button onClick={() => setIsAddTxOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                    type="number"
                    id="tx-amount-input"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: 24 }}
                    placeholder="0.00"
                    required
                    min="1"
                  />
                </div>
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
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                <button type="button" onClick={() => setIsAddTxOpen(false)} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  Cancel
                </button>
                <SpecularButton
                  type="submit"
                  size="md"
                  radius={14}
                  lineColor={txType === 'income' ? '#34d399' : '#f472b6'}
                  baseColor={txType === 'income' ? '#059669' : '#db2777'}
                  textColor="#ffffff"
                  speed={0.85}
                  followMouse
                  autoAnimate
                  style={{ flex: 2 }}
                >
                  Save Entry
                </SpecularButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CUSTOM CATEGORY FORM */}
      {isAddCategoryOpen && (
        <div className="modal-overlay" onClick={() => setIsAddCategoryOpen(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600 }}>Create Category</span>
              <button onClick={() => setIsAddCategoryOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                        transform: newCatColor === color ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease',
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
                <button type="button" onClick={() => setIsAddCategoryOpen(false)} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  Cancel
                </button>
                <SpecularButton
                  type="submit"
                  size="md"
                  radius={14}
                  lineColor="#818cf8"
                  baseColor="#4f46e5"
                  speed={0.85}
                  followMouse
                  autoAnimate
                  style={{ flex: 2 }}
                >
                  Create Category
                </SpecularButton>
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
        <div className="drawer-overlay" onClick={() => setIsCategoryDrawerOpen(false)}>
          <div className="drawer-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-handle" />
            <div className="drawer-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 600, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                🏷️ Add New Category
              </span>
              <button onClick={() => setIsCategoryDrawerOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
                &times;
              </button>
            </div>

            <form onSubmit={handleQuickAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                        transform: newCatColor === color ? 'scale(1.15)' : 'scale(1)',
                        transition: 'transform 0.15s ease',
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
                <button type="button" onClick={() => setIsCategoryDrawerOpen(false)} className="btn btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  Cancel
                </button>
                <SpecularButton
                  type="submit"
                  size="md"
                  radius={14}
                  lineColor="#818cf8"
                  baseColor="#4f46e5"
                  speed={0.85}
                  followMouse
                  autoAnimate
                  style={{ flex: 2 }}
                >
                  Save & Select
                </SpecularButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      {toast && <div className="toast">{toast}</div>}

    </div>
  );
}
