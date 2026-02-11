// src/features/nc/api/ncHistory.api.ts
import { http } from "../../../lib/http";

export type NcHistoryItem = {
  _id: string;
  ncId: string;
  action:
    | "CREATED"
    | "ASSIGNED"
    | "STATUS_CHANGED"
    | "RESOLVED"
    | "VALIDATED"
    | "REJECTED";
  fromStatus?: string | null;
  toStatus?: string | null;
  comment?: string | null;
  userId?: { _id: string; name?: string; email?: string } | string | null;
  createdAt: string;
};

export async function getNcHistory(ncId: string) {
  const { data } = await http.get<NcHistoryItem[]>(`/nc/${ncId}/history`);
  return data;
}
