import React, { useState } from 'react';
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

export default function PlaceholderVendre({ navigation }) {


  const COURS_DATA = [
    { id_cours: 1, code: 'INF101', nom: 'Programmation 1', description: 'Introduction aux concepts de base en programmation.', id_programme: 1 },
    { id_cours: 2, code: 'INF205', nom: 'Réseaux informatiques', description: 'Principes de configuration et gestion de réseaux.', id_programme: 1 },

    { id_cours: 3, code: 'SHU110', nom: 'Introduction à la psychologie', description: 'Étude du comportement humain et des processus mentaux.', id_programme: 2 },
    { id_cours: 4, code: 'SHU220', nom: 'Sociologie contemporaine', description: 'Analyse des structures et dynamiques sociales.', id_programme: 2 },

    { id_cours: 5, code: 'MEC120', nom: 'Dessin technique', description: 'Introduction à la lecture et production de plans mécaniques.', id_programme: 3 },
    { id_cours: 6, code: 'MEC245', nom: 'Fabrication assistée', description: 'Étude des procédés manufacturiers modernes.', id_programme: 3 },

    { id_cours: 7, code: 'COM110', nom: 'Principes comptables', description: 'Introduction aux méthodes et normes comptables.', id_programme: 4 },
    { id_cours: 8, code: 'GES240', nom: 'Gestion financière', description: 'Analyse financière et gestion des budgets.', id_programme: 4 },

    { id_cours: 9, code: 'EDS101', nom: 'Développement humain', description: "Étude des étapes du développement global de l'humain.", id_programme: 5 },
    { id_cours: 10, code: 'EDS330', nom: 'Intervention spécialisée', description: "Méthodes d’intervention auprès de clientèles vulnérables.", id_programme: 5 },

    { id_cours: 11, code: 'SCI150', nom: 'Biologie générale', description: 'Introduction aux systèmes vivants.', id_programme: 6 },
    { id_cours: 12, code: 'SCI260', nom: 'Chimie organique', description: 'Étude des composés du carbone et de leurs réactions.', id_programme: 6 },

    { id_cours: 13, code: 'DES130', nom: 'Typographie', description: 'Bases du design typographique et lisibilité.', id_programme: 7 },
    { id_cours: 14, code: 'DES320', nom: 'Illustration numérique', description: 'Techniques de création d’illustrations sur tablette graphique.', id_programme: 7 },

    { id_cours: 15, code: 'INFIRM101', nom: 'Soins de base', description: 'Apprentissage des techniques de soins primaires.', id_programme: 8 },
    { id_cours: 16, code: 'INFIRM270', nom: 'Pharmacologie', description: 'Introduction aux médicaments et à leurs effets.', id_programme: 8 },

    { id_cours: 17, code: 'ARCH115', nom: 'Lecture de plans', description: 'Compréhension et interprétation des dessins architecturaux.', id_programme: 9 },
    { id_cours: 18, code: 'ARCH270', nom: 'Logiciels CAO', description: 'Utilisation de logiciels de dessin assisté pour l’architecture.', id_programme: 9 },

    { id_cours: 19, code: 'TRM100', nom: 'Fondements du tourisme', description: 'Introduction aux concepts et réalités de l’industrie touristique.', id_programme: 10 },
    { id_cours: 20, code: 'TRM310', nom: 'Gestion d’hébergement', description: 'Gestion opérationnelle d’établissements touristiques.', id_programme: 10 },

    { id_cours: 21, code: 'ART110', nom: 'Création littéraire', description: 'Exploration et écriture de textes variés.', id_programme: 11 },
    { id_cours: 22, code: 'COM210', nom: 'Communication visuelle', description: 'Étude du rapport entre image et message.', id_programme: 11 },

    { id_cours: 23, code: 'POL101', nom: 'Techniques d’enquête', description: 'Introduction aux méthodes de collecte de preuves.', id_programme: 12 },
    { id_cours: 24, code: 'POL305', nom: 'Intervention policière', description: 'Mise en situation et résolution d’incidents.', id_programme: 12 },

    { id_cours: 25, code: 'DIT115', nom: 'Nutrition humaine', description: 'Étude des besoins nutritionnels selon les stades de vie.', id_programme: 13 },
    { id_cours: 26, code: 'DIT310', nom: 'Gestion alimentaire', description: 'Organisation des services alimentaires professionnels.', id_programme: 13 },

    { id_cours: 27, code: 'GCO120', nom: 'Marketing de base', description: 'Introduction aux stratégies marketing.', id_programme: 14 },
    { id_cours: 28, code: 'GCO255', nom: 'Gestion des ventes', description: 'Méthodes de gestion d’équipes de vente.', id_programme: 14 },

    { id_cours: 29, code: 'ELEC101', nom: 'Circuits électriques', description: 'Analyse des circuits et lois fondamentales.', id_programme: 15 },
    { id_cours: 30, code: 'ELEC340', nom: 'Systèmes automatisés', description: 'Programmation et contrôle de systèmes automatisés.', id_programme: 15 },

    { id_cours: 31, code: 'PHY120', nom: 'Rééducation physique', description: 'Principes de réadaptation biomécanique.', id_programme: 16 },
    { id_cours: 32, code: 'PHY250', nom: 'Anatomie fonctionnelle', description: 'Étude du corps humain en mouvement.', id_programme: 16 },

    { id_cours: 33, code: 'EAU115', nom: 'Traitement des eaux', description: 'Méthodes de filtration et désinfection de l’eau.', id_programme: 17 },
    { id_cours: 34, code: 'EAU330', nom: 'Échantillonnage environnemental', description: 'Techniques de prélèvement et d’analyse de l’eau.', id_programme: 17 },

    { id_cours: 35, code: 'JUR101', nom: 'Initiation au droit', description: 'Introduction au système juridique québécois.', id_programme: 18 },
    { id_cours: 36, code: 'JUR350', nom: 'Rédaction juridique', description: 'Apprentissage des documents légaux courants.', id_programme: 18 },

    { id_cours: 37, code: 'ANM110', nom: 'Modélisation 3D', description: 'Introduction à la création d’objets 3D.', id_programme: 19 },
    { id_cours: 38, code: 'ANM320', nom: 'Animation de personnages', description: 'Techniques d’animation avancée pour personnages.', id_programme: 19 },

    { id_cours: 39, code: 'IG101', nom: "Bases des systèmes d'information", description: 'Introduction à la gestion des données et des systèmes.', id_programme: 20 },
    { id_cours: 40, code: 'IG240', nom: 'Développement d’applications', description: 'Analyse, conception et programmation d’applications.', id_programme: 20 },
  ];

  function handleMettreEnVente() {
    const userId = authService.currentUser?.id ?? '';
    setIdUtilisateur(userId);
    console.log('Mettre en vente', {
      titre,
      lieu,
      description,
      image,
      dateFin,
      prix,
      cours,
      idUtilisateur: userId,
    });
  }

  const [titre, setTitre] = useState("");
  const [lieu, setLieu] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [prix, setPrix] = useState("");
  const [cours, setCours] = useState(COURS_DATA[0]?.id_cours ?? "");
  const [idUtilisateur, setIdUtilisateur] = useState("");

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
                  selectedValue={cours}
                  onValueChange={(value) => setCours(value)}
                >
                  {COURS_DATA.map((item) => (
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
