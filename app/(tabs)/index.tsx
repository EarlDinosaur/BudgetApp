import BottomNavigation from '@/components/bottom-navigation';
import PressableScale from '@/components/ui/pressable-scale';
import ProgressBar from '@/components/ui/progress-bar';
import ScreenFade from '@/components/ui/screen-fade';
import { Colors } from '@/constants/theme';
import { BrandPalette, formatPHP, useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Unified palette — home is the sage-green garden where all three tabs meet.
const HOME = {
  bg: '#E8EFE2',            // soft sage canvas
  surface: '#FFFFFF',       // clean white cards (Cards feel)
  surfaceBorder: '#DCE5D2',
  brownPanel: '#F6E9D7',    // warm sand panel (Budgets feel) — contrasts nicely
  brownPanelBorder: '#E7D3B4',
  sagePanel: '#F3F7EE',     // lighter mint panel (Goals feel) — still reads green on bg
  sagePanelBorder: '#D3DFCB',
  softInk: '#3E5144',       // deep forest ink for primary text
  mutedInk: '#6E7B6A',      // muted sage ink for secondary
  divider: '#DCE5D2',
};

// Soft shadow to add quiet depth across cards (forest green tint)
const softShadow = {
  shadowColor: '#3E5144',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.1,
  shadowRadius: 14,
  elevation: 2,
} as const;

const lightShadow = {
  shadowColor: '#3E5144',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.07,
  shadowRadius: 8,
  elevation: 1,
} as const;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
function todayLabel() {
  const d = new Date();
  return `${WEEKDAYS[d.getDay()]} · ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

export default function HomeScreen() {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];
  const router = useRouter();

  const {
    accounts,
    transactions,
    budgets,
    goals,
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    getCategory,
    getBudgetSpent,
    deleteTransaction,
  } = useFinance();

  const recentTransactions = transactions.slice(0, 4);
  const topBudgets = budgets.slice(0, 3);
  const topGoals = goals.slice(0, 2);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: HOME.bg }]}>
      <ScreenFade>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { borderColor: HOME.surfaceBorder, backgroundColor: HOME.surface }, lightShadow]}>
              <MaterialCommunityIcons name="teddy-bear" size={26} color={BrandPalette.moss} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.dateChip}>
                <MaterialCommunityIcons name="leaf" size={10} color={BrandPalette.moss} />
                <Text style={styles.dateChipText}>{todayLabel()}</Text>
              </View>
              <Text style={[styles.greeting, { color: HOME.softInk }]}>{getGreeting()}, Bubu 🧸</Text>
              <Text style={[styles.subGreeting, { color: HOME.mutedInk }]}>Have a cozy day with your money!</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <PressableScale
              onPress={() => router.push('/history')}
              style={[styles.headerBtn, { backgroundColor: HOME.surface, borderColor: HOME.surfaceBorder }, lightShadow]}
            >
              <MaterialCommunityIcons name="history" size={20} color={HOME.softInk} />
            </PressableScale>
            <PressableScale
              onPress={() => router.push('/modal')}
              style={[styles.quickAdd, { backgroundColor: BrandPalette.moss }, softShadow]}
            >
              <MaterialCommunityIcons name="plus" size={22} color="white" />
            </PressableScale>
          </View>
        </View>

        {/* Balance card — deep moss green with soft decorative flourishes */}
        <View style={[styles.mainCard, { backgroundColor: BrandPalette.moss }, softShadow]}>
          {/* Decorative circles */}
          <View style={[styles.decorCircle, styles.decorCircleLg, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
          <View style={[styles.decorCircle, styles.decorCircleSm, { backgroundColor: 'rgba(212,224,206,0.22)' }]} />

          <View style={styles.balanceHeaderRow}>
            <View style={styles.balanceLabelPill}>
              <MaterialCommunityIcons name="wallet-outline" size={12} color="#FFF3EA" />
              <Text style={styles.balanceLabel}>Total balance</Text>
            </View>
            <MaterialCommunityIcons name="leaf" size={16} color={BrandPalette.mint} />
          </View>

          <View style={styles.balanceContainer}>
            <Text style={styles.bigBalance}>{formatPHP(totalBalance)}</Text>
            <Text style={styles.balanceSubtle}>Across {accounts.length} account{accounts.length === 1 ? '' : 's'}</Text>
          </View>

          <View style={styles.flowRow}>
            <View style={styles.flowPill}>
              <View style={[styles.flowIconCircle, { backgroundColor: 'rgba(212,224,206,0.28)' }]}>
                <MaterialCommunityIcons name="arrow-down" size={14} color={BrandPalette.mint} />
              </View>
              <View>
                <Text style={styles.flowLabel}>INCOME</Text>
                <Text style={styles.flowValue}>{formatPHP(monthlyIncome)}</Text>
              </View>
            </View>
            <View style={styles.flowPill}>
              <View style={[styles.flowIconCircle, { backgroundColor: 'rgba(255,215,200,0.28)' }]}>
                <MaterialCommunityIcons name="arrow-up" size={14} color="#FFD7C8" />
              </View>
              <View>
                <Text style={styles.flowLabel}>EXPENSE</Text>
                <Text style={styles.flowValue}>{formatPHP(monthlyExpense)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick actions — each colored to match its destination tab */}
        <View style={styles.quickActions}>
          <QuickAction
            label="Add"
            icon="plus"
            bg={BrandPalette.moss}
            onPress={() => router.push('/modal')}
          />
          <QuickAction
            label="Budgets"
            icon="chart-pie"
            bg={BrandPalette.mocha}
            onPress={() => router.push('/budgets')}
          />
          <QuickAction
            label="Goals"
            icon="target"
            bg={BrandPalette.sage}
            onPress={() => router.push('/goals')}
          />
          <QuickAction
            label="Cards"
            icon="credit-card"
            bg={BrandPalette.khaki}
            onPress={() => router.push('/cards')}
          />
        </View>

        {/* Accounts (Cards tab feel: white cards on sage) */}
        <SectionHeader
          title="Your Accounts"
          dotColor={BrandPalette.khaki}
          actionLabel="See all"
          actionColor={BrandPalette.moss}
          onAction={() => router.push('/cards')}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {accounts.map((acc) => (
            <PressableScale
              key={acc.id}
              onPress={() => router.push('/cards')}
              style={[styles.accountCard, { backgroundColor: HOME.surface, borderColor: HOME.surfaceBorder }, lightShadow]}
            >
              <View style={[styles.accountAccentLine, { backgroundColor: acc.color }]} />
              <View style={[styles.iconBox, { backgroundColor: acc.color + '1F' }]}>
                <MaterialCommunityIcons name={acc.icon as any} size={22} color={acc.color} />
              </View>
              <Text style={[styles.miniLabel, { color: HOME.mutedInk }]}>{acc.name}</Text>
              <Text style={[styles.miniVal, { color: HOME.softInk }]}>{formatPHP(acc.balance)}</Text>
              <View style={[styles.typePill, { backgroundColor: acc.color + '18' }]}>
                <Text style={[styles.accountType, { color: acc.color }]}>{acc.type.toUpperCase()}</Text>
              </View>
            </PressableScale>
          ))}
        </ScrollView>

        {/* Budgets preview (Budgets tab feel: warm sand panel) */}
        {topBudgets.length > 0 && (
          <>
            <SectionHeader
              title="Budget Overview"
              dotColor={BrandPalette.coffee}
              actionLabel="Manage"
              actionColor={BrandPalette.coffee}
              onAction={() => router.push('/budgets')}
            />
            <View style={[styles.panel, { backgroundColor: HOME.brownPanel, borderColor: HOME.brownPanelBorder }, lightShadow]}>
              {topBudgets.map((b, idx) => {
                const cat = getCategory(b.categoryId);
                const spent = getBudgetSpent(b.categoryId);
                const pct = b.limit > 0 ? spent / b.limit : 0;
                const overBudget = spent > b.limit;
                return (
                  <View
                    key={b.id}
                    style={[
                      styles.budgetRow,
                      idx < topBudgets.length - 1 && { borderBottomColor: HOME.brownPanelBorder, borderBottomWidth: 1 },
                    ]}
                  >
                    <View style={styles.budgetHeader}>
                      <View style={styles.budgetLeft}>
                        <View style={[styles.miniIcon, { backgroundColor: (cat?.color ?? BrandPalette.mocha) + '2B' }]}>
                          <MaterialCommunityIcons name={(cat?.icon as any) ?? 'tag'} size={18} color={cat?.color ?? BrandPalette.mocha} />
                        </View>
                        <Text style={[styles.budgetName, { color: HOME.softInk }]}>{cat?.name ?? 'Other'}</Text>
                      </View>
                      <Text style={[styles.budgetAmount, { color: overBudget ? colors.danger : HOME.softInk }]}>
                        {formatPHP(spent)} / {formatPHP(b.limit)}
                      </Text>
                    </View>
                    <ProgressBar value={pct} color={overBudget ? colors.danger : cat?.color ?? BrandPalette.coffee} />
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Goals preview (Goals tab feel: sage panel) */}
        {topGoals.length > 0 && (
          <>
            <SectionHeader
              title="Savings Goals"
              dotColor={BrandPalette.moss}
              actionLabel="Manage"
              actionColor={BrandPalette.moss}
              onAction={() => router.push('/goals')}
            />
            <View style={styles.goalRow}>
              {topGoals.map((g) => {
                const pct = g.target > 0 ? g.saved / g.target : 0;
                return (
                  <PressableScale
                    key={g.id}
                    onPress={() => router.push('/goals')}
                    wrapperStyle={{ flex: 1 }}
                    style={[styles.goalCard, { backgroundColor: HOME.sagePanel, borderColor: HOME.sagePanelBorder }, lightShadow]}
                  >
                    <View style={styles.goalTopRow}>
                      <View style={[styles.iconBox, { backgroundColor: g.color + '2B', marginBottom: 0 }]}>
                        <MaterialCommunityIcons name={g.icon as any} size={22} color={g.color} />
                      </View>
                      <View style={[styles.goalPctBadge, { backgroundColor: BrandPalette.moss }]}>
                        <Text style={styles.goalPctBadgeText}>{Math.round(pct * 100)}%</Text>
                      </View>
                    </View>
                    <Text style={[styles.goalName, { color: HOME.softInk }]} numberOfLines={1}>{g.name}</Text>
                    <Text style={[styles.goalAmount, { color: HOME.mutedInk }]}>
                      {formatPHP(g.saved)} / {formatPHP(g.target)}
                    </Text>
                    <ProgressBar value={pct} color={g.color} />
                  </PressableScale>
                );
              })}
            </View>
          </>
        )}

        {/* Recent transactions (neutral white panel) */}
        <SectionHeader
          title="Recent Transactions"
          dotColor={BrandPalette.moss}
          actionLabel="Add new"
          actionColor={BrandPalette.moss}
          onAction={() => router.push('/modal')}
        />
        <View style={[styles.panel, { backgroundColor: HOME.surface, borderColor: HOME.surfaceBorder }, lightShadow]}>
          {recentTransactions.length === 0 ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="inbox" size={32} color={HOME.mutedInk} />
              <Text style={[styles.emptyText, { color: HOME.mutedInk }]}>No transactions yet</Text>
            </View>
          ) : (
            recentTransactions.map((tx, idx) => {
              const cat = getCategory(tx.categoryId);
              const sign = tx.type === 'income' ? '+' : '-';
              const color = tx.type === 'income' ? BrandPalette.moss : colors.danger;
              return (
                <Pressable
                  key={tx.id}
                  onLongPress={() => deleteTransaction(tx.id)}
                  style={[
                    styles.txRow,
                    idx < recentTransactions.length - 1 && {
                      borderBottomColor: HOME.divider,
                      borderBottomWidth: 1,
                    },
                  ]}
                >
                  <View style={styles.txLeft}>
                    <View style={[styles.miniIcon, { backgroundColor: (cat?.color ?? BrandPalette.mocha) + '1F' }]}>
                      <MaterialCommunityIcons name={(cat?.icon as any) ?? 'cash'} size={18} color={cat?.color ?? BrandPalette.mocha} />
                    </View>
                    <View>
                      <Text style={[styles.txName, { color: HOME.softInk }]}>{cat?.name ?? 'Other'}</Text>
                      {!!tx.note && <Text style={[styles.txNote, { color: HOME.mutedInk }]} numberOfLines={1}>{tx.note}</Text>}
                    </View>
                  </View>
                  <Text style={[styles.txAmount, { color }]}>{sign} {formatPHP(tx.amount)}</Text>
                </Pressable>
              );
            })
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      </ScreenFade>

      <BottomNavigation />
    </SafeAreaView>
  );
}

function SectionHeader({
  title,
  dotColor,
  actionLabel,
  actionColor,
  onAction,
}: {
  title: string;
  dotColor: string;
  actionLabel?: string;
  actionColor?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionTitleRow}>
        <View style={[styles.sectionDot, { backgroundColor: dotColor }]} />
        <Text style={[styles.sectionTitle, { color: HOME.mutedInk }]}>{title}</Text>
      </View>
      {actionLabel && onAction && (
        <Pressable onPress={onAction}>
          <Text style={[styles.linkText, { color: actionColor ?? HOME.softInk }]}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 18) return 'Good Afternoon';
  return 'Good Evening';
}

function QuickAction({ label, icon, bg, onPress }: { label: string; icon: string; bg: string; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} style={styles.quickActionItem} scaleTo={0.92}>
      <View style={[styles.quickActionIcon, { backgroundColor: HOME.surface, borderColor: HOME.surfaceBorder }, lightShadow]}>
        <View style={[styles.quickActionInner, { backgroundColor: bg + '1F' }]}>
          <MaterialCommunityIcons name={icon as any} size={22} color={bg} />
        </View>
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  greeting: { fontSize: 19, fontWeight: '800', letterSpacing: -0.2 },
  subGreeting: { fontSize: 12.5, marginTop: 2, fontWeight: '600' },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE5D2',
    marginBottom: 4,
  },
  dateChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: BrandPalette.moss,
    letterSpacing: 0.3,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAdd: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCard: {
    borderRadius: 26,
    padding: 22,
    marginBottom: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  decorCircleLg: {
    width: 180,
    height: 180,
    top: -70,
    right: -60,
  },
  decorCircleSm: {
    width: 90,
    height: 90,
    bottom: -30,
    left: -20,
  },
  balanceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  balanceLabelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,243,234,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  balanceLabel: { fontSize: 11, fontWeight: '700', color: '#FFF3EA', letterSpacing: 0.4 },
  balanceContainer: { marginBottom: 18 },
  bigBalance: { fontSize: 36, fontWeight: '800', color: '#FFFBF4', letterSpacing: -0.5 },
  balanceSubtle: { fontSize: 12, fontWeight: '600', color: 'rgba(255,243,234,0.75)', marginTop: 4 },
  flowRow: {
    flexDirection: 'row',
    gap: 10,
  },
  flowPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,243,234,0.1)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  flowIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flowLabel: { fontSize: 9.5, fontWeight: '800', color: 'rgba(255,243,234,0.85)', letterSpacing: 0.6 },
  flowValue: { fontSize: 14, fontWeight: '800', color: '#FFFBF4', marginTop: 1 },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    paddingHorizontal: 2,
  },
  quickActionItem: { alignItems: 'center', flex: 1, gap: 7 },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  quickActionInner: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: { fontSize: 11, fontWeight: '700', color: '#3E5144' },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionDot: { width: 8, height: 8, borderRadius: 4 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  linkText: { fontSize: 12, fontWeight: '700' },
  hScroll: { gap: 12, paddingBottom: 4, paddingRight: 4 },
  accountCard: {
    width: 160,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accountAccentLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  miniLabel: { fontSize: 12, marginBottom: 2, fontWeight: '600' },
  miniVal: { fontSize: 16, fontWeight: '800' },
  typePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 6,
  },
  accountType: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.5 },
  panel: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 4,
    marginTop: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  budgetRow: { padding: 12, gap: 8 },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  miniIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetName: { fontSize: 14, fontWeight: '600' },
  budgetAmount: { fontSize: 12, fontWeight: '700' },
  goalRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  goalCard: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    gap: 6,
  },
  goalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  goalName: { fontSize: 14, fontWeight: '800' },
  goalAmount: { fontSize: 11, fontWeight: '600' },
  goalPctBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  goalPctBadgeText: {
    color: '#FFF6EA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  txLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  txName: { fontSize: 14, fontWeight: '600' },
  txNote: { fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '700' },
  empty: { padding: 30, alignItems: 'center', gap: 8 },
  emptyText: { fontSize: 13, fontWeight: '500' },
  bottomSpacer: { height: 120 },
});
