import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TaskPriority, TaskStatus } from '../api/task.schemas';
import { useLanguageStore } from '../../../shared/i18n/language.store';
import { taskPriorityLabel, taskStatusLabel, translate } from '../../../shared/i18n/translations';

type Props = { status: TaskStatus[]; priority: TaskPriority[]; onChange: (status: TaskStatus[], priority: TaskPriority[]) => void };
const statuses: TaskStatus[] = ['Todo', 'InProgress', 'Done'];
const priorities: TaskPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export function TaskFilters({ status, priority, onChange }: Props) {
  const language = useLanguageStore((state) => state.language);
  const toggleStatus = (value: TaskStatus) => onChange(status.includes(value) ? status.filter((item) => item !== value) : [...status, value], priority);
  const togglePriority = (value: TaskPriority) => onChange(status, priority.includes(value) ? priority.filter((item) => item !== value) : [...priority, value]);

  return <View style={styles.container}>
    <View style={styles.titleRow}><Text style={styles.label}>{translate(language, 'filterBy')}</Text>{status.length + priority.length > 0 ? <Pressable onPress={() => onChange([], [])}><Text style={styles.clear}>{translate(language, 'clearFilters')}</Text></Pressable> : null}</View>
    <Text style={styles.groupLabel}>{translate(language, 'status')}</Text>
    <View style={styles.chips}>{statuses.map((value) => <Chip key={value} label={taskStatusLabel(language, value)} selected={status.includes(value)} onPress={() => toggleStatus(value)} />)}</View>
    <Text style={styles.groupLabel}>{translate(language, 'priority')}</Text>
    <View style={styles.chips}>{priorities.map((value) => <Chip key={value} label={taskPriorityLabel(language, value)} selected={priority.includes(value)} onPress={() => togglePriority(value)} />)}</View>
  </View>;
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.chip, selected && styles.selectedChip]} accessibilityRole="checkbox" accessibilityState={{ checked: selected }}><Text style={[styles.chipText, selected && styles.selectedChipText]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  container: { borderBottomColor: '#dcd7ca', borderBottomWidth: 1, paddingBottom: 16 },
  titleRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#879097', fontSize: 11, fontWeight: '900', letterSpacing: 1.5 },
  clear: { color: '#b4552d', fontSize: 12, fontWeight: '800' },
  groupLabel: { color: '#68747a', fontSize: 11, fontWeight: '800', marginTop: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 7 },
  chip: { backgroundColor: '#fffdf8', borderColor: '#dcd7ca', borderRadius: 9, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7 },
  selectedChip: { backgroundColor: '#17242b', borderColor: '#17242b' },
  chipText: { color: '#52626a', fontSize: 12, fontWeight: '700' },
  selectedChipText: { color: '#fffdf8' },
});
