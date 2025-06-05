
'use server';

import { dbFirestore } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp, getDocs, query, orderBy } from 'firebase/firestore';

// Interface for data coming from the form
export interface NewRequestData {
  fullName: string;
  mobile: string;
  address: string;
  farmaish: string;
  farmaishOn?: Date | null; // Date from picker
  preferredTime?: string; // From form's "Preferred Time / Program" input
}

// Interface representing the data structure as it is stored in Firestore
export interface FirestoreRequestData {
  fullName: string;
  mobile: string;
  address: string;
  farmaish: string;
  farmaishOn?: Timestamp | null; // Date from picker, stored as Timestamp
  preferredTime?: string;       // User's specific preferred time/program from form
  time: string;                 // For existing data; new data gets "Will Be Update"
  submittedAt: Timestamp;
  status: 'pending' | 'approved' | 'played' | 'rejected';
}

// Interface representing a request object when fetched and used in the client, including its ID
export interface SongRequest extends FirestoreRequestData {
  id: string;
}

const REQUESTS_COLLECTION = 'requests';

export async function addSongRequest(data: NewRequestData): Promise<string> {
  try {
    const requestsCollectionRef = collection(dbFirestore, REQUESTS_COLLECTION);
    
    const firestorePayload: Omit<FirestoreRequestData, 'submittedAt' | 'status'> & { submittedAt: any; status: string } = {
      fullName: data.fullName,
      mobile: data.mobile,
      address: data.address,
      farmaish: data.farmaish,
      farmaishOn: data.farmaishOn ? Timestamp.fromDate(data.farmaishOn) : null,
      preferredTime: data.preferredTime || '', // Save preferredTime from form
      time: "Will Be Update", // Default value for the 'time' field for new requests
      submittedAt: serverTimestamp(),
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
    const q = query(requestsCollectionRef, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const requests: SongRequest[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FirestoreRequestData; // Cast to FirestoreRequestData
      requests.push({
        id: doc.id,
        ...data,
        // This ensures preferredTime from form is prioritized if present,
        // otherwise falls back to the 'time' field from older docs,
        // or an empty string if neither exists.
        // For new docs, data.preferredTime will be what user typed or '',
        // and data.time will be "Will Be Update".
        // The display card logic will need to decide how to show these.
      } as SongRequest); // Assert as SongRequest after spreading
    });
    
    console.log('Successfully fetched requests from Firestore:', requests.length);
    return requests;
  } catch (error: any) {
    console.error('Error fetching song requests from Firestore:', error);
    throw new Error('Could not retrieve song requests. Please try again later.');
  }
}
