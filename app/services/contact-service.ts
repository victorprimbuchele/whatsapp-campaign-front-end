import { api } from "../lib/api";
import { Contact } from "../types/contact";
import { PaginatedResponse } from "../types/paginated-response";

export async function getContacts(params: {
  page: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedResponse<Contact>> {
  const response = await api.get("/contacts", { params });
  return response.data;
}

export async function getContactById(id: string): Promise<Contact> {
  const response = await api.get(`/contacts/${id}`);
  return response.data;
}
