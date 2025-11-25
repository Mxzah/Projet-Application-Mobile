import { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketplaceHeader from '../../components/MarketplaceHeader';
import { useTheme } from '/home/etd/Projet-Application-Mobile/code/context/ThemeContext.js';
import MarthaService from '../../services/Martha';

const marthaService = new MarthaService();

function formatPrice(n) {
  try {
    return new Intl.NumberFormat('fr-CA').format(n);
  } catch {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}

function resolveAnnonceImage(url) {
  if (typeof url !== 'string' || url.length === 0) {
    return { uri: 'https://via.placeholder.com/300?text=Annonce' };
  }

  if (url.startsWith('http')) {
    return { uri: url };
  }

  const cleaned = url.replace(/^\.\//, '');
  return { uri: `http://martha.jh.shawinigan.info/${cleaned}` };
}

export default function ListAnnoncesScreen({ navigation, route }) {
  const [annonces, setAnnonces] = useState([]);
  const [selectedCoursIds, setSelectedCoursIds] = useState(() => route?.params?.filteredCoursIds ?? []);
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerDate, setOfferDate] = useState('');
  const [offerPlace, setOfferPlace] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    let isMounted = true;
    marthaService
      .getAnnonces()
      .then((data) => {
        if (!isMounted) return;
        console.log('Annonces', data);
        const normalized = (data?.data ?? []).map((annonce) => ({
          ...annonce,
          image: resolveAnnonceImage(annonce.url_photo),
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
        style={[styles.card, { backgroundColor: theme.background }]}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <MarketplaceHeader
        active="Acheter"
        onPressVendre={() => navigation.navigate('Vendre')}
        onPressAcheter={() => { /* already here */ }}
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
                    <Text style={styles.offerButtonLabel}>Faire une offre</Text>
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

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  row: {
    gap: 8,
    paddingVertical: 6,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f3f4f6',
  },
  meta: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  price: {
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    color: '#111827',
  },
  place: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  sectionHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  filtersBanner: {
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filtersText: {
    fontWeight: '600',
    color: '#111827',
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    paddingVertical: 40,
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16,
  },
  dialogCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    maxHeight: '90%',
  },
  dialogImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  dialogDescription: {
    marginTop: 6,
    color: '#4b5563',
    lineHeight: 20,
  },
  dialogRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dialogLabel: {
    color: '#6b7280',
    fontWeight: '600',
  },
  dialogValue: {
    color: '#111827',
    fontWeight: '700',
  },
  dialogForm: {
    marginTop: 16,
    gap: 12,
  },
  dialogFormTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  dialogInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  offerButton: {
    backgroundColor: '#1877f2',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  offerButtonLabel: {
    color: '#fff',
    fontWeight: '700',
  },
});
