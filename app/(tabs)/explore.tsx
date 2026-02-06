import BottomNavigation from '@/components/bottom-navigation';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Expense {
  id: string;
  date: string;
  type: string;
  cash: string;
  maribank: string;
  beep?: string;
}

export default function ExpensesScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const [activeTab, setActiveTab] = useState<'transportation' | 'food' | 'other'>('transportation');
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    type: '',
    cash: '',
    maribank: '',
    beep: '',
  });

  // Sample data
  const [expenses, setExpenses] = useState<{
    transportation: Expense[];
    food: Expense[];
    other: Expense[];
  }>({
    transportation: [
      {
        id: '1',
        date: '2/1',
        type: 'LRT 2 RE - PU',
        cash: '',
        maribank: '',
        beep: '₱8.00',
      },
      {
        id: '2',
        date: '2/1',
        type: 'LRT 1 PJ - DJ',
        cash: '',
        maribank: '',
        beep: '₱17.00',
      },
      {
        id: '3',
        date: '2/2',
        type: 'Bus',
        cash: '₱32.00',
        maribank: '₱190.00',
        beep: '',
      },
      {
        id: '4',
        date: '2/3',
        type: 'Trike',
        cash: '₱20.00',
        maribank: '',
        beep: '',
      },
      {
        id: '5',
        date: '2/11',
        type: 'Jeep',
        cash: '₱13.00',
        maribank: '',
        beep: '',
      },
      {
        id: '6',
        date: '2/11',
        type: 'Bus',
        cash: '₱30.00',
        maribank: '',
        beep: '',
      },
      {
        id: '7',
        date: '2/15',
        type: 'LRT 1 PJ - DJ',
        cash: '',
        maribank: '',
        beep: '₱17.00',
      },
    ],
    food: [
      {
        id: '1',
        date: '2/1',
        type: 'Jollibee',
        cash: '',
        maribank: '₱374.00',
        beep: '',
      },
      {
        id: '2',
        date: '2/1',
        type: 'KKV',
        cash: '',
        maribank: '₱239.00',
        beep: '',
      },
      {
        id: '3',
        date: '2/2',
        type: 'San Mig',
        cash: '',
        maribank: '₱170.00',
        beep: '',
      },
      {
        id: '4',
        date: '2/2',
        type: 'Antonios',
        cash: '',
        maribank: '₱1,230.00',
        beep: '',
      },
      {
        id: '5',
        date: '2/3',
        type: 'Ramen Snack',
        cash: '',
        maribank: '₱95.00',
        beep: '',
      },
      {
        id: '6',
        date: '2/13',
        type: 'L/D',
        cash: '',
        maribank: '₱150.00',
        beep: '',
      },
      {
        id: '7',
        date: '2/15',
        type: 'L/D',
        cash: '',
        maribank: '₱150.00',
        beep: '',
      },
    ],
    other: [
      {
        id: '1',
        date: '2/3',
        type: 'DITO Palload',
        cash: '',
        maribank: '₱103.80',
        beep: '',
      },
      {
        id: '2',
        date: '2/7',
        type: 'WiFi',
        cash: '₱150.00',
        maribank: '',
        beep: '',
      },
      {
        id: '3',
        date: '2/15',
        type: 'Electricity',
        cash: '₱200.00',
        maribank: '',
        beep: '',
      },
      {
        id: '4',
        date: '2/28',
        type: 'Water Bill',
        cash: '₱200.00',
        maribank: '',
        beep: '',
      },
    ],
  });

  const currentExpenses = expenses[activeTab];

  const handleAddExpense = () => {
    if (formData.date && formData.type) {
      const newExpense: Expense = {
        id: Date.now().toString(),
        ...formData,
      };
      setExpenses({
        ...expenses,
        [activeTab]: [newExpense, ...currentExpenses],
      });
      setFormData({ date: '', type: '', cash: '', maribank: '', beep: '' });
      setShowForm(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses({
      ...expenses,
      [activeTab]: currentExpenses.filter(e => e.id !== id),
    });
  };

  const tabs = [
    { id: 'transportation', label: 'Transportation', icon: 'car' },
    { id: 'food', label: 'Food', icon: 'silverware-fork-knife' },
    { id: 'other', label: 'Other', icon: 'shopping' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Expenses</Text>
        <Pressable
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => setShowForm(!showForm)}
        >
          <MaterialCommunityIcons name={showForm ? 'close' : 'plus'} size={24} color="white" />
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: colors.backgroundSecondary }]}>
        {tabs.map(tab => (
          <Pressable
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && {
                borderBottomWidth: 3,
                borderBottomColor: colors.primary,
              },
            ]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <MaterialCommunityIcons
              name={tab.icon as any}
              size={20}
              color={activeTab === tab.id ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabLabel,
                {
                  color: activeTab === tab.id ? colors.primary : colors.textSecondary,
                  fontWeight: activeTab === tab.id ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Add Expense Form */}
      {showForm && (
        <View style={[styles.formContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.text }]}>Add New Expense</Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Date</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="e.g., 2/15"
              placeholderTextColor={colors.textTertiary}
              value={formData.date}
              onChangeText={text => setFormData({ ...formData, date: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Type/Description</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="e.g., Bus fare"
              placeholderTextColor={colors.textTertiary}
              value={formData.type}
              onChangeText={text => setFormData({ ...formData, type: text })}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Cash</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder="₱0.00"
                placeholderTextColor={colors.textTertiary}
                value={formData.cash}
                onChangeText={text => setFormData({ ...formData, cash: text })}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Maribank</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                placeholder="₱0.00"
                placeholderTextColor={colors.textTertiary}
                value={formData.maribank}
                onChangeText={text => setFormData({ ...formData, maribank: text })}
              />
            </View>

            {activeTab === 'transportation' && (
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Beep</Text>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                  placeholder="₱0.00"
                  placeholderTextColor={colors.textTertiary}
                  value={formData.beep}
                  onChangeText={text => setFormData({ ...formData, beep: text })}
                />
              </View>
            )}
          </View>

          <Pressable
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            onPress={handleAddExpense}
          >
            <Text style={styles.submitBtnText}>Add Expense</Text>
          </Pressable>
        </View>
      )}

      {/* Expenses List */}
      <ScrollView style={styles.expensesList}>
        {currentExpenses.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="inbox" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No expenses yet</Text>
          </View>
        ) : (
          currentExpenses.map(expense => (
            <View
              key={expense.id}
              style={[styles.expenseCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
            >
              <View style={styles.expenseHeader}>
                <View>
                  <Text style={[styles.expenseDate, { color: colors.textSecondary }]}>{expense.date}</Text>
                  <Text style={[styles.expenseType, { color: colors.text }]}>{expense.type}</Text>
                </View>
                <Pressable onPress={() => handleDeleteExpense(expense.id)}>
                  <MaterialCommunityIcons name="trash-can" size={20} color={colors.danger} />
                </Pressable>
              </View>

              <View style={styles.expenseDetails}>
                {expense.cash && (
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Cash</Text>
                    <Text style={[styles.detailValue, { color: colors.primary }]}>{expense.cash}</Text>
                  </View>
                )}
                {expense.maribank && (
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Maribank</Text>
                    <Text style={[styles.detailValue, { color: colors.accent }]}>{expense.maribank}</Text>
                  </View>
                )}
                {expense.beep && (
                  <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Beep</Text>
                    <Text style={[styles.detailValue, { color: colors.warning }]}>{expense.beep}</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 24,
    borderBottomWidth: 1,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabLabel: {
    fontSize: 14,
  },
  formContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  submitBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  expensesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  expenseCard: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  expenseDate: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  expenseType: {
    fontSize: 14,
    fontWeight: '600',
  },
  expenseDetails: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  detailItem: {
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
  },
});
