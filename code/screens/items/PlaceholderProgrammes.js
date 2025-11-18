import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import MarketplaceHeader from '../../components/MarketplaceHeader';

export default function PlaceholderProgrammes({ navigation }) {
  const PROGRAMMES = [
    { id_programme: 1, nom: 'Techniques de l’informatique', description: 'Programme axé sur le développement logiciel, les réseaux et la cybersécurité.', nb_sessions: 6 },
    { id_programme: 2, nom: 'Sciences humaines', description: 'Étude des comportements humains, de la société et des sciences sociales.', nb_sessions: 4 },
    { id_programme: 3, nom: 'Techniques de génie mécanique', description: 'Formation sur la conception, l\'analyse et la fabrication mécaniques.', nb_sessions: 6 },
    { id_programme: 4, nom: 'Techniques de comptabilité et gestion', description: 'Apprentissage de la gestion financière, analyse comptable et fiscalité.', nb_sessions: 6 },
    { id_programme: 5, nom: 'Techniques d’éducation spécialisée', description: 'Formation pour intervenir auprès de personnes en difficulté d’adaptation.', nb_sessions: 6 },
    { id_programme: 6, nom: 'Sciences de la nature', description: 'Programme préuniversitaire touchant biologie, chimie, et physique.', nb_sessions: 4 },
    { id_programme: 7, nom: 'Techniques de design graphique', description: 'Études sur la création visuelle, le design numérique et imprimé.', nb_sessions: 6 },
    { id_programme: 8, nom: 'Soins infirmiers', description: 'Formation pratique et théorique en soins de santé et intervention clinique.', nb_sessions: 6 },
    { id_programme: 9, nom: 'Techniques de l’architecture', description: 'Apprentissage de la conception, du dessin et de la modélisation architecturale.', nb_sessions: 6 },
    { id_programme: 10, nom: 'Techniques de tourisme', description: 'Formation orientée vers les services touristiques, l\'accueil et la gestion de voyages.', nb_sessions: 6 },
    { id_programme: 11, nom: 'Arts, lettres et communication', description: 'Programme axé sur l’expression artistique, la culture et la communication.', nb_sessions: 4 },
    { id_programme: 12, nom: 'Techniques policières', description: 'Formation préparatoire aux métiers policiers et à l’intervention sociale.', nb_sessions: 6 },
    { id_programme: 13, nom: 'Techniques de diététique', description: 'Programme portant sur la nutrition, l’alimentation et la santé.', nb_sessions: 6 },
    { id_programme: 14, nom: 'Gestion de commerces', description: 'Études en stratégie marketing, vente, supervision et gestion d’entreprise.', nb_sessions: 6 },
    { id_programme: 15, nom: 'Techniques de génie électrique', description: 'Concentration sur les circuits, l’automatisation et les systèmes électriques.', nb_sessions: 6 },
    { id_programme: 16, nom: 'Techniques de physiothérapie', description: 'Formation sur la réadaptation, la biomécanique et les soins thérapeutiques.', nb_sessions: 6 },
    { id_programme: 17, nom: 'Techniques d’assainissement de l’eau', description: 'Apprentissage des procédés de traitement et gestion de la qualité de l’eau.', nb_sessions: 6 },
    { id_programme: 18, nom: 'Techniques juridiques', description: 'Formation sur le droit, les procédures judiciaires et le travail juridique.', nb_sessions: 6 },
    { id_programme: 19, nom: 'Techniques d’animation 3D', description: 'Programme axé sur l’animation numérique, la modélisation et les effets visuels.', nb_sessions: 6 },
    { id_programme: 20, nom: 'Informatique de gestion', description: 'Préparation à la gestion des systèmes d’information et au développement d’applications.', nb_sessions: 6 },
  ];

  const COURS = [
    { id_cours: 1, code: 'INF101', nom: 'Programmation 1', description: 'Introduction aux concepts de base en programmation.', id_programme: 1 },
    { id_cours: 2, code: 'INF205', nom: 'Réseaux informatiques', description: 'Principes de configuration et gestion de réseaux.', id_programme: 1 },

    { id_cours: 3, code: 'SHU110', nom: 'Introduction à la psychologie', description: 'Étude du comportement humain et des processus mentaux.', id_programme: 2 },
    { id_cours: 4, code: 'SHU220', nom: 'Sociologie contemporaine', description: 'Analyse des structures et dynamiques sociales.', id_programme: 2 },

    { id_cours: 5, code: 'MEC120', nom: 'Dessin technique', description: 'Introduction à la lecture et production de plans mécaniques.', id_programme: 3 },
    { id_cours: 6, code: 'MEC245', nom: 'Fabrication assistée', description: 'Étude des procédés manufacturiers modernes.', id_programme: 3 },

    { id_cours: 7, code: 'COM110', nom: 'Principes comptables', description: 'Introduction aux méthodes et normes comptables.', id_programme: 4 },
    { id_cours: 8, code: 'GES240', nom: 'Gestion financière', description: 'Analyse financière et gestion des budgets.', id_programme: 4 },

    { id_cours: 9, code: 'EDS101', nom: 'Développement humain', description: "Étude des étapes du développement global de l'humain.", id_programme: 5 },
    { id_cours: 10, code: 'EDS330', nom: 'Intervention spécialisée', description: "Méthodes d’intervention auprès de clientèles vulnérables.", id_programme: 5 },

    { id_cours: 11, code: 'SCI150', nom: 'Biologie générale', description: 'Introduction aux systèmes vivants.', id_programme: 6 },
    { id_cours: 12, code: 'SCI260', nom: 'Chimie organique', description: 'Étude des composés du carbone et de leurs réactions.', id_programme: 6 },

    { id_cours: 13, code: 'DES130', nom: 'Typographie', description: 'Bases du design typographique et lisibilité.', id_programme: 7 },
    { id_cours: 14, code: 'DES320', nom: 'Illustration numérique', description: 'Techniques de création d’illustrations sur tablette graphique.', id_programme: 7 },

    { id_cours: 15, code: 'INFIRM101', nom: 'Soins de base', description: 'Apprentissage des techniques de soins primaires.', id_programme: 8 },
    { id_cours: 16, code: 'INFIRM270', nom: 'Pharmacologie', description: 'Introduction aux médicaments et à leurs effets.', id_programme: 8 },

    { id_cours: 17, code: 'ARCH115', nom: 'Lecture de plans', description: 'Compréhension et interprétation des dessins architecturaux.', id_programme: 9 },
    { id_cours: 18, code: 'ARCH270', nom: 'Logiciels CAO', description: 'Utilisation de logiciels de dessin assisté pour l’architecture.', id_programme: 9 },

    { id_cours: 19, code: 'TRM100', nom: 'Fondements du tourisme', description: 'Introduction aux concepts et réalités de l’industrie touristique.', id_programme: 10 },
    { id_cours: 20, code: 'TRM310', nom: 'Gestion d’hébergement', description: 'Gestion opérationnelle d’établissements touristiques.', id_programme: 10 },

    { id_cours: 21, code: 'ART110', nom: 'Création littéraire', description: 'Exploration et écriture de textes variés.', id_programme: 11 },
    { id_cours: 22, code: 'COM210', nom: 'Communication visuelle', description: 'Étude du rapport entre image et message.', id_programme: 11 },

    { id_cours: 23, code: 'POL101', nom: 'Techniques d’enquête', description: 'Introduction aux méthodes de collecte de preuves.', id_programme: 12 },
    { id_cours: 24, code: 'POL305', nom: 'Intervention policière', description: 'Mise en situation et résolution d’incidents.', id_programme: 12 },

    { id_cours: 25, code: 'DIT115', nom: 'Nutrition humaine', description: 'Étude des besoins nutritionnels selon les stades de vie.', id_programme: 13 },
    { id_cours: 26, code: 'DIT310', nom: 'Gestion alimentaire', description: 'Organisation des services alimentaires professionnels.', id_programme: 13 },

    { id_cours: 27, code: 'GCO120', nom: 'Marketing de base', description: 'Introduction aux stratégies marketing.', id_programme: 14 },
    { id_cours: 28, code: 'GCO255', nom: 'Gestion des ventes', description: 'Méthodes de gestion d’équipes de vente.', id_programme: 14 },

    { id_cours: 29, code: 'ELEC101', nom: 'Circuits électriques', description: 'Analyse des circuits et lois fondamentales.', id_programme: 15 },
    { id_cours: 30, code: 'ELEC340', nom: 'Systèmes automatisés', description: 'Programmation et contrôle de systèmes automatisés.', id_programme: 15 },

    { id_cours: 31, code: 'PHY120', nom: 'Rééducation physique', description: 'Principes de réadaptation biomécanique.', id_programme: 16 },
    { id_cours: 32, code: 'PHY250', nom: 'Anatomie fonctionnelle', description: 'Étude du corps humain en mouvement.', id_programme: 16 },

    { id_cours: 33, code: 'EAU115', nom: 'Traitement des eaux', description: 'Méthodes de filtration et désinfection de l’eau.', id_programme: 17 },
    { id_cours: 34, code: 'EAU330', nom: 'Échantillonnage environnemental', description: 'Techniques de prélèvement et d’analyse de l’eau.', id_programme: 17 },

    { id_cours: 35, code: 'JUR101', nom: 'Initiation au droit', description: 'Introduction au système juridique québécois.', id_programme: 18 },
    { id_cours: 36, code: 'JUR350', nom: 'Rédaction juridique', description: 'Apprentissage des documents légaux courants.', id_programme: 18 },

    { id_cours: 37, code: 'ANM110', nom: 'Modélisation 3D', description: 'Introduction à la création d’objets 3D.', id_programme: 19 },
    { id_cours: 38, code: 'ANM320', nom: 'Animation de personnages', description: 'Techniques d’animation avancée pour personnages.', id_programme: 19 },

    { id_cours: 39, code: 'IG101', nom: "Bases des systèmes d'information", description: 'Introduction à la gestion des données et des systèmes.', id_programme: 20 },
    { id_cours: 40, code: 'IG240', nom: 'Développement d’applications', description: 'Analyse, conception et programmation d’applications.', id_programme: 20 },
  ];

  const coursByProgramme = useMemo(() => {
    const acc = {};
    for (const p of PROGRAMMES) {
      acc[p.id_programme] = COURS.filter(c => c.id_programme === p.id_programme);
    }
    return acc;
  }, []);

  const [expandedId, setExpandedId] = useState(null);
  const [selectedCours, setSelectedCours] = useState(new Set());
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
        onPressAcheter={() => navigation.navigate('ListeItems')}
        onPressProgrammes={() => { /* already here */ }}
      />
      <View style={styles.listHeader}>
        <Text style={styles.title}>Programmes</Text>
      </View>
      <FlatList
        data={PROGRAMMES}
        keyExtractor={(it) => String(it.id_programme)}
        renderItem={renderProgramme}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  programCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    padding: 12,
    marginBottom: 10,
  },
  programHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkWrap: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uncheckedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: 'transparent',
  },
  programName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    paddingRight: 8,
  },
  sessionBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1877f2',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  programDesc: {
    marginTop: 6,
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 18,
  },
  coursList: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
  },
  coursRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f2f5',
  },
  coursCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1877f2',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginRight: 10,
    alignSelf: 'flex-start',
  },
  coursName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  coursDesc: {
    marginTop: 2,
    fontSize: 12,
    color: '#4b5563',
    lineHeight: 16,
  },
});
