import { api } from "../lib/api";
import { Template } from "../types/template";

export async function listTemplates(): Promise<Template[]> {
  const response = await api.get("/templates");
  return response.data;
}
