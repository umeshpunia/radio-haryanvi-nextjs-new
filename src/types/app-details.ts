
export interface AppDetails {
  id?: string; // Firestore document ID
  ads: boolean;
  message: string;
  showMessage: boolean;
  version: string;
  streamingUrl?: string;
  metaDataUrl?: string;
  bannerImage?: string;
  bannerTopText?: string;
  bannerTextBottom?: string;
}
