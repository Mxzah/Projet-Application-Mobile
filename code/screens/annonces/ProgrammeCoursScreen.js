import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketplaceHeader from '../../components/MarketplaceHeader';

export default function ProgrammeCoursScreen({ route, navigation }) {
  const { programmeName, cours = [] } = route.params || {};

  const renderCours = ({ item }) => (
    <View style={styles.coursCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.coursCode}>{item.code}</Text>
        <Text style={styles.coursName}>{item.nom}</Text>
      </View>
      <Text style={styles.coursDesc}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <MarketplaceHeader
        active="Programmes"
        onPressVendre={() => navigation.navigate('Vendre')}
        onPressAcheter={() => navigation.navigate('ListAnnonces')}
        onPressProgrammes={() => navigation.navigate('Programmes')}
      />
      <View style={styles.listHeader}>
        <Text style={styles.title}>{programmeName}</Text>
      </View>
      <FlatList
        data={cours}
        keyExtractor={(it) => String(it.id_cours)}
        renderItem={renderCours}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>Aucun cours pour ce programme.</Text>}
      />
      <View style={{ padding: 12 }}>
        <Button title="Retour" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listHeader: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  coursCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 10,
  },
  coursCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1877f2',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  coursName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  coursDesc: {
    marginTop: 6,
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
  },
});
