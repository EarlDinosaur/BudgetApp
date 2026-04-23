import BottomNavigation from '@/components/bottom-navigation';
import PressableScale from '@/components/ui/pressable-scale';
import ScreenFade from '@/components/ui/screen-fade';
import { Colors } from '@/constants/theme';
import { Account, AccountType, BrandPalette, formatPHP, useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const typeOptions: { type: AccountType; label: string; icon: string; color: string }[] = [
  { type: 'cash', label: 'Cash', icon: 'cash', color: BrandPalette.sage },
  { type: 'bank', label: 'Bank', icon: 'bank', color: BrandPalette.mocha },
  { type: 'card', label: 'Card', icon: 'credit-card', color: BrandPalette.coffee },
  { type: 'wallet', label: 'E-Wallet', icon: 'wallet', color: BrandPalette.khaki },
];

const TYPE_LABEL: Record<AccountType, string> = {
  cash: 'Cash',
  bank: 'Bank',
  card: 'Card',
  wallet: 'E-Wallet',
};

export default function CardsScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const {
    accounts,
    transactions,
    totalBalance,
    addAccount,
    updateAccount,
    deleteAccount,
    getCategory,
    resetToSeed,
    clearAll,
  } = useFinance();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [typeIdx, setTypeIdx] = useState(0);
  const [balance, setBalance] = useState('');

  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setName('');
    setTypeIdx(0);
    setBalance('');
    setShowModal(true);
  };

  const openEdit = (acc: Account) => {
    setEditingId(acc.id);
    setName(acc.name);
    setTypeIdx(Math.max(0, typeOptions.findIndex((t) => t.type === acc.type)));
    setBalance(String(acc.balance));
    setShowModal(true);
  };

  const save = () => {
    const bal = Number(balance);
    if (!name.trim() || Number.isNaN(bal)) return;
    const t = typeOptions[typeIdx];
    if (editingId) {
      updateAccount(editingId, {
        name: name.trim(),
        type: t.type,
        balance: bal,
        icon: t.icon,
        color: t.color,
      });
    } else {
      addAccount({
        name: name.trim(),
        type: t.type,
        balance: bal,
        icon: t.icon,
        color: t.color,
      });
    }
    setShowModal(false);
  };

  const selected = accounts.find((a) => a.id === selectedAccount);
  const selectedTxs = selected
    ? transactions.filter((t) => t.accountId === selected.id).slice(0, 6)
    : [];

  // Cool paper-ivory palette — no yellow/orange undertones
  const tabBg = '#F2EDE3';
  const surface = '#FFFFFF';
  const surfaceBorder = '#E6DECE';
  const softInk = BrandPalette.coffee;
  const mutedInk = '#8A7A68';

  const breakdown = accounts.reduce<Record<AccountType, number>>(
    (acc, a) => {
      acc[a.type] = (acc[a.type] ?? 0) + a.balance;
      return acc;
    },
    { cash: 0, bank: 0, card: 0, wallet: 0 }
  );

  const typeTotals = (Object.keys(breakdown) as AccountType[])
    .map((t) => ({
      type: t,
      total: breakdown[t],
      meta: typeOptions.find((o) => o.type === t)!,
    }))
    .filter((x) => x.total > 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: tabBg }]}>
      <ScreenFade>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: softInk }]}>Cards & Money</Text>
          <Text style={[styles.headerSubtitle, { color: mutedInk }]}>Manage every source of your money</Text>
        </View>
        <PressableScale style={[styles.addBtn, { backgroundColor: BrandPalette.mocha }]} onPress={openAdd}>
          <MaterialCommunityIcons name="plus" size={22} color="white" />
        </PressableScale>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Net balance — clean white card with mocha accent */}
        <View style={[styles.summaryCard, { backgroundColor: surface, borderColor: surfaceBorder }]}>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryBadge, { backgroundColor: BrandPalette.mocha + '15' }]}>
              <MaterialCommunityIcons name="wallet-outline" size={18} color={BrandPalette.mocha} />
            </View>
            <Text style={[styles.summaryLabel, { color: mutedInk }]}>NET BALANCE</Text>
          </View>
          <Text style={[styles.summaryAmount, { color: softInk }]}>{formatPHP(totalBalance)}</Text>
          <Text style={[styles.summaryHint, { color: mutedInk }]}>
            Across {accounts.length} account{accounts.length === 1 ? '' : 's'}
          </Text>

          {typeTotals.length > 0 && (
            <View style={styles.summaryBreakdown}>
              {typeTotals.map((x, i) => (
                <View
                  key={x.type}
                  style={[
                    styles.breakdownRow,
                    i < typeTotals.length - 1 && { borderBottomColor: '#F0EADF', borderBottomWidth: 1 },
                  ]}
                >
                  <View style={styles.breakdownLeft}>
                    <View style={[styles.breakdownDot, { backgroundColor: x.meta.color }]} />
                    <Text style={[styles.breakdownLabel, { color: mutedInk }]}>{x.meta.label}</Text>
                  </View>
                  <Text style={[styles.breakdownAmount, { color: softInk }]}>{formatPHP(x.total)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <Text style={[styles.sectionLabel, { color: mutedInk }]}>YOUR ACCOUNTS</Text>

        {accounts.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="credit-card-off" size={48} color={mutedInk} />
            <Text style={[styles.emptyText, { color: mutedInk }]}>No accounts yet</Text>
          </View>
        ) : (
          accounts.map((acc) => {
            const isSelected = selectedAccount === acc.id;
            return (
              <PressableScale
                key={acc.id}
                onPress={() => setSelectedAccount(isSelected ? null : acc.id)}
                style={[styles.accountCard, { backgroundColor: surface, borderColor: surfaceBorder }]}
              >
                <View style={[styles.accountAccent, { backgroundColor: acc.color }]} />
                <View style={styles.accountBody}>
                  <View style={styles.accountHeader}>
                    <View style={styles.accountLeft}>
                      <View style={[styles.accountIcon, { backgroundColor: acc.color + '1F' }]}>
                        <MaterialCommunityIcons name={acc.icon as any} size={22} color={acc.color} />
                      </View>
                      <View>
                        <Text style={[styles.accountName, { color: softInk }]}>{acc.name}</Text>
                        <Text style={[styles.accountType, { color: mutedInk }]}>
                          {TYPE_LABEL[acc.type]}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.accountActions}>
                      <Pressable
                        hitSlop={10}
                        onPress={(e) => {
                          e.stopPropagation?.();
                          openEdit(acc);
                        }}
                        style={[styles.smallIconBtn, { backgroundColor: '#F4EEE2' }]}
                      >
                        <MaterialCommunityIcons name="pencil" size={15} color={softInk} />
                      </Pressable>
                      <Pressable
                        hitSlop={10}
                        onPress={(e) => {
                          e.stopPropagation?.();
                          deleteAccount(acc.id);
                          if (selectedAccount === acc.id) setSelectedAccount(null);
                        }}
                        style={[styles.smallIconBtn, { backgroundColor: '#F4EEE2' }]}
                      >
                        <MaterialCommunityIcons name="trash-can-outline" size={15} color={softInk} />
                      </Pressable>
                    </View>
                  </View>

                  <Text style={[styles.accountBalance, { color: softInk }]}>{formatPHP(acc.balance)}</Text>
                  <View style={styles.accountFootRow}>
                    <MaterialCommunityIcons
                      name={isSelected ? 'chevron-up' : 'chevron-down'}
                      size={14}
                      color={mutedInk}
                    />
                    <Text style={[styles.accountFootnote, { color: mutedInk }]}>
                      {isSelected ? 'Hide activity' : 'Tap to see recent activity'}
                    </Text>
                  </View>
                </View>
              </PressableScale>
            );
          })
        )}

        {selected && (
          <View style={[styles.panel, { backgroundColor: surface, borderColor: surfaceBorder }]}>
            <Text style={[styles.panelTitle, { color: softInk }]}>Recent activity • {selected.name}</Text>
            {selectedTxs.length === 0 ? (
              <Text style={[styles.panelEmpty, { color: mutedInk }]}>No transactions yet for this account.</Text>
            ) : (
              selectedTxs.map((tx, i) => {
                const cat = getCategory(tx.categoryId);
                const sign = tx.type === 'income' ? '+' : '-';
                const color = tx.type === 'income' ? BrandPalette.moss : colors.danger;
                return (
                  <View
                    key={tx.id}
                    style={[
                      styles.txRow,
                      i < selectedTxs.length - 1 && { borderBottomColor: '#F0EADF', borderBottomWidth: 1 },
                    ]}
                  >
                    <View style={styles.txLeft}>
                      <View style={[styles.miniIcon, { backgroundColor: (cat?.color ?? BrandPalette.mocha) + '1F' }]}>
                        <MaterialCommunityIcons name={(cat?.icon as any) ?? 'cash'} size={16} color={cat?.color ?? BrandPalette.mocha} />
                      </View>
                      <View>
                        <Text style={[styles.txName, { color: softInk }]}>{cat?.name ?? 'Other'}</Text>
                        {!!tx.note && <Text style={[styles.txNote, { color: mutedInk }]} numberOfLines={1}>{tx.note}</Text>}
                      </View>
                    </View>
                    <Text style={[styles.txAmount, { color }]}>{sign} {formatPHP(tx.amount)}</Text>
                  </View>
                );
              })
            )}
          </View>
        )}

        <Text style={[styles.dangerSection, { color: mutedInk }]}>DATA</Text>
        <View style={[styles.dangerRow, { backgroundColor: surface, borderColor: surfaceBorder }]}>
          <Pressable
            style={[styles.dangerBtn, { borderColor: surfaceBorder }]}
            onPress={resetToSeed}
          >
            <MaterialCommunityIcons name="restore" size={18} color={softInk} />
            <Text style={[styles.dangerBtnText, { color: softInk }]}>Reset to sample</Text>
          </Pressable>
          <Pressable
            style={[styles.dangerBtn, { borderColor: colors.dangerLight, backgroundColor: colors.dangerLight }]}
            onPress={clearAll}
          >
            <MaterialCommunityIcons name="delete-sweep" size={18} color={colors.danger} />
            <Text style={[styles.dangerBtnText, { color: colors.danger }]}>Clear all data</Text>
          </Pressable>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      </ScreenFade>

      <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
        <Pressable style={styles.backdrop} onPress={() => setShowModal(false)}>
          <Pressable style={[styles.modalCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{editingId ? 'Edit Account' : 'New Account'}</Text>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Name</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="e.g. Maya Wallet"
              placeholderTextColor={colors.textTertiary}
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Type</Text>
            <View style={styles.chipRow}>
              {typeOptions.map((t, i) => {
                const active = i === typeIdx;
                return (
                  <Pressable
                    key={t.type}
                    onPress={() => setTypeIdx(i)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? t.color + '30' : colors.backgroundSecondary,
                        borderColor: active ? t.color : colors.border,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons name={t.icon as any} size={16} color={t.color} />
                    <Text style={[styles.chipText, { color: active ? t.color : colors.text }]}>{t.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, { color: colors.textSecondary }]}>Starting Balance (PHP)</Text>
            <TextInput
              style={[styles.input, { borderColor: colors.border, color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              value={balance}
              onChangeText={setBalance}
            />

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
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 18,
    gap: 4,
  },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 2 },
  summaryBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6 },
  summaryAmount: { fontSize: 30, fontWeight: '800', marginTop: 2 },
  summaryHint: { fontSize: 12, fontWeight: '600' },
  summaryBreakdown: { marginTop: 14, gap: 0 },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  breakdownLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  breakdownDot: { width: 10, height: 10, borderRadius: 5 },
  breakdownLabel: { fontSize: 13, fontWeight: '600' },
  breakdownAmount: { fontSize: 13, fontWeight: '700' },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginTop: 2,
  },
  accountCard: {
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accountAccent: {
    width: 5,
  },
  accountBody: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: { fontSize: 15, fontWeight: '800' },
  accountType: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  accountActions: { flexDirection: 'row', gap: 8 },
  smallIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountBalance: { fontSize: 24, fontWeight: '800' },
  accountFootRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  accountFootnote: { fontSize: 11, fontWeight: '600' },
  panel: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
    gap: 6,
  },
  panelTitle: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  panelEmpty: { fontSize: 13, fontStyle: 'italic' },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  miniIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txName: { fontSize: 13, fontWeight: '700' },
  txNote: { fontSize: 11, marginTop: 2 },
  txAmount: { fontSize: 13, fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyText: { fontSize: 15, fontWeight: '700' },
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
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
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalBtnText: { fontSize: 14, fontWeight: '700' },
  dangerSection: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 8,
    marginBottom: 10,
  },
  dangerRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  dangerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  dangerBtnText: { fontSize: 13, fontWeight: '700' },
});
