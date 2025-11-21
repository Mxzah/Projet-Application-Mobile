import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './screens/auth/LoginScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import ListAnnoncesScreen from './screens/items/ListAnnoncesScreen';
import PlaceholderVendre from './screens/items/PlaceholderVendre';
import PlaceholderProgrammes from './screens/items/PlaceholderProgrammes';
import ProgrammeCoursScreen from './screens/items/ProgrammeCoursScreen';
import ProfilScreen from './screens/profil/ProfilScreen';
import { ThemeProvider } from "/home/etd/Projet-Application-Mobile/code/context/ThemeContext.js";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Connexion" screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="Connexion"
              component={LoginScreen}
            />
            <Stack.Screen
              name="Inscription"
              component={SignUpScreen}
            />
            <Stack.Screen
              name="ListAnnonces"
              component={ListAnnoncesScreen}
            />
            <Stack.Screen
              name="Vendre"
              component={PlaceholderVendre}
            />
            <Stack.Screen
              name="Programmes"
              component={PlaceholderProgrammes}
            />
            <Stack.Screen
              name="ProgrammeCours"
              component={ProgrammeCoursScreen}
            />
            <Stack.Screen
              name="Profil"
              component={ProfilScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
