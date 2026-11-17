import { View, Text, StyleSheet } from 'react-native';
import { UI } from '../constants/colors';

// Apenas visual: toques e arrastar são tratados pelo NotesGrid
export default function NoteCard({ note }) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: note.color },
        note.color === '#FFFFFF' && styles.bordered,
      ]}
    >
      {!!note.title && <Text style={styles.title}>{note.title}</Text>}
      {!!note.content && (
        <Text style={styles.content} numberOfLines={10}>
          {note.content}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 8, padding: 12 },
  bordered: { borderWidth: 1, borderColor: UI.border },
  title: { fontSize: 16, fontWeight: '600', color: UI.text, marginBottom: 6 },
  content: { fontSize: 14, color: UI.text, lineHeight: 20 },
});
