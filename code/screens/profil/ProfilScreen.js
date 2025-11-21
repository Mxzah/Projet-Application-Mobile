import React, { useCallback, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import authService from "../../services/Auth";

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
        image: require("/home/etd/Projet-Application-Mobile/code/screens/items/assets/1.jpg"),
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
        image: require("/home/etd/Projet-Application-Mobile/code/screens/items/assets/2.jpg"),
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
        image: require("/home/etd/Projet-Application-Mobile/code/screens/items/assets/3.jpg"),
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
        image: require("/home/etd/Projet-Application-Mobile/code/screens/items/assets/4.jpg"),
    },
];

export default function ProfilScreen({ navigation }) {
    const [user, setUser] = useState(authService.currentUser);

    useFocusEffect(
        useCallback(() => {
            setUser(authService.currentUser);
        }, [])
    );

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

    const renderAnnonce = ({ item }) => {
        const debut = new Date(item.date_debut).toLocaleDateString();
        const fin = new Date(item.date_fin).toLocaleDateString();

        return (
            <TouchableOpacity
                style={styles.annonceCard}
                onPress={() =>
                    navigation?.navigate?.("DetailsAnnonce", { annonce: item })
                }
                activeOpacity={0.85}
            >
                <Image source={item.image} style={styles.annonceImage} />

                <View style={{ flex: 1 }}>
                    <Text style={styles.annonceTitre} numberOfLines={1}>
                        {item.titre}
                    </Text>

                    <Text style={styles.annonceLieu}>{item.lieu}</Text>
                    <Text style={styles.annoncePrix}>
                        {item.prix_demande.toFixed(2)} $
                    </Text>

                    <Text style={styles.annonceDates}>
                        {debut} → {fin}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* En-tête profil */}
            <View style={styles.header}>
                <Image
                    source={{
                        uri: "https://cdn-icons-png.flaticon.com/512/219/219970.png",
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>
                    {user.prenom} {user.nom}
                </Text>
                <Text style={styles.email}>{user.username}</Text>
            </View>

            {/* Infos simples */}
            <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Identifiant</Text>
                <Text style={styles.infoValue}>{user.id}</Text>
                <Text style={styles.infoLabel}>Nom</Text>
                <Text style={styles.infoValue}>{user.nom}</Text>
                <Text style={styles.infoLabel}>Prénom</Text>
                <Text style={styles.infoValue}>{user.prenom}</Text>
                <Text style={styles.infoLabel}>Courriel</Text>
                <Text style={styles.infoValue}>{user.username}</Text>

            </View>

            {/* Section Mes annonces */}
            <Text style={styles.sectionTitle}>Mes annonces</Text>

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
                    contentContainerStyle={{ paddingBottom: 30 }}
                />
            )}
        </View>
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
});
