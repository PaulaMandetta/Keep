import { createContext, useContext, useState } from 'react';
import BottomSheet, { SheetOption } from '../components/BottomSheet';

const ActionSheetContext = createContext(null);

// Substitui o Alert.alert (que não faz nada na versão web) por uma folha de opções:
// showActions({ title, message, options: [{ label, icon, destructive, onPress }] })
export function ActionSheetProvider({ children }) {
  const [sheet, setSheet] = useState(null);
  const close = () => setSheet(null);

  return (
    <ActionSheetContext.Provider value={setSheet}>
      {children}
      <BottomSheet visible={!!sheet} title={sheet?.title} message={sheet?.message} onClose={close}>
        {sheet?.options.map((option) => (
          <SheetOption
            key={option.label}
            label={option.label}
            icon={option.icon}
            destructive={option.destructive}
            onPress={() => {
              close();
              option.onPress();
            }}
          />
        ))}
      </BottomSheet>
    </ActionSheetContext.Provider>
  );
}

export const useActionSheet = () => useContext(ActionSheetContext);
