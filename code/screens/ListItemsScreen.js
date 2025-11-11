import { View, Text, Button } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>Bienvenue sur la page des items en vente !</Text>
      <Button
        title="Retour"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}
