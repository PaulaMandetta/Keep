import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { NotesProvider } from './src/context/NotesContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { ActionSheetProvider } from './src/context/ActionSheetContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DrawerContent from './src/components/DrawerContent';
import HomeScreen from './src/screens/HomeScreen';
import ArchiveScreen from './src/screens/ArchiveScreen';
import TrashScreen from './src/screens/TrashScreen';
import NoteScreen from './src/screens/NoteScreen';
import { UI } from './src/constants/colors';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const drawerIcon = (name) => ({ color, size }) => (
  <MaterialCommunityIcons name={name} color={color} size={size} />
);

// Telas acessíveis pelo menu lateral
function DrawerScreens() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: UI.drawerActive,
        drawerActiveTintColor: UI.text,
        drawerInactiveTintColor: UI.text,
        drawerItemStyle: { borderRadius: 0, borderTopRightRadius: 24, borderBottomRightRadius: 24 },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'Notas', drawerIcon: drawerIcon('lightbulb-outline') }} />
      <Drawer.Screen name="Archive" component={ArchiveScreen} options={{ title: 'Arquivo', drawerIcon: drawerIcon('archive-arrow-down-outline') }} />
      <Drawer.Screen name="Trash" component={TrashScreen} options={{ title: 'Lixeira', drawerIcon: drawerIcon('trash-can-outline') }} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SettingsProvider>
          <NotesProvider>
            <ActionSheetProvider>
              <NavigationContainer>
                <StatusBar style="dark" />
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Main" component={DrawerScreens} />
                  <Stack.Screen name="Note" component={NoteScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </ActionSheetProvider>
          </NotesProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
