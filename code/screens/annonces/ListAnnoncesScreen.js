import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, Button, FlatList, Image, TouchableOpacity, Modal, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
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
  const [coursMap, setCoursMap] = useState({});
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const styles = geAnnoncestStyles(theme);

  // Recharger les annonces à chaque fois que l'écran devient visible
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      
      // Charger les annonces
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

      // Charger les cours pour afficher leurs noms
      marthaService
        .getCours()
        .then((response) => {
          if (!isMounted) return;
          const coursList = response?.data ?? [];
          const map = {};
          coursList.forEach(c => {
            map[c.id_cours] = c.nom;
          });
          setCoursMap(map);
        })
        .catch((error) => {
          console.warn('Impossible de charger les cours', error);
        });

      return () => {
        isMounted = false;
      };
    }, [])
  );

  useEffect(() => {
    const incoming = route?.params?.filteredCoursIds;
    if (Array.isArray(incoming)) {
      setSelectedCoursIds(incoming);
    }
  }, [route?.params?.filteredCoursIds]);

  const filteredAnnonces = useMemo(() => {
    const currentUserId = currentUser?.id;
    let filtered = annonces;

    // Filtrer les annonces vendues (gérer les différents formats: boolean, number, string)
    filtered = filtered.filter((annonce) => {
      const estVendue = annonce.est_vendue;
      return estVendue !== true && estVendue !== 1 && estVendue !== "1" && estVendue !== "true";
    });

    if (currentUserId) {
      filtered = filtered.filter((annonce) => annonce.id_utilisateur !== currentUserId);
    }

    if (selectedCoursIds?.length) {
      filtered = filtered.filter((annonce) => selectedCoursIds.includes(annonce.id_cours));
    }

    return filtered;
  }, [annonces, selectedCoursIds, currentUser?.id]);

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

    const errors = [];

    if (offerPrice === '' || offerDate === '' || offerPlace === '') {
      errors.push('• Veuillez remplir tous les champs.');
    }

    if (offerPrice !== '' && (offerPrice <= 0 || isNaN(offerPrice))) {
      errors.push('• Le prix de l\'offre doit être un nombre supérieur à 0.');
    }

    if (offerDate !== '') {
      const dateRegex = /^\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2}:\d{2})?$/;
      if (!dateRegex.test(offerDate)) {
        errors.push('• Le format de la date doit être AAAA-MM-JJ ou AAAA-MM-JJ HH:MM:SS.');
      } else {
        const datePart = offerDate.trim().split(' ')[0];
        const [year, month, day] = datePart.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        
        // Vérifier que la date existe
        if (dateObj.getFullYear() !== year || 
            dateObj.getMonth() !== month - 1 || 
            dateObj.getDate() !== day) {
          errors.push('• La date entrée n\'existe pas (ex: le 30 février n\'existe pas).');
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (dateObj < today) {
            errors.push('• La date de la vente doit être aujourd\'hui ou dans le futur.');
          }
        }
      }
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join('\n'));
      return;
    }
    
    try {
      const ok = await marthaService.insertProposition(offerDate, parseFloat(offerPrice), offerPlace, currentUser?.id, selectedAnnonce.id_annonce, 1);
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
        programmesParams={{ selectedCoursIds }}
      />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Liste des annonces</Text>
      </View>

      {selectedCoursIds.length > 0 && (
        <View style={styles.filtersBanner}>
          <View style={styles.filtersContent}>
            <Text style={styles.filtersTitle}>
              {selectedCoursIds.length} cours sélectionné{selectedCoursIds.length > 1 ? 's' : ''}
            </Text>
            <Text style={styles.filtersText} numberOfLines={2}>
              {selectedCoursIds.map(id => coursMap[id] || `#${id}`).join(', ')}
            </Text>
          </View>
          <TouchableOpacity style={styles.filtersClearButton} onPress={handleClearFilters}>
            <Text style={styles.filtersClearText}>✕</Text>
          </TouchableOpacity>
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
        animationType="fade"
        onRequestClose={closeAnnonceDialog}
      >
        <KeyboardAvoidingView 
          style={styles.annonceModalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.annonceModalCard}>
            <TouchableOpacity
              style={styles.annonceModalCloseBtn}
              onPress={closeAnnonceDialog}
            >
              <Text style={styles.annonceModalCloseBtnText}>×</Text>
            </TouchableOpacity>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.annonceModalContent}
            >
              {selectedAnnonce && (
                <>
                  <Image source={selectedAnnonce.image} style={styles.annonceModalImage} resizeMode="cover" />
                  
                  <View style={styles.annonceModalHeader}>
                    <Text style={styles.annonceModalTitle}>{selectedAnnonce.titre}</Text>
                    <View style={styles.annonceModalPriceBadge}>
                      <Text style={styles.annonceModalPriceText}>{formatPrice(selectedAnnonce.prix_demande)} $</Text>
                    </View>
                  </View>

                  {selectedAnnonce.description ? (
                    <Text style={styles.annonceModalDescription}>{selectedAnnonce.description}</Text>
                  ) : null}

                  <View style={styles.annonceModalInfoSection}>
                    <View style={styles.annonceModalInfoRow}>
                      <Text style={styles.annonceModalInfoIcon}>📍</Text>
                      <View>
                        <Text style={styles.annonceModalInfoLabel}>Lieu de rencontre</Text>
                        <Text style={styles.annonceModalInfoValue}>{selectedAnnonce.lieu}</Text>
                      </View>
                    </View>
                  </View>

                  {selectedAnnonce.id_utilisateur && (
                    <TouchableOpacity
                      style={styles.annonceModalProfileBtn}
                      onPress={() => {
                        closeAnnonceDialog();
                        navigation.navigate('Profil', { id_utilisateur: selectedAnnonce.id_utilisateur });
                      }}
                    >
                      <Text style={styles.annonceModalProfileIcon}>👤</Text>
                      <Text style={styles.annonceModalProfileText}>Voir le profil du vendeur</Text>
                    </TouchableOpacity>
                  )}

                  <View style={styles.annonceModalDivider} />

                  <View style={styles.annonceModalForm}>
                    <Text style={styles.annonceModalFormTitle}>💰 Faire une offre</Text>
                    
                    <View style={styles.annonceModalInputGroup}>
                      <Text style={styles.annonceModalInputLabel}>Montant proposé</Text>
                      <TextInput
                        style={styles.annonceModalInput}
                        placeholder="Ex: 15.00"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={offerPrice}
                        onChangeText={setOfferPrice}
                      />
                    </View>

                    <View style={styles.annonceModalInputGroup}>
                      <Text style={styles.annonceModalInputLabel}>Date de la vente</Text>
                      <TextInput
                        style={styles.annonceModalInput}
                        placeholder="AAAA-MM-JJ"
                        placeholderTextColor="#999"
                        value={offerDate}
                        onChangeText={setOfferDate}
                      />
                    </View>

                    <View style={styles.annonceModalInputGroup}>
                      <Text style={styles.annonceModalInputLabel}>Lieu de la vente</Text>
                      <TextInput
                        style={styles.annonceModalInput}
                        placeholder="Ex: Cafétéria"
                        placeholderTextColor="#999"
                        value={offerPlace}
                        onChangeText={setOfferPlace}
                      />
                    </View>

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

                    <View style={styles.annonceModalButtons}>
                      <TouchableOpacity style={styles.annonceModalCancelBtn} onPress={closeAnnonceDialog}>
                        <Text style={styles.annonceModalCancelBtnText}>Fermer</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.annonceModalSubmitBtn} onPress={handleSubmitOffer}>
                        <Text style={styles.annonceModalSubmitBtnText}>Envoyer l'offre</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

