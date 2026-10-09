import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = { title: string; message: string; actionLabel?: string; onAction?: () => void };

export function ScreenState({ title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.mark}>/ / /</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction ? <Pressable onPress={onAction} style={styles.button}><Text style={styles.buttonText}>{actionLabel}</Text></Pressable> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 32 },
  mark: { color: '#b4552d', fontSize: 25, fontWeight: '800', letterSpacing: 5, marginBottom: 16 },
  title: { color: '#17242b', fontSize: 22, fontWeight: '800', textAlign: 'center' },
  message: { color: '#68747a', fontSize: 15, lineHeight: 22, marginTop: 8, maxWidth: 320, textAlign: 'center' },
  button: { backgroundColor: '#17242b', borderRadius: 12, marginTop: 22, paddingHorizontal: 20, paddingVertical: 13 },
  buttonText: { color: '#fffdf8', fontSize: 14, fontWeight: '800' },
});
