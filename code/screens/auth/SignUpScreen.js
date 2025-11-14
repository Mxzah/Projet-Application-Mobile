import { View, Text, Button } from 'react-native';

export default function SignUpScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>Voici la page d'inscription !</Text>
      <Button title="Retour" onPress={() => navigation.goBack()} />
    </View>
  );
}
