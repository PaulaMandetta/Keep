import { Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../context/NotesContext';
import { useSettings } from '../context/SettingsContext';
import { useActionSheet } from '../context/ActionSheetContext';
import NotesGrid from '../components/NotesGrid';
import TopBar from '../components/TopBar';
import { UI } from '../constants/colors';

export default function ArchiveScreen({ navigation }) {
  const { notes, toggleArchive, trashNote } = useNotes();
  const { columns } = useSettings();
  const archived = notes.filter((n) => n.archived && !n.trashed);

  const showActions = useActionSheet();

  const openMenu = (note) =>
    showActions({
      title: note.title || 'Nota',
      options: [
        { label: 'Desarquivar', icon: 'archive-arrow-up-outline', onPress: () => toggleArchive(note.id) },
        { label: 'Excluir', icon: 'trash-can-outline', onPress: () => trashNote(note.id) },
      ],
    });

  return (
    <SafeAreaView style={styles.container}>
      <TopBar title="Arquivo" onMenu={() => navigation.openDrawer()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {archived.length === 0 && (
          <Text style={styles.empty}>📥{'\n\n'}As notas arquivadas aparecem aqui</Text>
        )}
        <NotesGrid
          notes={archived}
          columns={columns}
          onPress={(note) => navigation.navigate('Note', { note })}
          onLongPress={openMenu}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: UI.background },
  scroll: { paddingHorizontal: 12, paddingBottom: 32 },
  empty: { textAlign: 'center', color: UI.textMuted, marginTop: 80, fontSize: 16 },
});
