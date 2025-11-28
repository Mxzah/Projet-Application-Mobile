import React, { useCallback, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import authService from "../../services/Auth";
import { useTheme } from "/home/etd/Projet-Application-Mobile/code/context/ThemeContext.js";
import MarthaService from "../../services/Martha";
import { getProfileStyles } from "../../styles";

const marthaService = new MarthaService();

export default function ProfilScreen({ navigation, route }) {

    const [user, setUser] = useState(authService.currentUser);

    const [mesAvis, setMesAvis] = useState([]);
    const [mesAnnonces, setMesAnnonces] = useState([]);

    const idProfil = route?.params?.id_utilisateur;
    // si quelqu’un clique sur un avis → idProfil existe
    // sinon → undefined

    useFocusEffect(
        useCallback(() => {
            async function loadProfilEtAvis() {
                const idACharger = idProfil ?? authService.currentUser?.id;

                if (!idACharger) {
                    setUser(null);
                    setMesAvis([]);
                    return;
                }

                // 1) charger le bon user
                if (idProfil) {
                    const autreUser = await marthaService.getUserById(idACharger);
                    setUser(autreUser);
                } else {
                    setUser(authService.currentUser);
                }

                // 2) charger SES avis (pas toujours ceux du connecté)
                const avis = await marthaService.getAvisByUser(idACharger);
                setMesAvis(avis);

                const annonces = await marthaService.getAnnoncesByUser(idACharger);
                setMesAnnonces(annonces);
            }

            loadProfilEtAvis();
        }, [idProfil])
    );
    const { theme, toggleTheme, isDark } = useTheme();
    const styles = getProfileStyles(theme);





    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Profil</Text>
                <Text>Aucun utilisateur connecté.</Text>
            </View>
        );
    }

    const renderAvis = ({ item }) => {
        const stars = "★".repeat(item.note) + "☆".repeat(5 - item.note);
        const dateTexte = new Date(item.date_avis).toLocaleDateString();

        return (
            <View style={[styles.avisCard, { backgroundColor: theme.card }]}>
                <Text style={[styles.avisStars, { color: theme.text }]}>{stars}</Text>

                <Text style={[styles.avisCommentaire, { color: theme.text }]}>
                    {item.commentaire || "Aucun commentaire"}
                </Text>

                <TouchableOpacity
                    onPress={() =>
                        navigation.push("Profil", { id_utilisateur: item.id_noteur })
                    }
                >
                    <Text style={[styles.avisMeta, { color: theme.primary }]}>
                        Le {dateTexte} • par {item.noteur_prenom} {item.noteur_nom}
                    </Text>

                </TouchableOpacity>
            </View>
        );
    };



    const renderAnnonce = ({ item }) => {
        // ✅ sécuriser les dates
        const debut = item.date_debut
            ? new Date(item.date_debut).toLocaleDateString()
            : "";
        const fin = item.date_fin
            ? new Date(item.date_fin).toLocaleDateString()
            : "";

        // ✅ convertir le prix en number proprement
        const prixNumber = Number(item.prix_demande);
        const prixTexte = Number.isFinite(prixNumber)
            ? `${prixNumber.toFixed(2)} $`
            : `${item.prix_demande ?? ""} $`;

        // ✅ sécuriser l'URL de l'image
        const photoUri = item.url_photo
            ? `http://martha.jh.shawinigan.info/${item.url_photo.replace(/^\.\//, "")}`
            : "https://via.placeholder.com/200x200?text=Annonce";

        return (
            <TouchableOpacity
                style={styles.annonceCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate("DetailsAnnonce", { annonce: item })}
            >
                <Image
                    source={{ uri: photoUri }}
                    style={styles.annonceImage}
                />

                <View style={styles.annonceContent}>
                    <Text style={styles.annonceTitre} numberOfLines={1}>
                        {item.titre}
                    </Text>

                    <Text style={styles.annonceLieu}>
                        {item.lieu}
                    </Text>

                    <Text style={styles.annoncePrix}>
                        {prixTexte}
                    </Text>

                    <Text style={styles.annonceDates}>
                        {debut && fin ? `${debut} → ${fin}` : ""}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
        >
            {/* Header profil */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={toggleTheme}
                    style={styles.themeToggleButton}
                >
                    <Text style={styles.themeToggleText}>
                        {isDark ? "☀ Mode clair" : "🌙 Mode sombre"}
                    </Text>
                </TouchableOpacity>

                <Image
                    source={{
                        uri: "https://cdn-icons-png.flaticon.com/512/219/219970.png",
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>
                    {user.prenom} {user.nom}
                </Text>
                <Text style={styles.email}>
                    {user.courriel ?? user.username}
                </Text>

                <TouchableOpacity
                    style={styles.btnAnnonces}
                    onPress={() => navigation.navigate("ListAnnonces")}
                >
                    <Text style={styles.btnAnnoncesText}>Voir les annonces</Text>
                </TouchableOpacity>
            </View>

            {/* Infos de base */}
            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Nom complet</Text>
                <Text style={styles.infoValue}>
                    {user.prenom} {user.nom}
                </Text>

                <Text style={[styles.infoLabel, { marginTop: 12 }]}>
                    Courriel
                </Text>
                <Text style={styles.infoValue}>
                    {user.courriel ?? user.username}
                </Text>

                <Text style={[styles.infoLabel, { marginTop: 12 }]}>
                    ID utilisateur
                </Text>
                <Text style={styles.infoValue}>
                    {user.id_utilisateur ?? user.id}
                </Text>
            </View>

            {/* Annonces */}
            <Text style={styles.sectionTitle}>Annonces</Text>
            {mesAnnonces.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>Aucune annonce pour l’instant.</Text>
                </View>
            ) : (
                <FlatList
                    data={mesAnnonces}
                    keyExtractor={(item) => String(item.id_annonce)}
                    renderItem={renderAnnonce}
                    scrollEnabled={false}
                />
            )}

            {/* Avis */}
            <Text style={styles.sectionTitle}>Avis</Text>
            {mesAvis.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>Aucun avis pour l’instant.</Text>
                </View>
            ) : (
                <FlatList
                    data={mesAvis}
                    keyExtractor={(item) => String(item.id_avis)}
                    renderItem={renderAvis}
                    scrollEnabled={false}
                />
            )}
        </ScrollView>
    );
}
