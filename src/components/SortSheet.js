import BottomSheet, { SheetOption } from './BottomSheet';

export const SORT_OPTIONS = [
  { id: 'custom', label: 'Personalizado (padrão)' },
  { id: 'created', label: 'Data de criação' },
  { id: 'modified', label: 'Data de modificação' },
];

// "Drawer" de baixo para cima com as opções de ordenação
export default function SortSheet({ visible, selected, onSelect, onClose }) {
  return (
    <BottomSheet visible={visible} title="Classificar por" onClose={onClose}>
      {SORT_OPTIONS.map((option) => (
        <SheetOption
          key={option.id}
          label={option.label}
          checked={option.id === selected}
          active={option.id === selected}
          onPress={() => {
            onSelect(option.id);
            onClose();
          }}
        />
      ))}
    </BottomSheet>
  );
}
