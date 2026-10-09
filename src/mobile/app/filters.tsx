import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { type TaskPriority, type TaskStatus } from '../src/features/tasks/api/task.schemas';
import { useTaskFiltersStore } from '../src/features/tasks/store/task-filters.store';

const statuses: { value: TaskStatus; label: string }[] = [
  { value: 'Todo', label: 'To do' },
  { value: 'InProgress', label: 'In progress' },
  { value: 'Done', label: 'Done' },
];

const priorities: { value: TaskPriority; label: string }[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' },
];

export default function FiltersScreen() {
  const savedStatus = useTaskFiltersStore((state) => state.status);
  const savedPriority = useTaskFiltersStore((state) => state.priority);
  const setFilters = useTaskFiltersStore((state) => state.setFilters);
  const clearFilters = useTaskFiltersStore((state) => state.clearFilters);
  const [status, setStatus] = useState<TaskStatus[]>(savedStatus);
  const [priority, setPriority] = useState<TaskPriority[]>(savedPriority);

  function toggle<T extends string>(value: T, current: T[], setCurrent: (values: T[]) => void) {
    setCurrent(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function clear() {
    setStatus([]);
    setPriority([]);
    clearFilters();
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>NARROW THE VIEW</Text>
      <Text style={styles.heading}>What needs your attention?</Text>
      <Text style={styles.description}>Choose one or more values. Your selection will apply to the task board.</Text>

      <Text style={styles.label}>STATUS</Text>
      <View style={styles.chips}>
        {statuses.map((item) => <Chip key={item.value} label={item.label} selected={status.includes(item.value)} onPress={() => toggle(item.value, status, setStatus)} />)}
      </View>

      <Text style={styles.label}>PRIORITY</Text>
      <View style={styles.chips}>
        {priorities.map((item) => <Chip key={item.value} label={item.label} selected={priority.includes(item.value)} onPress={() => toggle(item.value, priority, setPriority)} />)}
      </View>

      <View style={styles.footer}>
        <Pressable onPress={clear} style={styles.clearButton}><Text style={styles.clearText}>Clear all</Text></Pressable>
        <Pressable onPress={() => { setFilters({ status, priority }); router.back(); }} style={styles.applyButton}><Text style={styles.applyText}>Apply filters</Text></Pressable>
      </View>
    </ScrollView>
  );
}

function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.chip, selected && styles.selectedChip]} accessibilityRole="checkbox" accessibilityState={{ checked: selected }}><Text style={[styles.chipText, selected && styles.selectedChipText]}>{label}</Text>{selected ? <Text style={styles.check}>✓</Text> : null}</Pressable>;
}

const styles = StyleSheet.create({
  content: { backgroundColor: '#f6f2ea', flexGrow: 1, padding: 24 },
  kicker: { color: '#b4552d', fontSize: 11, fontWeight: '900', letterSpacing: 1.6 },
  heading: { color: '#17242b', fontSize: 30, fontWeight: '900', letterSpacing: -0.7, lineHeight: 35, marginTop: 17 },
  description: { color: '#68747a', fontSize: 15, lineHeight: 22, marginTop: 11 },
  label: { color: '#879097', fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginTop: 34 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 13 },
  chip: { alignItems: 'center', backgroundColor: '#fffdf8', borderColor: '#dcd7ca', borderRadius: 12, borderWidth: 1, flexDirection: 'row', gap: 7, paddingHorizontal: 14, paddingVertical: 12 },
  selectedChip: { backgroundColor: '#17242b', borderColor: '#17242b' },
  chipText: { color: '#52626a', fontSize: 14, fontWeight: '700' },
  selectedChipText: { color: '#fffdf8' },
  check: { color: '#d9784c', fontSize: 14, fontWeight: '900' },
  footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 48 },
  clearButton: { paddingVertical: 13 },
  clearText: { color: '#b4552d', fontSize: 14, fontWeight: '800' },
  applyButton: { backgroundColor: '#17242b', borderRadius: 12, paddingHorizontal: 18, paddingVertical: 13 },
  applyText: { color: '#fffdf8', fontSize: 14, fontWeight: '800' },
});
