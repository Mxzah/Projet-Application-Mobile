import { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, FlatList, Image, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketplaceHeader from '../../components/MarketplaceHeader';
import marthaService from '../../services/Martha';
import { geAnnoncestStyles } from '../../styles';
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from '../../context/AuthContext';



function formatPrice(n) {
  try {
    return new Intl.NumberFormat('fr-CA').format(n);
  } catch {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}

function resolveAnnonceImage(base64String) {
  if (typeof base64String !== 'string' || base64String.length === 0) {
    return { uri: 'https://via.placeholder.com/300?text=Annonce' };
  }

  if (base64String.startsWith('data:image')) {
    return { uri: base64String };
  }
  return { uri: `data:image/jpeg;base64,${base64String}` };
}

export default function ListAnnoncesScreen({ navigation, route }) {
  const [annonces, setAnnonces] = useState([]);
  const [selectedCoursIds, setSelectedCoursIds] = useState(() => route?.params?.filteredCoursIds ?? []);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerDate, setOfferDate] = useState('');
  const [offerPlace, setOfferPlace] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const styles = geAnnoncestStyles(theme);

  useEffect(() => {
    let isMounted = true;
    marthaService
      .getAnnonces()
      .then((data) => {
        if (!isMounted) return;
        const normalized = (data?.data ?? []).map((annonce) => ({
          ...annonce,
          image: resolveAnnonceImage(annonce.image_base64),
        }));
        setAnnonces(normalized);
      })
      .catch((error) => {
        console.warn('Impossible de charger les annonces', error);
        if (isMounted) {
          setAnnonces([]);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const incoming = route?.params?.filteredCoursIds;
    if (Array.isArray(incoming)) {
      setSelectedCoursIds(incoming);
    }
  }, [route?.params?.filteredCoursIds]);

  const filteredAnnonces = useMemo(() => {
    const currentUserId = currentUser?.id;
    let filtered = annonces;

    if (currentUserId) {
      filtered = filtered.filter((annonce) => annonce.id_utilisateur !== currentUserId);
    }

    if (selectedCoursIds?.length) {
      filtered = filtered.filter((annonce) => selectedCoursIds.includes(annonce.id_cours));
    }

    return filtered;
  }, [annonces, selectedCoursIds]);

  const handleOpenProgrammes = () => {
    navigation.navigate('Programmes', { selectedCoursIds });
  };

  const handleClearFilters = () => {
    navigation.setParams?.({ filteredCoursIds: [] });
    setSelectedCoursIds([]);
  };

  const openAnnonceDialog = (annonce) => {
    setSelectedAnnonce(annonce);
    setOfferPrice(String(annonce.prix_demande ?? ''));
    setOfferDate('');
    setOfferPlace(annonce.lieu ?? '');
  };

  const closeAnnonceDialog = () => {
    setSelectedAnnonce(null);
    setOfferPrice('');
    setOfferDate('');
    setOfferPlace('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSubmitOffer = async () => {
    if (!selectedAnnonce) return;
    
    setSuccessMessage('');
    setErrorMessage('');

    if (offerPrice === '' || offerDate === '' || offerPlace === '') {
      setErrorMessage('Veuillez remplir tous les champs.');
      return;
    }

    if (offerPrice <= 0 || isNaN(offerPrice)) {
      setErrorMessage('Le prix de l\'offre doit être un nombre supérieur à 0.');
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2}:\d{2})?$/;
    if (!dateRegex.test(offerDate)) {
      setErrorMessage('Le format de la date doit être AAAA-MM-JJ ou AAAA-MM-JJ HH:MM:SS (ex: 2024-12-31 ou 2024-12-31 23:59:59).');
      return;
    }
    
    try {
      const ok = await marthaService.insertProposition(offerDate, offerPrice, offerPlace, currentUser?.id, selectedAnnonce.id_annonce, 1);
      if (ok) {
        setSuccessMessage('Votre offre a été soumise avec succès!');
        setTimeout(() => {
          closeAnnonceDialog();
        }, 2000);
      } else {
        setErrorMessage('Une erreur est survenue lors de la soumission de votre offre. Veuillez réessayer.');
      }
    } catch (error) {
      setErrorMessage('Une erreur est survenue lors de la soumission de votre offre. Veuillez réessayer.');
      console.error('Erreur lors de la soumission de l\'offre:', error);
    }
  };


  function renderCard({ item }) {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => openAnnonceDialog(item)}
      >
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        <View style={styles.meta}>
          <Text style={styles.price}>{formatPrice(item.prix_demande)} $</Text>
          <Text numberOfLines={1} style={styles.title}>{item.titre}</Text>
          <Text numberOfLines={1} style={styles.place}>{item.lieu}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <MarketplaceHeader
        active="Acheter"
        onPressVendre={() => navigation.navigate('Vendre')}
        onPressAcheter={() => {}}
        onPressProgrammes={handleOpenProgrammes}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Sélection du jour</Text>
      </View>

      {selectedCoursIds.length > 0 && (
        <View style={styles.filtersBanner}>
          <Text style={styles.filtersText}>
            {selectedCoursIds.length} cours sélectionné{selectedCoursIds.length > 1 ? 's' : ''}
          </Text>
          <Button title="Effacer" onPress={handleClearFilters} />
        </View>
      )}

      <FlatList

        data={filteredAnnonces}
        keyExtractor={(it) => String(it.id_annonce)}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune annonce ne correspond à ces filtres.</Text>
        }
      />

      <Modal
        visible={!!selectedAnnonce}
        transparent
        animationType="slide"
        onRequestClose={closeAnnonceDialog}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogCard}>
            <TouchableOpacity
              style={styles.dialogCloseButton}
              onPress={closeAnnonceDialog}
            >
              <Text style={styles.dialogCloseButtonText}>×</Text>
            </TouchableOpacity>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.dialogScrollContent}
            >
              {selectedAnnonce && (
                <>
                  <Image source={selectedAnnonce.image} style={styles.dialogImage} resizeMode="cover" />
                  <Text style={styles.dialogTitle}>{selectedAnnonce.titre}</Text>
                  <Text style={styles.dialogDescription}>{selectedAnnonce.description}</Text>

                  <View style={styles.dialogRow}>
                    <Text style={styles.dialogLabel}>Prix demandé</Text>
                    <Text style={styles.dialogValue}>{formatPrice(selectedAnnonce.prix_demande)} $</Text>
                  </View>
                  <View style={styles.dialogRow}>
                    <Text style={styles.dialogLabel}>Lieu</Text>
                    <Text style={styles.dialogValue}>{selectedAnnonce.lieu}</Text>
                  </View>

                  {selectedAnnonce.id_utilisateur && (
                    <TouchableOpacity
                      style={styles.profileLink}
                      onPress={() => {
                        closeAnnonceDialog();
                        navigation.navigate('Profil', { id_utilisateur: selectedAnnonce.id_utilisateur });
                      }}
                    >
                      <Text style={styles.profileLinkText}>Voir le profil du vendeur</Text>
                    </TouchableOpacity>
                  )}

                  <View style={styles.dialogForm}>
                    <Text style={styles.dialogFormTitle}>Faire une offre</Text>
                    <TextInput
                      style={styles.dialogInput}
                      placeholder="Montant de l'offre"
                      keyboardType="numeric"
                      value={offerPrice}
                      onChangeText={setOfferPrice}
                    />
                    <TextInput
                      style={styles.dialogInput}
                      placeholder="Date de la vente (AAAA-MM-JJ)"
                      placeholderTextColor="#888"
                      value={offerDate}
                      onChangeText={setOfferDate}
                    />
                    <TextInput
                      style={styles.dialogInput}
                      placeholder="Lieu de la vente"
                      value={offerPlace}
                      onChangeText={setOfferPlace}
                    />

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

                    <TouchableOpacity style={styles.offerButton} onPress={handleSubmitOffer}>
                      <Text style={styles.offerButtonLabel}>FAIRE UNE OFFRE</Text>
                    </TouchableOpacity>
                    <Button title="Fermer" onPress={closeAnnonceDialog} />
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

