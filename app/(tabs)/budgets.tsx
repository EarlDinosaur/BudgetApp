import BottomNavigation from '@/components/bottom-navigation';
import PressableScale from '@/components/ui/pressable-scale';
import ProgressBar from '@/components/ui/progress-bar';
import ScreenFade from '@/components/ui/screen-fade';
import { Colors } from '@/constants/theme';
import { BrandPalette, formatPHP, useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BudgetsScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const {
    budgets,
    categories,
    getCategory,
    getBudgetSpent,
    addBudget,
    updateBudget,
    deleteBudget,
  } = useFinance();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [limitInput, setLimitInput] = useState('');

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === 'expense'),
    [categories]
  );

  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + getBudgetSpent(b.categoryId), 0);
  const overallPct = totalLimit > 0 ? totalSpent / totalLimit : 0;

  const openAdd = () => {
    setEditingId(null);
    setSelectedCategoryId(expenseCategories[0]?.id ?? '');
    setLimitInput('');
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    const b = budgets.find((x) => x.id === id);
    if (!b) return;
    setEditingId(id);
    setSelectedCategoryId(b.categoryId);
    setLimitInput(String(b.limit));
    setShowModal(true);
  };

  const save = () => {
    const limit = Number(limitInput);
    if (!selectedCategoryId || !limit || limit <= 0) return;
    if (editingId) {
      updateBudget(editingId, { categoryId: selectedCategoryId, limit });
    } else {
      addBudget({ categoryId: selectedCategoryId, limit });
    }
    setShowModal(false);
  };

  // Tab-specific accent: warm brown
  const tabBg = '#F2E4D2';
  const summaryBg = BrandPalette.mocha;
  const summaryText = '#FFF6EA';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tabBg }]}>
      <ScreenFade>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Budgets</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Track your monthly spending limits</Text>
        </View>
        <PressableScale style={[styles.addBtn, { backgroundColor: colors.primary }]} onPress={openAdd}>
          <MaterialCommunityIcons name="plus" size={22} color="white" />
        </PressableScale>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Overall summary */}
        <View style={[styles.summaryCard, { backgroundColor: summaryBg, borderColor: BrandPalette.coffee }]}>
          <Text style={[styles.summaryLabel, { color: 'rgba(255,246,234,0.85)' }]}>Monthly budget used</Text>
          <Text style={[styles.summaryAmount, { color: summaryText }]}>
            {formatPHP(totalSpent)} <Text style={[styles.summaryOf, { color: 'rgba(255,246,234,0.85)' }]}>/ {formatPHP(totalLimit)}</Text>
          </Text>
          <ProgressBar value={overallPct} color={overallPct >= 1 ? colors.danger : BrandPalette.amber} height={10} />
          <Text style={[styles.summaryPct, { color: overallPct >= 1 ? '#FFD7C8' : 'rgba(255,246,234,0.85)' }]}>
            {Math.round(overallPct * 100)}% used
          </Text>
        </View>

        {budgets.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="chart-pie" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No budgets yet</Text>
            <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>Tap + to set a monthly limit per category</Text>
          </View>
        ) : (
          budgets.map((b) => {
            const cat = getCategory(b.categoryId);
            const spent = getBudgetSpent(b.categoryId);
            const pct = b.limit > 0 ? spent / b.limit : 0;
            const over = spent > b.limit;
            const remaining = b.limit - spent;
            return (
              <PressableScale
                key={b.id}
                onPress={() => openEdit(b.id)}
                style={[styles.card, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardLeft}>
                    <View style={[styles.iconBox, { backgroundColor: (cat?.color ?? colors.primary) + '20' }]}>
                      <MaterialCommunityIcons name={(cat?.icon as any) ?? 'tag'} size={20} color={cat?.color ?? colors.primary} />
                    </View>
                    <View>
                      <Text style={[styles.cardTitle, { color: colors.text }]}>{cat?.name ?? 'Category'}</Text>
                      <Text style={[styles.cardSubtitle, { color: over ? colors.danger : colors.textSecondary }]}>
                        {over ? `Over by ${formatPHP(-remaining)}` : `${formatPHP(Math.max(remaining, 0))} left`}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation?.();
                      deleteBudget(b.id);
                    }}
                    hitSlop={10}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={20} color={colors.danger} />
                  </Pressable>
                </View>

                <Text style={[styles.cardAmount, { color: colors.text }]}>
                  {formatPHP(spent)} / {formatPHP(b.limit)}
                </Text>
                <ProgressBar value={pct} color={over ? colors.danger : cat?.color ?? colors.primary} />
              </PressableScale>
            );
          })
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
      </ScreenFade>

      {/* Add/Edit Modal */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowModal(false)}>
          <Pressable style={[styles.modalCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{editingId ? 'Edit Budget' : 'New Budget'}</Text>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {expenseCategories.map((c) => {
                const active = c.id === selectedCategoryId;
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => setSelectedCategoryId(c.id)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? c.color + '30' : colors.backgroundSecondary,
                        borderColor: active ? c.color : colors.border,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons name={c.icon as any} size={16} color={c.color} />
                    <Text style={[styles.chipText, { color: active ? c.color : colors.text }]}>{c.name}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Monthly Limit (PHP)</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="e.g. 5000"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={limitInput}
              onChangeText={setLimitInput}
            />

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, { borderColor: colors.border }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={save}
              >
                <Text style={[styles.modalBtnText, { color: 'white' }]}>
                  {editingId ? 'Save' : 'Add'}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <BottomNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  headerSubtitle: { fontSize: 13, marginTop: 2 },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  summaryLabel: { fontSize: 12, fontWeight: '600' },
  summaryAmount: { fontSize: 22, fontWeight: '800' },
  summaryOf: { fontSize: 14, fontWeight: '600' },
  summaryPct: { fontSize: 12, fontWeight: '700' },
  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardSubtitle: { fontSize: 12, marginTop: 2, fontWeight: '600' },
  cardAmount: { fontSize: 13, fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '700' },
  emptyHint: { fontSize: 12, textAlign: 'center', paddingHorizontal: 40 },
  bottomSpacer: { height: 120 },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  chipRow: { gap: 8, paddingVertical: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { fontSize: 12, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalBtnText: { fontSize: 14, fontWeight: '700' },
});
