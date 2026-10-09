import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Task } from '../api/task.schemas';
import { useLanguageStore } from '../../../shared/i18n/language.store';
import { taskPriorityLabel, taskStatusLabel } from '../../../shared/i18n/translations';

type Props = { task: Task; onPress: () => void };

export function TaskCard({ task, onPress }: Props) {
  const language = useLanguageStore((state) => state.language);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]} accessibilityRole="button">
      <View style={styles.content}>
        <View style={styles.topLine}><Text style={styles.priority}>{taskPriorityLabel(language, task.priority)}</Text><Text style={[styles.status, task.status === 'Done' && styles.done]}>{taskStatusLabel(language, task.status)}</Text></View>
        <Text style={styles.title} numberOfLines={1}>{task.title}</Text>
      </View>
      <Text style={styles.open}>→</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center', backgroundColor: '#fffdf8', borderColor: '#dcd7ca', borderRadius: 12, borderWidth: 1, flexDirection: 'row', gap: 12, justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  content: { flex: 1, gap: 5 },
  topLine: { flexDirection: 'row', justifyContent: 'space-between' },
  priority: { color: '#b4552d', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  status: { color: '#52626a', fontSize: 12, fontWeight: '700' },
  done: { color: '#2e8067' },
  title: { color: '#17242b', fontSize: 15, fontWeight: '800' },
  open: { color: '#b4552d', fontSize: 20, fontWeight: '700' },
});
