import { Text, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { UI } from '../constants/colors';

// Conteúdo do Drawer: logo "Keep" + itens das telas (Notas, Arquivo, Lixeira)
export default function DrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <Text style={styles.logo}>
        <Text style={styles.logoGoogle}>Google </Text>Keep
      </Text>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingStart: 0, paddingEnd: 12 },
  logo: { fontSize: 22, color: UI.textMuted, marginHorizontal: 24, marginVertical: 16 },
  logoGoogle: { fontWeight: '500' },
});
