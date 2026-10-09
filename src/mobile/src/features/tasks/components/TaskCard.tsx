import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Task } from '../api/task.schemas';

const statusLabels: Record<Task['status'], string> = {
  Todo: 'To do',
  InProgress: 'In progress',
  Done: 'Done',
};

const priorityLabels: Record<Task['priority'], string> = {
  Low: 'Low',
  Medium: 'Medium',
  High: 'High',
  Critical: 'Critical',
};

type Props = { task: Task; onPress: () => void };

export function TaskCard({ task, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]} accessibilityRole="button">
      <View style={styles.topLine}>
        <Text style={styles.priority}>{priorityLabels[task.priority]}</Text>
        <Text style={[styles.status, task.status === 'Done' && styles.done]}>{statusLabels[task.status]}</Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>{task.title}</Text>
      <Text style={styles.description} numberOfLines={2}>{task.description}</Text>
      <Text style={styles.open}>Open task  →</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fffdf8', borderColor: '#dcd7ca', borderRadius: 18, borderWidth: 1, gap: 10, padding: 18 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  topLine: { flexDirection: 'row', justifyContent: 'space-between' },
  priority: { color: '#b4552d', fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  status: { color: '#52626a', fontSize: 12, fontWeight: '700' },
  done: { color: '#2e8067' },
  title: { color: '#17242b', fontSize: 19, fontWeight: '800', lineHeight: 24 },
  description: { color: '#68747a', fontSize: 14, lineHeight: 20 },
  open: { color: '#b4552d', fontSize: 13, fontWeight: '700', marginTop: 3 },
});
