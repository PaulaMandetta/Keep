import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UI } from '../constants/colors';

// Barra superior das telas do Drawer (Arquivo, Lixeira): ☰ + título + ação opcional
export default function TopBar({ title, onMenu, action }) {
  return (
    <View style={styles.bar}>
      <Pressable onPress={onMenu} hitSlop={10}>
        <MaterialCommunityIcons name="menu" size={26} color={UI.text} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      {action && (
        <Pressable onPress={action.onPress} hitSlop={10}>
          <Text style={styles.action}>{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 56, gap: 20 },
  title: { flex: 1, fontSize: 20, color: UI.text },
  action: { fontSize: 14, fontWeight: '600', color: UI.textMuted },
});
