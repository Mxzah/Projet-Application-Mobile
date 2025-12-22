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
    Button,
    Alert,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "/home/etd/Projet-Application-Mobile/code/context/ThemeContext.js";
import marthaService from "../../services/Martha";
import { useAuth } from "../../context/AuthContext";
import { getProfileStyles } from "../../styles";
import Proposition from "./Proposition.model";



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

    const { currentUser, logOut } = useAuth();
    const [user, setUser] = useState(currentUser);

    const [mesAvis, setMesAvis] = useState([]);
    const [mesAnnonces, setMesAnnonces] = useState([]);
    const [selectedAnnonce, setSelectedAnnonce] = useState(null);
    const [offerPrice, setOfferPrice] = useState('');
    const [offerDate, setOfferDate] = useState('');
    const [offerPlace, setOfferPlace] = useState('');
    const [offerSuccessMessage, setOfferSuccessMessage] = useState('');
    const [offerErrorMessage, setOfferErrorMessage] = useState('');
    const [mesPropositions, setMesPropositions] = useState([]);
    const [mesPropositionsEnvoyees, setMesPropositionsEnvoyees] = useState([]);

    const [mesTransactionsAvis, setMesTransactionsAvis] = useState([]); // propositions acceptées où je peux laisser un avis
    const [avisModalVisible, setAvisModalVisible] = useState(false);
    const [editingAvis, setEditingAvis] = useState(null); // { type: 'create' | 'edit', id_avis?, id_proposition }
    const [avisNote, setAvisNote] = useState("5");
    const [avisCommentaire, setAvisCommentaire] = useState("");
    const [activeTab, setActiveTab] = useState("infos");
    const [coursMap, setCoursMap] = useState({});






    const idProfil = route?.params?.id_utilisateur;
    const isOwnProfile = !idProfil || idProfil === currentUser?.id;



    useFocusEffect(
        useCallback(() => {
            async function loadProfilEtAvis() {
                const idACharger = idProfil ?? currentUser?.id;

                if (!idACharger) {
                    setUser(null);
                    setMesAvis([]);
                    setMesAnnonces([]);
                    setMesTransactionsAvis([]);
                    setMesPropositions([]);
                    return;
                }

                if (idProfil) {
                    const autreUser = await marthaService.getUserById(idACharger);
                    setUser(autreUser);
                } else {
                    setUser(currentUser);
                }

                const avis = await marthaService.getAvisByUser(idACharger);
                setMesAvis(avis);

                const annonces = await marthaService.getAnnoncesByUser(idACharger);
                setMesAnnonces(annonces);

                // Charger les cours pour afficher le nom dans les annonces
                const coursResponse = await marthaService.getCours();
                const coursList = coursResponse?.data ?? [];
                const map = {};
                coursList.forEach(c => {
                    map[c.id_cours] = `${c.code} - ${c.nom}`;
                });
                setCoursMap(map);

                if (!idProfil && currentUser) {
                    const tx = await marthaService.getTransactionsPourAvis(
                        currentUser.id
                    );
                    setMesTransactionsAvis(tx);

                    const propositions = await marthaService.getPropositionsByUser(
                        currentUser.id
                    );
                    setMesPropositions(
                        (propositions ?? []).map(Proposition.fromApi)
                    );

                    // Propositions envoyées (où je suis l'acheteur)
                    const sent = await marthaService.getPropositionsSentByUser(currentUser.id);
                    setMesPropositionsEnvoyees((sent ?? []).map(Proposition.fromApi));
                } else {
                    setMesTransactionsAvis([]);
                    setMesPropositions([]);
                    setMesPropositionsEnvoyees([]);
                }
            }

            loadProfilEtAvis();
        }, [idProfil, currentUser?.id])
    );

    // Séparer les annonces vendues et non vendues, puis grouper par cours
    const { annoncesActives, annoncesVendues } = useMemo(() => {
        const groupByCours = (annonces) => {
            // Trier par date_debut (plus récent en premier)
            const sorted = [...annonces].sort((a, b) => {
                const dateA = new Date(a.date_debut || 0);
                const dateB = new Date(b.date_debut || 0);
                return dateB - dateA;
            });

            // Grouper par cours
            const groups = {};
            const sansCoursKey = '__sans_cours__';

            sorted.forEach(annonce => {
                const key = annonce.id_cours || sansCoursKey;
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(annonce);
            });

            // Convertir en tableau
            const result = [];

            const coursKeys = Object.keys(groups)
                .filter(k => k !== sansCoursKey)
                .sort((a, b) => {
                    const nomA = coursMap[a] || '';
                    const nomB = coursMap[b] || '';
                    return nomA.localeCompare(nomB);
                });

            coursKeys.forEach(key => {
                result.push({
                    coursId: key,
                    coursNom: coursMap[key] || `Cours #${key}`,
                    annonces: groups[key],
                });
            });

            if (groups[sansCoursKey]) {
                result.push({
                    coursId: null,
                    coursNom: 'Sans cours associé',
                    annonces: groups[sansCoursKey],
                });
            }

            return result;
        };

        // Séparer vendues et non vendues
        const actives = mesAnnonces.filter(a => !a.est_vendue);
        const vendues = mesAnnonces.filter(a => a.est_vendue);

        return {
            annoncesActives: groupByCours(actives),
            annoncesVendues: groupByCours(vendues),
        };
    }, [mesAnnonces, coursMap]);


    const renderTabButton = (key, label) => {
        const isActive = activeTab === key;
        return (
            <TouchableOpacity
                key={key}
                style={[
                    styles.tabButton,
                    isActive && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(key)}
            >
                <Text
                    style={[
                        styles.tabButtonText,
                        isActive && styles.tabButtonTextActive,
                    ]}
                >
                    {label}
                </Text>
            </TouchableOpacity>
        );
    };


    const handleUpdateProposition = async (id_proposition, nouveauStatut, id_annonce = null) => {
        const ok = await marthaService.updatePropositionStatut(
            id_proposition,
            nouveauStatut
        );

        if (!ok) return;

        // Si la proposition est acceptée (statut 2), marquer l'annonce comme vendue
        // et refuser toutes les autres propositions pour cette annonce
        if (nouveauStatut === 2 && id_annonce) {
            await marthaService.markAnnonceAsSold(id_annonce);
            // Mettre à jour la liste des annonces localement
            setMesAnnonces((prev) =>
                prev.map((a) =>
                    a.id_annonce === id_annonce
                        ? { ...a, est_vendue: true }
                        : a
                )
            );

            // Refuser toutes les autres propositions en attente pour cette annonce
            const autresPropositions = mesPropositions.filter(
                (p) => p.id_annonce === id_annonce &&
                    p.id_proposition !== id_proposition &&
                    p.id_statut === 1 // en attente
            );

            // Mettre à jour chaque proposition sur le backend
            for (const prop of autresPropositions) {
                await marthaService.updatePropositionStatut(prop.id_proposition, 3); // 3 = refusée
            }

            // Mettre à jour l'état local pour toutes les propositions de cette annonce
            setMesPropositions((prev) =>
                prev.map((p) => {
                    if (p.id_proposition === id_proposition) {
                        return p.cloneWith({
                            id_statut: 2,
                            statut_description: "acceptée",
                        });
                    }
                    if (p.id_annonce === id_annonce && p.id_statut === 1) {
                        return p.cloneWith({
                            id_statut: 3,
                            statut_description: "refusée",
                        });
                    }
                    return p;
                })
            );
        } else {
            // Cas où on refuse manuellement une proposition
            setMesPropositions((prev) =>
                prev.map((p) =>
                    p.id_proposition === id_proposition
                        ? p.cloneWith({
                            id_statut: nouveauStatut,
                            statut_description:
                                nouveauStatut === 2 ? "acceptée" : "refusée",
                        })
                        : p
                )
            );
        }
    };

    const handleDeleteAvis = (avis) => {

        Alert.alert(
            "Supprimer l'avis",
            "Êtes-vous sûr de vouloir supprimer cet avis ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        const ok = await marthaService.deleteAvis(avis.id_avis);

                        if (!ok) {
                            Alert.alert("Erreur", "Impossible de supprimer l'avis.");
                            return;
                        }

                        setMesAvis((prev) => prev.filter(a => a.id_avis !== avis.id_avis));

                        // IMPORTANT: si tu as l'onglet "Transactions à évaluer"
                        // il faut recharger pour que la transaction redevienne "à évaluer" (sans avis)
                        if (currentUser?.id) {
                            const tx = await marthaService.getTransactionsPourAvis(currentUser.id);
                            setMesTransactionsAvis(tx);
                        }
                    }
                }
            ]
        );
    };


    const handleDeleteAnnonce = async (id_annonce) => {
        Alert.alert(
            "Supprimer l'annonce",
            "Êtes-vous sûr de vouloir supprimer cette annonce ?",
            [
                {
                    text: "Annuler",
                    style: "cancel"
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: async () => {
                        const ok = await marthaService.deleteAnnonce(id_annonce);
                        if (ok) {
                            setMesAnnonces((prev) =>
                                prev.filter((a) => a.id_annonce !== id_annonce)
                            );
                        } else {
                            Alert.alert("Erreur", "Impossible de supprimer l'annonce.");
                        }
                    }
                }
            ]
        );
    };

    const handleEditAnnonce = (annonce) => {
        navigation.navigate("Vendre", { annonceToEdit: annonce });
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
        setOfferSuccessMessage('');
        setOfferErrorMessage('');
    };

    const handleSubmitOffer = async () => {
        if (!selectedAnnonce) return;

        setOfferSuccessMessage('');
        setOfferErrorMessage('');

        const errors = [];

        if (offerPrice === '' || offerDate === '' || offerPlace === '') {
            errors.push('• Veuillez remplir tous les champs.');
        }

        if (offerPrice !== '' && (offerPrice <= 0 || isNaN(offerPrice))) {
            errors.push('• Le prix de l\'offre doit être un nombre supérieur à 0.');
        }

        if (offerDate !== '') {
            const dateRegex = /^\d{4}-\d{2}-\d{2}(\s+\d{2}:\d{2}:\d{2})?$/;
            if (!dateRegex.test(offerDate)) {
                errors.push('• Le format de la date doit être AAAA-MM-JJ ou AAAA-MM-JJ HH:MM:SS.');
            } else {
                const datePart = offerDate.trim().split(' ')[0];
                const [year, month, day] = datePart.split('-').map(Number);
                const dateObj = new Date(year, month - 1, day);

                // Vérifier que la date existe
                if (dateObj.getFullYear() !== year ||
                    dateObj.getMonth() !== month - 1 ||
                    dateObj.getDate() !== day) {
                    errors.push('• La date entrée n\'existe pas (ex: le 30 février n\'existe pas).');
                } else {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    if (dateObj < today) {
                        errors.push('• La date de la vente doit être aujourd\'hui ou dans le futur.');
                    }
                }
            }
        }

        if (errors.length > 0) {
            setOfferErrorMessage(errors.join('\n'));
            return;
        }

        try {
            const ok = await marthaService.insertProposition(
                offerDate,
                parseFloat(offerPrice),
                offerPlace,
                currentUser?.id,
                selectedAnnonce.id_annonce,
                1
            );
            if (ok) {
                setOfferSuccessMessage('Votre offre a été soumise avec succès!');
                setTimeout(() => {
                    closeAnnonceDialog();
                }, 2000);
            } else {
                setOfferErrorMessage('Une erreur est survenue lors de la soumission de votre offre. Veuillez réessayer.');
            }
        } catch (error) {
            setOfferErrorMessage('Une erreur est survenue lors de la soumission de votre offre. Veuillez réessayer.');
            console.error('Erreur lors de la soumission de l\'offre:', error);
        }
    };




    const openAvisModalFromTransaction = (transaction) => {
        setEditingAvis({
            type: transaction.id_avis ? "edit" : "create",
            id_avis: transaction.id_avis ?? null,
            id_proposition: transaction.id_proposition,
        });

        setAvisNote(
            transaction.note ? String(transaction.note) : "5"
        );
        setAvisCommentaire(transaction.commentaire ?? "");
        setAvisModalVisible(true);
    };


    const openAvisModalFromAvis = (avis) => {
        setEditingAvis({
            type: "edit",
            id_avis: avis.id_avis,
            id_proposition: avis.id_proposition,
        });

        setAvisNote(String(avis.note));
        setAvisCommentaire(avis.commentaire ?? "");
        setAvisModalVisible(true);
    };


    const closeAvisModal = () => {
        setAvisModalVisible(false);
        setEditingAvis(null);
        setAvisNote("5");
        setAvisCommentaire("");
    };


    const handleSaveAvis = async () => {
        if (!editingAvis) return;

        const noteNumber = Number(avisNote);
        if (!Number.isFinite(noteNumber) || noteNumber < 1 || noteNumber > 5) {
            alert("La note doit être entre 1 et 5.");
            return;
        }

        if (!currentUser) {
            alert("Vous devez être connecté pour laisser un avis.");
            return;
        }

        let ok = false;

        if (editingAvis.type === "create") {
            ok = await marthaService.createAvis({
                id_proposition: editingAvis.id_proposition,
                id_noteur: currentUser.id,
                note: noteNumber,
                commentaire: String(avisCommentaire),
            });

            if (!ok) {
                alert("Impossible d'enregistrer l'avis.");
                return;
            }

            const [tx, avis] = await Promise.all([
                marthaService.getTransactionsPourAvis(currentUser.id),
                marthaService.getAvisByUser(currentUser.id),
            ]);
            setMesTransactionsAvis(tx);
            setMesAvis(avis);

        } else if (editingAvis.type === "edit") {
            ok = await marthaService.updateAvis({
                id_avis: editingAvis.id_avis,
                id_noteur: currentUser.id,
                note: noteNumber,
                commentaire: String(avisCommentaire),
            });

            if (!ok) {
                alert("Impossible de mettre à jour l'avis.");
                return;
            }

            setMesAvis((prev) =>
                prev.map((a) =>
                    a.id_avis === editingAvis.id_avis
                        ? {
                            ...a,
                            note: noteNumber,
                            commentaire: avisCommentaire,
                            date_avis: new Date().toISOString(),
                        }
                        : a
                )
            );

            const tx = await marthaService.getTransactionsPourAvis(currentUser.id);
            setMesTransactionsAvis(tx);
        }

        closeAvisModal();
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
        const dateTexte = item.formattedDate;
        const prixTexte = `${item.formattedPrice} $`;
        const enAttente = item.isPending;

        return (
            <View style={styles.propositionCard}>
                <Text style={styles.propositionTitre}>
                    Proposition sur : {item.titre_annonce}
                </Text>

                <Text style={styles.propositionLigne}>
                    De : {item.buyerFullName}
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
                            onPress={() => handleUpdateProposition(item.id_proposition, 2, item.id_annonce)}
                        >
                            <Text style={styles.btnAcceptText}>Accepter</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnRefuse}
                            onPress={() => handleUpdateProposition(item.id_proposition, 3, item.id_annonce)}
                        >
                            <Text style={styles.btnRefuseText}>Refuser</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    const handleDeleteSentProposition = (id_proposition) => {
        Alert.alert("Confirmer", "Supprimer cette proposition ?", [
            { text: "Annuler", style: "cancel" },
            {
                text: "Supprimer",
                style: "destructive",
                onPress: async () => {
                    const ok = await marthaService.deleteProposition(id_proposition);
                    if (ok) {
                        setMesPropositionsEnvoyees(prev => prev.filter(p => p.id_proposition !== id_proposition));
                    } else {
                        Alert.alert("Erreur", "Impossible de supprimer la proposition.");
                    }
                },
            },
        ]);
    };



    const renderActiveTab = () => {
        switch (activeTab) {
            case "infos":
                return (
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
                );

            case "transactions":
                if (!isOwnProfile) return null;
                return (
                    <>
                        <Text style={styles.sectionTitle}>Transactions à évaluer</Text>
                        {mesTransactionsAvis.length === 0 ? (
                            <View style={styles.emptyBox}>
                                <Text style={styles.emptyText}>
                                    Aucune transaction à évaluer pour l’instant.
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={mesTransactionsAvis}
                                keyExtractor={(item) => String(item.id_proposition)}
                                renderItem={({ item }) => {
                                    const dateTexte = new Date(
                                        item.date_proposition
                                    ).toLocaleDateString();
                                    const prixTexte = formatPrice(item.prix);
                                    const aDejaAvis = !!item.id_avis;

                                    return (
                                        <View style={styles.propositionCard}>
                                            <Text style={styles.propositionTitre}>
                                                {item.titre_annonce}
                                            </Text>
                                            <Text style={styles.propositionLigne}>
                                                Vendeur : {item.vendeur_prenom} {item.vendeur_nom}
                                            </Text>
                                            <Text style={styles.propositionLigne}>
                                                Prix : {prixTexte} $
                                            </Text>
                                            <Text style={styles.propositionMeta}>
                                                Acceptée le {dateTexte}
                                            </Text>

                                            <TouchableOpacity
                                                style={styles.btnAvis}
                                                onPress={() => openAvisModalFromTransaction(item)}
                                            >
                                                <Text style={styles.btnAvisText}>
                                                    {aDejaAvis
                                                        ? "Modifier mon avis"
                                                        : "Laisser un avis"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }}
                                scrollEnabled={false}
                            />
                        )}
                    </>
                );

            case "propositions":
                if (!isOwnProfile) return null;
                return (
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

                        <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Propositions envoyées</Text>
                        {mesPropositionsEnvoyees.length === 0 ? (
                            <View style={styles.emptyBox}>
                                <Text style={styles.emptyText}>
                                    Aucune proposition envoyée pour l’instant.
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={mesPropositionsEnvoyees}
                                keyExtractor={(item) => String(item.id_proposition)}
                                renderItem={renderSentProposition}
                                scrollEnabled={false}
                            />
                        )}
                    </>
                );

            case "annonces":
                const totalActives = annoncesActives.reduce((acc, g) => acc + g.annonces.length, 0);
                const totalVendues = annoncesVendues.reduce((acc, g) => acc + g.annonces.length, 0);

                return (
                    <>
                        {/* Section Annonces Actives */}
                        <View style={styles.annonceSectionHeader}>
                            <Text style={styles.annonceSectionTitle}>📢 Annonces actives</Text>
                            <Text style={styles.annonceSectionCount}>{totalActives}</Text>
                        </View>

                        {totalActives === 0 ? (
                            <View style={styles.emptyBox}>
                                <Text style={styles.emptyText}>
                                    Aucune annonce active pour l'instant.
                                </Text>
                            </View>
                        ) : (
                            annoncesActives.map((group) => (
                                <View key={`active-${group.coursId || 'sans-cours'}`} style={styles.annonceGroupContainer}>
                                    <View style={styles.annonceGroupHeader}>
                                        <Text style={styles.annonceGroupTitle}>{group.coursNom}</Text>
                                        <Text style={styles.annonceGroupCount}>
                                            {group.annonces.length} annonce{group.annonces.length > 1 ? 's' : ''}
                                        </Text>
                                    </View>
                                    {group.annonces.map((item) => (
                                        <View key={item.id_annonce}>
                                            {renderAnnonce({ item })}
                                        </View>
                                    ))}
                                </View>
                            ))
                        )}

                        {/* Section Annonces Vendues */}
                        <View style={[styles.annonceSectionHeader, styles.annonceSectionHeaderSold]}>
                            <Text style={styles.annonceSectionTitle}>✅ Annonces vendues</Text>
                            <Text style={styles.annonceSectionCount}>{totalVendues}</Text>
                        </View>

                        {totalVendues === 0 ? (
                            <View style={styles.emptyBox}>
                                <Text style={styles.emptyText}>
                                    Aucune annonce vendue pour l'instant.
                                </Text>
                            </View>
                        ) : (
                            annoncesVendues.map((group) => (
                                <View key={`sold-${group.coursId || 'sans-cours'}`} style={[styles.annonceGroupContainer, styles.annonceGroupContainerSold]}>
                                    <View style={styles.annonceGroupHeader}>
                                        <Text style={styles.annonceGroupTitle}>{group.coursNom}</Text>
                                        <Text style={styles.annonceGroupCount}>
                                            {group.annonces.length} annonce{group.annonces.length > 1 ? 's' : ''}
                                        </Text>
                                    </View>
                                    {group.annonces.map((item) => (
                                        <View key={item.id_annonce}>
                                            {renderAnnonce({ item, isSold: true })}
                                        </View>
                                    ))}
                                </View>
                            ))
                        )}
                    </>
                );

            case "avis":
                return (
                    <>
                        <Text style={styles.sectionTitle}>Avis</Text>
                        {mesAvis.length === 0 ? (
                            <View style={styles.emptyBox}>
                                <Text style={styles.emptyText}>
                                    Aucun avis pour l’instant.
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={mesAvis}
                                keyExtractor={(item) => String(item.id_avis)}
                                renderItem={renderAvis}
                                scrollEnabled={false}
                            />
                        )}
                    </>
                );

            default:
                return null;
        }
    };


    const renderAvis = ({ item }) => {
        const stars = "★".repeat(item.note) + "☆".repeat(5 - item.note);
        const dateTexte = new Date(item.date_avis).toLocaleDateString();
        const currentUserId = currentUser?.id;

        const estMonAvis = item.id_noteur === currentUserId;

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

                {estMonAvis && (
                    <View style={styles.avisActionsRow}>
                        <TouchableOpacity
                            style={styles.btnEditAvis}
                            onPress={() => openAvisModalFromAvis(item)}
                        >
                            <Text style={styles.btnEditAvisText}>Modifier</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnDeleteAvis}
                            onPress={() => handleDeleteAvis(item)}>

                            <Text style={styles.btnDeleteAvisText}>Supprimer</Text>
                        </TouchableOpacity>

                    </View>
                )
                }


            </View >
        );
    };

    const renderSentProposition = ({ item }) => {
        const dateTexte = item.formattedDate;
        const prixTexte = `${item.formattedPrice} $`;
        const enAttente = item.isPending;

        return (
            <View style={styles.propositionCard}>
                <Text style={styles.propositionTitre}>
                    Proposition sur : {item.titre_annonce}
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

                <View style={styles.propositionActions}>
                    <TouchableOpacity
                        style={styles.btnDelete}
                        onPress={() => handleDeleteSentProposition(item.id_proposition)}
                    >
                        <Text style={styles.btnDeleteText}>Supprimer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }


    const renderAnnonce = ({ item, isSold = false }) => {
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
            <View style={[styles.annonceCard, isSold && styles.annonceCardSold]}>
                <TouchableOpacity
                    style={{ flexDirection: "row" }}
                    activeOpacity={isOwnProfile ? 1 : 0.85}
                    onPress={isOwnProfile ? undefined : () => openAnnonceDialog(item)}
                    disabled={isOwnProfile || isSold}
                >
                    <View style={{ position: 'relative' }}>
                        <Image
                            source={{ uri: photoUri }}
                            style={[styles.annonceImage, isSold && styles.annonceImageSold]}
                        />
                        {isSold && (
                            <View style={styles.soldBadge}>
                                <Text style={styles.soldBadgeText}>VENDU</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.annonceContent}>
                        <Text style={[styles.annonceTitre, isSold && styles.annonceTitreSold]} numberOfLines={1}>
                            {item.titre}
                        </Text>

                        <Text style={styles.annonceLieu}>
                            {item.lieu}
                        </Text>

                        <Text style={[styles.annoncePrix, isSold && styles.annoncePrixSold]}>
                            {prixTexte}
                        </Text>

                        <Text style={styles.annonceDates}>
                            {debut && fin ? `${debut} → ${fin}` : ""}
                        </Text>
                    </View>
                </TouchableOpacity>

                {isOwnProfile && !isSold && (
                    <View style={styles.annonceActions}>
                        <TouchableOpacity
                            style={styles.btnEdit}
                            onPress={() => handleEditAnnonce(item)}
                        >
                            <Text style={styles.btnEditText}>Modifier</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.btnDelete}
                            onPress={() => handleDeleteAnnonce(item.id_annonce)}
                        >
                            <Text style={styles.btnDeleteText}>Supprimer</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.header}>
                    {!isOwnProfile && (
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity>
                    )}
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

                <View style={styles.tabsContainer}>
                    {renderTabButton("infos", "Infos")}
                    {isOwnProfile && renderTabButton("transactions", "Transactions")}
                    {isOwnProfile && renderTabButton("propositions", "Propositions")}
                    {renderTabButton("annonces", "Annonces")}
                    {renderTabButton("avis", "Avis")}
                </View>

                {renderActiveTab()}





                <Modal
                    visible={!!selectedAnnonce}
                    transparent
                    animationType="fade"
                    onRequestClose={closeAnnonceDialog}
                >
                    <KeyboardAvoidingView
                        style={styles.annonceModalOverlay}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <View style={styles.annonceModalCard}>
                            <TouchableOpacity
                                style={styles.annonceModalCloseBtn}
                                onPress={closeAnnonceDialog}
                            >
                                <Text style={styles.annonceModalCloseBtnText}>×</Text>
                            </TouchableOpacity>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.annonceModalContent}
                            >
                                {selectedAnnonce && (
                                    <>
                                        <Image
                                            source={resolveAnnonceImage(selectedAnnonce.image_base64)}
                                            style={styles.annonceModalImage}
                                            resizeMode="cover"
                                        />

                                        <View style={styles.annonceModalHeader}>
                                            <Text style={styles.annonceModalTitle}>{selectedAnnonce.titre}</Text>
                                            <View style={styles.annonceModalPriceBadge}>
                                                <Text style={styles.annonceModalPriceText}>{formatPrice(selectedAnnonce.prix_demande)} $</Text>
                                            </View>
                                        </View>

                                        {selectedAnnonce.description ? (
                                            <Text style={styles.annonceModalDescription}>{selectedAnnonce.description}</Text>
                                        ) : null}

                                        <View style={styles.annonceModalInfoSection}>
                                            <View style={styles.annonceModalInfoRow}>
                                                <Text style={styles.annonceModalInfoIcon}>📍</Text>
                                                <View>
                                                    <Text style={styles.annonceModalInfoLabel}>Lieu de rencontre</Text>
                                                    <Text style={styles.annonceModalInfoValue}>{selectedAnnonce.lieu}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={styles.annonceModalDivider} />

                                        <View style={styles.annonceModalForm}>
                                            <Text style={styles.annonceModalFormTitle}>💰 Faire une offre</Text>

                                            <View style={styles.annonceModalInputGroup}>
                                                <Text style={styles.annonceModalInputLabel}>Montant proposé</Text>
                                                <TextInput
                                                    style={styles.annonceModalInput}
                                                    placeholder="Ex: 15.00"
                                                    placeholderTextColor="#999"
                                                    keyboardType="numeric"
                                                    value={offerPrice}
                                                    onChangeText={setOfferPrice}
                                                />
                                            </View>

                                            <View style={styles.annonceModalInputGroup}>
                                                <Text style={styles.annonceModalInputLabel}>Date de la vente</Text>
                                                <TextInput
                                                    style={styles.annonceModalInput}
                                                    placeholder="AAAA-MM-JJ"
                                                    placeholderTextColor="#999"
                                                    value={offerDate}
                                                    onChangeText={setOfferDate}
                                                />
                                            </View>

                                            <View style={styles.annonceModalInputGroup}>
                                                <Text style={styles.annonceModalInputLabel}>Lieu de la vente</Text>
                                                <TextInput
                                                    style={styles.annonceModalInput}
                                                    placeholder="Ex: Cafétéria"
                                                    placeholderTextColor="#999"
                                                    value={offerPlace}
                                                    onChangeText={setOfferPlace}
                                                />
                                            </View>

                                            {offerSuccessMessage ? (
                                                <View style={styles.successContainer}>
                                                    <Text style={styles.successText}>{offerSuccessMessage}</Text>
                                                </View>
                                            ) : null}

                                            {offerErrorMessage ? (
                                                <View style={styles.errorContainer}>
                                                    <Text style={styles.errorText}>{offerErrorMessage}</Text>
                                                </View>
                                            ) : null}

                                            <View style={styles.annonceModalButtons}>
                                                <TouchableOpacity style={styles.annonceModalCancelBtn} onPress={closeAnnonceDialog}>
                                                    <Text style={styles.annonceModalCancelBtnText}>Fermer</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.annonceModalSubmitBtn} onPress={handleSubmitOffer}>
                                                    <Text style={styles.annonceModalSubmitBtnText}>Envoyer l'offre</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </>
                                )}
                            </ScrollView>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>

                <Modal
                    visible={avisModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={closeAvisModal}
                >
                    <KeyboardAvoidingView
                        style={styles.avisModalOverlay}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
                        <View style={styles.avisModalCard}>
                            <TouchableOpacity
                                style={styles.avisModalCloseBtn}
                                onPress={closeAvisModal}
                            >
                                <Text style={styles.avisModalCloseBtnText}>×</Text>
                            </TouchableOpacity>

                            <Text style={styles.avisModalTitle}>
                                {editingAvis?.type === "edit"
                                    ? "✏️ Modifier mon avis"
                                    : "⭐ Laisser un avis"}
                            </Text>

                            <Text style={styles.avisModalLabel}>Note</Text>
                            <View style={styles.avisStarsContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <TouchableOpacity
                                        key={star}
                                        onPress={() => setAvisNote(String(star))}
                                        style={styles.avisStarButton}
                                    >
                                        <Text style={[
                                            styles.avisStarIcon,
                                            parseInt(avisNote) >= star && styles.avisStarIconActive
                                        ]}>
                                            ★
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.avisModalLabel}>Commentaire</Text>
                            <TextInput
                                style={styles.avisModalTextarea}
                                multiline
                                numberOfLines={4}
                                placeholder="Partagez votre expérience..."
                                placeholderTextColor={theme.textLight}
                                value={avisCommentaire}
                                onChangeText={setAvisCommentaire}
                            />

                            <View style={styles.avisModalButtons}>
                                <TouchableOpacity
                                    style={styles.avisModalCancelBtn}
                                    onPress={closeAvisModal}
                                >
                                    <Text style={styles.avisModalCancelBtnText}>Annuler</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.avisModalSubmitBtn}
                                    onPress={handleSaveAvis}
                                >
                                    <Text style={styles.avisModalSubmitBtnText}>Enregistrer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>




                {isOwnProfile && (
                    <View style={styles.logoutWrapper}>
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={() => {
                                logOut();
                                navigation.replace("Connexion");
                            }}

                        >
                            <Text style={styles.btnAnnoncesText}>Se déconnecter</Text>
                        </TouchableOpacity>
                    </View>
                )}


            </ScrollView>
        </SafeAreaView>
    );
}
