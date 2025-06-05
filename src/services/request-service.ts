
'use server';

import { dbFirestore } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp, getDocs, query, orderBy } from 'firebase/firestore';

// Interface for data coming from the form to this service
export interface NewRequestData {
  fullName: string;
  mobile: string;
  address: string;
  farmaish: string;
  time?: string; // User's preferred time/program input
}

// Interface representing the data structure as it is stored in Firestore
export interface FirestoreRequestData {
  fullName: string;
  mobile: string;
  address: string;
  farmaish: string;
  farmaishOn: Timestamp; // Submission timestamp
  time: string; // User's preferred time/program, or "Will Be Update"
}

// Interface representing a request object when fetched and used in the client, including its ID
export interface SongRequest extends FirestoreRequestData {
  id: string;
}

const REQUESTS_COLLECTION = 'requests';

export async function addSongRequest(data: NewRequestData): Promise<string> {
  try {
    const requestsCollectionRef = collection(dbFirestore, REQUESTS_COLLECTION);
    
    const firestorePayload: FirestoreRequestData = {
      fullName: data.fullName,
      mobile: data.mobile,
      address: data.address,
      farmaish: data.farmaish,
      farmaishOn: serverTimestamp() as Timestamp, // This is the submission timestamp
      time: (data.time && data.time.trim() !== "") ? data.time.trim() : "Will Be Update",
    };

    const docRef = await addDoc(requestsCollectionRef, firestorePayload);
    
    return docRef.id;
  } catch (error: any) {
    console.error('Error adding song request to Firestore:', error);
    throw new Error('Could not submit your song request. Please try again later.');
  }
}

export async function getSongRequests(): Promise<SongRequest[]> {
  try {
    const requestsCollectionRef = collection(dbFirestore, REQUESTS_COLLECTION);
    const q = query(requestsCollectionRef, orderBy('farmaishOn', 'desc'));
    const querySnapshot = await getDocs(q);

    const requests: SongRequest[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Ensure farmaishOn exists for robust processing, though query should ensure it
      if (!data.farmaishOn) {
        console.warn(`Document ${doc.id} is missing 'farmaishOn' field and will be skipped.`);
        return;
      }
      requests.push({
        id: doc.id,
        fullName: data.fullName || '',
        mobile: data.mobile || '',
        address: data.address || '',
        farmaish: data.farmaish || '',
        farmaishOn: data.farmaishOn, // Should be a Timestamp from Firestore
        time: data.time || 'Will Be Update', // Fallback for time
      } as SongRequest); 
    });
    
    console.log('Fetched Requests from Service:', requests); 
    return requests;
  } catch (error: any) {
    console.error('Error fetching song requests from Firestore:', error);
    throw new Error('Could not retrieve song requests. Please try again later.');
  }
}

