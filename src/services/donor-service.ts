
'use server';

import { db } from '@/lib/firebase';
import { ref, push, set, get, child, serverTimestamp, query, orderByChild, equalTo } from 'firebase/database';

export interface Donor {
  id: string;
  name: string;
  mobile: string;
  dob: string; // YYYY-MM-DD
  age: number;
  bloodGroup: string; // e.g., "A+", "B-", "O+"
  address: string;
  area: string;
  description?: string;
  active: boolean;
  timestamp: number; // serverTimestamp or Date.now()
}

export interface NewDonorData {
  name: string;
  mobile: string;
  dob: string; // YYYY-MM-DD
  bloodGroup: string;
  address: string;
  area: string;
  description?: string;
}

const DONORS_PATH = 'donors';

// This function is only used internally, so it should not be exported
// if the file has 'use server'; directive.
function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export async function addDonor(donorData: NewDonorData): Promise<Donor> {
  const age = calculateAge(donorData.dob);
  if (age < 18) {
    throw new Error('Donor must be at least 18 years old.');
  }
  if (age > 50) {
    throw new Error('Donor must be 50 years old or younger.');
  }

  try {
    const donorsRef = ref(db, DONORS_PATH);
    const newDonorRef = push(donorsRef);
    const newDonorId = newDonorRef.key;

    if (!newDonorId) {
      throw new Error('Failed to generate a new donor ID.');
    }

    const donorPayload = {
      ...donorData,
      age,
      active: true,
      timestamp: serverTimestamp(),
    };

    await set(newDonorRef, donorPayload);
    
    // For immediate return, we'll use current client time for timestamp and provided data.
    // The actual stored value for timestamp will be server time.
    const currentTimestamp = Date.now();

    return { 
      id: newDonorId, 
      ...donorData, 
      age,
      active: true,
      timestamp: currentTimestamp 
    };
  } catch (error: any) {
    console.error('Error adding donor:', error);
    // Re-throw specific error for age validation if it's the cause
    if (error.message === 'Donor must be at least 18 years old.' || error.message === 'Donor must be 50 years old or younger.') {
        throw error;
    }
    throw new Error('Could not add donor.');
  }
}

export async function getDonors(): Promise<Donor[]> {
  try {
    const donorsRef = ref(db, DONORS_PATH);
    // Order by name for consistent listing, can be changed
    const donorsQuery = query(donorsRef, orderByChild('name')); 
    const snapshot = await get(donorsQuery);

    if (snapshot.exists()) {
      const donorsData = snapshot.val();
      return Object.keys(donorsData).map((key) => ({
        id: key,
        ...donorsData[key],
      })).sort((a, b) => b.timestamp - a.timestamp); // Sort by most recent first
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
    const dbRef = ref(db, `${DONORS_PATH}/${donorId}`);
    const snapshot = await get(dbRef);
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
