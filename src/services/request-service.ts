
'use server';

import { dbFirestore } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp, getDocs, query, orderBy } from 'firebase/firestore';

export interface NewRequestData {
  fullName: string;
  mobile: string;
  address: string;
  farmaish: string;
  farmaishOn?: Date | null; // Date from picker
  preferredTime?: string;
}

// This interface represents the data structure as it is stored in Firestore
// Note: `submittedAt` will be a Firestore Timestamp, `farmaishOn` can be Timestamp or null
export interface FirestoreRequestData {
  fullName: string;
  mobile: string;
  address: string;
  farmaish: string;
  farmaishOn?: Timestamp | null;
  preferredTime?: string;
  time?: string; // Allow for old field name
  submittedAt: Timestamp;
  status: 'pending' | 'approved' | 'played' | 'rejected';
}

// This interface represents a request object when fetched and used in the client, including its ID
export interface SongRequest extends FirestoreRequestData {
  id: string;
}

const REQUESTS_COLLECTION = 'requests';

export async function addSongRequest(data: NewRequestData): Promise<string> {
  try {
    const requestsCollectionRef = collection(dbFirestore, REQUESTS_COLLECTION);
    
    // Prepare data for Firestore, converting Date to Timestamp if present
    const firestorePayload: Omit<FirestoreRequestData, 'submittedAt' | 'status' | 'time'> & { submittedAt: any; status: string } = {
      fullName: data.fullName,
      mobile: data.mobile,
      address: data.address,
      farmaish: data.farmaish,
      preferredTime: data.preferredTime || '',
      farmaishOn: data.farmaishOn ? Timestamp.fromDate(data.farmaishOn) : null,
      submittedAt: serverTimestamp(), // Let Firestore generate the timestamp
      status: 'pending',
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
    // This query requires 'submittedAt' to exist and be a Timestamp on the documents.
    // If 'submittedAt' is missing or of a different type, documents might not be returned.
    const q = query(requestsCollectionRef, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const requests: SongRequest[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreRequestData; // Cast to include 'time'
      requests.push({
        id: doc.id,
        ...data,
        // Handle potential 'time' field from older documents for 'preferredTime'
        preferredTime: data.preferredTime || data.time || '',
      } as SongRequest);
    });
    
    console.log('Successfully fetched requests from Firestore:', requests.length); // Added log for success
    return requests;
  } catch (error: any) {
    console.error('Error fetching song requests from Firestore:', error);
    // It's important to check Firestore console for specific query errors if any.
    throw new Error('Could not retrieve song requests. Please try again later.');
  }
}

