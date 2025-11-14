import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './screens/auth/LoginScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import ListItemsScreen from './screens/items/ListItemsScreen';
import PlaceholderVendre from './screens/items/PlaceholderVendre';
import PlaceholderProgrammes from './screens/items/PlaceholderProgrammes';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
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
            name="ListeItems" 
            component={ListItemsScreen} 
          />
          <Stack.Screen 
            name="Vendre" 
            component={PlaceholderVendre} 
          />
          <Stack.Screen 
            name="Programmes" 
            component={PlaceholderProgrammes} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
