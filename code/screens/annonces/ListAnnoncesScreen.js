import { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, FlatList, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketplaceHeader from '../../components/MarketplaceHeader';
import MarthaService from '../../services/Martha';
import { geAnnoncestStyles } from '../../styles';
import { useTheme } from "../../context/ThemeContext";

const marthaService = new MarthaService();



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
  const { theme } = useTheme();
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
    if (!selectedCoursIds?.length) return annonces;
    return annonces.filter((annonce) => selectedCoursIds.includes(annonce.id_cours));
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
  };

  const handleSubmitOffer = () => {
    if (!selectedAnnonce) return;
    console.log('Nouvelle offre', {
      annonceId: selectedAnnonce.id_annonce,
      prix: offerPrice,
      dateVente: offerDate,
      lieu: offerPlace,
    });
    closeAnnonceDialog();
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

                  <TouchableOpacity style={styles.offerButton} onPress={handleSubmitOffer}>
                    <Text style={styles.offerButtonLabel}>FAIRE UNE OFFRE</Text>
                  </TouchableOpacity>
                  <Button title="Fermer" onPress={closeAnnonceDialog} />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

