import { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketplaceHeader from '../../components/MarketplaceHeader';
import { ThemeContext } from '@react-navigation/native';
import { useTheme } from '/home/etd/Projet-Application-Mobile/code/context/ThemeContext.js';

const ANNONCES = [
  {
    id_annonce: 1,
    titre: '2019 McLaren 570S',
    lieu: 'Cafétéria',
    description: 'Supercar en excellent état, faible kilométrage, carnet à jour.',
    date_debut: '2025-10-01T08:00:00Z',
    date_fin: '2025-12-31T23:59:59Z',
    prix_demande: 298900.0,
    id_cours: 1,
    id_utilisateur: 101,
    image: require('./assets/1.jpg'),
  },
  {
    id_annonce: 2,
    titre: 'Robe de bal',
    lieu: 'Bibliothèque',
    description: "Robe élégante, portée une seule fois, taille M.",
    date_debut: '2025-10-25T12:00:00Z',
    date_fin: '2025-12-30T23:59:59Z',
    prix_demande: 180.0,
    id_cours: 2,
    id_utilisateur: 102,
    image: require('./assets/2.jpg'),
  },
  {
    id_annonce: 3,
    titre: 'Scooter urbain',
    lieu: 'Local 1132',
    description: 'Scooter électrique parfait pour la ville, autonomie 40 km.',
    date_debut: '2025-10-10T09:30:00Z',
    date_fin: '2025-11-30T23:59:59Z',
    prix_demande: 950.0,
    id_cours: 3,
    id_utilisateur: 103,
    image: require('./assets/3.jpg'),
  },
  {
    id_annonce: 4,
    titre: 'Portrait encadré',
    lieu: 'Local 2080',
    description: 'Cadre 40x60 cm, parfait état, prêt à accrocher.',
    date_debut: '2025-10-23T10:00:00Z',
    date_fin: '2025-12-15T23:59:59Z',
    prix_demande: 45.0,
    id_cours: 4,
    id_utilisateur: 104,
    image: require('./assets/4.jpg'),
  },
];

function formatPrice(n) {
  try {
    return new Intl.NumberFormat('fr-CA').format(n);
  } catch {
    return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}

export default function ListAnnoncesScreen({ navigation, route }) {
  const [selectedCoursIds, setSelectedCoursIds] = useState(() => route?.params?.filteredCoursIds ?? []);

  useEffect(() => {
    const incoming = route?.params?.filteredCoursIds;
    if (Array.isArray(incoming)) {
      setSelectedCoursIds(incoming);
    }
  }, [route?.params?.filteredCoursIds]);

  const filteredAnnonces = useMemo(() => {
    if (!selectedCoursIds?.length) return ANNONCES;
    return ANNONCES.filter((annonce) => selectedCoursIds.includes(annonce.id_cours));
  }, [selectedCoursIds]);

  const handleOpenProgrammes = () => {
    navigation.navigate('Programmes', { selectedCoursIds });
  };

  const handleClearFilters = () => {
    navigation.setParams?.({ filteredCoursIds: [] });
    setSelectedCoursIds([]);
  };
  const { theme } = useTheme();


  function renderCard({ item }) {
    return (
      <TouchableOpacity style={[styles.card, { backgroundColor: theme.background }]} activeOpacity={0.7}>
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
});
