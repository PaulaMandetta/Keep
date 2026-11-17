import { ScrollView, Pressable, View, StyleSheet } from 'react-native';
import { NOTE_COLORS, UI } from '../constants/colors';

export default function ColorPicker({ selected, onSelect }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {NOTE_COLORS.map((c) => (
        <Pressable key={c.id} onPress={() => onSelect(c.value)}>
          <View
            style={[
              styles.swatch,
              { backgroundColor: c.value },
              selected === c.value && styles.selected,
            ]}
          />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: UI.border },
  selected: { borderWidth: 2, borderColor: '#A142F4' },
});
