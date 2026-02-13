import { http } from "../../../lib/http";

export type SearchResponse = {
  q: string;
  totals: {
    projects: number;
    nc: number;
    milestones: number;
    stock: number;
    tools: number;
    invoices: number;
  };
  results: {
    projects: Array<{
      _id: string;
      name: string;
      status: string;
      description: string;
    }>;
    nc: Array<{
      _id: string;
      projectId: string;
      title: string;
      status: string;
    }>;
    milestones: Array<{
      _id: string;
      projectId: string;
      name: string;
      progress: number;
      completed: boolean;
    }>;
    stock: Array<{
      _id: string;
      projectId: string;
      quantity: number;
      location: string;
      product: { _id: string; name: string } | null;
    }>;
    tools: Array<{
      _id: string;
      name: string;
      status: string;
      serialNumber: string | null;
    }>;
    invoices: Array<{
      _id: string;
      projectId: string;
      number: string;
      amount: number;
      status: string;
    }>;
  };
};

export async function searchApi(q: string, limit = 8) {
  const { data } = await http.get<SearchResponse>(`/search`, {
    params: { q, limit },
  });
  return data;
}
