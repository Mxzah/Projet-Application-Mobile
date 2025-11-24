import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Picker,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketplaceHeader from '../../components/MarketplaceHeader';
import authService from '../../services/Auth';
import MarthaService from '../../services/Martha';

const marthaService = new MarthaService();

export default function PlaceholderVendre({ navigation }) {


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
              <TextInput
                style={styles.input}
                placeholder="URL ou nom du fichier"
                value={image}
                onChangeText={setImage}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Titre</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex. MacBook Pro 2022"
                value={titre}
                onChangeText={setTitre}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Lieu</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex. Bloc B - Local 2103"
                value={lieu}
                onChangeText={setLieu}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Ajoutez les détails importants"
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
                value={dateFin}
                onChangeText={setDateFin}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Prix demandé</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex. 199.99"
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
                  <Picker.Item label="Sélectionnez un cours" value="" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f9fafb',
  },
  submitButton: {
    marginTop: 6,
    backgroundColor: '#1877f2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
