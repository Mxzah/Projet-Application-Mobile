# Procédurier

## Authentification

### Connexion

- Clic sur "Se connecter" ET courriel ou mot de passe vide: Message d'erreur "Entre ton courriel et ton mot de passe."
- Clic sur "Se connecter" ET courriel ou mot de passe invalide: Message d'erreur "Courriel ou mot de passe incorrect."
- Clic sur "Se connecter" ET courriel et mot de passe valides: Ouverture de l'écran Liste des annonces
- Clic sur "Créer un compte": Ouverture de l'écran Inscription
- Erreur réseau lors de la connexion: Message d'erreur "Impossible de se connecter."

### Inscription

- Clic sur "Créer un compte" ET nom, prénom, courriel ou mot de passe vide: Message d'erreur "Veuillez remplir tous les champs."
- Clic sur "Créer un compte" ET courriel déjà utilisé: Message d'erreur "Impossible de créer l'utilisateur (courriel déjà utilisé ?)"
- Clic sur "Créer un compte" ET tous les champs valides: Ouverture de l'écran Liste des annonces
- Clic sur "Retour": Retour à l'écran Connexion
- Erreur réseau lors de l'inscription: Message d'erreur "Une erreur s'est produite lors de l'inscription."

## Navigation principale (MarketplaceHeader)

### Onglets

- Clic sur l'onglet "Vendre": Navigation vers l'écran Vendre un produit
- Clic sur l'onglet "Acheter": Navigation vers l'écran Liste des annonces
- Clic sur l'onglet "Programmes": Navigation vers l'écran Filtrage par programmes
- L'onglet actif est mis en évidence visuellement (fond bleu clair, texte bleu)

### Icônes

- Clic sur l'icône profil (person-circle-outline): Navigation vers l'écran Profil

## Liste des annonces (ListAnnoncesScreen)

### Affichage

- Chargement des annonces: Affichage des annonces en grille 2 colonnes avec image, prix, titre et lieu
- Aucune annonce disponible: Affichage du message "Aucune annonce ne correspond à ces filtres."
- Erreur de chargement: Message d'avertissement dans la console, liste vide affichée

### Filtrage

- Clic sur l'onglet "Programmes" depuis la liste: Ouverture de l'écran Filtrage par programmes
- Filtres actifs: Affichage d'une bannière indiquant le nombre de cours sélectionnés avec bouton "Effacer"
- Clic sur "Effacer": Suppression des filtres, affichage de toutes les annonces
- Annonces filtrées: Affichage uniquement des annonces correspondant aux cours sélectionnés

### Consultation d'une annonce

- Clic sur une carte d'annonce: Ouverture d'une modal avec les détails complets
- Modal affiche: Image, titre, description, prix demandé, lieu
- Lien vers le profil du vendeur: Affichage du lien "Voir le profil du vendeur" si l'annonce a un vendeur associé
- Clic sur "Voir le profil du vendeur": Fermeture de la modal et navigation vers le profil du vendeur
- Formulaire d'offre dans la modal: Champs pour montant de l'offre, date de la vente, lieu de la vente
- Modal scrollable: Le contenu de la modal peut être défilé si nécessaire pour accéder à tous les éléments
- Clic sur "FAIRE UNE OFFRE": Non implémenté
- Clic sur "Fermer": Fermeture de la modal

## Vendre un produit (VendreProduitScreen)

### Formulaire

- Chargement de l'écran: Affichage du formulaire avec tous les champs vides
- Chargement des cours: Liste des cours chargée depuis l'API et affichée dans le sélecteur

### Image

- Clic sur "Prendre une photo": Ouverture de l'appareil photo
- Annulation de la prise de photo: Aucune image ajoutée
- Prise de photo réussie: Image compressée (qualité 0.1) et convertie en base64, prévisualisation affichée
- Image enregistrée: Photo sauvegardée dans la médiathèque
- Aucune image: Affichage du placeholder "Aucune photo"

### Champs du formulaire

- Titre: Champ texte avec placeholder "Ex. MacBook Pro 2022"
- Lieu: Champ texte avec placeholder "Ex. Bloc B - Local 2103"
- Description: Champ texte multiligne avec placeholder "Ajoutez les détails importants"
- Date de fin: Champ texte avec placeholder "AAAA-MM-JJ"
- Prix demandé: Champ numérique avec placeholder "Ex. 199.99"
- Cours associé: Sélecteur avec option "Sélectionnez un cours" et liste des cours disponibles

### Soumission

- Clic sur "Mettre en vente": Non implémenté

## Filtrage par programmes (FilterByProgrammesScreen)

### Affichage

- Chargement de l'écran: Liste des programmes affichée avec nombre de cours par programme
- Programmes chargés: Affichage du nom, description et nombre de cours de chaque programme

### Navigation dans les programmes

- Clic sur un programme (hors case à cocher): Expansion/réduction de la liste des cours du programme
- Programme déjà sélectionné: Affichage de la liste des cours
- Programme non sélectionné: Liste des cours masquée

### Sélection

- Clic sur la case à cocher d'un programme: Sélection/désélection de tous les cours du programme
- Tous les cours d'un programme sélectionnés: Case à cocher du programme cochée
- Clic sur la case à cocher d'un cours individuel: Sélection/désélection du cours uniquement
- Cours sélectionné: Affichage d'une icône de coche bleue
- Cours non sélectionné: Affichage d'un cercle vide

### Application des filtres

- Clic sur "Appliquer les filtres": Navigation vers l'écran Liste des annonces avec les cours sélectionnés comme filtres
- Aucun cours sélectionné: Affichage de toutes les annonces
- Cours sélectionnés: Affichage uniquement des annonces correspondant aux cours sélectionnés

## Profil (ProfilScreen)

### Affichage du profil

- Chargement de l'écran: Affichage des informations de l'utilisateur connecté
- Utilisateur non connecté: Affichage du message "Aucun utilisateur connecté."
- Informations affichées: Avatar, nom complet, courriel, ID utilisateur

### Thème

- Clic sur "☀ Mode clair" ou "🌙 Mode sombre": Basculement entre thème clair et thème sombre
- Thème appliqué: Changement immédiat de l'apparence de l'application

### Navigation

- Clic sur "Voir les annonces": Navigation vers l'écran Liste des annonces

### Déconnexion

- Affichage: Bouton "Se déconnecter" visible uniquement sur le profil personnel
- Clic sur "Se déconnecter": Déconnexion de l'utilisateur et redirection vers l'écran Connexion

### Propositions reçues

- Affichage: Section visible uniquement sur le profil personnel (pas sur le profil d'un autre utilisateur)
- Propositions disponibles: Affichage de la liste des propositions reçues sur les annonces de l'utilisateur
- Informations affichées: Titre de l'annonce, nom de l'acheteur, prix proposé, lieu proposé, date de la proposition, statut
- Aucune proposition: Affichage du message "Aucune proposition pour l'instant."
- Statut des propositions: Affichage du statut (en attente, acceptée, refusée)
- Proposition en attente: Affichage des boutons "Accepter" et "Refuser"
- Clic sur "Accepter": Mise à jour du statut de la proposition à "acceptée"
- Clic sur "Refuser": Mise à jour du statut de la proposition à "refusée"
- Proposition acceptée ou refusée: Les boutons d'action ne sont plus affichés

### Annonces de l'utilisateur

- Annonces disponibles: Affichage de la liste des annonces de l'utilisateur avec image, titre, lieu, prix et dates
- Aucune annonce: Affichage du message "Aucune annonce pour l'instant."
- Consultation de son propre profil: Les annonces ne sont pas cliquables (pas d'interaction)
- Consultation du profil d'un autre utilisateur: Les annonces sont cliquables
- Clic sur une annonce (profil d'un autre utilisateur): Ouverture d'une modal avec les détails complets de l'annonce
- Modal affiche: Image, titre, description, prix demandé, lieu
- Formulaire d'offre dans la modal: Champs pour montant de l'offre, date de la vente, lieu de la vente
- Modal scrollable: Le contenu de la modal peut être défilé si nécessaire pour accéder à tous les éléments
- Clic sur "FAIRE UNE OFFRE": Non implémenté
- Clic sur "Fermer": Fermeture de la modal

### Avis

- Avis disponibles: Affichage de la liste des avis reçus avec étoiles, commentaire, date et auteur
- Aucun avis: Affichage du message "Aucun avis pour l'instant."
- Clic sur le nom de l'auteur d'un avis: Navigation vers le profil de cet utilisateur
- Affichage des étoiles: Étoiles pleines (★) pour la note, étoiles vides (☆) pour le reste

### Consultation d'un autre profil

- Navigation depuis un avis: Affichage du profil de l'utilisateur qui a laissé l'avis
- Navigation depuis le lien "Voir le profil du vendeur": Affichage du profil du vendeur depuis une annonce
- Informations affichées: Même structure que le profil personnel (sans la section "Propositions reçues")
- Annonces et avis: Affichage des annonces et avis de l'utilisateur consulté
- Annonces cliquables: Possibilité de cliquer sur les annonces pour faire une offre

## Standards de développement

### Code

- Noms de variables et fonctions en camelCase
- Noms de classes en PascalCase
- Organisation du code par fonctionnalité

### Base de données (BD)

- Noms de tables au pluriel et en majuscule
- Noms de colonnes en snake_case
- Clés primaires : toujours id_<table>

### Interface utilisateur (UI)

- Palette de couleurs principale (bleu pour les actions, rouge pour les erreurs)
- Police utilisée (Sans Serif)
- Boutons d'action principaux toujours centrés, en bas des formulaires
- Même style pour tous les formulaires (labels au-dessus des champs et champs pleine largeur)

### Expérience utilisateur (UX)

- Navigation cohérente : l'entête de page constant sur toutes les pages

