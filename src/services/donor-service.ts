
'use server';

import { db } from '@/lib/firebase';
import { ref, push, set, get, child, serverTimestamp } from 'firebase/database';

export interface Donor {
  id: string;
  name: string;
  amount: number;
  message?: string;
  timestamp: number;
}

export interface NewDonorData {
  name: string;
  amount: number;
  message?: string;
}

const DONORS_PATH = 'donors';

export async function addDonor(donorData: NewDonorData): Promise<Donor> {
  try {
    const donorsRef = ref(db, DONORS_PATH);
    const newDonorRef = push(donorsRef);
    const newDonorId = newDonorRef.key;

    if (!newDonorId) {
      throw new Error('Failed to generate a new donor ID.');
    }

    const donorPayload = {
      ...donorData,
      timestamp: serverTimestamp(),
    };

    await set(newDonorRef, donorPayload);
    
    // Firebase serverTimestamp is an object, for immediate return we'll use current client time
    // For actual stored value, it will be server time.
    // Or fetch the data again if exact server timestamp is needed immediately.
    const currentTimestamp = Date.now();

    return { id: newDonorId, ...donorData, timestamp: currentTimestamp };
  } catch (error) {
    console.error('Error adding donor:', error);
    throw new Error('Could not add donor.');
  }
}

export async function getDonors(): Promise<Donor[]> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, DONORS_PATH));
    if (snapshot.exists()) {
      const donorsData = snapshot.val();
      return Object.keys(donorsData).map((key) => ({
        id: key,
        ...donorsData[key],
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error getting donors:', error);
    throw new Error('Could not retrieve donors.');
  }
}

export async function getDonorById(donorId: string): Promise<Donor | null> {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `${DONORS_PATH}/${donorId}`));
    if (snapshot.exists()) {
      return { id: snapshot.key as string, ...snapshot.val() } as Donor;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting donor by ID ${donorId}:`, error);
    throw new Error(`Could not retrieve donor with ID ${donorId}.`);
  }
}
