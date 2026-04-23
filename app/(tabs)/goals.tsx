import BottomNavigation from '@/components/bottom-navigation';
import PressableScale from '@/components/ui/pressable-scale';
import ProgressBar from '@/components/ui/progress-bar';
import ScreenFade from '@/components/ui/screen-fade';
import { Colors } from '@/constants/theme';
import { BrandPalette, formatPHP, useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const goalIcons: { icon: string; color: string }[] = [
  { icon: 'shield-check', color: BrandPalette.sage },
  { icon: 'laptop', color: BrandPalette.mocha },
  { icon: 'airplane', color: BrandPalette.amber },
  { icon: 'home', color: BrandPalette.coffee },
  { icon: 'car', color: BrandPalette.sienna },
  { icon: 'school', color: BrandPalette.tan },
  { icon: 'gift', color: BrandPalette.caramel },
  { icon: 'piggy-bank', color: BrandPalette.moss },
  { icon: 'sprout', color: BrandPalette.sage },
  { icon: 'leaf', color: BrandPalette.moss },
];

export default function GoalsScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const { goals, addGoal, updateGoal, deleteGoal, contributeToGoal } = useFinance();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [saved, setSaved] = useState('');
  const [iconIdx, setIconIdx] = useState(0);

  const [contributeId, setContributeId] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');

  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = goals.reduce((s, g) => s + g.target, 0);
  const overall = totalTarget > 0 ? totalSaved / totalTarget : 0;

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setTarget('');
    setSaved('');
    setIconIdx(0);
    setShowModal(true);
  };

  const openEdit = (id: string) => {
    const g = goals.find((x) => x.id === id);
    if (!g) return;
    setEditingId(id);
    setName(g.name);
    setTarget(String(g.target));
    setSaved(String(g.saved));
    const idx = goalIcons.findIndex((i) => i.icon === g.icon);
    setIconIdx(idx >= 0 ? idx : 0);
    setShowModal(true);
  };

  const save = () => {
    const t = Number(target);
    const s = Number(saved) || 0;
    if (!name.trim() || !t || t <= 0) return;
    const picked = goalIcons[iconIdx];
    if (editingId) {
      updateGoal(editingId, {
        name: name.trim(),
        target: t,
        saved: s,
        icon: picked.icon,
        color: picked.color,
      });
    } else {
      addGoal({
        name: name.trim(),
        target: t,
        saved: s,
        icon: picked.icon,
        color: picked.color,
      });
    }
    setShowModal(false);
  };

  const contribute = () => {
    const amount = Number(contributeAmount);
    if (!contributeId || !amount) return;
    contributeToGoal(contributeId, amount);
    setContributeId(null);
    setContributeAmount('');
  };

  // Tab-specific accent: soft sage
  const tabBg = '#E8EFE2';
  const summaryBg = BrandPalette.sage;
  const summaryText = '#FFF6EA';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tabBg }]}>
      <ScreenFade>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Savings Goals</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Keep your dreams on track</Text>
        </View>
        <PressableScale style={[styles.addBtn, { backgroundColor: BrandPalette.moss }]} onPress={openAdd}>
          <MaterialCommunityIcons name="plus" size={22} color="white" />
        </PressableScale>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.summaryCard, { backgroundColor: summaryBg, borderColor: BrandPalette.moss }]}>
          <Text style={[styles.summaryLabel, { color: 'rgba(255,246,234,0.85)' }]}>Total saved toward goals</Text>
          <Text style={[styles.summaryAmount, { color: summaryText }]}>
            {formatPHP(totalSaved)} <Text style={[styles.summaryOf, { color: 'rgba(255,246,234,0.85)' }]}>/ {formatPHP(totalTarget)}</Text>
          </Text>
          <ProgressBar value={overall} color={BrandPalette.mint} height={10} />
          <Text style={[styles.summaryPct, { color: 'rgba(255,246,234,0.85)' }]}>
            {Math.round(overall * 100)}% complete
          </Text>
        </View>

        {goals.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="target" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No goals yet</Text>
            <Text style={[styles.emptyHint, { color: colors.textTertiary }]}>Add a savings goal to visualize your progress</Text>
          </View>
        ) : (
          goals.map((g) => {
            const pct = g.target > 0 ? g.saved / g.target : 0;
            return (
              <View key={g.id} style={[styles.card, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardLeft}>
                    <View style={[styles.iconBox, { backgroundColor: g.color + '20' }]}>
                      <MaterialCommunityIcons name={g.icon as any} size={22} color={g.color} />
                    </View>
                    <View>
                      <Text style={[styles.cardTitle, { color: colors.text }]}>{g.name}</Text>
                      <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                        {formatPHP(Math.max(0, g.target - g.saved))} to go
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.cardPct, { color: g.color }]}>{Math.round(pct * 100)}%</Text>
                </View>

                <ProgressBar value={pct} color={g.color} height={10} />

                <Text style={[styles.cardAmount, { color: colors.text }]}>
                  {formatPHP(g.saved)} / {formatPHP(g.target)}
                </Text>

                <View style={styles.cardActions}>
                  <PressableScale
                    onPress={() => setContributeId(g.id)}
                    style={[styles.smallBtn, { backgroundColor: g.color }]}
                  >
                    <MaterialCommunityIcons name="plus" size={16} color="white" />
                    <Text style={styles.smallBtnText}>Add Savings</Text>
                  </PressableScale>
                  <PressableScale
                    onPress={() => openEdit(g.id)}
                    style={[styles.smallBtn, { backgroundColor: colors.backgroundTertiary }]}
                  >
                    <MaterialCommunityIcons name="pencil" size={16} color={colors.text} />
                    <Text style={[styles.smallBtnText, { color: colors.text }]}>Edit</Text>
                  </PressableScale>
                  <Pressable
                    onPress={() => deleteGoal(g.id)}
                    style={[styles.iconBtn, { backgroundColor: colors.dangerLight }]}
                  >
                    <MaterialCommunityIcons name="trash-can-outline" size={18} color={colors.danger} />
                  </Pressable>
                </View>
              </View>
            );
          })
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
      </ScreenFade>

      {/* Add/Edit goal */}
      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowModal(false)}>
          <Pressable style={[styles.modalCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{editingId ? 'Edit Goal' : 'New Goal'}</Text>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="e.g. Emergency Fund"
              placeholderTextColor={colors.textTertiary}
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Icon</Text>
            <View style={styles.iconGrid}>
              {goalIcons.map((ic, i) => {
                const active = i === iconIdx;
                return (
                  <Pressable
                    key={ic.icon}
                    onPress={() => setIconIdx(i)}
                    style={[
                      styles.iconChoice,
                      {
                        backgroundColor: active ? ic.color + '30' : colors.backgroundSecondary,
                        borderColor: active ? ic.color : colors.border,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons name={ic.icon as any} size={22} color={ic.color} />
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Target (PHP)</Text>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                  placeholder="30000"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="numeric"
                  value={target}
                  onChangeText={setTarget}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Saved (PHP)</Text>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, color: colors.text }]}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="numeric"
                  value={saved}
                  onChangeText={setSaved}
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <Pressable style={[styles.modalBtn, { borderColor: colors.border }]} onPress={() => setShowModal(false)}>
                <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={save}
              >
                <Text style={[styles.modalBtnText, { color: 'white' }]}>{editingId ? 'Save' : 'Add'}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Contribute */}
      <Modal
        visible={contributeId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setContributeId(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setContributeId(null)}>
          <Pressable style={[styles.modalCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add to Goal</Text>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Amount (PHP)</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="500"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={contributeAmount}
              onChangeText={setContributeAmount}
            />
            <Text style={[styles.hint, { color: colors.textTertiary }]}>
              Tip: use a negative amount to withdraw from this goal.
            </Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, { borderColor: colors.border }]}
                onPress={() => setContributeId(null)}
              >
                <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: colors.primary, borderColor: colors.primary }]}
                onPress={contribute}
              >
                <Text style={[styles.modalBtnText, { color: 'white' }]}>Confirm</Text>
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
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  cardSubtitle: { fontSize: 12, marginTop: 2, fontWeight: '600' },
  cardAmount: { fontSize: 13, fontWeight: '700' },
  cardPct: { fontSize: 16, fontWeight: '800' },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 6 },
  smallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  smallBtnText: { color: 'white', fontSize: 12, fontWeight: '700' },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
    gap: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  row: { flexDirection: 'row', gap: 10 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iconChoice: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
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
  hint: { fontSize: 12, fontStyle: 'italic' },
});
