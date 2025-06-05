
'use server';

import { dbFirestore } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { AppDetails } from '@/types/app-details';

const APP_DETAILS_COLLECTION = 'rhAppDetails';
const APP_DETAILS_DOC_ID = 'details';

export async function getAppDetails(): Promise<AppDetails | null> {
  try {
    const docRef = doc(dbFirestore, APP_DETAILS_COLLECTION, APP_DETAILS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as AppDetails;
    } else {
      console.warn(`App details document not found at ${APP_DETAILS_COLLECTION}/${APP_DETAILS_DOC_ID}`);
      // Return default values or handle as an error case
      return {
        ads: false,
        message: '',
        showMessage: false,
        version: '0.0.0',
      };
    }
  } catch (error) {
    console.error('Error fetching app details from Firestore:', error);
    // Fallback to default values in case of an error
    return {
      ads: false,
      message: 'Error loading app settings.',
      showMessage: true, // Show error message
      version: '0.0.0',
    };
  }
}
