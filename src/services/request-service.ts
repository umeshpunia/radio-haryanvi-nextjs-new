
'use server';

import { dbFirestore } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, Timestamp, getDocs, query, orderBy } from 'firebase/firestore';

// Interface for data coming from the form to this service
export interface NewRequestData {
  fullName: string;
  mobile: string;
  address: string;
  farmaish: string;
  farmaishOn?: Date | null; 
  time?: string; // This will come from the form's "preferredTime" input
}

// Interface representing the data structure as it is stored in Firestore
export interface FirestoreRequestData {
  fullName: string;
  mobile: string;
  address: string;
  farmaish: string;
  farmaishOn?: Timestamp | null;
  time: string; // Default to "Will Be Update" if not provided
  submittedAt: Timestamp; // System field
  status: 'pending' | 'approved' | 'played' | 'rejected'; // System field
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
      farmaishOn: data.farmaishOn ? Timestamp.fromDate(data.farmaishOn) : null,
      time: (data.time && data.time.trim() !== "") ? data.time : "Will Be Update",
      submittedAt: serverTimestamp() as Timestamp, // Cast for immediate use, Firestore handles server value
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
    // Ensure submittedAt field exists and is a timestamp for ordering
    const q = query(requestsCollectionRef, orderBy('submittedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const requests: SongRequest[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Basic validation to ensure essential fields for ordering and status exist
      if (!data.submittedAt) {
        console.warn(`Document ${doc.id} is missing 'submittedAt' field and will be skipped.`);
        return;
      }
      requests.push({
        id: doc.id,
        fullName: data.fullName || '',
        mobile: data.mobile || '',
        address: data.address || '',
        farmaish: data.farmaish || '',
        farmaishOn: data.farmaishOn instanceof Timestamp ? data.farmaishOn : null,
        time: data.time || 'N/A', // Fallback for time
        submittedAt: data.submittedAt, // Already validated
        status: data.status || 'pending', // Fallback for status
      } as SongRequest); 
    });
    
    console.log('Fetched Requests from Service:', requests); 
    return requests;
  } catch (error: any) {
    console.error('Error fetching song requests from Firestore:', error);
    throw new Error('Could not retrieve song requests. Please try again later.');
  }
}
