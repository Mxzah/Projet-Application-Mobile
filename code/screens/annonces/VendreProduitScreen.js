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
  Platform,
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

  const [titre, setTitre] = useState("");
  const [lieu, setLieu] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [prix, setPrix] = useState("");
  const [coursOptions, setCoursOptions] = useState([]);
  const [coursSelection, setCoursSelection] = useState('');
  const [idUtilisateur, setIdUtilisateur] = useState("");
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleMettreEnVente() {
    setSuccessMessage('');
    setErrorMessage('');

    if (!titre || titre.trim() === '') {
      setErrorMessage('Veuillez entrer un titre pour votre annonce.');
      return;
    }

    if (!prix || prix.trim() === '' || isNaN(prix) || parseFloat(prix) <= 0) {
      setErrorMessage('Veuillez entrer un prix valide (supérieur à 0).');
      return;
    }

    if (!lieu || lieu.trim() === '') {
      setErrorMessage('Veuillez entrer un lieu pour votre annonce.');
      return;
    }

    if (!dateFin || dateFin.trim() === '') {
      setErrorMessage('Veuillez entrer une date de fin pour votre annonce.');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateFin)) {
      setErrorMessage('Le format de la date doit être AAAA-MM-JJ (ex: 2024-12-31).');
      return;
    }

    if (!coursSelection || coursSelection === '') {
      setErrorMessage('Veuillez sélectionner un cours associé.');
      return;
    }

    const userId = authService.currentUser?.id ?? '';
    if (!userId) {
      setErrorMessage('Vous devez être connecté pour mettre un produit en vente.');
      return;
    }

    setIdUtilisateur(userId);

    if (image && image.length > 300000) {
      setErrorMessage('L\'image est trop grande. Veuillez reprendre une photo avec une qualité plus faible.');
      return;
    }

    try {
      const ok = await marthaService.insertAnnonce(
        dateFin, 
        prix, 
        lieu, 
        userId, 
        coursSelection, 
        1,
        titre,
        description || null,
        image || null
      );
      
      if (!ok) {
        setErrorMessage('Une erreur est survenue lors de la mise en vente de votre produit. Veuillez réessayer.');
        return;
      }
      
      setSuccessMessage('Votre produit a été mis en vente avec succès!');
      setTimeout(() => {
        navigation.navigate('ListAnnonces');
        setTitre('');
        setLieu('');
        setDescription('');
        setImage('');
        setDateFin('');
        setPrix('');
        setCoursSelection('');
        setIdUtilisateur('');
        setSuccessMessage('');
        setErrorMessage('');
      }, 2000);
    } catch (error) {
      setErrorMessage('Une erreur est survenue lors de la mise en vente de votre produit. Veuillez réessayer.');
      console.error('Erreur lors de la mise en vente:', error);
    }
  }
  
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
      quality: 0.0000001,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      exif: false,
    });

    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset) return;

    const base64Image = asset.base64 ?? '';
    
    const MAX_BASE64_LENGTH = 300000;
    
    if (base64Image.length > MAX_BASE64_LENGTH) {
      Alert.alert(
        'Image trop grande',
        `L'image est trop grande (${Math.round(base64Image.length / 1024)}KB). Veuillez reprendre une photo.`,
        [{ text: 'OK' }]
      );
      return;
    }

    if (Platform.OS !== 'web' && MediaLibrary.saveToLibraryAsync) {
      try {
        await MediaLibrary.saveToLibraryAsync(asset.uri);
      } catch (error) {
        console.warn("Impossible d'enregistrer la photo dans la bibliothèque", error);
      }
    }

    setImage(base64Image);
  }

  return (
    <SafeAreaView style={styles.container}>
      <MarketplaceHeader
        active="Vendre"
        onPressVendre={() => {}}
        onPressAcheter={() => navigation.navigate('ListAnnonces')}
        onPressProgrammes={() => navigation.navigate('Programmes')}
      />
      <View style={{ flex: 1 }}>
        {successMessage ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
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
              <Text style={styles.helperText}>L'image est fortement compressée (qualité 1%) pour réduire la taille. Maximum 300KB.</Text>
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

