import { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNotes } from '../context/NotesContext';
import { useSettings } from '../context/SettingsContext';
import { useActionSheet } from '../context/ActionSheetContext';
import NotesGrid from '../components/NotesGrid';
import SortSheet from '../components/SortSheet';
import { UI } from '../constants/colors';

const createdAt = (n) => n.createdAt ?? Number(n.id);

// "Personalizado" mantém a ordem salva (arrastada); as datas mostram as mais recentes primeiro
function sortNotes(list, sortBy) {
  if (sortBy === 'created') return [...list].sort((a, b) => createdAt(b) - createdAt(a));
  if (sortBy === 'modified') {
    return [...list].sort((a, b) => (b.updatedAt ?? createdAt(b)) - (a.updatedAt ?? createdAt(a)));
  }
  return list;
}

export default function HomeScreen({ navigation }) {
  const { notes, trashNote, togglePin, toggleArchive, reorderNotes } = useNotes();
  const { layout, columns, toggleLayout, sortBy, setSortBy } = useSettings();
  const [search, setSearch] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const showActions = useActionSheet();

  const active = useMemo(() => notes.filter((n) => !n.archived && !n.trashed), [notes]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = active.filter(
      (n) => !q || n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
    return sortNotes(filtered, sortBy);
  }, [active, search, sortBy]);

  const pinned = useMemo(() => visible.filter((n) => n.pinned), [visible]);
  const others = useMemo(() => visible.filter((n) => !n.pinned), [visible]);

  const openMenu = (note) =>
    showActions({
      title: note.title || 'Nota',
      options: [
        {
          label: note.pinned ? 'Desafixar' : 'Fixar',
          icon: note.pinned ? 'pin-off-outline' : 'pin-outline',
          onPress: () => togglePin(note.id),
        },
        { label: 'Arquivar', icon: 'archive-arrow-down-outline', onPress: () => toggleArchive(note.id) },
        { label: 'Excluir', icon: 'trash-can-outline', onPress: () => trashNote(note.id) },
      ],
    });

  const gridProps = {
    columns,
    sortable: sortBy === 'custom',
    onPress: (note) => navigation.navigate('Note', { note }),
    onLongPress: openMenu,
    onReorder: reorderNotes,
    onDragChange: setDragging,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.openDrawer()} hitSlop={10}>
          <MaterialCommunityIcons name="menu" size={26} color={UI.text} />
        </Pressable>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.search}
            placeholder="Pesquisar no Keep"
            placeholderTextColor={UI.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {/* Mostra o ícone do modo para o qual vai mudar, como no Keep */}
          <Pressable onPress={toggleLayout} hitSlop={8}>
            <MaterialCommunityIcons
              name={layout === 'grid' ? 'view-agenda-outline' : 'view-grid-outline'}
              size={24}
              color={UI.text}
            />
          </Pressable>
          <Pressable onPress={() => setSortOpen(true)} hitSlop={8}>
            <MaterialCommunityIcons name="swap-vertical" size={24} color={UI.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} scrollEnabled={!dragging}>
        {active.length === 0 && (
          <Text style={styles.empty}>As notas que você adicionar aparecem aqui</Text>
        )}
        {pinned.length > 0 && (
          <>
            <Text style={styles.section}>Fixadas</Text>
            <NotesGrid notes={pinned} {...gridProps} />
            {others.length > 0 && <Text style={styles.section}>Outras</Text>}
          </>
        )}
        <NotesGrid notes={others} {...gridProps} />
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => navigation.navigate('Note')}>
        <Text style={styles.fabIcon}>+</Text>
      </Pressable>

      <SortSheet
        visible={sortOpen}
        selected={sortBy}
        onSelect={setSortBy}
        onClose={() => setSortOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: UI.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, paddingBottom: 8 },
  searchBar: {
    flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 20,
    paddingLeft: 20, paddingRight: 16, height: 52, borderRadius: 26, backgroundColor: UI.searchBar,
  },
  // minWidth: 0 evita que o campo (no navegador) empurre os botões para fora da tela
  search: { flex: 1, minWidth: 0, height: '100%', fontSize: 16, color: UI.text },
  scroll: { paddingHorizontal: 12, paddingBottom: 100 },
  section: { fontSize: 12, fontWeight: '600', color: UI.textMuted, margin: 8, marginTop: 16 },
  empty: { textAlign: 'center', color: UI.textMuted, marginTop: 80, fontSize: 16 },
  fab: {
    position: 'absolute', right: 20, bottom: 32, width: 56, height: 56, borderRadius: 16,
    backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 },
  },
  fabIcon: { fontSize: 32, color: UI.accent, marginTop: -2 },
});
