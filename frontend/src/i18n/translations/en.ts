export const en = {
  common: {
    loading: "Loading…",
    refresh: "Refresh",
    retry: "Retry",
    cancel: "Cancel",
    error: "Something went wrong",
    tryAgain: "Please try again.",
    next: "Next",
    prev: "Previous",
    save: "Save",
    saving: "Saving…",
    delete: "Delete",
    created: "Created",
    updated: "Updated",
    deleted: "Deleted",
  },

  auth: {
    loginTitle: "Sign in",
    loginSubtitle: "Access your chantier workspace",
    email: "Email",
    password: "Password",
    login: "Login",
    loggingIn: "Logging in…",
    logout: "Logout",
    loginError: "Login failed",
    hint: "Tip: you can switch language and theme from the top right.",
  },

  boot: {
    loadingApp: "Loading chantier…",
    verifying: "Verifying your session",
    preparing: "Preparing login screen",
  },

  nav: {
    dashboard: "Dashboard",
    projects: "Projects",
    search: "Search",
    notifications: "Notifications",
  },

  dashboard: {
    title: "Dashboard",
    overview: "Global overview",
    project: "project",
    projects: "projects",

    manageProjects: "Manage Projects",

    errorTitle: "Something went wrong",
    errorSubtitle: "We couldn't load the dashboard data.",
    noProjectsTitle: "No projects yet",
    noProjectsSubtitle:
      "Create your first project to start tracking progress, stock, tools, and billing.",
    goToProjects: "Go to Projects",

    kpiNcTotal: "NC Total",
    kpiStockQty: "Stock Qty",
    kpiStockHint: "Total quantity",
    kpiToolsAssigned: "Tools Assigned",
    kpiToolsHint: "Active assignments",
    kpiInvoicesPaid: "Invoices Paid",
    kpiInvoicesTotal: "Total invoices",

    ncOpen: "Open",
    ncInProgress: "In Progress",
    ncValidated: "Validated",

    chartNcTitle: "Non-Conformities (Global Status)",
    chartInvoicesTitle: "Invoices by Status (Global Amount)",

    milestonesTitle: "Milestones (Global Progress)",
    completed: "Completed:",
    rate: "Rate:",
    totalInvoiced: "Total invoiced:",

    projectsTitle: "Projects",
    searchPlaceholder: "Search projects...",
    noResultsTitle: "No projects found",
    noResultsSubtitle: "Try a different search.",

    openWorkspace: "Open Workspace",
    setActive: "Set Active",
    active: "Active",
    progress: "Progress",

    cardNcOpen: "NC Open",
    cardStockQty: "Stock Qty",
    cardInvoicesPaid: "Invoices Paid",
    cardToolsAssigned: "Tools Assigned",
  },

  projects: {
    title: "Projects",
    subtitle: "Select a project to activate your workspace",
    searchPlaceholder: "Search projects...",
    create: "Create",
    creating: "Creating…",

    createTitle: "Create Project",
    createHint: "Name + description (optional)",
    createError: "Project creation failed",

    name: "Name",
    namePlaceholder: "Example: Project A",
    description: "Description",
    descriptionPlaceholder: "Optional details…",

    emptyTitle: "No projects yet",
    emptySubtitle: "Create your first project to start working.",

    open: "Open",
    setActive: "Set Active",
    active: "Active",
    members: "Members",
    noDescription: "No description",

    errorTitle: "Could not load projects",

    status: {
      PLANNING: "Planning",
      ACTIVE: "Active",
      COMPLETED: "Completed",
      ARCHIVED: "Archived",
      UNKNOWN: "Unknown",
    },
  },

  workspace: {
    title: "Workspace",
    subtitle: "Project workspace with modules and tabs",
    projectIdLabel: "Project ID:",
    changeProject: "Change project",
    setActive: "Set active",

    noProjectSelectedTitle: "No project selected",
    noProjectSelectedSubtitle: "Go to Projects and open a project workspace.",
    goToProjects: "Go to Projects",

    tabs: {
      plans: "Plans",
      nc: "NC",
      progress: "Progress",
      stock: "Stock",
      tools: "Tools",
      billing: "Billing",
    },
  },

  notifications: {
    title: "Notifications",
    unread: "Unread:",
    markAllRead: "Mark all as read",
    marking: "Marking…",
    loadErrorTitle: "Failed to load notifications",
    emptyTitle: "No notifications",
    emptySubtitle: "You're all caught up.",
    project: "Project",
    tapToRead: "Tap to read",
    read: "Read",
  },
  search: {
    title: "Search",
    subtitle: "Search across projects, NC, milestones, stock, tools, invoices.",
    inputLabel: "Search query",
    minChars: "Minimum 2 characters",
    placeholder: "Try: villa, INV-, hammer, open, concrete…",
    clear: "Clear",
    typeMore: "Type at least 2 characters to start searching.",

    emptyQueryTitle: "Start searching",
    emptyQuerySubtitle: "Enter a keyword to search across your workspace data.",

    errorTitle: "Search failed",

    noResultsTitle: "No results",
    noResultsSubtitle: "No results found for “{{q}}”.",

    due: "Due",
    qty: "Qty",
    amount: "Amount",

    totals: {
      projects: "Projects: {{n}}",
      nc: "NC: {{n}}",
      milestones: "Milestones: {{n}}",
      stock: "Stock: {{n}}",
      tools: "Tools: {{n}}",
      invoices: "Invoices: {{n}}",
    },

    sections: {
      projects: "Projects ({{n}})",
      nc: "NC ({{n}})",
      milestones: "Milestones ({{n}})",
      stock: "Stock ({{n}})",
      tools: "Tools ({{n}})",
      invoices: "Invoices ({{n}})",
    },

    badges: {
      project: "PROJECT",
      nc: "NC",
      milestone: "MILESTONE",
      stock: "STOCK",
      tool: "TOOL",
      invoice: "INV",
    },
  },
  stock: {
    title: "Stock",
    subtitle: "Manage products and project stock items.",
    newProduct: "New product",
    addToProject: "Add to project",
    needProductFirst: "Create a product first.",

    itemsTitle: "Stock items",
    detailsTitle: "Item details",
    movementsTitle: "Movements",
    searchPlaceholder: "Search by product or location…",

    qty: "Qty",
    currentQty: "Current quantity",
    product: "Product",
    location: "Location",
    locationNone: "Not set",
    reason: "Reason",
    reasonNone: "—",

    adjust: "Adjust",
    saving: "Saving…",

    selectItemFirst: "Select a stock item to view movements.",
    selectItemTitle: "Select an item",
    selectItemSubtitle: "Choose a stock item from the list on the left.",

    emptyTitle: "No stock items yet",
    emptySubtitle: "Add a product to this project to start tracking stock.",

    noProjectTitle: "No project selected",
    noProjectSubtitle: "Open a project workspace to manage stock.",

    errorTitle: "Failed to load stock",
    movementsErrorTitle: "Failed to load movements",
    movementsEmptyTitle: "No movements yet",
    movementsEmptySubtitle: "Adjust stock to create the first movement.",

    in: "IN",
    out: "OUT",

    toast: {
      productCreated: "Product created",
      itemCreated: "Stock item created",
      adjusted: "Stock adjusted",
    },

    modal: {
      create: "Create",
      creating: "Creating…",
      save: "Save",
      saving: "Saving…",

      productTitle: "Create product",
      productSubtitle: "Add a product to your catalog.",
      itemTitle: "Add product to project",
      itemSubtitle: "Create a stock item for this project.",
      adjustTitle: "Adjust stock",
      adjustSubtitle: "Increase or decrease quantity.",

      name: "Name",
      namePh: "Example: Cement 50kg",
      sku: "SKU",
      skuPh: "Optional",
      unit: "Unit",
      unitPh: "kg, pcs, box…",

      product: "Product",
      type: "Type",
      quantity: "Quantity",
      location: "Location",
      locationPh: "Warehouse / Floor / Zone…",
      reason: "Reason",
      reasonPh: "Optional note…",
    },
  },
  tools: {
    pageTitle: "Tools",
    subtitle: "Inventory + assignments + maintenance",
    toolFallback: "Tool",
    unknownUser: "Unknown user",

    actions: {
      newTool: "+ New Tool",
      assignTool: "Assign Tool",
      startMaintenance: "Start Maintenance",
      returnTool: "Return",
      returning: "Returning...",
      completeMaintenance: "Complete maintenance",
      complete: "Complete",
      completing: "Completing...",
    },

    tabs: {
      assigned: "Assigned ({{n}})",
      history: "History ({{n}})",
      maintenance: "Maintenance ({{n}})",
      available: "Available ({{n}})",
      inventory: "Inventory ({{n}})",
    },

    sections: {
      activeAssigned: "Active assigned tools",
      history: "Assignment history",
      maintenance: "Maintenance history",
      available: "Available tools (inventory)",
      inventory: "All tools (inventory)",
    },

    empty: {
      activeAssigned: "No active assigned tools.",
      history: "No assignments yet.",
      maintenance: "No maintenance records.",
      available: "No available tools.",
      inventory: "No tools yet.",
    },

    labels: {
      assignedTo: "Assigned to",
      to: "To",
      by: "By",
      assigned: "Assigned",
      returned: "Returned",
      started: "Started",
      completed: "Completed",
      sn: "SN",
    },

    status: {
      active: "Active",
      returned: "Returned",
      completed: "Completed",
    },

    modals: {
      create: {
        title: "Create Tool",
        subtitle: "Add a tool to inventory",
        name: "Name",
        namePh: "Hammer",
        serial: "Serial number (optional)",
        serialPh: "SN-001",
        create: "Create",
        creating: "Creating...",
      },
      assign: {
        title: "Assign Tool",
        subtitle: "Pick a tool + member",
        tool: "Tool",
        selectTool: "Select tool",
        onlyAvailable: "Only AVAILABLE tools are shown here.",
        member: "Member",
        loadingMembers: "Loading members...",
        noMembers: "No members found",
        selectMember: "Select member",
        membersError: "Failed to load members",
        membersHint: "Members come from: GET /api/projects/:projectId",
        assign: "Assign",
        assigning: "Assigning...",
      },
      maintenance: {
        title: "Start Maintenance",
        subtitle: "Set a tool to MAINTENANCE",
        tool: "Tool",
        selectTool: "Select tool",
        rule: "You can’t start maintenance if tool is ASSIGNED.",
        description: "Description",
        descriptionPh: "Broken handle, needs repair...",
        start: "Start",
        starting: "Starting...",
      },
    },
  },
  billing: {
    title: "Billing",
    project: "Project",

    noProjectTitle: "No project selected",
    noProjectSubtitle: "Open a project first.",
    goProjects: "Go to Projects",

    newInvoice: "+ New Invoice",
    openWorkspaceTab: "Open Workspace Tab",

    byStatusTitle: "By status",
    invoicesTitle: "Invoices",

    summary: {
      invoices: "Invoices",
      totalCount: "Total count",
      unpaid: "Unpaid",
      unpaidHint: "DRAFT + SENT",
      totalAmount: "Total amount",
      sumAll: "Sum of all invoices",
      paidAmount: "Paid amount",
      paidHint: "Status = PAID",
    },

    amount: "Amount",
    created: "Created",

    emptyTitle: "No invoices yet",
    emptySubtitle: "Click “+ New Invoice” to create one.",

    pay: "Pay",
    cancel: "Cancel",
    markPaid: "Mark paid",
    cancelInvoice: "Cancel invoice",

    onlySentCanBePaid: "Only SENT invoices can be paid",
    paidCannotCancel: "Paid invoices cannot be cancelled",
    alreadyCancelled: "Already cancelled",

    modal: {
      title: "Create Invoice",
      subtitle: "Enter amount (number > 0)",
      amount: "Amount",
      create: "Create",
      creating: "Creating...",
      notePrefix: "Note: your backend currently creates invoices as",
      noteSuffix:
        "If you want DRAFT first, tell me and I’ll adjust backend service cleanly.",
    },
  },
  plans: {
    plansTitle: "Plans",
    versionsTitle: "Versions",
    newPlan: "+ New Plan",

    count: "{{n}} plans",

    emptyTitle: "No plans yet",
    emptySubtitle: "Click “+ New Plan” to create your first plan.",

    errorTitle: "Failed to load plans",

    upload: "+ Upload",
    uploading: "Uploading...",
    uploadHint: "Upload a new version file",
    selectPlanHint: "Select a plan",

    noVersions: "No versions yet. Upload the first PDF.",
    versionNumber: "Version #{{n}}",
    modal: {
      createTitle: "Create Plan",
      createSubtitle: "Add a plan to this project",
      name: "Name",
      namePh: "Architectural plan - Ground floor",
      description: "Description (optional)",
      descriptionPh: "Add details...",
      create: "Create",
      creating: "Creating...",
    },
    preview: {
      titleFallback: "Preview",
      noVersionTitle: "No version selected",
      noVersionSubtitle: "Choose a plan version to preview the PDF.",

      page: "Page",
      loadingDoc: "Loading document...",
      pinMode: "Click on PDF to place pin",

      selectVersionFirst: "Select a version first",
      addPin: "Add pin",
      pin: "+ Pin",
      cancelPin: "Cancel Pin",
      openPdf: "Open PDF",

      tip: "Tip: Right click pin to delete · Hold Shift and drag pin to move",

      renderErrorTitle: "Failed to render PDF",
      renderErrorBody: "Error:",
      openInNewTab: "Open the PDF in a new tab",
    },
  },
  nc: {
    title: "NC",
    subtitle: "Track non-conformities (create, assign, status)",
    searchPh: "Search NC...",
    new: "+ New",

    errorTitle: "Failed to load NC",

    filters: {
      all: "All ({{n}})",
      open: "Open ({{n}})",
      inProgress: "In Progress ({{n}})",
      resolved: "Resolved ({{n}})",
      validated: "Validated ({{n}})",
      priorityAll: "Priority: All",
      priority: {
        LOW: "LOW ({{n}})",
        MEDIUM: "MEDIUM ({{n}})",
        HIGH: "HIGH ({{n}})",
        CRITICAL: "CRITICAL ({{n}})",
      },
    },

    emptyTitle: "No NC found",
    emptySubtitle: "Try changing filters or create a new NC.",

    assign: {
      title: "Assign NC",
      subtitle: "Choose a member (name shown, id sent to backend)",
      member: "Member",
      selectMember: "Select member...",
      assign: "Assign",
      assigning: "Assigning...",
    },

    status: {
      title: "Change Status",
      subtitle: "Allowed transitions are enforced by backend",
      field: "Status",
      values: {
        OPEN: "OPEN",
        IN_PROGRESS: "IN_PROGRESS",
        RESOLVED: "RESOLVED",
        VALIDATED: "VALIDATED",
      },
      comment: "Comment (optional)",
      commentPh: "Reason / note...",
      save: "Save",
      saving: "Saving...",
    },

    drawer: {
      noDescription: "No description",
      status: "Status",
      priority: "Priority",
      assigned: "Assigned",
      assign: "Assign",
      changeStatus: "Change Status",
      history: "History",
      noHistory: "No history yet.",
      by: "By",
      from: "From",
      to: "To",
    },
    priority: {
      LOW: "LOW",
      MEDIUM: "MEDIUM",
      HIGH: "HIGH",
      CRITICAL: "CRITICAL",
    },

    create: {
      title: "New NC",
      subtitle: "Create a non-conformity item",
      fields: {
        title: "Title",
        titlePh: "Ex: Wrong material delivered",
        description: "Description (optional)",
        descriptionPh: "More context...",
        priority: "Priority",
      },
      create: "Create",
      creating: "Creating...",
    },

    card: {
      noDescription: "No description",
      assigned: "Assigned",
    },
  },
  annotations: {
    pinTooltip: "Click to edit • Shift+drag to move • Right click to delete",

    drawer: {
      pin: "Pin",
      pinWithPage: "Pin (page {{n}})",
      subtitle: "Edit note, save or delete.",
      note: "Note (optional)",
      notePh: "Write something…",
      deleteTitle: "Delete pin",
      deleting: "Deleting…",
      saving: "Saving…",
    },
  },
};
