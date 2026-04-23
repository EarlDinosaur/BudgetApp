/**
 * Central finance state for the app.
 *
 * Keeps accounts, transactions, budgets, goals, and categories in one
 * place so every screen can read/update the same data without plumbing
 * props around.
 *
 * State is persisted to AsyncStorage so data survives app restarts.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

export type AccountType = 'cash' | 'bank' | 'card' | 'wallet';
export type TxType = 'income' | 'expense';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  icon: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TxType;
}

export interface Transaction {
  id: string;
  accountId: string;
  categoryId: string;
  amount: number;
  note?: string;
  date: string; // ISO date string
  type: TxType;
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number; // monthly limit
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  icon: string;
  color: string;
  dueDate?: string;
}

interface FinanceContextValue {
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];

  isHydrated: boolean;

  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;

  addAccount: (data: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, data: Partial<Account>) => void;
  deleteAccount: (id: string) => void;

  addTransaction: (data: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  addBudget: (data: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, data: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getBudgetSpent: (categoryId: string, monthKey?: string) => number;

  // History helpers. monthKey format: "YYYY-MM"
  getMonthKey: (date?: string | Date) => string;
  getAvailableMonths: () => string[];
  getTransactionsForMonth: (monthKey: string) => Transaction[];
  getMonthSummary: (monthKey: string) => { income: number; expense: number; net: number };

  addGoal: (data: Omit<Goal, 'id' | 'saved'> & { saved?: number }) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;

  getCategory: (id: string) => Category | undefined;
  getAccount: (id: string) => Account | undefined;

  resetToSeed: () => void;
  clearAll: () => void;
}

const STORAGE_KEY = '@budgetapp/finance-state-v1';

interface PersistedState {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString();

/**
 * Brand palette — every color used by accounts, categories, and goals
 * must come from here so the app stays consistent (brown + cream).
 */
export const BrandPalette = {
  // Warm browns
  mocha: '#8B5E4C',
  terracotta: '#A67054',
  tan: '#B89070',
  coffee: '#704A3B',
  sienna: '#9B6B55',
  caramel: '#C08B5C',
  amber: '#E8B04B',
  khaki: '#A28876',
  // Soft sage greens — nature / growth / income accents
  sage: '#8FA885',
  moss: '#6B8A6B',
  mint: '#D4E0CE',
};

const seedAccounts: Account[] = [
  { id: 'acc-cash', name: 'Cash', type: 'cash', balance: 9319.09, icon: 'cash', color: BrandPalette.sage },
  { id: 'acc-gotyme', name: 'GoTyme', type: 'bank', balance: 9761.51, icon: 'bank', color: BrandPalette.mocha },
  { id: 'acc-maribank', name: 'Maribank', type: 'wallet', balance: 5420.0, icon: 'wallet', color: BrandPalette.coffee },
];

const seedCategories: Category[] = [
  { id: 'cat-food', name: 'Food', icon: 'silverware-fork-knife', color: BrandPalette.terracotta, type: 'expense' },
  { id: 'cat-transport', name: 'Transport', icon: 'car', color: BrandPalette.mocha, type: 'expense' },
  { id: 'cat-shopping', name: 'Shopping', icon: 'shopping', color: BrandPalette.tan, type: 'expense' },
  { id: 'cat-bills', name: 'Bills', icon: 'receipt', color: BrandPalette.coffee, type: 'expense' },
  { id: 'cat-entertainment', name: 'Entertainment', icon: 'movie-open', color: BrandPalette.sienna, type: 'expense' },
  { id: 'cat-salary', name: 'Salary', icon: 'briefcase', color: BrandPalette.sage, type: 'income' },
  { id: 'cat-gift', name: 'Gift', icon: 'gift', color: BrandPalette.caramel, type: 'income' },
];

const seedTransactions: Transaction[] = [
  { id: uid(), accountId: 'acc-gotyme', categoryId: 'cat-food', amount: 2008, note: 'Jollibee + KKV', date: today(), type: 'expense' },
  { id: uid(), accountId: 'acc-cash', categoryId: 'cat-transport', amount: 125, note: 'LRT + Jeep', date: today(), type: 'expense' },
  { id: uid(), accountId: 'acc-gotyme', categoryId: 'cat-shopping', amount: 550, note: 'Clothes', date: today(), type: 'expense' },
  { id: uid(), accountId: 'acc-gotyme', categoryId: 'cat-salary', amount: 18000, note: 'Monthly salary', date: today(), type: 'income' },
];

const seedBudgets: Budget[] = [
  { id: uid(), categoryId: 'cat-food', limit: 5000 },
  { id: uid(), categoryId: 'cat-transport', limit: 1500 },
  { id: uid(), categoryId: 'cat-shopping', limit: 2000 },
  { id: uid(), categoryId: 'cat-bills', limit: 3000 },
];

const seedGoals: Goal[] = [
  { id: uid(), name: 'Emergency Fund', target: 30000, saved: 12500, icon: 'shield-check', color: BrandPalette.sage },
  { id: uid(), name: 'New Laptop', target: 55000, saved: 18000, icon: 'laptop', color: BrandPalette.mocha },
  { id: uid(), name: 'Travel', target: 25000, saved: 4500, icon: 'airplane', color: BrandPalette.moss },
];

/**
 * Maps any legacy multi-color hex (blue/green/purple/etc.) to the
 * closest shade in the brown palette. Runs during hydration so old
 * accounts/goals/categories from previous builds become consistent.
 */
const LEGACY_COLOR_MAP: Record<string, string> = {
  // Greens → soft sage
  '#10B981': BrandPalette.sage,
  '#34D399': BrandPalette.sage,
  '#22C55E': BrandPalette.sage,
  '#059669': BrandPalette.moss,
  // Blues → mocha
  '#3B82F6': BrandPalette.mocha,
  '#60A5FA': BrandPalette.mocha,
  // Purples → deep coffee
  '#8B5CF6': BrandPalette.coffee,
  '#A78BFA': BrandPalette.coffee,
  // Pinks / reds → warm terracotta / coffee
  '#EC4899': BrandPalette.terracotta,
  '#F472B6': BrandPalette.caramel,
  '#EF4444': BrandPalette.coffee,
  '#F87171': BrandPalette.coffee,
  '#FB7185': BrandPalette.terracotta,
  // Oranges / yellows → amber
  '#F59E0B': BrandPalette.amber,
  '#FBBF24': BrandPalette.amber,
  '#F97316': BrandPalette.amber,
  // Cyans / teals → sienna or moss
  '#06B6D4': BrandPalette.moss,
  '#14B8A6': BrandPalette.moss,
};

function normalizeBrandColor(color: string | undefined): string {
  if (!color) return BrandPalette.mocha;
  const upper = color.toUpperCase();
  return LEGACY_COLOR_MAP[upper] ?? color;
}

function migrateColors<T extends { color: string }>(items: T[]): T[] {
  return items.map((i) => ({ ...i, color: normalizeBrandColor(i.color) }));
}

/**
 * Accounts get an extra tweak on top of the standard palette migration:
 * amber is reserved as a Home-quick-action accent, so any stored account
 * that's still amber (from older builds) is re-mapped to khaki for a
 * cleaner, less orange look on the Cards screen.
 */
function migrateAccounts(items: Account[]): Account[] {
  return migrateColors(items).map((a) =>
    a.color.toUpperCase() === BrandPalette.amber.toUpperCase()
      ? { ...a, color: BrandPalette.khaki }
      : a
  );
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(seedAccounts);
  const [categories] = useState<Category[]>(seedCategories);
  const [transactions, setTransactions] = useState<Transaction[]>(seedTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(seedBudgets);
  const [goals, setGoals] = useState<Goal[]>(seedGoals);
  const [isHydrated, setIsHydrated] = useState(false);
  const hydratedRef = useRef(false);

  // Load persisted state on mount.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && raw) {
          const parsed = JSON.parse(raw) as Partial<PersistedState>;
          if (parsed.accounts) setAccounts(migrateAccounts(parsed.accounts));
          if (parsed.transactions) setTransactions(parsed.transactions);
          if (parsed.budgets) setBudgets(parsed.budgets);
          if (parsed.goals) setGoals(migrateColors(parsed.goals));
        }
      } catch (err) {
        console.warn('Failed to load finance state:', err);
      } finally {
        if (!cancelled) {
          hydratedRef.current = true;
          setIsHydrated(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Save to AsyncStorage whenever data changes (after first hydration).
  useEffect(() => {
    if (!hydratedRef.current) return;
    const payload: PersistedState = { accounts, transactions, budgets, goals };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch((err) =>
      console.warn('Failed to save finance state:', err)
    );
  }, [accounts, transactions, budgets, goals]);

  const getCategory = useCallback(
    (id: string) => categories.find((c) => c.id === id),
    [categories]
  );

  const getAccount = useCallback(
    (id: string) => accounts.find((a) => a.id === id),
    [accounts]
  );

  const addAccount = useCallback((data: Omit<Account, 'id'>) => {
    setAccounts((prev) => [...prev, { ...data, id: uid() }]);
  }, []);

  const updateAccount = useCallback((id: string, data: Partial<Account>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
  }, []);

  const deleteAccount = useCallback((id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addTransaction = useCallback((data: Omit<Transaction, 'id'>) => {
    const tx: Transaction = { ...data, id: uid() };
    setTransactions((prev) => [tx, ...prev]);
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id !== tx.accountId) return acc;
        const delta = tx.type === 'income' ? tx.amount : -tx.amount;
        return { ...acc, balance: acc.balance + delta };
      })
    );
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => {
      const tx = prev.find((t) => t.id === id);
      if (tx) {
        setAccounts((accs) =>
          accs.map((acc) => {
            if (acc.id !== tx.accountId) return acc;
            const delta = tx.type === 'income' ? -tx.amount : tx.amount;
            return { ...acc, balance: acc.balance + delta };
          })
        );
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const addBudget = useCallback((data: Omit<Budget, 'id'>) => {
    setBudgets((prev) => [...prev, { ...data, id: uid() }]);
  }, []);

  const updateBudget = useCallback((id: string, data: Partial<Budget>) => {
    setBudgets((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const getMonthKey = useCallback((date?: string | Date) => {
    const d = date ? new Date(date) : new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, []);

  const getBudgetSpent = useCallback(
    (categoryId: string, monthKey?: string) => {
      const key = monthKey ?? getMonthKey();
      return transactions
        .filter(
          (t) =>
            t.type === 'expense' &&
            t.categoryId === categoryId &&
            getMonthKey(t.date) === key
        )
        .reduce((sum, t) => sum + t.amount, 0);
    },
    [transactions, getMonthKey]
  );

  const getAvailableMonths = useCallback(() => {
    const set = new Set<string>();
    set.add(getMonthKey()); // always include current
    transactions.forEach((t) => set.add(getMonthKey(t.date)));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [transactions, getMonthKey]);

  const getTransactionsForMonth = useCallback(
    (monthKey: string) =>
      transactions
        .filter((t) => getMonthKey(t.date) === monthKey)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions, getMonthKey]
  );

  const getMonthSummary = useCallback(
    (monthKey: string) => {
      let income = 0;
      let expense = 0;
      transactions.forEach((t) => {
        if (getMonthKey(t.date) !== monthKey) return;
        if (t.type === 'income') income += t.amount;
        else expense += t.amount;
      });
      return { income, expense, net: income - expense };
    },
    [transactions, getMonthKey]
  );

  const addGoal = useCallback((data: Omit<Goal, 'id' | 'saved'> & { saved?: number }) => {
    setGoals((prev) => [...prev, { saved: 0, ...data, id: uid() }]);
  }, []);

  const updateGoal = useCallback((id: string, data: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const contributeToGoal = useCallback((id: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, saved: Math.max(0, g.saved + amount) } : g
      )
    );
  }, []);

  const resetToSeed = useCallback(() => {
    setAccounts(seedAccounts);
    setTransactions(seedTransactions);
    setBudgets(seedBudgets);
    setGoals(seedGoals);
  }, []);

  const clearAll = useCallback(() => {
    setAccounts([]);
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
  }, []);

  const { totalBalance, monthlyIncome, monthlyExpense } = useMemo(() => {
    const balance = accounts.reduce((sum, a) => sum + a.balance, 0);
    const now = new Date();
    let income = 0;
    let expense = 0;
    transactions.forEach((t) => {
      const d = new Date(t.date);
      if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return;
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return { totalBalance: balance, monthlyIncome: income, monthlyExpense: expense };
  }, [accounts, transactions]);

  const value: FinanceContextValue = {
    accounts,
    categories,
    transactions,
    budgets,
    goals,
    isHydrated,
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    addAccount,
    updateAccount,
    deleteAccount,
    addTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetSpent,
    getMonthKey,
    getAvailableMonths,
    getTransactionsForMonth,
    getMonthSummary,
    addGoal,
    updateGoal,
    deleteGoal,
    contributeToGoal,
    getCategory,
    getAccount,
    resetToSeed,
    clearAll,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinance must be used inside FinanceProvider');
  return ctx;
}

export function formatPHP(value: number) {
  return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Converts "YYYY-MM" into a friendly label like "March 2026". */
export function formatMonthLabel(monthKey: string) {
  const [y, m] = monthKey.split('-').map(Number);
  if (!y || !m) return monthKey;
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
