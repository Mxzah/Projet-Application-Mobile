import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketplaceHeader from '../../components/MarketplaceHeader';
import { Picker } from '@react-native-picker/picker';
import authService from '../../services/Auth';
import MarthaService from '../../services/Martha';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { getCreateAnnonceStyles } from '../../styles';
import { useTheme } from "../../context/ThemeContext";

const marthaService = new MarthaService();

export default function VendreProduitScreen({ navigation }) {
  const { theme } = useTheme();
  const styles = getCreateAnnonceStyles(theme);

  function handleMettreEnVente() {
    const userId = authService.currentUser?.id ?? '';
    setIdUtilisateur(userId);

    const payload = {
      titre,
      lieu,
      description,
      image,
      dateFin,
      prix,
      cours: coursSelection ?? '',
      idUtilisateur: userId,
    };

    console.log('Mettre en vente', payload);
  }

  const [titre, setTitre] = useState("");
  const [lieu, setLieu] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [prix, setPrix] = useState("");
  const [coursOptions, setCoursOptions] = useState([]);
  const [coursSelection, setCoursSelection] = useState('');
  const [idUtilisateur, setIdUtilisateur] = useState("");

  useEffect(() => {
    let isMounted = true;
    marthaService
      .getCours()
      .then((data) => {
        if (!isMounted) return;
        setCoursOptions(data.data ?? []);
      })
      .catch((error) => {
        console.warn('Impossible de charger les cours', error);
        if (isMounted) {
          setCoursOptions([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleTakePhoto() {

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.1,
      base64: true,
      allowsEditing: false,
    });

    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset) return;

    try {
      await MediaLibrary.saveToLibraryAsync(asset.uri);
    } catch (error) {
      console.warn('Impossible d’enregistrer la photo', error);
    }

    setImage(asset.base64 ?? '');
  }

  return (
    <SafeAreaView style={styles.container}>
      <MarketplaceHeader
        active="Vendre"
        onPressVendre={() => { /* already here */ }}
        onPressAcheter={() => navigation.navigate('ListAnnonces')}
        onPressProgrammes={() => navigation.navigate('Programmes')}
      />
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            <Text style={styles.title}>Votre annonce</Text>
            <Text style={styles.subtitle}>Complétez ces informations pour publier</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Image</Text>
              {image ? (
                <Image source={{ uri: `data:image/jpeg;base64,${image}` }} style={styles.preview} />
              ) : (
                <View style={[styles.preview, styles.previewPlaceholder]}>
                  <Text style={styles.previewPlaceholderText}>Aucune photo</Text>
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton} onPress={handleTakePhoto}>
                <Text style={styles.cameraButtonLabel}>Prendre une photo</Text>
              </TouchableOpacity>
              <Text style={styles.helperText}>L’image est compressée et stockée en base64 (qualité 0.1).</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Titre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex. MacBook Pro 2022"
                placeholderTextColor="#888"
                value={titre}
                onChangeText={setTitre}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Lieu</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex. Bloc B - Local 2103"
                placeholderTextColor="#888"
                value={lieu}
                onChangeText={setLieu}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Ajoutez les détails importants"
                placeholderTextColor="#888"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Date de fin</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-JJ"
                placeholderTextColor="#888"
                value={dateFin}
                onChangeText={setDateFin}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Prix demandé</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex. 199.99"
                placeholderTextColor="#888"
                keyboardType="numeric"
                value={prix}
                onChangeText={setPrix}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Cours associé</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={coursSelection}
                  onValueChange={(value) => setCoursSelection(value)}
                >
                  <Picker.Item label="Sélectionnez un cours" value="" style={{ color: '#888' }} />
                  {coursOptions.map((item) => (
                    <Picker.Item
                      key={item.id_cours}
                      label={`${item.code} - ${item.nom}`}
                      value={item.id_cours}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleMettreEnVente}>
              <Text style={styles.submitLabel}>Mettre en vente</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

