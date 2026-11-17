import { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../context/NotesContext';
import ColorPicker from '../components/ColorPicker';
import { UI } from '../constants/colors';

export default function NoteScreen({ navigation, route }) {
  const { saveNote, deleteNote } = useNotes();
  const existing = route.params?.note;

  const [id] = useState(existing?.id ?? Date.now().toString());
  const [title, setTitle] = useState(existing?.title ?? '');
  const [content, setContent] = useState(existing?.content ?? '');
  const [color, setColor] = useState(existing?.color ?? '#FFFFFF');
  const [pinned, setPinned] = useState(existing?.pinned ?? false);
  const archived = existing?.archived ?? false;

  // Igual ao Keep: salva ao voltar; nota vazia é descartada
  const saveAndClose = (changes) => {
    if (title.trim() || content.trim()) {
      saveNote({ id, title, content, color, pinned, archived, ...changes });
    } else if (existing) {
      deleteNote(id);
    }
    navigation.goBack();
  };

  // Fixar uma nota arquivada a traz de volta para a tela principal
  const handleBack = () => saveAndClose(pinned ? { archived: false } : {});

  const handleArchive = () => saveAndClose({ archived: !archived, pinned: false });

  // Excluir manda a nota para a Lixeira (com as edições atuais)
  const handleDelete = () => saveAndClose({ trashed: true, pinned: false });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: color }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable onPress={handleBack} hitSlop={10}>
            <Text style={styles.icon}>←</Text>
          </Pressable>
          <View style={styles.actions}>
            <Pressable onPress={() => setPinned((p) => !p)} hitSlop={10}>
              <Text style={[styles.icon, !pinned && styles.faded]}>📌</Text>
            </Pressable>
            <Pressable onPress={handleArchive} hitSlop={10}>
              <Text style={[styles.icon, !archived && styles.faded]}>📥</Text>
            </Pressable>
          </View>
        </View>

        <TextInput
          style={styles.title}
          placeholder="Título"
          placeholderTextColor={UI.textMuted}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={styles.content}
          placeholder="Nota"
          placeholderTextColor={UI.textMuted}
          value={content}
          onChangeText={setContent}
          multiline
          autoFocus={!existing}
          textAlignVertical="top"
        />

        <ColorPicker selected={color} onSelect={setColor} />
        <Pressable onPress={handleDelete} style={styles.delete}>
          <Text style={styles.deleteText}>Excluir nota</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  actions: { flexDirection: 'row', gap: 24 },
  icon: { fontSize: 22, color: UI.text },
  faded: { opacity: 0.3 },
  title: { fontSize: 22, color: UI.text, paddingHorizontal: 16, paddingVertical: 8 },
  content: { flex: 1, fontSize: 16, color: UI.text, paddingHorizontal: 16, lineHeight: 22 },
  delete: { alignSelf: 'center', padding: 12, marginBottom: 8 },
  deleteText: { color: UI.textMuted, fontSize: 14 },
});
