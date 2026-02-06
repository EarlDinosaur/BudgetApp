import BottomNavigation from '@/components/bottom-navigation';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const [expandedBudget, setExpandedBudget] = useState<string | null>(null);

  const categoryIcons = [
    { icon: 'currency-usd', label: 'Cash', amount: '₱9,319.09', color: colors.accent },
    { icon: 'office-building', label: 'GoTyme', amount: '₱9,761.51', color: colors.primary },
  ];

  const expenses = [
    { icon: 'car', label: 'Transport', amount: '- ₱125.00' },
    { icon: 'silverware-fork-knife', label: 'Food (Bank)', amount: '- ₱2,008.00' },
    { icon: 'shopping', label: 'Shopping', amount: '- ₱550.00' },
  ];

  const budgetBreakdowns = [
    {
      id: 'budget',
      title: 'Budget Allocation',
      total: '₱3,000.00',
      icon: 'wallet',
      items: [
        { label: 'Necessary', tag: '50%', amount: '₱1,500.00', color: colors.primary },
        { label: 'Fun', tag: '30%', amount: '₱900.00', color: colors.accent },
        { label: 'Emergency', tag: '20%', amount: '₱800.00', color: colors.warning },
      ]
    },
    {
      id: 'salary',
      title: 'Salary Allocation',
      total: '₱9,320.12',
      icon: 'briefcase',
      items: [
        { label: 'Necessary', tag: '50%', amount: '₱4,680.06', color: colors.primary },
        { label: 'Fun', tag: '30%', amount: '₱2,788.03', color: colors.accent },
        { label: 'Emergency', tag: '20%', amount: '₱1,844.02', color: colors.warning },
      ]
    },
    {
      id: 'gotyme-savings',
      title: 'GoTyme Savings',
      total: '₱9,885.88',
      icon: 'bank',
      items: [
        { label: 'Initial Amount', tag: 'BALANCE', amount: '₱7,934.88', color: colors.primary },
        { label: 'To be Deposited', tag: 'PENDING', amount: '₱1,951.21', color: colors.accent },
        { label: 'Interest Gained', tag: 'EARNED', amount: '₱0.00', color: colors.warning },
      ]
    },
    {
      id: 'gotyme-wallet',
      title: 'GoTyme Wallet',
      total: '₱392.39',
      icon: 'phone-android',
      items: [
        { label: 'Initial Amount', tag: 'BALANCE', amount: '₱588.39', color: colors.primary },
        { label: 'Cloud Subscription', tag: 'EXPENSE', amount: '₱49.00', color: colors.danger },
        { label: 'Apple Music', tag: 'EXPENSE', amount: '₱78.00', color: colors.danger },
      ]
    },
    {
      id: 'rcbc-savings',
      title: 'RCBC Savings',
      total: '₱20,365.27',
      icon: 'vault',
      items: [
        { label: 'Initial Amount', tag: 'BALANCE', amount: '₱4,322.81', color: colors.primary },
        { label: 'To be Deposited', tag: 'PENDING', amount: '₱2,464.02', color: colors.accent },
        { label: 'Money Cooking', tag: 'EARNING', amount: '₱4,250.22', color: colors.warning },
        { label: 'Cash Safekeeping', tag: 'LOCKED', amount: '₱9,328.34', color: colors.primary },
      ]
    }
  ];

  const toggleBudget = (id: string) => {
    setExpandedBudget(expandedBudget === id ? null : id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { borderColor: colors.border }]}>
              <MaterialCommunityIcons name="currency-usd" size={28} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.greeting, { color: colors.text }]}>Good Morning</Text>
              <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>Have a great day!</Text>
            </View>
          </View>
          <TouchableOpacity>
            <MaterialCommunityIcons name="bell" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Main Balance Card */}
        <View style={[styles.mainCard, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Total balance</Text>
            <MaterialCommunityIcons name="eye" size={18} color={colors.textSecondary} />
          </View>
          <View style={styles.balanceContainer}>
            <Text style={[styles.bigBalance, { color: colors.primary }]}>18,987.67</Text>
            <Text style={[styles.currency, { color: colors.textSecondary }]}>PHP</Text>
          </View>

          <View style={styles.actionButtons}>
            <Pressable style={[styles.actionBtn, { borderColor: colors.border }]}>
              <MaterialCommunityIcons name="plus" size={22} color={colors.primary} />
              <Text style={[styles.btnLabel, { color: colors.text }]}>Deposit</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, { borderColor: colors.border }]}>
              <MaterialCommunityIcons name="arrow-top-right" size={22} color={colors.primary} />
              <Text style={[styles.btnLabel, { color: colors.text }]}>Transfer</Text>
            </Pressable>
            <Pressable style={[styles.actionBtn, { borderColor: colors.border }]}>
              <MaterialCommunityIcons name="dots-horizontal" size={22} color={colors.primary} />
              <Text style={[styles.btnLabel, { color: colors.text }]}>More</Text>
            </Pressable>
          </View>
        </View>

        {/* Your Accounts Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Your Accounts</Text>
        <View style={styles.gridCards}>
          {categoryIcons.map((cat, idx) => {
            return (
              <TouchableOpacity 
                key={idx}
                style={[styles.miniCard, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
              >
                <View style={[styles.iconBox, { backgroundColor: cat.color + '20' }]}>
                  <MaterialCommunityIcons name={cat.icon as any} size={24} color={cat.color} />
                </View>
                <Text style={[styles.miniLabel, { color: colors.textSecondary }]}>{cat.label}</Text>
                <Text style={[styles.miniVal, { color: colors.text }]}>{cat.amount}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Recent Expenses Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Recent Expenses</Text>
        <View style={[styles.expenseList, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          {expenses.map((exp, idx) => {
            return (
              <View 
                key={idx}
                style={[
                  styles.expenseRow,
                  {
                    borderBottomColor: colors.divider,
                    borderBottomWidth: idx < expenses.length - 1 ? 1 : 0,
                  }
                ]}
              >
                <View style={styles.expLeft}>
                  <View style={[styles.expIconBox, { backgroundColor: colors.backgroundTertiary }]}>
                    <MaterialCommunityIcons name={exp.icon as any} size={20} color={colors.primary} />
                  </View>
                  <Text style={[styles.expName, { color: colors.text }]}>{exp.label}</Text>
                </View>
                <Text style={[styles.expAmount, { color: colors.danger }]}>{exp.amount}</Text>
              </View>
            );
          })}
        </View>

        {/* Financial Breakdown Section */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Financial Breakdown</Text>
        {budgetBreakdowns.map((breakdown) => (
          <View key={breakdown.id} style={styles.breakdownSection}>
            <Pressable
              style={[styles.breakdownHeader, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
              onPress={() => toggleBudget(breakdown.id)}
            >
              <View style={styles.headerContent}>
                <View style={[styles.headerIcon, { backgroundColor: colors.primaryLight }]}>
                  <MaterialCommunityIcons name={breakdown.icon as any} size={24} color={colors.primary} />
                </View>
                <View style={styles.headerText}>
                  <Text style={[styles.breakdownTitle, { color: colors.text }]}>{breakdown.title}</Text>
                  <Text style={[styles.breakdownTotal, { color: colors.primary }]}>{breakdown.total}</Text>
                </View>
              </View>
              <MaterialCommunityIcons 
                name={expandedBudget === breakdown.id ? 'chevron-up' : 'chevron-down'} 
                size={24} 
                color={colors.textSecondary} 
              />
            </Pressable>

            {expandedBudget === breakdown.id && (
              <View style={[styles.breakdownContent, { backgroundColor: colors.background, borderColor: colors.border }]}>
                {breakdown.items.map((item, idx) => (
                  <View key={idx}>
                    <View style={styles.breakdownItem}>
                      <View style={styles.itemLeft}>
                        <Text style={[styles.itemLabel, { color: colors.text }]}>{item.label}</Text>
                        <View style={[styles.tagBadge, { backgroundColor: item.color + '20' }]}>
                          <Text style={[styles.tagText, { color: item.color }]}>{item.tag}</Text>
                        </View>
                      </View>
                      <Text style={[styles.itemAmount, { color: item.color }]}>{item.amount}</Text>
                    </View>
                    {idx < breakdown.items.length - 1 && (
                      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
  },
  subGreeting: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  mainCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 28,
    borderWidth: 1,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 24,
  },
  bigBalance: {
    fontSize: 42,
    fontWeight: '700',
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    height: 72,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    paddingLeft: 2,
  },
  gridCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  miniCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  miniLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  miniVal: {
    fontSize: 16,
    fontWeight: '700',
  },
  expenseList: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  expLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expName: {
    fontSize: 14,
    fontWeight: '600',
  },
  expAmount: {
    fontWeight: '600',
    fontSize: 14,
  },
  bottomSpacer: {
    height: 120,
  },
  breakdownSection: {
    marginBottom: 12,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 14,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  breakdownTotal: {
    fontSize: 16,
    fontWeight: '800',
  },
  breakdownContent: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    padding: 16,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemLeft: {
    gap: 8,
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
});
