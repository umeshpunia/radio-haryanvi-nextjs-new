"use server";

import { dbFirestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import type { AppDetails } from "@/types/app-details";

const APP_DETAILS_COLLECTION = "rhAppDetails";
const APP_DETAILS_DOC_ID = "details";

const FALLBACK_STREAMING_URL = "https://listen.weareharyanvi.com/listen";
const FALLBACK_METADATA_URL =
  "https://listen.weareharyanvi.com/status-json.xsl";
const FALLBACK_BANNER_IMAGE = ""; // Default to empty, page.tsx will use its own placeholder

export async function getAppDetails(): Promise<AppDetails | null> {
  try {
    const docRef = doc(dbFirestore, APP_DETAILS_COLLECTION, APP_DETAILS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ads: data.ads || false,
        message: data.message || "",
        showMessage: data.showMessage || false,
        version: data.version || "0.0.0",
        streamingUrl: data.streamingUrl || FALLBACK_STREAMING_URL,
        metaDataUrl: data.metaDataUrl || FALLBACK_METADATA_URL,
        bannerImage: data.bannerImage || FALLBACK_BANNER_IMAGE,
        bannerTopText: data.bannerTopText || "",
        bannerTextBottom: data.bannerTextBottom || "",
      } as AppDetails;
    } else {
      console.warn(
        `App details document not found at ${APP_DETAILS_COLLECTION}/${APP_DETAILS_DOC_ID}`
      );
      // Return default values
      return {
        ads: false,
        message: "",
        showMessage: false,
        version: "0.0.0",
        streamingUrl: FALLBACK_STREAMING_URL,
        metaDataUrl: FALLBACK_METADATA_URL,
        bannerImage: FALLBACK_BANNER_IMAGE,
        bannerTopText: "",
        bannerTextBottom: "",
      };
    }
  } catch (error) {
    console.error("Error fetching app details from Firestore:", error);
    // Fallback to default values in case of an error
    return {
      ads: false,
      message: "Error loading app settings.",
      showMessage: true, // Show error message
      version: "0.0.0",
      streamingUrl: FALLBACK_STREAMING_URL,
      metaDataUrl: FALLBACK_METADATA_URL,
      bannerImage: FALLBACK_BANNER_IMAGE,
      bannerTopText: "",
      bannerTextBottom: "",
    };
  }
}
