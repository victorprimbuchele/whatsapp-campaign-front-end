const NON_EDITABLE_STATUS_CODES = new Set(["finished", "completed", "concluida"]);

export function isCampaignEditable(statusCode: string): boolean {
  return !NON_EDITABLE_STATUS_CODES.has(statusCode);
}
