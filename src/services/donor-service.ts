
'use server';

import { db } from '@/lib/firebase';
import { ref, push, set, get, serverTimestamp } from 'firebase/database';

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
  timestamp: number; // serverTimestamp will resolve to a number
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

// Internal helper function to capitalize the first letter of each word in a name.
function capitalizeName(name: string): string {
  if (!name) return "";
  return name
    .toLowerCase() // Optional: convert to lower case first for consistency
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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

    const formattedName = capitalizeName(donorData.name);

    const donorPayload = {
      ...donorData, // Spread original data first
      name: formattedName, // Override name with formatted name
      age,
      active: true,
      timestamp: serverTimestamp(), // Firebase will convert this to a numeric timestamp
    };

    await set(newDonorRef, donorPayload);
    
    // For the immediate return, serverTimestamp() isn't resolved yet by Firebase.
    // The actual numeric timestamp will be available on subsequent reads.
    // We can use Date.now() for an immediate optimistic update if needed,
    // but getDonors will fetch the server-generated timestamp.
    const currentTimestamp = Date.now(); // For optimistic local state if needed

    return { 
      id: newDonorId, 
      ...donorData,       // Use original donorData for other fields
      name: formattedName, // Return the formatted name
      age,
      active: true,
      timestamp: currentTimestamp // Return current client time for immediate display
                                // getDonors() will fetch the server-set timestamp.
    };
  } catch (error: any) {
    console.error('Error adding donor:', error);
    if (error.message === 'Donor must be at least 18 years old.' || error.message === 'Donor must be 50 years old or younger.') {
        throw error;
    }
    throw new Error('Could not add donor.');
  }
}

export async function getDonors(): Promise<Donor[]> {
  try {
    const donorsRef = ref(db, DONORS_PATH);
    const snapshot = await get(donorsRef);

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
