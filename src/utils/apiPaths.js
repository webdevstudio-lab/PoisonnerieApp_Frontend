import API from "./axiosInstance";

export const API_PATHS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout", //logger un utilisateur et retourne un token jwt
    REGISTER: "/auth/adduser", // ajoute un utilisateur
    ME: "/auth/me",
    UPDATE_PASSWORD: "/auth/update-password",
  },

  USERS: {
    GET_ALL: "/users", // retourne tous les utilisateurs
    GET_ONE: "/users/:id", // retourne un utilisateur par son ID
    UPDATE_ONE: "/users/:id", // met à jour un utilisateur par son ID
    DELETE_ONE: "/users/:id", // supprime un utilisateur par son ID
    ADD_ONE: "/users", // ajoute un utilisateur
  },

  SALES: {
    GET_ALL: "/sales", // retourne toutes les ventes
    GET_ONE: "/sales/:id", // retourne une vente par son ID
    UPDATE_ONE: "/sales/:id", // met à jour une vente par son ID
    DELETE_ONE: "/sales/:id", // supprime une vente par son ID
    ADD_ONE: "/sales", // ajoute une vente
  },

  STORES: {
    GET_ALL: "/stores", // retourne tous les stocks
    GET_ONE: "/stores/:id", // retourne un stock par son ID
    UPDATE_ONE: "/stores/:id", // met à jour un stock par son ID
    DELETE_ONE: "/stores/:id", // supprime un stock par son ID
    ADD_ONE: "/stores", // ajoute un stock

    // --- NOUVELLES ROUTES DE MOUVEMENTS ---
    TRANSFER: "/stores/transfer", // POST : Transfert entre deux dépôts
    DECLARE_LOSS: "/stores/:id/loss", // POST : Déclaration de perte sur un dépôt spécifique
  },

  SUPPLIER: {
    // Gestion du profil Fournisseur
    GET_ALL: "/suppliers",
    GET_ONE: "/suppliers/:id",
    ADD_ONE: "/suppliers",
    UPDATE_ONE: "/suppliers/:id",
    DELETE_ONE: "/suppliers/:id",

    // Gestion du catalogue de prix spécifique au fournisseur
    CATALOG: {
      ADD_PRODUCT: "/suppliers/:supplierId/products",
      GET_ALL_PRODUCTS: "/suppliers/:supplierId/products",
      GET_ONE_PRODUCT: "/suppliers/:supplierId/products/:productId",
      UPDATE_PRODUCT: "/suppliers/:supplierId/products/:productId",
      DELETE_PRODUCT: "/suppliers/:supplierId/products/:productId",
    },
  },

  PRODUCTS: {
    // Catalogue global des références (Nom, Catégorie, Poids)
    GET_ALL: "/products",
    GET_ONE: "/products/:id",
    ADD_ONE: "/products",
    UPDATE_ONE: "/products/:id",
    DELETE_ONE: "/products/:id",
  },

  ARCHIVES: {
    // Gestion des dossiers et fichiers (Images, PDF, TXT, Excel < 2MB)
    GET_ITEMS: "/archive", // Récupérer le contenu d'un dossier (?parentId=...)
    CREATE_FOLDER: "/archive/folder", // Créer un nouveau répertoire
    UPLOAD: "/archive/upload", // Importer un ou plusieurs fichiers
    RENAME: "/archive/:id", // Renommer (utilise PATCH)
    DELETE: "/archive/:id", // Supprimer un fichier ou un dossier vide
    DOWNLOAD: "/archive/download/:id", // Téléchargement forcé avec nom d'origine
  },

  DEPENSES: {
    // Gestion des flux financiers (Sorties de caisse)
    GET_STATS: "/depenses/stats", // Pour tes KPI Cards (Jour, Semaine, Mois...)
    GET_ALL: "/depenses", // Récupérer toutes les dépenses (filtres possibles)
    CREATE: "/depenses", // Enregistrer une nouvelle dépense
    UPDATE: "/depenses/:id", // Modifier une dépense (utilise PATCH)
    DELETE: "/depenses/:id", // Supprimer une dépense
  },

  CATEGORIES_DEPENSES: {
    // Gestion des types de dépenses (Loyer, Salaire, Factures...)
    GET_ALL: "/categories", // Récupérer la liste des catégories
    CREATE: "/categories", // Créer une nouvelle catégorie
    DELETE: "/categories/:id", // Supprimer une catégorie (si non liée)
  },

  ACHATS: {
    // Gestion des arrivages et approvisionnements
    GET_ALL: "/achats", // Récupérer tout l'historique des achats
    CREATE: "/achats", // Enregistrer un nouvel achat (simple ou multiple)
    GET_ONE: "/achats/:id", // Détails d'un achat spécifique (avec produits)
    UPDATE: "/achats/:id", // Modifier les infos (ex: description)
    DELETE: "/achats/:id", // Annuler un achat complet (ajuste stocks & solde)

    // Route spécifique pour la gestion granulaire
    DELETE_PRODUCT: "/achats/:achatId/product/:productId", // Retirer un seul produit d'une liste
  },

  STOCK_HISTORY: {
    GET_ALL: "/stock-history",
    GET_ONE: "/stock-history/:id",
  },
};
