export const fr = {
  common: {
    loading: "Chargement…",
    refresh: "Actualiser",
    retry: "Réessayer",
    cancel: "Annuler",
    error: "Une erreur est survenue",
    tryAgain: "Veuillez réessayer.",
    next: "Suivant",
    prev: "Précédent",
    save: "Enregistrer",
    saving: "Enregistrement…",
    delete: "Supprimer",
    created: "Créé",
    updated: "Mis à jour",
    deleted: "Supprimé",
  },

  auth: {
    loginTitle: "Connexion",
    loginSubtitle: "Accédez à votre espace chantier",
    email: "Email",
    password: "Mot de passe",
    login: "Se connecter",
    loggingIn: "Connexion…",
    logout: "Se déconnecter",
    loginError: "Échec de connexion",
    hint: "Astuce : vous pouvez changer la langue et le thème en haut à droite.",
  },

  boot: {
    loadingApp: "Chargement chantier…",
    verifying: "Vérification de votre session",
    preparing: "Préparation de l’écran de connexion",
  },

  nav: {
    dashboard: "Tableau de bord",
    projects: "Projets",
    search: "Recherche",
    notifications: "Notifications",
  },

  dashboard: {
    title: "Tableau de bord",
    overview: "Vue globale",
    project: "projet",
    projects: "projets",

    manageProjects: "Gérer les projets",

    errorTitle: "Une erreur est survenue",
    errorSubtitle: "Impossible de charger les données du tableau de bord.",
    noProjectsTitle: "Aucun projet pour le moment",
    noProjectsSubtitle:
      "Créez votre premier projet pour suivre l’avancement, le stock, les outils et la facturation.",
    goToProjects: "Aller aux projets",

    kpiNcTotal: "NC Total",
    kpiStockQty: "Qté Stock",
    kpiStockHint: "Quantité totale",
    kpiToolsAssigned: "Outils affectés",
    kpiToolsHint: "Affectations actives",
    kpiInvoicesPaid: "Factures payées",
    kpiInvoicesTotal: "Factures totales",

    ncOpen: "Ouvert",
    ncInProgress: "En cours",
    ncValidated: "Validé",

    chartNcTitle: "Non-conformités (statut global)",
    chartInvoicesTitle: "Factures par statut (montant global)",

    milestonesTitle: "Jalons (progression globale)",
    completed: "Terminés :",
    rate: "Taux :",
    totalInvoiced: "Total facturé :",

    projectsTitle: "Projets",
    searchPlaceholder: "Rechercher un projet...",
    noResultsTitle: "Aucun projet trouvé",
    noResultsSubtitle: "Essayez une autre recherche.",

    openWorkspace: "Ouvrir l’espace",
    setActive: "Définir actif",
    active: "Actif",
    progress: "Progression",

    cardNcOpen: "NC ouvertes",
    cardStockQty: "Qté stock",
    cardInvoicesPaid: "Factures payées",
    cardToolsAssigned: "Outils affectés",
  },

  projects: {
    title: "Projets",
    subtitle: "Sélectionnez un projet pour activer votre espace",
    searchPlaceholder: "Rechercher un projet...",
    create: "Créer",
    creating: "Création…",

    createTitle: "Créer un projet",
    createHint: "Nom + description (optionnel)",
    createError: "Échec de création du projet",

    name: "Nom",
    namePlaceholder: "Ex : Projet A",
    description: "Description",
    descriptionPlaceholder: "Détails optionnels…",

    emptyTitle: "Aucun projet pour le moment",
    emptySubtitle: "Créez votre premier projet pour commencer.",

    open: "Ouvrir",
    setActive: "Définir actif",
    active: "Actif",
    members: "Membres",
    noDescription: "Aucune description",

    errorTitle: "Impossible de charger les projets",

    status: {
      PLANNING: "Planification",
      ACTIVE: "Actif",
      COMPLETED: "Terminé",
      ARCHIVED: "Archivé",
      UNKNOWN: "Inconnu",
    },
  },

  workspace: {
    title: "Espace de travail",
    subtitle: "Espace projet avec modules et onglets",
    projectIdLabel: "ID projet :",
    changeProject: "Changer de projet",
    setActive: "Définir actif",

    noProjectSelectedTitle: "Aucun projet sélectionné",
    noProjectSelectedSubtitle: "Allez dans Projets et ouvrez un espace projet.",
    goToProjects: "Aller aux projets",

    tabs: {
      plans: "Plans",
      nc: "NC",
      progress: "Progression",
      stock: "Stock",
      tools: "Outils",
      billing: "Facturation",
    },
  },

  notifications: {
    title: "Notifications",
    unread: "Non lues :",
    markAllRead: "Tout marquer comme lu",
    marking: "Marquage…",
    loadErrorTitle: "Impossible de charger les notifications",
    emptyTitle: "Aucune notification",
    emptySubtitle: "Vous êtes à jour.",
    project: "Projet",
    tapToRead: "Toucher pour lire",
    read: "Lu",
  },
  search: {
    title: "Recherche",
    subtitle: "Rechercher dans projets, NC, jalons, stock, outils, factures.",
    inputLabel: "Requête",
    minChars: "Minimum 2 caractères",
    placeholder: "Ex : villa, INV-, marteau, ouvert, béton…",
    clear: "Effacer",
    typeMore: "Saisissez au moins 2 caractères pour lancer la recherche.",

    emptyQueryTitle: "Commencer une recherche",
    emptyQuerySubtitle:
      "Entrez un mot-clé pour rechercher dans les données de l’espace.",

    errorTitle: "Échec de la recherche",

    noResultsTitle: "Aucun résultat",
    noResultsSubtitle: "Aucun résultat pour « {{q}} ».",

    due: "Échéance",
    qty: "Qté",
    amount: "Montant",

    totals: {
      projects: "Projets : {{n}}",
      nc: "NC : {{n}}",
      milestones: "Jalons : {{n}}",
      stock: "Stock : {{n}}",
      tools: "Outils : {{n}}",
      invoices: "Factures : {{n}}",
    },

    sections: {
      projects: "Projets ({{n}})",
      nc: "NC ({{n}})",
      milestones: "Jalons ({{n}})",
      stock: "Stock ({{n}})",
      tools: "Outils ({{n}})",
      invoices: "Factures ({{n}})",
    },

    badges: {
      project: "PROJET",
      nc: "NC",
      milestone: "JALON",
      stock: "STOCK",
      tool: "OUTIL",
      invoice: "FAC",
    },
  },
  stock: {
    title: "Stock",
    subtitle: "Gérer les produits et le stock du projet.",
    newProduct: "Nouveau produit",
    addToProject: "Ajouter au projet",
    needProductFirst: "Créez d’abord un produit.",

    itemsTitle: "Articles de stock",
    detailsTitle: "Détails",
    movementsTitle: "Mouvements",
    searchPlaceholder: "Rechercher par produit ou emplacement…",

    qty: "Qté",
    currentQty: "Quantité actuelle",
    product: "Produit",
    location: "Emplacement",
    locationNone: "Non défini",
    reason: "Raison",
    reasonNone: "—",

    adjust: "Ajuster",
    saving: "Enregistrement…",

    selectItemFirst: "Sélectionnez un article pour voir les mouvements.",
    selectItemTitle: "Sélectionner un article",
    selectItemSubtitle: "Choisissez un article dans la liste à gauche.",

    emptyTitle: "Aucun article de stock",
    emptySubtitle: "Ajoutez un produit au projet pour commencer.",

    noProjectTitle: "Aucun projet sélectionné",
    noProjectSubtitle: "Ouvrez un projet pour gérer le stock.",

    errorTitle: "Impossible de charger le stock",
    movementsErrorTitle: "Impossible de charger les mouvements",
    movementsEmptyTitle: "Aucun mouvement",
    movementsEmptySubtitle: "Ajustez le stock pour créer le premier mouvement.",

    in: "ENTRÉE",
    out: "SORTIE",

    toast: {
      productCreated: "Produit créé",
      itemCreated: "Article créé",
      adjusted: "Stock ajusté",
    },

    modal: {
      create: "Créer",
      creating: "Création…",
      save: "Enregistrer",
      saving: "Enregistrement…",

      productTitle: "Créer un produit",
      productSubtitle: "Ajouter un produit au catalogue.",
      itemTitle: "Ajouter au projet",
      itemSubtitle: "Créer un article de stock pour ce projet.",
      adjustTitle: "Ajuster le stock",
      adjustSubtitle: "Augmenter ou diminuer la quantité.",

      name: "Nom",
      namePh: "Ex : Ciment 50kg",
      sku: "SKU",
      skuPh: "Optionnel",
      unit: "Unité",
      unitPh: "kg, pièce, boîte…",

      product: "Produit",
      type: "Type",
      quantity: "Quantité",
      location: "Emplacement",
      locationPh: "Dépôt / Étage / Zone…",
      reason: "Raison",
      reasonPh: "Note optionnelle…",
    },
  },
  tools: {
    pageTitle: "Outils",
    subtitle: "Inventaire + affectations + maintenance",
    toolFallback: "Outil",
    unknownUser: "Utilisateur inconnu",

    actions: {
      newTool: "+ Nouvel outil",
      assignTool: "Affecter outil",
      startMaintenance: "Démarrer maintenance",
      returnTool: "Retour",
      returning: "Retour...",
      completeMaintenance: "Terminer la maintenance",
      complete: "Terminer",
      completing: "Finalisation...",
    },

    tabs: {
      assigned: "Affectés ({{n}})",
      history: "Historique ({{n}})",
      maintenance: "Maintenance ({{n}})",
      available: "Disponibles ({{n}})",
      inventory: "Inventaire ({{n}})",
    },

    sections: {
      activeAssigned: "Outils affectés (actifs)",
      history: "Historique des affectations",
      maintenance: "Historique maintenance",
      available: "Outils disponibles (inventaire)",
      inventory: "Tous les outils (inventaire)",
    },

    empty: {
      activeAssigned: "Aucun outil affecté actuellement.",
      history: "Aucune affectation pour le moment.",
      maintenance: "Aucune maintenance.",
      available: "Aucun outil disponible.",
      inventory: "Aucun outil.",
    },

    labels: {
      assignedTo: "Affecté à",
      to: "À",
      by: "Par",
      assigned: "Affecté",
      returned: "Retourné",
      started: "Démarré",
      completed: "Terminé",
      sn: "SN",
    },

    status: {
      active: "Actif",
      returned: "Retourné",
      completed: "Terminé",
    },

    modals: {
      create: {
        title: "Créer un outil",
        subtitle: "Ajouter un outil à l’inventaire",
        name: "Nom",
        namePh: "Marteau",
        serial: "Numéro de série (optionnel)",
        serialPh: "SN-001",
        create: "Créer",
        creating: "Création...",
      },
      assign: {
        title: "Affecter un outil",
        subtitle: "Choisir un outil + membre",
        tool: "Outil",
        selectTool: "Sélectionner un outil",
        onlyAvailable: "Seuls les outils DISPONIBLES sont affichés ici.",
        member: "Membre",
        loadingMembers: "Chargement des membres...",
        noMembers: "Aucun membre trouvé",
        selectMember: "Sélectionner un membre",
        membersError: "Échec de chargement des membres",
        membersHint: "Les membres viennent de : GET /api/projects/:projectId",
        assign: "Affecter",
        assigning: "Affectation...",
      },
      maintenance: {
        title: "Démarrer une maintenance",
        subtitle: "Mettre un outil en MAINTENANCE",
        tool: "Outil",
        selectTool: "Sélectionner un outil",
        rule: "Impossible si l’outil est AFFECTÉ.",
        description: "Description",
        descriptionPh: "Manche cassé, réparation…",
        start: "Démarrer",
        starting: "Démarrage...",
      },
    },
  },
  billing: {
    title: "Facturation",
    project: "Projet",

    noProjectTitle: "Aucun projet sélectionné",
    noProjectSubtitle: "Ouvrez d’abord un projet.",
    goProjects: "Aller aux projets",

    newInvoice: "+ Nouvelle facture",
    openWorkspaceTab: "Ouvrir l’onglet du projet",

    byStatusTitle: "Par statut",
    invoicesTitle: "Factures",

    summary: {
      invoices: "Factures",
      totalCount: "Nombre total",
      unpaid: "Impayées",
      unpaidHint: "BROUILLON + ENVOYÉE",
      totalAmount: "Montant total",
      sumAll: "Somme de toutes les factures",
      paidAmount: "Montant payé",
      paidHint: "Statut = PAYÉE",
    },

    amount: "Montant",
    created: "Créée",

    emptyTitle: "Aucune facture",
    emptySubtitle: "Cliquez sur « + Nouvelle facture » pour en créer une.",

    pay: "Payer",
    cancel: "Annuler",
    markPaid: "Marquer payée",
    cancelInvoice: "Annuler la facture",

    onlySentCanBePaid: "Seules les factures ENVOYÉES peuvent être payées",
    paidCannotCancel: "Les factures payées ne peuvent pas être annulées",
    alreadyCancelled: "Déjà annulée",

    modal: {
      title: "Créer une facture",
      subtitle: "Saisissez un montant (nombre > 0)",
      amount: "Montant",
      create: "Créer",
      creating: "Création...",
      notePrefix: "Note : le backend crée actuellement les factures en",
      noteSuffix:
        "Si vous voulez d’abord BROUILLON, dites-moi et j’ajusterai le backend proprement.",
    },
  },
  plans: {
    plansTitle: "Plans",
    versionsTitle: "Versions",
    newPlan: "+ Nouveau plan",

    count: "{{n}} plans",

    emptyTitle: "Aucun plan",
    emptySubtitle:
      "Cliquez sur « + Nouveau plan » pour créer votre premier plan.",

    errorTitle: "Impossible de charger les plans",

    upload: "+ Importer",
    uploading: "Importation...",
    uploadHint: "Importer une nouvelle version",
    selectPlanHint: "Sélectionnez un plan",

    noVersions: "Aucune version. Importez le premier PDF.",
    versionNumber: "Version n°{{n}}",
    modal: {
      createTitle: "Créer un plan",
      createSubtitle: "Ajouter un plan à ce projet",
      name: "Nom",
      namePh: "Plan architectural - Rez-de-chaussée",
      description: "Description (optionnelle)",
      descriptionPh: "Ajouter des détails...",
      create: "Créer",
      creating: "Création...",
    },
    preview: {
      titleFallback: "Aperçu",
      noVersionTitle: "Aucune version sélectionnée",
      noVersionSubtitle:
        "Choisissez une version du plan pour prévisualiser le PDF.",

      page: "Page",
      loadingDoc: "Chargement du document...",
      pinMode: "Cliquez sur le PDF pour placer une épingle",

      selectVersionFirst: "Sélectionnez d’abord une version",
      addPin: "Ajouter une épingle",
      pin: "+ Épingle",
      cancelPin: "Annuler l’épingle",
      openPdf: "Ouvrir le PDF",

      tip: "Astuce : clic droit sur l’épingle pour supprimer · Maj + glisser pour déplacer",

      renderErrorTitle: "Impossible d’afficher le PDF",
      renderErrorBody: "Erreur :",
      openInNewTab: "Ouvrir le PDF dans un nouvel onglet",
    },
  },
  nc: {
    title: "NC",
    subtitle: "Suivi des non-conformités (créer, affecter, statut)",
    searchPh: "Rechercher une NC...",
    new: "+ Nouveau",

    errorTitle: "Impossible de charger les NC",

    filters: {
      all: "Toutes ({{n}})",
      open: "Ouvertes ({{n}})",
      inProgress: "En cours ({{n}})",
      resolved: "Résolues ({{n}})",
      validated: "Validées ({{n}})",
      priorityAll: "Priorité : Toutes",
      priority: {
        LOW: "FAIBLE ({{n}})",
        MEDIUM: "MOYENNE ({{n}})",
        HIGH: "ÉLEVÉE ({{n}})",
        CRITICAL: "CRITIQUE ({{n}})",
      },
    },

    emptyTitle: "Aucune NC trouvée",
    emptySubtitle: "Essayez de changer les filtres ou créez une nouvelle NC.",

    assign: {
      title: "Affecter la NC",
      subtitle: "Choisissez un membre (nom affiché, id envoyé au backend)",
      member: "Membre",
      selectMember: "Sélectionner un membre...",
      assign: "Affecter",
      assigning: "Affectation...",
    },

    status: {
      title: "Changer le statut",
      subtitle: "Les transitions autorisées sont contrôlées par le backend",
      field: "Statut",
      values: {
        OPEN: "OUVERT",
        IN_PROGRESS: "EN_COURS",
        RESOLVED: "RÉSOLU",
        VALIDATED: "VALIDÉ",
      },
      comment: "Commentaire (optionnel)",
      commentPh: "Raison / note...",
      save: "Enregistrer",
      saving: "Enregistrement...",
    },

    drawer: {
      noDescription: "Aucune description",
      status: "Statut",
      priority: "Priorité",
      assigned: "Affecté à",
      assign: "Affecter",
      changeStatus: "Changer le statut",
      history: "Historique",
      noHistory: "Aucun historique pour le moment.",
      by: "Par",
      from: "De",
      to: "À",
    },
    priority: {
      LOW: "FAIBLE",
      MEDIUM: "MOYENNE",
      HIGH: "ÉLEVÉE",
      CRITICAL: "CRITIQUE",
    },

    create: {
      title: "Nouvelle NC",
      subtitle: "Créer un élément de non-conformité",
      fields: {
        title: "Titre",
        titlePh: "Ex : Mauvais matériau livré",
        description: "Description (optionnelle)",
        descriptionPh: "Plus de contexte...",
        priority: "Priorité",
      },
      create: "Créer",
      creating: "Création...",
    },

    card: {
      noDescription: "Aucune description",
      assigned: "Affecté à",
    },
  },
  annotations: {
    pinTooltip:
      "Cliquer pour éditer • Maj + glisser pour déplacer • Clic droit pour supprimer",

    drawer: {
      pin: "Épingle",
      pinWithPage: "Épingle (page {{n}})",
      subtitle: "Modifier la note, enregistrer ou supprimer.",
      note: "Note (optionnelle)",
      notePh: "Écrire quelque chose…",
      deleteTitle: "Supprimer l’épingle",
      deleting: "Suppression…",
      saving: "Enregistrement…",
    },
  },
};
