import { View, Text, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketplaceHeader from '../../components/MarketplaceHeader';

export default function PlaceholderVendre({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <MarketplaceHeader
        active="Vendre"
        onPressVendre={() => { /* already here */ }}
        onPressAcheter={() => navigation.navigate('ListeItems')}
        onPressProgrammes={() => navigation.navigate('Programmes')}
      />
      <View style={styles.centerContent}>
        <Text style={styles.title}>Vendre</Text>
        <Text style={styles.subtitle}>Page en construction…</Text>
        <View style={{ marginTop: 16 }}>
          <Button title="Retour" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
});
