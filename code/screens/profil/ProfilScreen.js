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

// --- Tes annonces mock ---
const ANNONCES = [
    {
        id_annonce: 1,
        titre: "2019 McLaren 570S",
        lieu: "Cafétéria",
        description:
            "Supercar en excellent état, faible kilométrage, carnet à jour.",
        date_debut: "2025-10-01T08:00:00Z",
        date_fin: "2025-12-31T23:59:59Z",
        prix_demande: 298900.0,
        id_cours: 1,
        id_utilisateur: 7,
        image: require("/home/etd/Projet-Application-Mobile/code/screens/annonces/assets/1.jpg"),
    },
    {
        id_annonce: 2,
        titre: "Robe de bal",
        lieu: "Bibliothèque",
        description: "Robe élégante, portée une seule fois, taille M.",
        date_debut: "2025-10-25T12:00:00Z",
        date_fin: "2025-12-30T23:59:59Z",
        prix_demande: 180.0,
        id_cours: 2,
        id_utilisateur: 7,
        image: require("/home/etd/Projet-Application-Mobile/code/screens/annonces/assets/2.jpg"),
    },
    {
        id_annonce: 3,
        titre: "Scooter urbain",
        lieu: "Local 1132",
        description: "Scooter électrique parfait pour la ville, autonomie 40 km.",
        date_debut: "2025-10-10T09:30:00Z",
        date_fin: "2025-11-30T23:59:59Z",
        prix_demande: 950.0,
        id_cours: 3,
        id_utilisateur: 103,
        image: require("/home/etd/Projet-Application-Mobile/code/screens/annonces/assets/3.jpg"),
    },
    {
        id_annonce: 4,
        titre: "Portrait encadré",
        lieu: "Local 2080",
        description: "Cadre 40x60 cm, parfait état, prêt à accrocher.",
        date_debut: "2025-10-23T10:00:00Z",
        date_fin: "2025-12-15T23:59:59Z",
        prix_demande: 45.0,
        id_cours: 4,
        id_utilisateur: 104,
        image: require("/home/etd/Projet-Application-Mobile/code/screens/annonces/assets/4.jpg"),
    },
];

const AVIS = [
    {
        id_avis: 1,
        note: 5,
        commentaire: "Super vendeur, transaction rapide et produit conforme!",
        date_avis: "2025-10-12T14:20:00Z",
        id_utilisateur: 7,     // ✅ utilisateur qui reçoit l’avis (le profil)
        id_noteur: 3,          // celui qui a donné l'avis
        id_proposition: 12,
    },
    {
        id_avis: 2,
        note: 4,
        commentaire: "Bonne communication, petit retard mais OK.",
        date_avis: "2025-10-28T09:05:00Z",
        id_utilisateur: 7,     // ✅ même user
        id_noteur: 2,
        id_proposition: 15,
    },
    {
        id_avis: 3,
        note: 2,
        commentaire: "Article pas tout à fait comme décrit.",
        date_avis: "2025-11-02T18:40:00Z",
        id_utilisateur: 2,     // autre utilisateur
        id_noteur: 1,
        id_proposition: 18,
    },
];


export default function ProfilScreen({ navigation }) {
    const [user, setUser] = useState(authService.currentUser);

    useFocusEffect(
        useCallback(() => {
            setUser(authService.currentUser);
        }, [])
    );

    const { theme, toggleTheme, isDark } = useTheme();

    const mesAnnonces = useMemo(() => {
        if (!user) return [];
        return ANNONCES.filter((a) => a.id_utilisateur === user.id);
    }, [user]);

    const mesAvis = useMemo(() => {
        if (!user) return [];
        return AVIS.filter(a => a.id_utilisateur === user.id);
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
        const date = new Date(item.date_avis).toLocaleDateString();

        const stars = "★".repeat(item.note) + "☆".repeat(5 - item.note);

        return (
            <View style={[styles.avisCard, { backgroundColor: theme.card }]}>

                <Text style={[styles.avisStars, { color: theme.text }]}>
                    {stars}
                </Text>

                {item.commentaire ? (
                    <Text style={[styles.avisCommentaire, { color: theme.text }]}>
                        {item.commentaire}
                    </Text>
                ) : (
                    <Text style={[styles.avisCommentaireMuted, { color: theme.textLight }]}>
                        Aucun commentaire
                    </Text>
                )}

                <TouchableOpacity
                    onPress={() => navigation.navigate("ProfilPublic", { id_utilisateur: item.id_noteur })}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.avisMeta, { color: theme.textLight }]}>
                        Le {date} • par l’utilisateur #{item.id_noteur}
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
                    {user.username}
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
                    {user.username}
                </Text>
                <Text style={[styles.infoLabel, { color: theme.textLight, marginTop: 12 }]}>ID utilisateur</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                    {user.id}
                </Text>
            </View>

            {/* Section Mes annonces */}
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Mes annonces</Text>

            {mesAnnonces.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>
                        Tu n’as aucune annonce pour l’instant.
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
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Mes avis</Text>
            {mesAvis.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>
                        Tu n’as aucun avis pour l’instant.
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
