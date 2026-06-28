import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { Booking, ClientProfile, FreeScheduleBlock } from './types';
import { INITIAL_BOOKINGS, INITIAL_CLIENTS, INITIAL_SCHEDULE_BLOCKS } from './data';

const firebaseConfig = {
  apiKey: "AIzaSyCV_wBFZi6X98ZLXOQWpKOhDk5SqfZDxnc",
  authDomain: "gen-lang-client-0044538244.firebaseapp.com",
  projectId: "gen-lang-client-0044538244",
  storageBucket: "gen-lang-client-0044538244.firebasestorage.app",
  messagingSenderId: "280010873273",
  appId: "1:280010873273:web:d76489f94b13a7d043fe68"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with the custom database ID from configuration
export const db = getFirestore(app, "ai-studio-4bc324a2-fea0-40fe-b1ef-6cf255e265ee");

// Collection names
const BOOKINGS_COLL = 'bookings';
const CLIENTS_COLL = 'clients';
const SCHEDULE_COLL = 'scheduleBlocks';

/**
 * Seeds the database if any collection is empty
 */
export async function seedDatabaseIfEmpty() {
  try {
    const bookingsSnap = await getDocs(collection(db, BOOKINGS_COLL));
    if (bookingsSnap.empty) {
      console.log('Seeding initial bookings...');
      for (const b of INITIAL_BOOKINGS) {
        await setDoc(doc(db, BOOKINGS_COLL, b.id), b);
      }
    }

    const clientsSnap = await getDocs(collection(db, CLIENTS_COLL));
    if (clientsSnap.empty) {
      console.log('Seeding initial clients...');
      for (const c of INITIAL_CLIENTS) {
        await setDoc(doc(db, CLIENTS_COLL, c.id), c);
      }
    }

    const scheduleSnap = await getDocs(collection(db, SCHEDULE_COLL));
    if (scheduleSnap.empty) {
      console.log('Seeding initial schedule blocks...');
      for (const s of INITIAL_SCHEDULE_BLOCKS) {
        await setDoc(doc(db, SCHEDULE_COLL, s.id), s);
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// ==========================================
// 1. Booking Operations
// ==========================================

export async function addBookingInFirestore(booking: Booking) {
  await setDoc(doc(db, BOOKINGS_COLL, booking.id), booking);
}

export async function updateBookingStatusInFirestore(id: string, status: Booking['status']) {
  const ref = doc(db, BOOKINGS_COLL, id);
  await updateDoc(ref, { status });
}

export async function updateBookingNotesInFirestore(id: string, notes: string) {
  const ref = doc(db, BOOKINGS_COLL, id);
  await updateDoc(ref, { trainerNotes: notes });
}

export async function deleteBookingFromFirestore(id: string) {
  const ref = doc(db, BOOKINGS_COLL, id);
  await deleteDoc(ref);
}

// ==========================================
// 2. Client Profile Operations
// ==========================================

export async function addClientInFirestore(client: ClientProfile) {
  await setDoc(doc(db, CLIENTS_COLL, client.id), client);
}

export async function updateClientSessionsInFirestore(id: string, paid: number, done: number) {
  const ref = doc(db, CLIENTS_COLL, id);
  await updateDoc(ref, {
    sessionsPaid: Math.max(0, paid),
    sessionsDone: Math.max(0, done),
    sessionsRemaining: Math.max(0, paid - done)
  });
}

export async function updateClientNotesInFirestore(id: string, notes: string) {
  const ref = doc(db, CLIENTS_COLL, id);
  await updateDoc(ref, { notes });
}

export async function deleteClientFromFirestore(id: string) {
  const ref = doc(db, CLIENTS_COLL, id);
  await deleteDoc(ref);
}

// ==========================================
// 3. Schedule Block Operations
// ==========================================

export async function addScheduleBlockInFirestore(block: FreeScheduleBlock) {
  await setDoc(doc(db, SCHEDULE_COLL, block.id), block);
}

export async function deleteScheduleBlockFromFirestore(id: string) {
  const ref = doc(db, SCHEDULE_COLL, id);
  await deleteDoc(ref);
}

export async function bookScheduleBlockInFirestore(blockId: string, clientId: string | null, clientName: string | null) {
  const ref = doc(db, SCHEDULE_COLL, blockId);
  if (clientId) {
    await updateDoc(ref, {
      isBooked: true,
      bookedByClientId: clientId,
      bookedByClientName: clientName
    });
  } else {
    await updateDoc(ref, {
      isBooked: false,
      bookedByClientId: null,
      bookedByClientName: null
    });
  }
}

// ==========================================
// Real-Time Listener Setup Functions
// ==========================================

export function listenToBookings(onUpdate: (bookings: Booking[]) => void) {
  return onSnapshot(collection(db, BOOKINGS_COLL), (snapshot) => {
    const bookings: Booking[] = [];
    snapshot.forEach((doc) => {
      bookings.push(doc.data() as Booking);
    });
    // Sort by createdTime or id descending so latest shows up first
    bookings.sort((a, b) => b.id.localeCompare(a.id));
    onUpdate(bookings);
  });
}

export function listenToClients(onUpdate: (clients: ClientProfile[]) => void) {
  return onSnapshot(collection(db, CLIENTS_COLL), (snapshot) => {
    const clients: ClientProfile[] = [];
    snapshot.forEach((doc) => {
      clients.push(doc.data() as ClientProfile);
    });
    clients.sort((a, b) => a.name.localeCompare(b.name));
    onUpdate(clients);
  });
}

export function listenToScheduleBlocks(onUpdate: (blocks: FreeScheduleBlock[]) => void) {
  return onSnapshot(collection(db, SCHEDULE_COLL), (snapshot) => {
    const blocks: FreeScheduleBlock[] = [];
    snapshot.forEach((doc) => {
      blocks.push(doc.data() as FreeScheduleBlock);
    });
    // Sort by date then startTime
    blocks.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
    onUpdate(blocks);
  });
}
