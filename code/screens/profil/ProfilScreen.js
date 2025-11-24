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

const ANNONCES = [];
const marthaService = new MarthaService();

export default function ProfilScreen({ navigation, route }) {

    const [user, setUser] = useState(authService.currentUser);

    const [mesAvis, setMesAvis] = useState([]);

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
            }

            loadProfilEtAvis();
        }, [idProfil])
    );
    const { theme, toggleTheme, isDark } = useTheme();

    const mesAnnonces = useMemo(() => {
        if (!user) return [];
        return ANNONCES.filter((a) => a.id_utilisateur === user.id);
    }, [user]);



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
        const debut = new Date(item.date_debut).toLocaleDateString();
        const fin = new Date(item.date_fin).toLocaleDateString();

        return (
            <TouchableOpacity
                style={[styles.annonceCard, { backgroundColor: theme.card }]}
                onPress={() => navigation.navigate("DetailsAnnonce", { annonce: item })}
                activeOpacity={0.85}
            >
                <Image source={item.image} style={styles.annonceImage} />

                <View style={{ flex: 1 }}>

                    <Text style={[styles.annonceTitre, { color: theme.text }]} numberOfLines={1}>
                        {item.titre}
                    </Text>

                    <Text style={[styles.annonceLieu, { color: theme.textLight }]}>
                        {item.lieu}
                    </Text>

                    <Text style={[styles.annoncePrix, { color: theme.text }]}>
                        {item.prix_demande.toFixed(2)} $
                    </Text>

                    <Text style={[styles.annonceDates, { color: theme.textLight }]}>
                        {debut} → {fin}
                    </Text>

                </View>
            </TouchableOpacity>
        );
    };



    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}
            contentContainerStyle={{ paddingBottom: 30 }}
        >
            {/* En-tête profil */}
            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <TouchableOpacity onPress={toggleTheme} style={styles.btn}>
                    <Text style={{ color: theme.text }}>
                        {isDark ? "☀ Mode clair" : "🌙 Mode sombre"}
                    </Text>
                </TouchableOpacity>
                <Image
                    source={{
                        uri: "https://cdn-icons-png.flaticon.com/512/219/219970.png",
                    }}
                    style={styles.avatar}
                />
                <Text style={[styles.name, { color: theme.text }]}>
                    {user.prenom} {user.nom}
                </Text>

                <Text style={[styles.email, { color: theme.textLight }]}>
                    {user.courriel ?? user.username}
                </Text>

                <TouchableOpacity
                    style={[styles.btnAnnonces, { color: "red" }]}
                    onPress={() => navigation?.navigate?.("ListAnnonces")}
                >
                    <Text style={styles.btnAnnoncesText}>Page accueil</Text>
                </TouchableOpacity>

            </View>

            {/* Infos simples */}
            <View style={[styles.infoSection, { backgroundColor: theme.card }]}>
                <Text style={[styles.infoLabel, { color: theme.textLight }]}>Nom complet</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                    {user.prenom} {user.nom}
                </Text>

                <Text style={[styles.infoLabel, { color: theme.textLight, marginTop: 12 }]}>Courriel</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                    {user.courriel ?? user.username}
                </Text>
                <Text style={[styles.infoLabel, { color: theme.textLight, marginTop: 12 }]}>ID utilisateur</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                    {user.id_utilisateur ?? user.id}
                </Text>
            </View>

            {/* Section Mes annonces */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Annonces</Text>

            {mesAnnonces.length === 0 ? (
                <View style={[styles.emptyBox, { backgroundColor: theme.card }]}>
                    <Text style={styles.emptyText}>
                        Aucune annonce pour l’instant.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={mesAnnonces}
                    keyExtractor={(item) => String(item.id_annonce)}
                    renderItem={renderAnnonce}
                    scrollEnabled={false}     // ✅ IMPORTANT
                />
            )}

            {/* Section Mes avis */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Avis</Text>
            {mesAvis.length === 0 ? (
                <View style={[styles.emptyBox, { backgroundColor: theme.card }]}>
                    <Text style={styles.emptyText}>
                        Aucun avis pour l’instant.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={mesAvis}
                    keyExtractor={(item) => String(item.id_avis)}
                    renderItem={renderAvis}
                    scrollEnabled={false}     // ✅ déjà fait
                />
            )}
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f4f4f4" },

    // Header
    header: {
        backgroundColor: "white",
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: "center",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    avatar: { width: 85, height: 85, borderRadius: 50, marginBottom: 12 },
    name: { fontSize: 24, fontWeight: "bold", color: "#222" },
    email: { fontSize: 14, color: "#666", marginTop: 4 },

    // Infos
    infoSection: {
        backgroundColor: "white",
        padding: 16,
        marginTop: 15,
        marginHorizontal: 18,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    infoLabel: { fontSize: 14, fontWeight: "600", color: "#777", marginBottom: 4 },
    infoValue: { fontSize: 16, color: "#222" },

    // Mes annonces
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        marginTop: 20,
        marginBottom: 8,
        marginHorizontal: 18,
        color: "#222",
    },

    annonceCard: {
        flexDirection: "row",
        backgroundColor: "white",
        marginHorizontal: 18,
        marginVertical: 8,
        borderRadius: 14,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    annonceImage: {
        width: 90,
        height: 90,
        marginRight: 12,
    },
    annonceTitre: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 8,
        marginRight: 8,
    },
    annonceLieu: {
        fontSize: 13,
        color: "#666",
        marginTop: 2,
    },
    annoncePrix: {
        fontSize: 15,
        fontWeight: "800",
        marginTop: 6,
    },
    annonceDates: {
        fontSize: 12,
        color: "#888",
        marginTop: 4,
        marginBottom: 8,
    },

    emptyBox: {
        backgroundColor: "white",
        marginHorizontal: 18,
        padding: 16,
        borderRadius: 12,
    },
    emptyText: { color: "#666" },

    avisCard: {
        backgroundColor: "white",
        marginHorizontal: 18,
        marginVertical: 6,
        padding: 14,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },

    avisStars: {
        fontSize: 16,
        fontWeight: "800",
        marginBottom: 6,
    },

    avisCommentaire: {
        fontSize: 15,
        color: "#222",
    },

    avisCommentaireMuted: {
        fontSize: 15,
        color: "#888",
        fontStyle: "italic",
    },

    avisMeta: {
        marginTop: 8,
        fontSize: 12,
        color: "#777",
    },

});
