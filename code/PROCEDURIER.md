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
- Formulaire d'offre dans la modal: Champs pour montant de l'offre, date de la vente, lieu de la vente
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

### Annonces de l'utilisateur

- Annonces disponibles: Affichage de la liste des annonces de l'utilisateur avec image, titre, lieu, prix et dates
- Aucune annonce: Affichage du message "Aucune annonce pour l'instant."
- Clic sur une annonce: Navigation vers l'écran Détails de l'annonce (non implémenté actuellement)

### Avis

- Avis disponibles: Affichage de la liste des avis reçus avec étoiles, commentaire, date et auteur
- Aucun avis: Affichage du message "Aucun avis pour l'instant."
- Clic sur le nom de l'auteur d'un avis: Navigation vers le profil de cet utilisateur
- Affichage des étoiles: Étoiles pleines (★) pour la note, étoiles vides (☆) pour le reste

### Consultation d'un autre profil

- Navigation depuis un avis: Affichage du profil de l'utilisateur qui a laissé l'avis
- Informations affichées: Même structure que le profil personnel
- Annonces et avis: Affichage des annonces et avis de l'utilisateur consulté

