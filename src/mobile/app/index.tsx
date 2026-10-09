import { Link, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { TaskCard } from '../src/features/tasks/components/TaskCard';
import { useTasksQuery } from '../src/features/tasks/api/tasks.queries';
import { useTaskFiltersStore } from '../src/features/tasks/store/task-filters.store';
import { ScreenState } from '../src/shared/components/ScreenState';

export default function TasksScreen() {
  const status = useTaskFiltersStore((state) => state.status);
  const priority = useTaskFiltersStore((state) => state.priority);
  const [page, setPage] = useState(1);
  const [pageFiltersKey, setPageFiltersKey] = useState('');
  const filters = useMemo(() => ({ status, priority }), [priority, status]);
  const filterKey = `${status.join(',')}|${priority.join(',')}`;
  const activePage = pageFiltersKey === filterKey ? page : 1;
  const query = useTasksQuery(activePage, filters);
  const filterCount = status.length + priority.length;

  if (query.isPending) {
    return <View style={styles.loading}><ActivityIndicator color="#b4552d" size="large" /></View>;
  }

  if (query.isError) {
    return <ScreenState title="Could not load tasks" message={query.error.message} actionLabel="Try again" onAction={() => query.refetch()} />;
  }

  const result = query.data;

  return (
    <View style={styles.screen}>
      <FlatList
        data={result.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={result.items.length === 0 ? styles.emptyList : styles.list}
        refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => query.refetch()} tintColor="#b4552d" />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.eyebrowRow}>
              <Text style={styles.eyebrow}>PERSONAL WORKBOARD</Text>
              <Text style={styles.counter}>{result.totalItems} total</Text>
            </View>
            <Text style={styles.heading}>Make room for{`\n`}what matters.</Text>
            <Text style={styles.subheading}>A focused view of your work, one task at a time.</Text>
            <View style={styles.actions}>
              <Link href="/filters" asChild>
                <Pressable style={styles.filterButton} accessibilityRole="button">
                  <Text style={styles.filterButtonText}>Filter tasks</Text>
                  {filterCount > 0 ? <View style={styles.filterCount}><Text style={styles.filterCountText}>{filterCount}</Text></View> : null}
                </Pressable>
              </Link>
              {filterCount > 0 ? <Text style={styles.activeFilters}>{filterCount} active</Text> : null}
            </View>
            <Text style={styles.sectionLabel}>CURRENT TASKS</Text>
          </View>
        }
        renderItem={({ item }) => <TaskCard task={item} onPress={() => router.push({ pathname: '/task/[id]', params: { id: item.id } })} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<ScreenState title="Nothing on the board" message="Try clearing your filters or check back after adding more tasks." actionLabel={filterCount > 0 ? 'View all tasks' : undefined} onAction={filterCount > 0 ? () => router.push('/filters') : undefined} />}
        ListFooterComponent={
          result.items.length > 0 ? (
            <View style={styles.pagination}>
              <Pressable disabled={activePage <= 1 || query.isFetching} onPress={() => { setPageFiltersKey(filterKey); setPage((current) => current - 1); }} style={[styles.pageButton, activePage <= 1 && styles.disabled]}>
                <Text style={styles.pageButtonText}>Previous</Text>
              </Pressable>
              <Text style={styles.pageText}>Page {result.page} of {Math.max(result.totalPages, 1)}</Text>
              <Pressable disabled={activePage >= result.totalPages || query.isFetching} onPress={() => { setPageFiltersKey(filterKey); setPage((current) => current + 1); }} style={[styles.pageButton, activePage >= result.totalPages && styles.disabled]}>
                <Text style={styles.pageButtonText}>Next</Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#f6f2ea', flex: 1 },
  loading: { alignItems: 'center', backgroundColor: '#f6f2ea', flex: 1, justifyContent: 'center' },
  list: { padding: 20, paddingBottom: 36 },
  emptyList: { flexGrow: 1, padding: 20 },
  header: { paddingBottom: 24 },
  eyebrowRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  eyebrow: { color: '#b4552d', fontSize: 11, fontWeight: '900', letterSpacing: 1.6 },
  counter: { color: '#879097', fontSize: 12, fontWeight: '700' },
  heading: { color: '#17242b', fontSize: 37, fontWeight: '900', letterSpacing: -1.3, lineHeight: 40, marginTop: 22 },
  subheading: { color: '#68747a', fontSize: 15, lineHeight: 22, marginTop: 12, maxWidth: 300 },
  actions: { alignItems: 'center', flexDirection: 'row', gap: 12, marginTop: 24 },
  filterButton: { alignItems: 'center', backgroundColor: '#17242b', borderRadius: 12, flexDirection: 'row', gap: 9, paddingHorizontal: 16, paddingVertical: 12 },
  filterButtonText: { color: '#fffdf8', fontSize: 14, fontWeight: '800' },
  filterCount: { alignItems: 'center', backgroundColor: '#d9784c', borderRadius: 10, height: 20, justifyContent: 'center', minWidth: 20, paddingHorizontal: 5 },
  filterCountText: { color: '#fffdf8', fontSize: 11, fontWeight: '900' },
  activeFilters: { color: '#b4552d', fontSize: 13, fontWeight: '800' },
  sectionLabel: { color: '#879097', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginTop: 32 },
  separator: { height: 12 },
  pagination: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  pageButton: { borderColor: '#c8c1b3', borderRadius: 10, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 10 },
  pageButtonText: { color: '#17242b', fontSize: 12, fontWeight: '800' },
  pageText: { color: '#68747a', fontSize: 12, fontWeight: '700' },
  disabled: { opacity: 0.35 },
});
