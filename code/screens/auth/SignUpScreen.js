import React, { useState } from 'react';
import { View, Text, Button, TextInput, ActivityIndicator, Alert } from 'react-native';
import authService from '../../services/Auth';

export default function SignUpScreen({ navigation }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [courriel, setCourriel] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    if (!nom || !prenom || !courriel || !motDePasse) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    try {
      setIsSubmitting(true);

      const success = await authService.signUp({
        nom,
        prenom,
        courriel,
        mot_de_passe: motDePasse,
      });

      setIsSubmitting(false);

      if (success) {
        Alert.alert('Succès', 'Compte créé !', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          'Erreur',
          "Impossible de créer l'utilisateur (courriel déjà utilisé ?)"
        );
      }
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
      Alert.alert(
        'Erreur',
        "Une erreur s'est produite lors de l'inscription."
      );
    }
  };


  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20, textAlign: 'center' }}>
        Inscription
      </Text>

      <TextInput
        placeholder="Nom"
        value={nom}
        onChangeText={setNom}
        style={inputStyle}
      />

      <TextInput
        placeholder="Prénom"
        value={prenom}
        onChangeText={setPrenom}
        style={inputStyle}
      />

      <TextInput
        placeholder="Courriel"
        value={courriel}
        onChangeText={setCourriel}
        autoCapitalize="none"
        keyboardType="email-address"
        style={inputStyle}
      />

      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        value={motDePasse}
        onChangeText={setMotDePasse}
        style={inputStyle}
      />

      {isSubmitting ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Créer un compte" onPress={handleSignUp} />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Retour" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const inputStyle = {
  width: '100%',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 12,
  marginBottom: 12
};
