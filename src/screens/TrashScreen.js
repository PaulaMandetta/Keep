import { Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../context/NotesContext';
import { useSettings } from '../context/SettingsContext';
import { useActionSheet } from '../context/ActionSheetContext';
import NotesGrid from '../components/NotesGrid';
import TopBar from '../components/TopBar';
import { UI } from '../constants/colors';

export default function TrashScreen({ navigation }) {
  const { notes, restoreNote, deleteNote, emptyTrash } = useNotes();
  const { columns } = useSettings();
  const trashed = notes.filter((n) => n.trashed);

  const showActions = useActionSheet();

  // Notas na Lixeira não são editáveis: só restaurar ou excluir de vez
  const openMenu = (note) =>
    showActions({
      title: note.title || 'Nota',
      message: 'Não é possível editar notas na Lixeira.',
      options: [
        { label: 'Restaurar', icon: 'restore', onPress: () => restoreNote(note.id) },
        {
          label: 'Excluir permanentemente', icon: 'delete-forever-outline', destructive: true,
          onPress: () => deleteNote(note.id),
        },
      ],
    });

  const confirmEmpty = () =>
    showActions({
      title: 'Esvaziar Lixeira?',
      message: 'Todas as notas na Lixeira serão excluídas permanentemente.',
      options: [
        { label: 'Esvaziar Lixeira', icon: 'delete-forever-outline', destructive: true, onPress: emptyTrash },
      ],
    });

  return (
    <SafeAreaView style={styles.container}>
      <TopBar
        title="Lixeira"
        onMenu={() => navigation.openDrawer()}
        action={trashed.length > 0 ? { label: 'Esvaziar', onPress: confirmEmpty } : undefined}
      />
      <ScrollView contentContainerStyle={styles.scroll}>
        {trashed.length === 0 && (
          <Text style={styles.empty}>🗑️{'\n\n'}Nenhuma nota na Lixeira</Text>
        )}
        <NotesGrid notes={trashed} columns={columns} onPress={openMenu} onLongPress={openMenu} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: UI.background },
  scroll: { paddingHorizontal: 12, paddingBottom: 32 },
  empty: { textAlign: 'center', color: UI.textMuted, marginTop: 80, fontSize: 16 },
});
