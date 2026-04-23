import { Colors } from '@/constants/theme';
import { TxType, useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTransactionModal() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();

  const { accounts, categories, addTransaction } = useFinance();

  const [type, setType] = useState<TxType>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id ?? '');
  const [categoryId, setCategoryId] = useState<string>('');

  const filteredCategories = useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type]
  );

  // Reset category when switching type
  const selectType = (t: TxType) => {
    setType(t);
    setCategoryId('');
  };

  const save = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0 || !accountId || !categoryId) return;
    addTransaction({
      type,
      accountId,
      categoryId,
      amount: amt,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
    });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Type toggle */}
        <View style={[styles.segment, { borderColor: colors.border }]}>
          {(['expense', 'income'] as TxType[]).map((t) => {
            const active = type === t;
            const color = t === 'income' ? colors.accent : colors.danger;
            return (
              <Pressable
                key={t}
                onPress={() => selectType(t)}
                style={[
                  styles.segmentItem,
                  { backgroundColor: active ? color : 'transparent' },
                ]}
              >
                <MaterialCommunityIcons
                  name={t === 'income' ? 'arrow-down-circle' : 'arrow-up-circle'}
                  size={18}
                  color={active ? 'white' : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.segmentText,
                    { color: active ? 'white' : colors.textSecondary },
                  ]}
                >
                  {t === 'income' ? 'Income' : 'Expense'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Amount */}
        <View style={styles.amountWrapper}>
          <Text style={[styles.amountCurrency, { color: colors.textSecondary }]}>₱</Text>
          <TextInput
            style={[styles.amountInput, { color: colors.text }]}
            placeholder="0.00"
            placeholderTextColor={colors.textTertiary}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* Category */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>
        <View style={styles.grid}>
          {filteredCategories.map((c) => {
            const active = c.id === categoryId;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCategoryId(c.id)}
                style={[
                  styles.catItem,
                  {
                    backgroundColor: active ? c.color + '30' : colors.backgroundSecondary,
                    borderColor: active ? c.color : colors.border,
                  },
                ]}
              >
                <View style={[styles.catIcon, { backgroundColor: c.color + '30' }]}>
                  <MaterialCommunityIcons name={c.icon as any} size={20} color={c.color} />
                </View>
                <Text style={[styles.catLabel, { color: colors.text }]}>{c.name}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Account */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>From Account</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {accounts.map((acc) => {
            const active = acc.id === accountId;
            return (
              <Pressable
                key={acc.id}
                onPress={() => setAccountId(acc.id)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? acc.color + '30' : colors.backgroundSecondary,
                    borderColor: active ? acc.color : colors.border,
                  },
                ]}
              >
                <MaterialCommunityIcons name={acc.icon as any} size={16} color={acc.color} />
                <Text style={[styles.chipText, { color: active ? acc.color : colors.text }]}>{acc.name}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Note */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Note (optional)</Text>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. lunch with friends"
          placeholderTextColor={colors.textTertiary}
          value={note}
          onChangeText={setNote}
        />

        <Pressable
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={save}
        >
          <Text style={styles.saveText}>Save Transaction</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, gap: 10 },
  segment: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  segmentItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 10,
  },
  segmentText: { fontSize: 13, fontWeight: '700' },
  amountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  amountCurrency: { fontSize: 28, fontWeight: '700', marginRight: 6 },
  amountInput: {
    fontSize: 40,
    fontWeight: '800',
    minWidth: 150,
    textAlign: 'center',
    padding: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: 4,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catItem: {
    width: '23%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  catIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
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
  chipText: { fontSize: 13, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  saveBtn: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: { color: 'white', fontSize: 15, fontWeight: '800' },
});
