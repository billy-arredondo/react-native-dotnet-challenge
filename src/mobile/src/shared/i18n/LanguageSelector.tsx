import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { useLanguageStore } from './language.store';
import { translate, type Language } from './translations';

export function LanguageSelector() {
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const [open, setOpen] = useState(false);
  const options: Language[] = ['en', 'es'];
  const selectLanguage = (option: Language) => {
    setLanguage(option);
    setOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => setOpen((value) => !value)} style={styles.trigger} accessibilityRole="button" accessibilityLabel="Language">
        <Text style={styles.triggerText}>{language === 'en' ? 'EN' : 'ES'}</Text>
        <Text style={styles.chevron}>{open ? '⌃' : '⌄'}</Text>
      </Pressable>
      {open ? <View style={styles.menu}>{options.map((option) => (
        <Pressable key={option} onPressIn={() => selectLanguage(option)} onPress={() => selectLanguage(option)} style={[styles.option, option === language && styles.selected]} accessibilityRole="menuitem">
          <Text style={[styles.optionText, option === language && styles.selectedText]}>{translate(language, option === 'en' ? 'english' : 'spanish')}</Text>
        </Pressable>
      ))}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'relative', zIndex: 2 },
  trigger: { alignItems: 'center', borderColor: '#dcd7ca', borderRadius: 10, borderWidth: 1, cursor: 'pointer', flexDirection: 'row', gap: 5, paddingHorizontal: 10, paddingVertical: 7 },
  triggerText: { color: '#17242b', fontSize: 11, fontWeight: '900' },
  chevron: { color: '#b4552d', fontSize: 13, fontWeight: '900' },
  menu: { backgroundColor: '#fffdf8', borderColor: '#dcd7ca', borderRadius: 10, borderWidth: 1, elevation: 4, position: 'absolute', right: 0, shadowColor: '#17242b', shadowOpacity: 0.12, shadowRadius: 8, top: 38, width: 110 },
  option: { cursor: 'pointer', paddingHorizontal: 12, paddingVertical: 10 },
  selected: { backgroundColor: '#17242b' },
  optionText: { color: '#52626a', fontSize: 12, fontWeight: '700' },
  selectedText: { color: '#fffdf8' },
});
