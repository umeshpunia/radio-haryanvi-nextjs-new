
export interface AppDetails {
  id?: string; // Firestore document ID
  ads: boolean;
  message: string;
  showMessage: boolean;
  version: string;
  streamingUrl?: string;
  metaDataUrl?: string;
}
