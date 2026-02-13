// types/index.ts

// Auth Types
export interface User {
  id: string; // ✅ Changed from _id to match backend
  email: string;
  name: string;
  avatar?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string; // ✅ Changed from token
  user: User;
  sessionId?: string;
  refreshToken?: string;
}

// Project Types
export interface ProjectMember {
  userId: string | User; // ✅ Can be populated
  role: "PROJECT_MANAGER" | "QUALITY" | "TEAM_LEADER" | "WORKER"; // ✅ Match backend
  _id?: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  owner: string | User; // ✅ Can be populated
  members: ProjectMember[];
  status: "PLANNING" | "ACTIVE" | "COMPLETED" | "ARCHIVED"; // ✅ Match backend
  startDate?: string;
  endDate?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Plan Types
export interface Plan {
  _id: string;
  projectId: string;
  name: string;
  description?: string;
  currentVersion?: PlanVersion;
  versions: PlanVersion[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanVersion {
  _id: string;
  version: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  notes?: string;
}

// Progress Types
export interface Milestone {
  _id: string;
  projectId: string;
  name: string;
  description?: string;
  progress: number;
  startDate?: string;
  endDate?: string;
  completed?: boolean;
  status?: "pending" | "in-progress" | "completed";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Tool Types
export interface Tool {
  _id: string;
  name: string;
  description?: string;
  category: string;
  serialNumber?: string;
  status: "available" | "in-use" | "maintenance" | "retired";
  currentAssignment?: ToolAssignment;
  assignments?: ToolAssignment[];
  createdAt: string;
  updatedAt: string;
}

export interface ToolAssignment {
  _id: string;
  toolId: string;
  projectId: string;
  assignedTo: string;
  assignedBy: string;
  assignedDate: string;
  returnedDate?: string;
  returnedAt?: string;
  notes?: string;
  status?: "active" | "returned" | "lost";
}

export interface ToolMaintenance {
  _id: string;
  toolId: string;
  type: "preventive" | "corrective";
  startDate: string;
  endDate?: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  technician?: string;
  notes?: string;
}

// Stock Types
export interface Product {
  _id: string;
  name: string;
  description?: string;
  sku: string;
  category: string;
  unit: string;
  unitPrice?: number;
  currentQuantity: number;
  quantity?: number;
  minQuantity?: number;
  reorderLevel?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  _id: string;
  productId: string;
  projectId?: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: string;
  reference?: string;
  createdBy: string;
  createdAt: string;
}

// Billing Types
export interface Invoice {
  _id: string;
  projectId: string;
  invoiceNumber: string;
  amount: number;
  description?: string;
  status: "DRAFT" | "SENT" | "PAID" | "CANCELLED";
  dueDate?: string;
  paidDate?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BillingRule {
  _id: string;
  projectId: string;
  type: string;
  amount: number;
  frequency?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Non-Conformity Types
// export interface NonConformity {
//   _id: string;
//   projectId: string;
//   title: string;
//   description?: string;
//   severity: "low" | "medium" | "high" | "critical";
//   status: "OPEN" | "IN_PROGRESS" | "VALIDATED" | "CLOSED";
//   assignedTo?: string;
//   reportedBy: string;
//   reportedDate: string;
//   resolvedDate?: string;
//   closedDate?: string;
//   rootCause?: string;
//   correctionAction?: string;
//   preventiveAction?: string;
//   history?: NCHistory[];
//   createdAt: string;
//   updatedAt: string;
// }

// export interface NCHistory {
//   _id: string;
//   ncId: string;
//   status: string;
//   changeDate: string;
//   changedBy: string;
//   notes?: string;
//   attachments?: string[];
// }

export interface NonConformity {
  _id: string;
  projectId: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "VALIDATED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  assignedTo?: string | User;
  planId?: string;
  planVersionId?: string;
  annotationId?: string;
  attachments: string[];
  createdBy: string | User;
  updatedBy?: string | User;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NCHistory {
  _id: string;
  ncId: string;
  action: "CREATED" | "ASSIGNED" | "STATUS_CHANGED" | "VALIDATED";
  fromStatus?: string;
  toStatus?: string;
  userId: string | User;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  _id: string;
  projectId: string;
  name: string;
  currentVersion?: PlanVersion;
  createdBy: string;
  updatedBy?: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanVersion {
  _id: string;
  planId: string;
  projectId: string;
  versionNumber: number;
  file: {
    url: string;
    publicId: string;
    bytes?: number;
    resourceType?: string;
    originalName?: string;
  };
  createdBy: string;
  updatedBy?: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Annotation {
  _id: string;
  projectId: string;
  planVersionId: string;
  type: "DRAW" | "PIN" | "TEXT";
  geometry: {
    x?: number;
    y?: number;
    page?: number;
    [key: string]: any;
  };
  content?: string;
  createdBy: string;
  clientId?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  openNCRs: number;
  totalTools: number;
  toolsInUse: number;
  totalStock: number;
  lowStockItems: number;
  totalBilling: number;
  outstandingAmount: number;

  totals: {
    ncTotal: number;
    ncOpen: number;
    ncInProgress: number;
    ncValidated: number;
    milestonesTotal: number;
    milestonesCompleted: number;
    milestonesCompletionRate: number;
    stockTotalQty: number;
    toolsAssigned: number;
    invoicesTotal: number;
    invoicesPaid: number;
    invoicesUnpaid: number;
  };

  invoicesByStatus: {
    DRAFT: { count: number; totalAmount: number };
    SENT: { count: number; totalAmount: number };
    PAID: { count: number; totalAmount: number };
    CANCELLED: { count: number; totalAmount: number };
  };

  projects: Array<{
    _id: string;
    name: string;
    status: string;
    updatedAt: string;
  }>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
