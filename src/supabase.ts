import { createClient } from '@supabase/supabase-js';
import { Booking, ClientProfile, FreeScheduleBlock, CompletedSession } from './types';
import { INITIAL_BOOKINGS, INITIAL_CLIENTS, INITIAL_SCHEDULE_BLOCKS } from './data';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Signs up a new client user in Supabase Auth without affecting the current session.
 */
export async function signUpNewClient(email: string, password: string) {
  // Instantiate temporary client with persistSession: false to avoid signing out the trainer
  const tempSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  const { data, error } = await tempSupabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'client'
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Seeds the database if any table is empty
 */
export async function seedDatabaseIfEmpty() {
  try {
    // Check if database has already been seeded before
    const { data: metaData, error: metaError } = await supabase
      .from('metadata')
      .select('value')
      .eq('key', 'seeded')
      .maybeSingle();

    if (!metaError && metaData && (metaData as any).value === 'true') {
      // Already seeded before, do not re-seed even if tables are cleared
      return;
    }

    // 1. Check & seed bookings
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('id')
      .limit(1);
    
    if (!bookingsError && (!bookingsData || bookingsData.length === 0)) {
      console.log('Seeding initial bookings into Supabase...');
      await supabase.from('bookings').insert(INITIAL_BOOKINGS);
    }

    // 2. Check & seed clients
    const { data: clientsData, error: clientsError } = await supabase
      .from('clients')
      .select('id')
      .limit(1);

    if (!clientsError && (!clientsData || clientsData.length === 0)) {
      console.log('Seeding initial clients into Supabase...');
      await supabase.from('clients').insert(INITIAL_CLIENTS);
    }

    // 3. Check & seed scheduleBlocks
    const { data: scheduleData, error: scheduleError } = await supabase
      .from('scheduleBlocks')
      .select('id')
      .limit(1);

    if (!scheduleError && (!scheduleData || scheduleData.length === 0)) {
      console.log('Seeding initial schedule blocks into Supabase...');
      await supabase.from('scheduleBlocks').insert(INITIAL_SCHEDULE_BLOCKS);
    }

    // Write the seeded flag so we never auto-populate again
    await supabase.from('metadata').insert({ key: 'seeded', value: 'true' });
  } catch (error) {
    console.error('Error seeding Supabase database:', error);
  }
}

// ==========================================
// 1. Booking Operations
// ==========================================

export async function addBookingInFirestore(booking: Booking) {
  const { error } = await supabase.from('bookings').insert(booking);
  if (error) throw new Error(error.message);
}

export async function updateBookingStatusInFirestore(id: string, status: Booking['status']) {
  const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function updateBookingNotesInFirestore(id: string, notes: string) {
  const { error } = await supabase.from('bookings').update({ trainerNotes: notes }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteBookingFromFirestore(id: string) {
  const { error } = await supabase.from('bookings').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ==========================================
// 2. Client Profile Operations
// ==========================================

export async function addClientInFirestore(client: ClientProfile) {
  const { error } = await supabase.from('clients').insert(client);
  if (error) throw new Error(error.message);
}

export async function updateClientSessionsInFirestore(id: string, paid: number, done: number) {
  const paidVal = Math.max(0, paid);
  const doneVal = Math.max(0, done);
  const { error } = await supabase
    .from('clients')
    .update({
      sessionsPaid: paidVal,
      sessionsDone: doneVal,
      sessionsRemaining: Math.max(0, paidVal - doneVal)
    })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function updateClientNotesInFirestore(id: string, notes: string) {
  const { error } = await supabase.from('clients').update({ notes }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteClientFromFirestore(id: string) {
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ==========================================
// 3. Schedule Block Operations
// ==========================================

export async function addScheduleBlockInFirestore(block: FreeScheduleBlock) {
  const { error } = await supabase.from('scheduleBlocks').insert(block);
  if (error) throw new Error(error.message);
}

export async function deleteScheduleBlockFromFirestore(id: string) {
  const { error } = await supabase.from('scheduleBlocks').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function bookScheduleBlockInFirestore(blockId: string, clientId: string | null, clientName: string | null) {
  const updateData = clientId 
    ? { isBooked: true, bookedByClientId: clientId, bookedByClientName: clientName }
    : { isBooked: false, bookedByClientId: null, bookedByClientName: null };
  const { error } = await supabase.from('scheduleBlocks').update(updateData).eq('id', blockId);
  if (error) throw new Error(error.message);
}

// ==========================================
// Real-Time Listener Setup Functions
// ==========================================

export function listenToBookings(onUpdate: (bookings: Booking[]) => void) {
  const fetchAndEmit = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*');
    if (!error && data) {
      const sorted = (data as Booking[]).sort((a, b) => b.id.localeCompare(a.id));
      onUpdate(sorted);
    }
  };

  fetchAndEmit();

  const channel = supabase
    .channel('public:bookings')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookings' },
      () => {
        fetchAndEmit();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function listenToClients(onUpdate: (clients: ClientProfile[]) => void) {
  const fetchAndEmit = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    if (!error && data) {
      const sorted = (data as ClientProfile[]).sort((a, b) => a.name.localeCompare(b.name));
      onUpdate(sorted);
    }
  };

  fetchAndEmit();

  const channel = supabase
    .channel('public:clients')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'clients' },
      () => {
        fetchAndEmit();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function listenToScheduleBlocks(onUpdate: (blocks: FreeScheduleBlock[]) => void) {
  const fetchAndEmit = async () => {
    const { data, error } = await supabase
      .from('scheduleBlocks')
      .select('*');
    if (!error && data) {
      const sorted = (data as FreeScheduleBlock[]).sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });
      onUpdate(sorted);
    }
  };

  fetchAndEmit();

  const channel = supabase
    .channel('public:scheduleBlocks')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'scheduleBlocks' },
      () => {
        fetchAndEmit();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ==========================================
// 4. Completed Session Operations
// ==========================================

export async function addCompletedSession(session: CompletedSession) {
  const { error } = await supabase.from('completed_sessions').insert(session);
  if (error) throw new Error(error.message);
}

export async function updateCompletedSessionNotes(id: string, privateNotes: string, sharedNotes: string) {
  const { error } = await supabase
    .from('completed_sessions')
    .update({ privateNotes, sharedNotes })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteCompletedSession(id: string) {
  const { error } = await supabase.from('completed_sessions').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export function listenToCompletedSessions(onUpdate: (sessions: CompletedSession[]) => void) {
  const fetchAndEmit = async () => {
    const { data, error } = await supabase
      .from('completed_sessions')
      .select('*');
    if (!error && data) {
      // Sort by date descending (newest completed first)
      const sorted = (data as CompletedSession[]).sort((a, b) => b.date.localeCompare(a.date));
      onUpdate(sorted);
    }
  };

  fetchAndEmit();

  const channel = supabase
    .channel('public:completed_sessions')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'completed_sessions' },
      () => {
        fetchAndEmit();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
