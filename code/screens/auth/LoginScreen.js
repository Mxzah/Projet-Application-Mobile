import { View, Text, Button } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>Bienvenue sur la page de connexion !</Text>
      <Button
        title="Aller à la page Inscription"
        onPress={() => navigation.navigate('Inscription')}
      />
      <Button
        title="Aller à la page Liste des Items"
        onPress={() => navigation.navigate('ListeItems')}
      />
    </View>
  );
}
