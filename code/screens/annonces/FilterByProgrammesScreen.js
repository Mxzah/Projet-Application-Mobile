import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketplaceHeader from '../../components/MarketplaceHeader';
import marthaService from '../../services/Martha';
import { getProgrammesStyles } from '../../styles';
import { useTheme } from "../../context/ThemeContext";

export default function FilterByProgrammesScreen({ navigation, route }) {
  const { theme } = useTheme();
  const styles = getProgrammesStyles(theme);

  const [programmes, setProgrammes] = useState([]);
  const [cours, setCours] = useState([]);

  useEffect(() => {
    marthaService.getProgrammes().then((data) => {
      setProgrammes(data.data ?? []);
    });
  }, []);

  useEffect(() => {
    marthaService.getCours().then((data) => {
      setCours(data.data ?? []);
    });
  }, []);

  const coursByProgramme = useMemo(() => {
    const acc = {};
    for (const p of programmes) {
      acc[p.id_programme] = cours.filter(c => c.id_programme === p.id_programme);
    }
    return acc;
  }, [programmes, cours]);

  const initialSelectedCours = route?.params?.selectedCoursIds ?? [];
  const [expandedId, setExpandedId] = useState(null);
  const [selectedCours, setSelectedCours] = useState(() => new Set(initialSelectedCours));

  useEffect(() => {
    const incoming = route?.params?.selectedCoursIds;
    if (Array.isArray(incoming)) {
      setSelectedCours(new Set(incoming));
    }
  }, [route?.params?.selectedCoursIds]);
  const toggleExpand = (id) => setExpandedId(prev => (prev === id ? null : id));

  const programmeChecked = (progId) => {
    const list = coursByProgramme[progId] || [];
    if (list.length === 0) return false;
    return list.every(c => selectedCours.has(c.id_cours));
  };

  const toggleProgrammeCheck = (progId) => {
    const list = coursByProgramme[progId] || [];
    const allChecked = list.length > 0 && list.every(c => selectedCours.has(c.id_cours));
    const next = new Set(selectedCours);
    if (allChecked) {
      list.forEach(c => next.delete(c.id_cours));
    } else {
      list.forEach(c => next.add(c.id_cours));
    }
    setSelectedCours(next);
  };

  const toggleCoursCheck = (coursId) => {
    const next = new Set(selectedCours);
    if (next.has(coursId)) next.delete(coursId); else next.add(coursId);
    setSelectedCours(next);
  };

  const handleApplyFilters = () => {
    const ids = Array.from(selectedCours);
    navigation.navigate('ListAnnonces', { filteredCoursIds: ids });
  };

  const Check = ({ checked, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.checkWrap} activeOpacity={0.7}>
      {checked ? (
        <Ionicons name="checkmark-circle" size={22} color="#1877f2" />
      ) : (
        <View style={styles.uncheckedCircle} />
      )}
    </TouchableOpacity>
  );

  const renderProgramme = ({ item }) => {
    const count = coursByProgramme[item.id_programme]?.length || 0;
    const expanded = expandedId === item.id_programme;
    const cours = coursByProgramme[item.id_programme] || [];
    return (
      <View style={styles.programCard}>
        <View style={styles.programHeaderRow}>
          <Check checked={programmeChecked(item.id_programme)} onPress={() => toggleProgrammeCheck(item.id_programme)} />
          <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8} onPress={() => toggleExpand(item.id_programme)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.programName}>{item.nom}</Text>
              <Text style={styles.sessionBadge}>{count} cours</Text>
            </View>
            <Text style={styles.programDesc}>{item.description}</Text>
          </TouchableOpacity>
        </View>
        {expanded && (
          <View style={styles.coursList}>
            {cours.map(c => (
              <View key={c.id_cours} style={styles.coursRow}>
                <Check checked={selectedCours.has(c.id_cours)} onPress={() => toggleCoursCheck(c.id_cours)} />
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.coursCode}>{c.code}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.coursName}>{c.nom}</Text>
                    <Text style={styles.coursDesc}>{c.description}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <MarketplaceHeader
        active="Programmes"
        onPressVendre={() => navigation.navigate('Vendre')}
        onPressAcheter={() => navigation.navigate('ListAnnonces')}
        onPressProgrammes={() => {}}
      />
      <View style={styles.listHeader}>
        <Text style={styles.title}>Programmes</Text>
      </View>
      <FlatList
        data={programmes}
        keyExtractor={(it) => String(it.id_programme)}
        renderItem={renderProgramme}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <View style={{ padding: 12 }}>
        <Button title="Appliquer les filtres" onPress={handleApplyFilters} />
      </View>
    </SafeAreaView>
  );
}

