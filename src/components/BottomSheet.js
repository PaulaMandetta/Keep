import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInDown } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UI } from '../constants/colors';

// Folha que sobe da parte de baixo da tela (base do "Classificar por" e dos menus das notas)
export default function BottomSheet({ visible, title, message, onClose, children }) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        entering={SlideInDown.duration(250)}
        style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}
      >
        {!!title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
        {!!message && <Text style={styles.message}>{message}</Text>}
        <View style={styles.divider} />
        {children}
      </Animated.View>
    </Modal>
  );
}

// Uma opção da folha: ícone opcional à esquerda (ou ✓ quando `checked`)
export function SheetOption({ label, icon, checked, active, destructive, onPress }) {
  const color = destructive ? UI.danger : UI.text;
  return (
    <Pressable style={[styles.option, active && styles.optionActive]} onPress={onPress}>
      <View style={styles.icon}>
        {(icon || checked) && (
          <MaterialCommunityIcons name={checked ? 'check' : icon} size={24} color={color} />
        )}
      </View>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: UI.sheet, borderTopLeftRadius: 28, borderTopRightRadius: 28,
  },
  title: { fontSize: 18, color: UI.text, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 20 },
  message: { fontSize: 14, color: UI.textMuted, paddingHorizontal: 24, marginTop: -12, paddingBottom: 20 },
  divider: { height: 1, backgroundColor: UI.border, marginBottom: 8 },
  option: {
    flexDirection: 'row', alignItems: 'center', height: 48,
    marginHorizontal: 8, paddingHorizontal: 16, borderRadius: 24,
  },
  optionActive: { backgroundColor: UI.sheetActive },
  icon: { width: 48 },
  label: { fontSize: 16 },
});
