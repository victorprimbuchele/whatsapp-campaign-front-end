export type Campaign = {
  id: string;
  name: string;
  status: {
    id: string;
    createdAt: Date;
    updatedAt: Date | null;
    sortOrder: number;
    code: string;
  };
  userId: string;
  templateId: string;
  phoneNumbers: string[];
  variables: Record<string, string>;
  scheduleAt?: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;
};
