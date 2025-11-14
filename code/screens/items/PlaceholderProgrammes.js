import { View, Text, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PlaceholderProgrammes({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Programmes</Text>
      <Text style={styles.subtitle}>Page en construction…</Text>
      <View style={{ marginTop: 16 }}>
        <Button title="Retour" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
