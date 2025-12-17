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
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketplaceHeader from '../../components/MarketplaceHeader';
import { Picker } from '@react-native-picker/picker';
import marthaService from '../../services/Martha';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { getCreateAnnonceStyles } from '../../styles';
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from '../../context/AuthContext';

export default function VendreProduitScreen({ navigation, route }) {
  const { theme } = useTheme();
  const styles = getCreateAnnonceStyles(theme);
  const { currentUser } = useAuth();

  const annonceToEdit = route?.params?.annonceToEdit;
  const isEditMode = !!annonceToEdit;

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

    const errors = [];

    if (!titre || titre.trim() === '') {
      errors.push('• Veuillez entrer un titre pour votre annonce.');
    }

    if (!prix || prix.trim() === '' || isNaN(prix) || parseFloat(prix) <= 0) {
      errors.push('• Veuillez entrer un prix valide (supérieur à 0).');
    }

    if (!lieu || lieu.trim() === '') {
      errors.push('• Veuillez entrer un lieu pour votre annonce.');
    }

    if (!dateFin || dateFin.trim() === '') {
      errors.push('• Veuillez entrer une date de fin pour votre annonce.');
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2}:\d{2})?$/;
      if (!dateRegex.test(dateFin)) {
        errors.push('• Le format de la date doit être AAAA-MM-JJ ou AAAA-MM-JJ HH:MM:SS.');
      } else {
        const dateFinPart = dateFin.trim().split(' ')[0];
        const [year, month, day] = dateFinPart.split('-').map(Number);
        const dateFinObj = new Date(year, month - 1, day);
        
        // Vérifier que la date existe (ex: 2025-02-30 n'existe pas)
        if (dateFinObj.getFullYear() !== year || 
            dateFinObj.getMonth() !== month - 1 || 
            dateFinObj.getDate() !== day) {
          errors.push('• La date entrée n\'existe pas (ex: le 30 février n\'existe pas).');
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (dateFinObj < today) {
            errors.push('• La date de fin doit être aujourd\'hui ou dans le futur.');
          }
        }
      }
    }

    if (!coursSelection || coursSelection === '') {
      errors.push('• Veuillez sélectionner un cours associé.');
    }

    const userId = currentUser?.id ?? '';
    if (!userId) {
      errors.push('• Vous devez être connecté pour mettre un produit en vente.');
    }

    if (image && image.length > 300000) {
      errors.push('• L\'image est trop grande. Veuillez reprendre une photo avec une qualité plus faible.');
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join('\n'));
      return;
    }

    setIdUtilisateur(userId);

    try {
      let ok;
      if (isEditMode && annonceToEdit) {
        let dateDebut = annonceToEdit.date_debut || new Date().toISOString().split('T')[0];
        if (dateDebut && typeof dateDebut === 'string') {
          if (dateDebut.includes(' ')) {
            dateDebut = dateDebut.split(' ')[0];
          }
          if (dateDebut.includes('T')) {
            dateDebut = dateDebut.split('T')[0];
          }
        }
        if (!dateDebut || dateDebut === '') {
          dateDebut = new Date().toISOString().split('T')[0];
        }
        
        if (!dateDebut.includes(' ')) {
          dateDebut = dateDebut + ' 00:00:00';
        }
        
        let dateFinFormatted = dateFin.trim();
        if (dateFinFormatted.includes(' ')) {
          const parts = dateFinFormatted.split(' ');
          if (parts.length === 2) {
            const datePart = parts[0];
            const timePart = parts[1];
            if (timePart.match(/^\d{2}:\d{2}:\d{2}$/)) {
              dateFinFormatted = `${datePart} ${timePart}`;
            } else {
              dateFinFormatted = datePart + ' 23:59:59';
            }
          } else {
            dateFinFormatted = parts[0] + ' 23:59:59';
          }
        } else {
          dateFinFormatted = dateFinFormatted + ' 23:59:59';
        }
        
        const idCoursNum = coursSelection ? Number(coursSelection) : null;
        
        console.log('Données envoyées pour updateAnnonce:', {
          id_annonce: annonceToEdit.id_annonce,
          date_debut: dateDebut,
          date_fin: dateFinFormatted,
          prix_demande: parseFloat(prix),
          lieu,
          id_cours: idCoursNum,
          titre,
          description: description || null,
          image_base64: image ? `${image.substring(0, 50)}...` : null
        });
        
        ok = await marthaService.updateAnnonce(
          annonceToEdit.id_annonce,
          titre,
          lieu,
          description || null,
          image || null,
          dateDebut,
          dateFinFormatted,
          parseFloat(prix),
          idCoursNum,
          annonceToEdit.id_utilisateur || userId
        );
      } else {
        ok = await marthaService.insertAnnonce(
          dateFin, 
          prix, 
          lieu, 
          userId, 
          coursSelection, 
          'Produit',
          titre,
          description || null,
          image || null
        );
      }
      
      if (!ok) {
        setErrorMessage(isEditMode 
          ? 'Une erreur est survenue lors de la modification de votre annonce. Veuillez réessayer.'
          : 'Une erreur est survenue lors de la mise en vente de votre produit. Veuillez réessayer.');
        return;
      }
      
      setSuccessMessage(isEditMode 
        ? 'Votre annonce a été modifiée avec succès!'
        : 'Votre produit a été mis en vente avec succès!');
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

  useEffect(() => {
    if (annonceToEdit) {
      setTitre(annonceToEdit.titre || "");
      setLieu(annonceToEdit.lieu || "");
      setDescription(annonceToEdit.description || "");
      setImage(annonceToEdit.image_base64 || "");
      setDateFin(annonceToEdit.date_fin || "");
      setPrix(String(annonceToEdit.prix_demande || ""));
      setIdUtilisateur(String(annonceToEdit.id_utilisateur || ""));
    }
  }, [annonceToEdit]);

  useEffect(() => {
    if (annonceToEdit && annonceToEdit.id_cours && coursOptions.length > 0) {
      const coursId = annonceToEdit.id_cours;
      const coursIdString = String(coursId);
      setCoursSelection(coursIdString);
    }
  }, [annonceToEdit, coursOptions]);

  async function handleTakePhoto() {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.01,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      exif: false,
    });

    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset) return;

    const base64Image = asset.base64 ?? '';
    //const base64Image = '';
    
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
      <MarketplaceHeader active="Vendre" />
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
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
          <View style={styles.formCard}>
            <Text style={styles.title}>{isEditMode ? 'Modifier votre annonce' : 'Votre annonce'}</Text>
            <Text style={styles.subtitle}>{isEditMode ? 'Modifiez les informations de votre annonce' : 'Complétez ces informations pour publier'}</Text>

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
              <Text style={styles.submitLabel}>{isEditMode ? 'Modifier l\'annonce' : 'Mettre en vente'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

