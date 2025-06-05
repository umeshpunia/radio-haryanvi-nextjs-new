
'use server';

import { dbFirestore } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface NewRequestData {
  fullName: string;
  mobile: string;
  address: string;
  farmaish: string;
  farmaishOn?: Date | null; // Date from picker
  preferredTime?: string;
}

export interface FirestoreRequestData extends Omit<NewRequestData, 'farmaishOn'> {
  farmaishOn?: Timestamp | null; // Firestore Timestamp
  submittedAt: Timestamp;
  status: 'pending' | 'approved' | 'played' | 'rejected';
}

const REQUESTS_COLLECTION = 'requests';

export async function addSongRequest(data: NewRequestData): Promise<string> {
  try {
    const requestsCollectionRef = collection(dbFirestore, REQUESTS_COLLECTION);
    
    const firestoreData: Omit<FirestoreRequestData, 'submittedAt' | 'id'> = {
      fullName: data.fullName,
      mobile: data.mobile,
      address: data.address,
      farmaish: data.farmaish,
      preferredTime: data.preferredTime || '',
      status: 'pending',
    };

    if (data.farmaishOn) {
      (firestoreData as FirestoreRequestData).farmaishOn = Timestamp.fromDate(data.farmaishOn);
    } else {
      (firestoreData as FirestoreRequestData).farmaishOn = null;
    }

    const docRef = await addDoc(requestsCollectionRef, {
      ...firestoreData,
      submittedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error: any) {
    console.error('Error adding song request to Firestore:', error);
    throw new Error('Could not submit your song request. Please try again later.');
  }
}
