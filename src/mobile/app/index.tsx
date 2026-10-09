import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { TaskCard } from '../src/features/tasks/components/TaskCard';
import { TaskFilters } from '../src/features/tasks/components/TaskFilters';
import { useTasksQuery } from '../src/features/tasks/api/tasks.queries';
import { useTaskFiltersStore } from '../src/features/tasks/store/task-filters.store';
import { ScreenState } from '../src/shared/components/ScreenState';
import { LanguageSelector } from '../src/shared/i18n/LanguageSelector';
import { useLanguageStore } from '../src/shared/i18n/language.store';
import { translate } from '../src/shared/i18n/translations';

export default function TasksScreen() {
  const status = useTaskFiltersStore((state) => state.status);
  const priority = useTaskFiltersStore((state) => state.priority);
  const setFilters = useTaskFiltersStore((state) => state.setFilters);
  const language = useLanguageStore((state) => state.language);
  const [page, setPage] = useState(1);
  const filters = useMemo(() => ({ status, priority }), [priority, status]);
  const query = useTasksQuery(page, filters);
  const filterCount = status.length + priority.length;
  const handleFilterChange = (nextStatus: typeof status, nextPriority: typeof priority) => {
    setPage(1);
    setFilters({ status: nextStatus, priority: nextPriority });
  };
  const header = (total: number) => <View style={styles.header}>
    <View style={styles.eyebrowRow}><Text style={styles.eyebrow}>{translate(language, 'appName')}</Text><View style={styles.headerRight}><Text style={styles.counter}>{total} {translate(language, 'total')}</Text><LanguageSelector /></View></View>
    <Text style={styles.heading}>{translate(language, 'heading')}</Text>
    <Text style={styles.subheading}>{translate(language, 'subheading')}</Text>
    <View style={styles.filters}><TaskFilters status={status} priority={priority} onChange={handleFilterChange} /></View>
    <Text style={styles.sectionLabel}>{translate(language, 'currentTasks')}</Text>
  </View>;

  if (query.isPending) {
    return <View style={styles.screen}><FlatList data={[]} renderItem={() => null} ListHeaderComponent={header(0)} ListEmptyComponent={<ActivityIndicator color="#b4552d" size="large" />} contentContainerStyle={styles.emptyList} /></View>;
  }

  if (query.isError) {
    return <View style={styles.screen}><FlatList data={[]} renderItem={() => null} ListHeaderComponent={header(0)} ListEmptyComponent={<ScreenState title={translate(language, 'couldNotLoad')} message={query.error.message} actionLabel={translate(language, 'tryAgain')} onAction={() => query.refetch()} />} contentContainerStyle={styles.emptyList} /></View>;
  }

  const result = query.data;

  return (
    <View style={styles.screen}>
      <FlatList
        data={result.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={result.items.length === 0 ? styles.emptyList : styles.list}
        refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => query.refetch()} tintColor="#b4552d" />}
         ListHeaderComponent={header(result.totalItems)}
        renderItem={({ item }) => <TaskCard task={item} onPress={() => router.push({ pathname: '/task/[id]', params: { id: item.id } })} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={<ScreenState title={translate(language, 'nothing')} message={translate(language, 'emptyMessage')} actionLabel={filterCount > 0 ? translate(language, 'viewAll') : undefined} onAction={filterCount > 0 ? () => handleFilterChange([], []) : undefined} />}
        ListFooterComponent={
          result.items.length > 0 ? (
            <View style={styles.pagination}>
               <Pressable disabled={page <= 1 || query.isFetching} onPress={() => setPage((current) => current - 1)} style={[styles.pageButton, page <= 1 && styles.disabled]}>
                 <Text style={styles.pageButtonText}>{translate(language, 'previous')}</Text>
               </Pressable>
               <Text style={styles.pageText}>{translate(language, 'pageOf', { page: result.page, total: Math.max(result.totalPages, 1) })}</Text>
               <Pressable disabled={page >= result.totalPages || query.isFetching} onPress={() => setPage((current) => current + 1)} style={[styles.pageButton, page >= result.totalPages && styles.disabled]}>
                 <Text style={styles.pageButtonText}>{translate(language, 'next')}</Text>
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
  list: { padding: 20, paddingBottom: 36 },
  emptyList: { flexGrow: 1, padding: 20 },
  header: { paddingBottom: 24 },
  eyebrowRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  headerRight: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  eyebrow: { color: '#b4552d', fontSize: 11, fontWeight: '900', letterSpacing: 1.6 },
  counter: { color: '#879097', fontSize: 12, fontWeight: '700' },
  heading: { color: '#17242b', fontSize: 32, fontWeight: '900', letterSpacing: -1.1, lineHeight: 35, marginTop: 18 },
  subheading: { color: '#68747a', fontSize: 15, lineHeight: 22, marginTop: 12, maxWidth: 300 },
  filters: { marginTop: 20 },
  sectionLabel: { color: '#879097', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginTop: 20 },
  separator: { height: 7 },
  pagination: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  pageButton: { borderColor: '#c8c1b3', borderRadius: 10, borderWidth: 1, paddingHorizontal: 13, paddingVertical: 10 },
  pageButtonText: { color: '#17242b', fontSize: 12, fontWeight: '800' },
  pageText: { color: '#68747a', fontSize: 12, fontWeight: '700' },
  disabled: { opacity: 0.35 },
});
