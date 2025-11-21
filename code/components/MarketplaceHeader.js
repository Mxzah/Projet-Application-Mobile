import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '/home/etd/Projet-Application-Mobile/code/context/ThemeContext.js';


export default function MarketplaceHeader({
  active = 'Acheter',
  onPressVendre = () => { },
  onPressAcheter = () => { },
  onPressProgrammes = () => { },
}) {
  const navigation = useNavigation();
  const { theme, toggleTheme, isDark } = useTheme();

  const isActive = (tab) => active === tab;
  return (
    <View style={styles.container}>
      {/* Top row: title + right icons */}
      <View style={styles.topRow}>
        <Text style={styles.title}>Marketplace</Text>

        <View style={styles.rightIcons}>
          <TouchableOpacity onPress={toggleTheme} style={styles.btn}>
            <Text style={{ color: theme.text }}>
              {isDark ? "Mode clair" : "Mode sombre"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={26} color="black" onPress={() => navigation.navigate('Profil')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs row: Vendre / Acheter / Programmes */}
      <View style={styles.tabsRow}>
        <TouchableOpacity style={[styles.tab, isActive('Vendre') && styles.activeTab]} onPress={onPressVendre}>
          <Text style={[styles.tabText, isActive('Vendre') && styles.activeTabText]}>Vendre</Text>
        </TouchableOpacity>

        {/* Acheter */}
        <TouchableOpacity style={[styles.tab, isActive('Acheter') && styles.activeTab]} onPress={onPressAcheter}>
          <Text style={[styles.tabText, isActive('Acheter') && styles.activeTabText]}>Acheter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tab, isActive('Programmes') && styles.activeTab]} onPress={onPressProgrammes}>
          <Text style={[styles.tabText, isActive('Programmes') && styles.activeTabText]}>Programmes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: 'white',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeTab: {
    backgroundColor: '#e6f0ff', // light blue pill like the screenshot
  },
  activeTabText: {
    color: '#1877f2', // Facebook blue
  },
});