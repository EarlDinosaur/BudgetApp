import { Colors } from '@/constants/theme';
import { formatMonthLabel, formatPHP, useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const {
    getAvailableMonths,
    getMonthSummary,
    getTransactionsForMonth,
    getBudgetSpent,
    getCategory,
    getAccount,
    budgets,
  } = useFinance();

  const months = useMemo(() => getAvailableMonths(), [getAvailableMonths]);
  const [selected, setSelected] = useState<string>(months[0] ?? '');

  const summary = selected ? getMonthSummary(selected) : { income: 0, expense: 0, net: 0 };
  const txs = selected ? getTransactionsForMonth(selected) : [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Month selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.monthRow}
      >
        {months.map((m) => {
          const active = m === selected;
          return (
            <Pressable
              key={m}
              onPress={() => setSelected(m)}
              style={[
                styles.monthChip,
                {
                  backgroundColor: active ? colors.primary : colors.backgroundSecondary,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.monthChipText, { color: active ? 'white' : colors.text }]}>
                {formatMonthLabel(m)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Monthly summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>{formatMonthLabel(selected)}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="arrow-down-circle" size={18} color={colors.accent} />
              <View>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Income</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPHP(summary.income)}</Text>
              </View>
            </View>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="arrow-up-circle" size={18} color={colors.danger} />
              <View>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Expense</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{formatPHP(summary.expense)}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.netRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Net this month</Text>
            <Text
              style={[
                styles.netValue,
                { color: summary.net >= 0 ? colors.accent : colors.danger },
              ]}
            >
              {summary.net >= 0 ? '+' : '-'} {formatPHP(Math.abs(summary.net))}
            </Text>
          </View>
        </View>

        {/* Budgets for that month */}
        {budgets.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Budget usage</Text>
            <View style={[styles.panel, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
              {budgets.map((b, i) => {
                const cat = getCategory(b.categoryId);
                const spent = getBudgetSpent(b.categoryId, selected);
                const over = spent > b.limit;
                return (
                  <View
                    key={b.id}
                    style={[
                      styles.budgetRow,
                      i < budgets.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: 1 },
                    ]}
                  >
                    <View style={styles.budgetLeft}>
                      <View style={[styles.miniIcon, { backgroundColor: (cat?.color ?? colors.primary) + '20' }]}>
                        <MaterialCommunityIcons name={(cat?.icon as any) ?? 'tag'} size={16} color={cat?.color ?? colors.primary} />
                      </View>
                      <Text style={[styles.budgetName, { color: colors.text }]}>{cat?.name ?? 'Other'}</Text>
                    </View>
                    <Text style={[styles.budgetValue, { color: over ? colors.danger : colors.text }]}>
                      {formatPHP(spent)} / {formatPHP(b.limit)}
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Transactions */}
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Transactions ({txs.length})
        </Text>
        <View style={[styles.panel, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
          {txs.length === 0 ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="calendar-blank" size={32} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions this month</Text>
            </View>
          ) : (
            txs.map((tx, i) => {
              const cat = getCategory(tx.categoryId);
              const acc = getAccount(tx.accountId);
              const sign = tx.type === 'income' ? '+' : '-';
              const color = tx.type === 'income' ? colors.accent : colors.danger;
              const day = new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              return (
                <View
                  key={tx.id}
                  style={[
                    styles.txRow,
                    i < txs.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: 1 },
                  ]}
                >
                  <View style={styles.txLeft}>
                    <View style={[styles.miniIcon, { backgroundColor: (cat?.color ?? colors.primary) + '20' }]}>
                      <MaterialCommunityIcons name={(cat?.icon as any) ?? 'cash'} size={16} color={cat?.color ?? colors.primary} />
                    </View>
                    <View>
                      <Text style={[styles.txName, { color: colors.text }]}>{cat?.name ?? 'Other'}</Text>
                      <Text style={[styles.txMeta, { color: colors.textTertiary }]}>
                        {day}{acc ? ` · ${acc.name}` : ''}{tx.note ? ` · ${tx.note}` : ''}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.txAmount, { color }]}>{sign} {formatPHP(tx.amount)}</Text>
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  monthRow: { gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  monthChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  monthChipText: { fontSize: 13, fontWeight: '700' },
  scroll: { flex: 1, paddingHorizontal: 20 },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 16,
  },
  summaryTitle: { fontSize: 16, fontWeight: '800' },
  summaryRow: { flexDirection: 'row', gap: 16 },
  summaryItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  summaryLabel: { fontSize: 11, fontWeight: '600' },
  summaryValue: { fontSize: 15, fontWeight: '800' },
  netRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  netValue: { fontSize: 16, fontWeight: '800' },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 8,
    marginTop: 4,
  },
  panel: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  budgetLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetName: { fontSize: 13, fontWeight: '600' },
  budgetValue: { fontSize: 12, fontWeight: '700' },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  txName: { fontSize: 13, fontWeight: '700' },
  txMeta: { fontSize: 11, marginTop: 2 },
  txAmount: { fontSize: 13, fontWeight: '800' },
  empty: { padding: 30, alignItems: 'center', gap: 6 },
  emptyText: { fontSize: 13, fontWeight: '500' },
});
