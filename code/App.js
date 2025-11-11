import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ListItemsScreen from './screens/ListItemsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Connexion">
        <Stack.Screen 
          name="Connexion" 
          component={LoginScreen} 
          options={{ title: 'Connexion' }} 
        />
        <Stack.Screen 
          name="Inscription" 
          component={SignUpScreen} 
          options={{ title: 'Inscription' }} 
        />
        <Stack.Screen 
          name="ListeItems" 
          component={ListItemsScreen} 
          options={{ title: 'Liste des Items' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
