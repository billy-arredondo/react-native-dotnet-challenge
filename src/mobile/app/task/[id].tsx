import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTaskQuery } from '../../src/features/tasks/api/tasks.queries';
import { ScreenState } from '../../src/shared/components/ScreenState';
import { useLanguageStore } from '../../src/shared/i18n/language.store';
import { taskPriorityLabel, taskStatusLabel, translate } from '../../src/shared/i18n/translations';

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const taskId = Array.isArray(id) ? id[0] : id ?? '';
  const query = useTaskQuery(taskId);
  const language = useLanguageStore((state) => state.language);

  if (query.isPending) return <View style={styles.loading}><ActivityIndicator color="#b4552d" size="large" /></View>;
  if (query.isError) return <ScreenState title={translate(language, 'taskUnavailable')} message={query.error.message} actionLabel={translate(language, 'tryAgain')} onAction={() => query.refetch()} />;
  if (!query.data) return <ScreenState title={translate(language, 'taskNotFound')} message={translate(language, 'removedTask')} />;

  const task = query.data;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.metaRow}><Text style={styles.priority}>{taskPriorityLabel(language, task.priority)}</Text><Text style={styles.status}>{taskStatusLabel(language, task.status)}</Text></View>
      <Text style={styles.title}>{task.title}</Text>
      <View style={styles.rule} />
      <Text style={styles.label}>{translate(language, 'description')}</Text>
      <Text style={styles.description}>{task.description}</Text>
      <View style={styles.infoBlock}><Text style={styles.label}>{translate(language, 'created')}</Text><Text style={styles.date}>{formatDate(task.createdAt, language)}</Text></View>
    </ScrollView>
  );
}

function formatDate(value: string, language: 'en' | 'es') {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

const styles = StyleSheet.create({
  content: { backgroundColor: '#f6f2ea', flexGrow: 1, padding: 24 },
  loading: { alignItems: 'center', backgroundColor: '#f6f2ea', flex: 1, justifyContent: 'center' },
  metaRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  priority: { color: '#b4552d', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, textTransform: 'uppercase' },
  status: { color: '#2e8067', fontSize: 13, fontWeight: '800' },
  title: { color: '#17242b', fontSize: 36, fontWeight: '900', letterSpacing: -1.1, lineHeight: 42, marginTop: 22 },
  rule: { backgroundColor: '#dcd7ca', height: 1, marginVertical: 30 },
  label: { color: '#879097', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  description: { color: '#52626a', fontSize: 17, lineHeight: 28, marginTop: 14 },
  infoBlock: { borderTopColor: '#dcd7ca', borderTopWidth: 1, marginTop: 44, paddingTop: 18 },
  date: { color: '#17242b', fontSize: 15, fontWeight: '700', marginTop: 8 },
});
