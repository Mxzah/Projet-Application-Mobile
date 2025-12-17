import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '/home/etd/Projet-Application-Mobile/code/context/ThemeContext.js';
import { getHeaderStyles } from "../styles";



export default function MarketplaceHeader({
  active = 'Acheter',
  programmesParams = {},  // Paramètres optionnels pour l'écran Programmes
}) {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = getHeaderStyles(theme);

  const isActive = (tab) => active === tab;

  // Utilise replace() pour éviter d'empiler les écrans
  const handleTabPress = (tab) => {
    if (isActive(tab)) return; // Ne rien faire si déjà sur cet onglet
    
    const screenMap = {
      'Vendre': 'Vendre',
      'Acheter': 'ListAnnonces',
      'Programmes': 'Programmes',
    };
    
    const params = tab === 'Programmes' ? programmesParams : undefined;
    navigation.replace(screenMap[tab], params);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Marketplace</Text>

        <View style={styles.rightIcons}>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={26} color={theme.text} onPress={() => navigation.navigate('Profil')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsRow}>
        <TouchableOpacity style={[styles.tab, isActive('Vendre') && styles.activeTab]} onPress={() => handleTabPress('Vendre')}>
          <Text style={[styles.tabText, isActive('Vendre') && styles.activeTabText]}>Vendre</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, isActive('Acheter') && styles.activeTab]} onPress={() => handleTabPress('Acheter')}>
          <Text style={[styles.tabText, isActive('Acheter') && styles.activeTabText]}>Acheter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, isActive('Programmes') && styles.activeTab]} onPress={() => handleTabPress('Programmes')}>
          <Text style={[styles.tabText, isActive('Programmes') && styles.activeTabText]}>Programmes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

