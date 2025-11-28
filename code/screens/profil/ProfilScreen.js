import React, { useCallback, useMemo, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TouchableOpacity,
    ScrollView,
    Modal,
    TextInput,
    Button
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import authService from "../../services/Auth";
import { useTheme } from "/home/etd/Projet-Application-Mobile/code/context/ThemeContext.js";
import MarthaService from "../../services/Martha";
import { getProfileStyles } from "../../styles";

const marthaService = new MarthaService();



function formatPrice(n) {
    try {
        return new Intl.NumberFormat('fr-CA').format(n);
    } catch {
        return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
}

function resolveAnnonceImage(base64String) {
    if (typeof base64String !== 'string' || base64String.length === 0) {
        return { uri: 'https://via.placeholder.com/300?text=Annonce' };
    }
    if (base64String.startsWith('data:image')) {
        return { uri: base64String };
    }
    return { uri: `data:image/jpeg;base64,${base64String}` };
}

export default function ProfilScreen({ navigation, route }) {

    const [user, setUser] = useState(authService.currentUser);

    const [mesAvis, setMesAvis] = useState([]);
    const [mesAnnonces, setMesAnnonces] = useState([]);
    const [selectedAnnonce, setSelectedAnnonce] = useState(null);
    const [offerPrice, setOfferPrice] = useState('');
    const [offerDate, setOfferDate] = useState('');
    const [offerPlace, setOfferPlace] = useState('');
    const [mesPropositions, setMesPropositions] = useState([]);  // 🔹 nouveau


    const idProfil = route?.params?.id_utilisateur;
    const isOwnProfile = !idProfil || idProfil === authService.currentUser?.id;

    useFocusEffect(
        useCallback(() => {
            async function loadProfilEtAvis() {
                const idACharger = idProfil ?? authService.currentUser?.id;

                if (!idACharger) {
                    setUser(null);
                    setMesAvis([]);
                    setMesAnnonces([]);
                    setMesPropositions([]);
                    return;
                }

                if (idProfil) {
                    const autreUser = await marthaService.getUserById(idACharger);
                    setUser(autreUser);
                } else {
                    setUser(authService.currentUser);
                }

                const avis = await marthaService.getAvisByUser(idACharger);
                setMesAvis(avis);

                const annonces = await marthaService.getAnnoncesByUser(idACharger);
                setMesAnnonces(annonces);

                if (!idProfil || idProfil === authService.currentUser?.id) {
                    const propositions = await marthaService.getPropositionsByUser(idACharger);
                    setMesPropositions(propositions);
                } else {
                    setMesPropositions([]); // on vide au cas où
                }
            }

            loadProfilEtAvis();
        }, [idProfil])
    );

    const handleUpdateProposition = async (id_proposition, nouveauStatut) => {
        // nouveauStatut : 2 = acceptée, 3 = refusée (à adapter à ta lookup)
        const ok = await marthaService.updatePropositionStatut(
            id_proposition,
            nouveauStatut
        );

        if (!ok) return;

        // Mise à jour locale de la liste
        setMesPropositions((prev) =>
            prev.map((p) =>
                p.id_proposition === id_proposition
                    ? {
                        ...p,
                        id_statut: nouveauStatut,
                        statut_description:
                            nouveauStatut === 2 ? "acceptée" : "refusée",
                    }
                    : p
            )
        );
    };


    const { theme, toggleTheme, isDark } = useTheme();
    const styles = getProfileStyles(theme);

    const openAnnonceDialog = (annonce) => {
        setSelectedAnnonce(annonce);
        setOfferPrice(String(annonce.prix_demande ?? ''));
        setOfferDate('');
        setOfferPlace(annonce.lieu ?? '');
    };

    const closeAnnonceDialog = () => {
        setSelectedAnnonce(null);
        setOfferPrice('');
        setOfferDate('');
        setOfferPlace('');
    };

    const handleSubmitOffer = () => {
        if (!selectedAnnonce) return;
        console.log('Nouvelle offre', {
            annonceId: selectedAnnonce.id_annonce,
            prix: offerPrice,
            dateVente: offerDate,
            lieu: offerPlace,
        });
        closeAnnonceDialog();
    };





    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Profil</Text>
                <Text>Aucun utilisateur connecté.</Text>
            </View>
        );
    }

    const renderProposition = ({ item }) => {
        const dateTexte = new Date(item.date_proposition).toLocaleDateString();
        const prixNumber = Number(item.prix);
        const prixTexte = Number.isFinite(prixNumber)
            ? `${prixNumber.toFixed(2)} $`
            : `${item.prix ?? ""} $`;

        const enAttente =
            item.id_statut === 1 || item.statut_description === "en attente";

        return (
            <View style={styles.propositionCard}>
                <Text style={styles.propositionTitre}>
                    Proposition sur : {item.titre_annonce}
                </Text>

                <Text style={styles.propositionLigne}>
                    De : {item.acheteur_prenom} {item.acheteur_nom}
                </Text>

                <Text style={styles.propositionLigne}>
                    Prix proposé : {prixTexte}
                </Text>

                <Text style={styles.propositionLigne}>
                    Lieu proposé : {item.lieu || "Non précisé"}
                </Text>

                <Text style={styles.propositionMeta}>
                    Le {dateTexte} • Statut : {item.statut_description}
                </Text>

                {enAttente && (
                    <View style={styles.propositionActions}>
                        <TouchableOpacity
                            style={styles.btnAccept}
                            onPress={() => handleUpdateProposition(item.id_proposition, 2)}
                        >
                            <Text style={styles.btnAcceptText}>Accepter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnRefuse}
                            onPress={() => handleUpdateProposition(item.id_proposition, 3)}
                        >
                            <Text style={styles.btnRefuseText}>Refuser</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

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
        const debut = item.date_debut
            ? new Date(item.date_debut).toLocaleDateString()
            : "";
        const fin = item.date_fin
            ? new Date(item.date_fin).toLocaleDateString()
            : "";

        const prixNumber = Number(item.prix_demande);
        const prixTexte = Number.isFinite(prixNumber)
            ? `${prixNumber.toFixed(2)} $`
            : `${item.prix_demande ?? ""} $`;

        const resolveImage = (base64String) => {
            if (typeof base64String !== 'string' || base64String.length === 0) {
                return "https://via.placeholder.com/200x200?text=Annonce";
            }
            if (base64String.startsWith('data:image')) {
                return base64String;
            }
            return `data:image/jpeg;base64,${base64String}`;
        };
        const photoUri = resolveImage(item.image_base64);

        return (
            <TouchableOpacity
                style={styles.annonceCard}
                activeOpacity={isOwnProfile ? 1 : 0.85}
                onPress={isOwnProfile ? undefined : () => openAnnonceDialog(item)}
                disabled={isOwnProfile}
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

            {isOwnProfile && (
                <>
                    <Text style={styles.sectionTitle}>Propositions reçues</Text>
                    {mesPropositions.length === 0 ? (
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyText}>
                                Aucune proposition pour l’instant.
                            </Text>
                        </View>
                    ) : (
                        <FlatList
                            data={mesPropositions}
                            keyExtractor={(item) => String(item.id_proposition)}
                            renderItem={renderProposition}
                            scrollEnabled={false}
                        />
                    )}
                </>
            )}



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



            <Modal
                visible={!!selectedAnnonce}
                transparent
                animationType="slide"
                onRequestClose={closeAnnonceDialog}
            >
                <View style={styles.dialogOverlay}>
                    <View style={styles.dialogCard}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.dialogScrollContent}
                        >
                            {selectedAnnonce && (
                                <>
                                    <Image
                                        source={resolveAnnonceImage(selectedAnnonce.image_base64)}
                                        style={styles.dialogImage}
                                        resizeMode="cover"
                                    />
                                    <Text style={styles.dialogTitle}>{selectedAnnonce.titre}</Text>
                                    <Text style={styles.dialogDescription}>{selectedAnnonce.description}</Text>

                                    <View style={styles.dialogRow}>
                                        <Text style={styles.dialogLabel}>Prix demandé</Text>
                                        <Text style={styles.dialogValue}>{formatPrice(selectedAnnonce.prix_demande)} $</Text>
                                    </View>
                                    <View style={styles.dialogRow}>
                                        <Text style={styles.dialogLabel}>Lieu</Text>
                                        <Text style={styles.dialogValue}>{selectedAnnonce.lieu}</Text>
                                    </View>

                                    <View style={styles.dialogForm}>
                                        <Text style={styles.dialogFormTitle}>Faire une offre</Text>
                                        <TextInput
                                            style={styles.dialogInput}
                                            placeholder="Montant de l'offre"
                                            keyboardType="numeric"
                                            value={offerPrice}
                                            onChangeText={setOfferPrice}
                                        />
                                        <TextInput
                                            style={styles.dialogInput}
                                            placeholder="Date de la vente (AAAA-MM-JJ)"
                                            placeholderTextColor="#888"
                                            value={offerDate}
                                            onChangeText={setOfferDate}
                                        />
                                        <TextInput
                                            style={styles.dialogInput}
                                            placeholder="Lieu de la vente"
                                            value={offerPlace}
                                            onChangeText={setOfferPlace}
                                        />

                                        <TouchableOpacity style={styles.offerButton} onPress={handleSubmitOffer}>
                                            <Text style={styles.offerButtonLabel}>FAIRE UNE OFFRE</Text>
                                        </TouchableOpacity>
                                        <Button title="Fermer" onPress={closeAnnonceDialog} />
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Bouton Déconnexion */}

            {isOwnProfile && (
                <View style={styles.logoutWrapper}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={() => {
                            authService.logOut();
                            navigation.replace("Connexion");
                        }}

                    >
                        <Text style={styles.btnAnnoncesText}>Se déconnecter</Text>
                    </TouchableOpacity>
                </View>
            )}


        </ScrollView>
    );
}
