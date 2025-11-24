import { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
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
