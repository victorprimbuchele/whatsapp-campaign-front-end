export type Contact = {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string | null;
};
