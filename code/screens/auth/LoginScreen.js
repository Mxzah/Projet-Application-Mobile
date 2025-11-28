import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import authService from "../../services/Auth";

export default function LoginScreen({ navigation }) {
  const [courriel, setCourriel] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!courriel || !motDePasse) {
      Alert.alert("Erreur", "Entre ton courriel et ton mot de passe.");
      return;
    }

    try {
      setLoading(true);

      const success = await authService.logIn({
        courriel,
        mot_de_passe: motDePasse
      });

      setLoading(false);

      if (success) {
        console.log("success");
        navigation.navigate("ListAnnonces");
      } else {
        Alert.alert("Erreur", "Courriel ou mot de passe incorrect.");
      }
    } catch (e) {
      console.error(e);
      setLoading(false);
      Alert.alert("Erreur", "Impossible de se connecter.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, textAlign: "center", marginBottom: 20 }}>
        Connexion
      </Text>

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
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
        style={inputStyle}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={{ marginBottom: 12 }}>
          <Button title="Se connecter" onPress={handleLogin} />
        </View>
      )}

      <View style={{ marginTop: 4 }}>
        <Button
          title="Créer un compte"
          onPress={() => navigation.navigate("Inscription")}
        />
      </View>
    </View>
  );
}

const inputStyle = {
  width: "100%",
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
};


