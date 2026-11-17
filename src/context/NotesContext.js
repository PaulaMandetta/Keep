import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@keep_clone/notes';
const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Carrega as notas salvas ao abrir o app
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => json && setNotes(JSON.parse(json)))
      .finally(() => setLoaded(true));
  }, []);

  // Salva sempre que a lista muda (depois do carregamento inicial)
  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes, loaded]);

  const saveNote = (note) => {
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === note.id);
      const updated = { ...note, updatedAt: Date.now() };
      // Mescla para preservar campos que o editor não conhece (ex.: trashed)
      return exists
        ? prev.map((n) => (n.id === note.id ? { ...n, ...updated } : n))
        : [{ ...updated, createdAt: updated.updatedAt }, ...prev];
    });
  };

  // Ordem "Personalizada": recoloca as notas de `ids` (ex.: só as fixadas) nas
  // mesmas posições que elas ocupavam, seguindo a nova ordem arrastada
  const reorderNotes = (ids) =>
    setNotes((prev) => {
      const byId = new Map(prev.map((n) => [n.id, n]));
      const moved = new Set(ids);
      let i = 0;
      return prev.map((n) => (moved.has(n.id) ? byId.get(ids[i++]) : n));
    });

  const updateNote = (id, changes) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...changes } : n)));

  // Exclui de vez (usado na Lixeira e para descartar notas vazias)
  const deleteNote = (id) => setNotes((prev) => prev.filter((n) => n.id !== id));

  const togglePin = (id) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  // Como no Keep, arquivar desafixa a nota
  const toggleArchive = (id) =>
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, archived: !n.archived, pinned: false } : n))
    );

  const trashNote = (id) => updateNote(id, { trashed: true, pinned: false });

  const restoreNote = (id) => updateNote(id, { trashed: false });

  const emptyTrash = () => setNotes((prev) => prev.filter((n) => !n.trashed));

  return (
    <NotesContext.Provider
      value={{
        notes, loaded, saveNote, deleteNote, togglePin,
        toggleArchive, trashNote, restoreNote, emptyTrash, reorderNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);
