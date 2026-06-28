import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Calendar, Clock, Phone, Mail, FileText, CheckCircle, 
  XCircle, Trash2, Edit3, Settings, User, LogOut, Key, Plus, 
  UserPlus, Info, CheckCircle2, ShieldCheck, Award
} from 'lucide-react';
import { Booking, ClientProfile, FreeScheduleBlock } from '../types';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

interface PortalProps {
  bookings: Booking[];
  onUpdateBookingStatus: (id: string, status: Booking['status']) => void;
  onUpdateBookingNotes: (id: string, notes: string) => void;
  onDeleteBooking: (id: string) => void;
  
  clients: ClientProfile[];
  onAddClient: (newClient: ClientProfile) => void;
  onUpdateClientSessions: (id: string, paid: number, done: number) => void;
  onUpdateClientNotes: (id: string, notes: string) => void;
  onDeleteClient: (id: string) => void;
  
  scheduleBlocks: FreeScheduleBlock[];
  onAddScheduleBlock: (newBlock: FreeScheduleBlock) => void;
  onDeleteScheduleBlock: (id: string) => void;
  onBookScheduleBlock: (blockId: string, clientId: string | null, clientName: string | null) => void;
  
  onClose: () => void;
}

export default function Portal({
  bookings,
  onUpdateBookingStatus,
  onUpdateBookingNotes,
  onDeleteBooking,
  
  clients,
  onAddClient,
  onUpdateClientSessions,
  onUpdateClientNotes,
  onDeleteClient,
  
  scheduleBlocks,
  onAddScheduleBlock,
  onDeleteScheduleBlock,
  onBookScheduleBlock,
  
  onClose
}: PortalProps) {
  // Session authentication states
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<'none' | 'admin' | 'client'>('none');
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login Form states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active trainer navigation tab: 'leads' | 'clients' | 'schedule'
  const [trainerTab, setTrainerTab] = useState<'leads' | 'clients' | 'schedule'>('leads');

  // Lead status and demographic filters (from previous Dashboard)
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [demoFilter, setDemoFilter] = useState<string>('all');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(bookings[0]?.id || null);
  const [bookingNotesDraft, setBookingNotesDraft] = useState('');
  const [isEditingBookingNotes, setIsEditingBookingNotes] = useState(false);

  // Client Manager states
  const [selectedClientId, setSelectedClientId] = useState<string | null>(clients[0]?.id || null);
  const [clientNotesDraft, setClientNotesDraft] = useState('');
  const [isEditingClientNotes, setIsEditingClientNotes] = useState(false);
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  // New Client Form
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientUsername, setNewClientUsername] = useState('');
  const [newClientPassword, setNewClientPassword] = useState('password123');
  const [newClientPaid, setNewClientPaid] = useState<number>(12);
  const [clientFormError, setClientFormError] = useState('');

  // Schedule Creator States
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockStart, setNewBlockStart] = useState('09:00 AM');
  const [newBlockEnd, setNewBlockEnd] = useState('10:30 AM');
  const [scheduleError, setScheduleError] = useState('');

  // Effect to handle Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // Determine role based on if their email matches a client's email
        const matchingClient = clients.find(c => c.email.toLowerCase() === user.email?.toLowerCase());
        if (matchingClient) {
          setUserRole('client');
          setCurrentClientId(matchingClient.id);
        } else {
          // If no matching client profile, treat as admin
          // Assuming the trainer creates an account for themselves not tied to a client profile
          setUserRole('admin');
          setCurrentClientId(null);
        }
      } else {
        setUserRole('none');
        setCurrentClientId(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [clients]);

  const activeInquiry = bookings.find(b => b.id === selectedInquiryId) || bookings[0];
  const activeClient = clients.find(c => c.id === selectedClientId) || clients[0];
  const loggedInClientProfile = clients.find(c => c.id === currentClientId);

  // Stats calculations for trainer
  const totalLeads = bookings.length;
  const pendingLeads = bookings.filter(b => b.status === 'pending').length;
  const activeRegisteredClients = clients.length;
  const totalFreeSlots = scheduleBlocks.filter(b => !b.isBooked).length;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!emailInput.trim() || !passwordInput.trim()) {
      setLoginError('Please fill out all credentials.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
    } catch (err: any) {
      setLoginError('Invalid email or password. Please try again.');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setEmailInput('');
      setPasswordInput('');
    } catch (err) {
      console.error('Logout error', err);
    }
  };

  // Client registration submit
  const handleCreateClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientFormError('');

    if (!newClientName || !newClientEmail || !newClientPhone) {
      setClientFormError('Please complete all client information.');
      return;
    }

    if (clients.some(c => c.email.toLowerCase() === newClientEmail.toLowerCase())) {
      setClientFormError('Email already exists. Please choose another.');
      return;
    }

    const newProfile: ClientProfile = {
      id: `client-${Date.now()}`,
      name: newClientName,
      email: newClientEmail,
      phone: newClientPhone,
      username: newClientEmail.split('@')[0], // Generate simple username from email
      sessionsPaid: Number(newClientPaid),
      sessionsDone: 0,
      sessionsRemaining: Number(newClientPaid),
      notes: 'New account created by trainer. (Make sure to create corresponding Firebase Auth user)'
    };

    onAddClient(newProfile);
    setSelectedClientId(newProfile.id);
    setIsCreatingClient(false);

    // Clear client form
    setNewClientName('');
    setNewClientEmail('');
    setNewClientPhone('');
    setNewClientUsername('');
    setNewClientPassword('password123');
    setNewClientPaid(12);
  };

  // Add Free Schedule block
  const handleCreateScheduleBlock = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleError('');

    if (!newBlockDate || !newBlockStart || !newBlockEnd) {
      setScheduleError('Please enter Date, Start Time, and End Time.');
      return;
    }

    const newBlock: FreeScheduleBlock = {
      id: `block-${Date.now()}`,
      date: newBlockDate,
      startTime: newBlockStart,
      endTime: newBlockEnd,
      isBooked: false
    };

    onAddScheduleBlock(newBlock);
    setNewBlockDate('');
  };

  // Client books a slot
  const handleClientBookSlot = (block: FreeScheduleBlock) => {
    if (!loggedInClientProfile) return;
    
    if (loggedInClientProfile.sessionsRemaining <= 0) {
      alert('You have 0 sessions remaining. Please contact Hanoch Lib to purchase more sessions.');
      return;
    }

    const confirmBooking = window.confirm(`Confirm your booking for this session?\nDate: ${block.date}\nTime Slot: ${block.startTime} - ${get45MinEndTime(block.startTime)} (45-Min Call)`);
    if (!confirmBooking) return;

    // Book block
    onBookScheduleBlock(block.id, loggedInClientProfile.id, loggedInClientProfile.name);
    // Deduct remaining sessions
    onUpdateClientSessions(
      loggedInClientProfile.id, 
      loggedInClientProfile.sessionsPaid, 
      loggedInClientProfile.sessionsDone + 1
    );
  };

  // Helper to calculate client 45-minute chunk end time from start time
  const get45MinEndTime = (startTimeStr: string) => {
    try {
      const match = startTimeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return '45 mins later';
      let hours = parseInt(match[1]);
      let minutes = parseInt(match[2]);
      const ampm = match[3].toUpperCase();

      minutes += 45;
      if (minutes >= 60) {
        hours += 1;
        minutes -= 60;
      }
      
      let endHours = hours;
      let endAmpm = ampm;
      if (hours > 12) {
        endHours = hours - 12;
      } else if (hours === 12) {
        endAmpm = ampm === 'AM' ? 'PM' : 'AM';
      }

      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${endHours}:${formattedMinutes} ${endAmpm}`;
    } catch {
      return '45 mins later';
    }
  };

  // Filtered bookings list for inquiry queue
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesDemo = demoFilter === 'all' || b.ageGroup === demoFilter;
    return matchesStatus && matchesDemo;
  });

  return (
    <div className="bg-[#FDFCFB] border-y border-[#E5E2DE] py-12 text-left font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Portal Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 px-2.5 bg-[#C0392B] text-[#FDFCFB] font-mono text-[9px] uppercase font-bold tracking-widest leading-none">
                LIB FITNESS INTERACTIVE PORTAL
              </span>
              <Settings className="w-3.5 h-3.5 text-[#7F8C8D] rotate-45 animate-spin-slow" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#2C3E50] tracking-tight mt-1">
              {userRole === 'admin' && 'Trainer Control panel'}
              {userRole === 'client' && `Welcome Back, ${loggedInClientProfile?.name}`}
              {userRole === 'none' && 'Client & Trainer Portal'}
            </h2>
            <p className="text-[#5D6D7E] text-xs mt-1 leading-normal">
              {userRole === 'admin' && 'Manage registered active clients, customize schedule blocks, and organize phone consults.'}
              {userRole === 'client' && 'Check your remaining sessions, view progressive workout logs, and reserve active consultation slots.'}
              {userRole === 'none' && 'Access your private personal training account to schedule free hours and track metrics.'}
            </p>
          </div>

          <div className="flex gap-2">
            {userRole !== 'none' && (
              <button 
                onClick={handleLogout}
                className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-sans font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm transition flex items-center gap-1.5 border border-stone-200 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="bg-[#2C3E50] hover:bg-[#1A252F] text-white text-[10px] font-sans font-bold uppercase tracking-widest px-5 py-2.5 rounded-sm cursor-pointer shadow-sm border border-[#1A1A1A] transition"
            >
              Exit Portal
            </button>
          </div>
        </div>

        {/* =========================================================================
            NO ROLE LOGGED IN: DISPLAY POLISHED LOGIN CONTAINER
            ========================================================================= */}
        {userRole === 'none' && (
          <div className="max-w-md mx-auto bg-white border border-[#E5E2DE] p-8 sm:p-10 rounded-sm shadow-sm my-8">
            <div className="text-center space-y-3 mb-6">
              <div className="w-12 h-12 bg-[#F5F5F0] border border-[#E5E2DE] rounded-full flex items-center justify-center text-[#2C3E50] mx-auto">
                <Key className="w-5 h-5 text-[#2C3E50]" />
              </div>
              <h3 className="text-xl font-serif text-[#2C3E50]">Sign In to Your Account</h3>
              <p className="text-stone-400 text-xs leading-relaxed">
                Enter the credentials provided by Hanoch Lib to access your client card and schedule calendar.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="bg-red-50 border border-red-200 text-[#C0392B] p-3 text-xs rounded-sm flex items-start gap-2">
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#7F8C8D] uppercase tracking-wider">Email</label>
                <input 
                  type="email" 
                  placeholder="e.g. client@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#E5E2DE] px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-[#2C3E50] focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[#7F8C8D] uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#FDFCFB] border border-[#E5E2DE] px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-[#2C3E50] focus:bg-white transition"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#C0392B] hover:bg-[#A93226] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-sm transition cursor-pointer"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#E5E2DE] space-y-3">
              <p className="text-[10px] text-stone-400 italic text-center mt-2 leading-relaxed">
                Log in with the credentials created in the Firebase Authentication console. 
                If your email matches an existing client profile, you will log in as that client.
                Otherwise, you will log in as an administrator/trainer.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            ROLE: CLIENT DASHBOARD
            ========================================================================= */}
        {userRole === 'client' && loggedInClientProfile && (
          <div className="space-y-8">
            
            {/* 1. Client Session Bank Progress Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Sessions Remaining Card */}
              <div className="bg-white border-2 border-[#D4AF37] p-6 sm:p-8 rounded-sm shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-sm bg-amber-50 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
                    <Award className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h4 className="font-serif italic text-lg text-[#2C3E50]">Remaining Sessions</h4>
                  <p className="text-xs text-[#7F8C8D]">Sessions available to book right now.</p>
                </div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-5xl font-serif font-black text-[#2C3E50]">{loggedInClientProfile.sessionsRemaining}</span>
                  <span className="text-stone-400 text-sm">/ {loggedInClientProfile.sessionsPaid} total paid</span>
                </div>
                <div className="mt-4 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#D4AF37] h-full" 
                    style={{ width: `${(loggedInClientProfile.sessionsRemaining / loggedInClientProfile.sessionsPaid) * 100}%` }}
                  />
                </div>
              </div>

              {/* Sessions Done Card */}
              <div className="bg-white border border-[#E5E2DE] p-6 sm:p-8 rounded-sm shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-sm bg-[#F5F5F0] border border-[#E5E2DE] flex items-center justify-center text-emerald-800">
                    <CheckCircle className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h4 className="font-serif italic text-lg text-[#2C3E50]">Completed Sessions</h4>
                  <p className="text-xs text-[#7F8C8D]">Workouts completed or reserved so far.</p>
                </div>
                <div className="mt-6">
                  <span className="text-5xl font-serif font-black text-[#2C3E50]">{loggedInClientProfile.sessionsDone}</span>
                  <span className="text-stone-400 text-sm ml-2">completed</span>
                </div>
              </div>

              {/* Private Trainer Progressive Logs Card */}
              <div className="bg-[#F5F5F0]/70 border border-[#E5E2DE] p-6 sm:p-8 rounded-sm shadow-xs flex flex-col justify-between md:col-span-1">
                <div className="space-y-3">
                  <h4 className="font-sans text-[10px] text-[#7F8C8D] uppercase font-bold tracking-widest flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C0392B]" />
                    <span>Personal Posture & Progress Logs</span>
                  </h4>
                  <div className="text-xs text-[#5D6D7E] leading-relaxed whitespace-pre-wrap max-h-[140px] overflow-y-auto italic">
                    {loggedInClientProfile.notes ? `"${loggedInClientProfile.notes}"` : 'No logs written yet. Hanoch will update your balance and movement notes here as your sessions progress!'}
                  </div>
                </div>
                <div className="text-[9px] text-[#7F8C8D] uppercase tracking-wider font-mono font-bold mt-4">
                  Only visible to you and Hanoch
                </div>
              </div>
            </div>

            {/* 2. Available Scheduling Hours Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT: Book Free Slot */}
              <div className="lg:col-span-7 bg-white border border-[#E5E2DE] p-6 sm:p-8 rounded-sm shadow-xs">
                <div className="border-b border-[#E5E2DE] pb-4 mb-6">
                  <h3 className="font-serif text-xl text-[#2C3E50] italic">Reserve Your Time Slot</h3>
                  <p className="text-stone-400 text-xs mt-1">
                    Select one of Hanoch's free schedule blocks below. Your session lasts <strong>45 minutes</strong> (commencing at the block's start time), while Hanoch blocks off the rest of the time window for travel and preparation!
                  </p>
                </div>

                <div className="space-y-4">
                  {scheduleBlocks.filter(b => !b.isBooked).length === 0 ? (
                    <div className="p-8 text-center bg-[#FDFCFB] border border-dashed border-[#E5E2DE] rounded-sm text-stone-400 text-xs">
                      No free scheduling times available at the moment. Please reach out to Hanoch or check back later!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {scheduleBlocks.filter(b => !b.isBooked).map((block) => (
                        <div 
                          key={block.id} 
                          className="bg-[#FDFCFB] border border-[#E5E2DE] p-4 rounded-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-xs transition"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#C0392B]" />
                              <span className="text-xs font-bold text-[#2C3E50]">{block.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-stone-500">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Your Session Slot: <strong>{block.startTime} - {get45MinEndTime(block.startTime)}</strong></span>
                              <span className="text-[10px] text-stone-400 italic font-normal ml-1">({block.startTime} - {block.endTime} reserved for Hanoch)</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleClientBookSlot(block)}
                            className="bg-[#C0392B] hover:bg-[#A93226] text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm transition cursor-pointer"
                          >
                            Reserve Slot
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: My Scheduled Appointments */}
              <div className="lg:col-span-5 bg-white border border-[#E5E2DE] p-6 sm:p-8 rounded-sm shadow-xs flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="border-b border-[#E5E2DE] pb-4 mb-4">
                    <h3 className="font-serif text-lg text-[#2C3E50] italic">My Scheduled Sessions</h3>
                    <p className="text-stone-400 text-[10px] mt-1">Confirmed appointments and reserved slots.</p>
                  </div>

                  <div className="space-y-3">
                    {scheduleBlocks.filter(b => b.isBooked && b.bookedByClientId === loggedInClientProfile.id).length === 0 ? (
                      <div className="p-6 text-center bg-[#FDFCFB] text-stone-400 text-xs italic">
                        No upcoming sessions reserved yet. Book one of the available slots on the left!
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[250px] overflow-y-auto">
                        {scheduleBlocks.filter(b => b.isBooked && b.bookedByClientId === loggedInClientProfile.id).map((block) => (
                          <div key={block.id} className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-sm text-xs">
                            <div className="flex items-center justify-between font-bold text-emerald-800 mb-1">
                              <span>45-Min Call Session</span>
                              <span className="text-[9px] uppercase tracking-widest bg-emerald-100 px-1.5 py-0.5 rounded-sm">Confirmed</span>
                            </div>
                            <div className="text-stone-600 space-y-0.5">
                              <p>Date: <strong>{block.date}</strong></p>
                              <p>Time: <strong>{block.startTime} - {get45MinEndTime(block.startTime)}</strong></p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E2DE] text-[10px] text-stone-400 leading-relaxed font-serif italic text-center">
                  Hanoch Lib Training • (516) 555-0199 • Cedarhurst, NY
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            ROLE: TRAINER/ADMIN CONTROL PANEL
            ========================================================================= */}
        {userRole === 'admin' && (
          <div className="space-y-8">
            
            {/* Admin Stats & Tab Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#E5E2DE] p-4 rounded-sm shadow-xs">
              
              <div className="flex gap-1.5">
                {[
                  { id: 'leads', label: `Inquiries Queue (${totalLeads})` },
                  { id: 'clients', label: `Client Accounts (${activeRegisteredClients})` },
                  { id: 'schedule', label: `Schedule & Free Slots` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTrainerTab(tab.id as any)}
                    className={`text-[10px] font-sans font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm border cursor-pointer transition-all ${
                      trainerTab === tab.id
                        ? 'bg-[#C0392B] border-[#C0392B] text-white shadow-xs'
                        : 'bg-[#F5F5F0] border-[#E5E2DE] text-[#2C3E50] hover:bg-[#E5E2DE]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="text-xs text-stone-500 font-mono flex gap-4">
                <span>Leads Pending: <strong className="text-[#C0392B]">{pendingLeads}</strong></span>
                <span>•</span>
                <span>Unbooked Slots: <strong className="text-[#D4AF37]">{totalFreeSlots}</strong></span>
              </div>
            </div>

            {/* TAB 1: INQUIRIES QUEUE (Original Lead Dashboard) */}
            {trainerTab === 'leads' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Queue list */}
                <div className="lg:col-span-5 bg-white border border-[#E5E2DE] rounded-sm overflow-hidden shadow-xs flex flex-col h-[550px]">
                  <div className="p-4 border-b border-[#E5E2DE] bg-[#FDFCFB] space-y-2.5">
                    <h3 className="font-serif font-bold text-xs uppercase tracking-widest text-stone-500">Inbound Leads Queue ({filteredBookings.length})</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-[#E5E2DE] p-1.5 rounded-sm text-xs focus:outline-none"
                      >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <select 
                        value={demoFilter}
                        onChange={(e) => setDemoFilter(e.target.value)}
                        className="bg-white border border-[#E5E2DE] p-1.5 rounded-sm text-xs focus:outline-none"
                      >
                        <option value="all">All Populations</option>
                        <option value="senior">Seniors (65+)</option>
                        <option value="general">General Pop</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-[#F5F5F0]">
                    {filteredBookings.length === 0 ? (
                      <div className="p-10 text-center text-stone-400 text-xs italic">
                        No lead inquiries found.
                      </div>
                    ) : (
                      filteredBookings.map((bk) => (
                        <div
                          key={bk.id}
                          onClick={() => {
                            setSelectedInquiryId(bk.id);
                            setBookingNotesDraft(bk.trainerNotes || '');
                            setIsEditingBookingNotes(false);
                          }}
                          className={`p-4 cursor-pointer transition flex items-start justify-between gap-4 border-b border-[#F5F5F0] ${
                            activeInquiry?.id === bk.id ? 'bg-[#F5F5F0]/85 border-l-2 border-[#C0392B]' : 'hover:bg-[#F5F5F0]'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-serif font-bold text-[#2C3E50] block">{bk.clientName}</span>
                            <span className="text-[9px] text-[#7F8C8D] uppercase tracking-wider font-semibold block">{bk.ageGroup === 'senior' ? 'Active Senior' : 'General Pop'} • {bk.city}</span>
                            <span className="text-[10px] text-stone-400 block mt-1">{bk.sessionDate} • {bk.sessionTimeSlot}</span>
                          </div>
                          <span className={`text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                            bk.status === 'pending' ? 'bg-[#FDFCFB] text-[#C0392B] border border-[#C0392B]/20' :
                            bk.status === 'confirmed' ? 'bg-emerald-50 text-emerald-800 border' :
                            bk.status === 'completed' ? 'bg-blue-50 text-blue-800' : 'bg-stone-100 text-stone-500'
                          }`}>
                            {bk.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Lead details */}
                <div className="lg:col-span-7 bg-white border border-[#E5E2DE] rounded-sm p-6 shadow-xs h-[550px] flex flex-col justify-between overflow-y-auto">
                  {activeInquiry ? (
                    <div className="space-y-5">
                      <div className="flex justify-between items-start border-b border-[#E5E2DE] pb-4">
                        <div>
                          <span className="text-[9px] text-[#7F8C8D] uppercase font-bold tracking-widest block">Inbound Lead File</span>
                          <h3 className="font-serif font-bold text-xl text-[#2C3E50]">{activeInquiry.clientName}</h3>
                          <p className="text-[10px] text-stone-400">Created: {activeInquiry.createdTime}</p>
                        </div>
                        <div className="flex bg-[#F5F5F0] border border-[#E5E2DE] p-1 rounded-sm gap-1">
                          <button
                            onClick={() => onUpdateBookingStatus(activeInquiry.id, 'confirmed')}
                            className="p-1 rounded text-emerald-700 hover:bg-white transition text-xs font-bold"
                            title="Confirm"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => onUpdateBookingStatus(activeInquiry.id, 'completed')}
                            className="p-1 rounded text-blue-700 hover:bg-white transition text-xs font-bold"
                            title="Complete"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => onUpdateBookingStatus(activeInquiry.id, 'cancelled')}
                            className="p-1 rounded text-stone-500 hover:bg-white transition text-xs font-bold"
                            title="Cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-[#FDFCFB] p-3 border border-[#E5E2DE] rounded-sm">
                          <span className="text-[9px] text-[#7F8C8D] font-bold block mb-1">CONTACTS</span>
                          <p>{activeInquiry.clientPhone}</p>
                          <p className="truncate">{activeInquiry.clientEmail}</p>
                        </div>
                        <div className="bg-[#FDFCFB] p-3 border border-[#E5E2DE] rounded-sm">
                          <span className="text-[9px] text-[#7F8C8D] font-bold block mb-1">REQUESTED SLOT</span>
                          <p>{activeInquiry.sessionDate}</p>
                          <p>{activeInquiry.sessionTimeSlot}</p>
                        </div>
                      </div>

                      <div className="bg-[#F5F5F0] p-3 border border-[#E5E2DE] rounded-sm text-xs">
                        <span className="font-bold text-[#2C3E50] block mb-1">Additional Goal Context</span>
                        <p className="text-[#5D6D7E]">{activeInquiry.additionalNotes || 'None specified.'}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-[#7F8C8D] uppercase font-bold tracking-wider">Progressive Physical Logs</span>
                          <button
                            onClick={() => {
                              setIsEditingBookingNotes(!isEditingBookingNotes);
                              setBookingNotesDraft(activeInquiry.trainerNotes || '');
                            }}
                            className="text-[#C0392B] hover:text-[#A93226] text-[10px] font-bold uppercase tracking-wider"
                          >
                            {isEditingBookingNotes ? 'Cancel' : 'Edit Log'}
                          </button>
                        </div>

                        {isEditingBookingNotes ? (
                          <div className="space-y-2 text-right">
                            <textarea
                              value={bookingNotesDraft}
                              onChange={(e) => setBookingNotesDraft(e.target.value)}
                              rows={3}
                              className="w-full bg-[#FDFCFB] border border-[#E5E2DE] p-2 rounded-sm text-xs focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                onUpdateBookingNotes(activeInquiry.id, bookingNotesDraft);
                                setIsEditingBookingNotes(false);
                              }}
                              className="bg-[#C0392B] hover:bg-[#A93226] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm"
                            >
                              Save Log
                            </button>
                          </div>
                        ) : (
                          <div className="bg-[#FDFCFB] border border-dashed border-[#D4AF37] p-3 rounded-sm text-xs text-stone-500 italic">
                            {activeInquiry.trainerNotes || 'No notes saved for this lead yet.'}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-[#E5E2DE] flex justify-between items-center text-[10px]">
                        <span>ID: {activeInquiry.id}</span>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete lead inquiry?')) {
                              onDeleteBooking(activeInquiry.id);
                              setSelectedInquiryId(null);
                            }
                          }}
                          className="text-[#C0392B] hover:underline"
                        >
                          Delete Lead Permanent
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center text-stone-400 py-12">
                      Select an inquiry file to review details.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: CLIENT ACCOUNTS MANAGER */}
            {trainerTab === 'clients' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Client List */}
                <div className="lg:col-span-5 bg-white border border-[#E5E2DE] rounded-sm overflow-hidden shadow-xs flex flex-col h-[550px]">
                  <div className="p-4 border-b border-[#E5E2DE] bg-[#FDFCFB] flex justify-between items-center">
                    <h3 className="font-serif font-bold text-xs uppercase tracking-widest text-stone-500">Active Registered Clients ({clients.length})</h3>
                    <button
                      onClick={() => setIsCreatingClient(true)}
                      className="bg-[#C0392B] hover:bg-[#A93226] text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-sm flex items-center gap-1 cursor-pointer"
                    >
                      <UserPlus className="w-3 h-3" />
                      Add Account
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto divide-y divide-[#F5F5F0]">
                    {clients.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedClientId(c.id);
                          setClientNotesDraft(c.notes || '');
                          setIsEditingClientNotes(false);
                          setIsCreatingClient(false);
                        }}
                        className={`p-4 cursor-pointer transition flex items-start justify-between gap-4 ${
                          selectedClientId === c.id && !isCreatingClient ? 'bg-[#F5F5F0]/85 border-l-2 border-[#C0392B]' : 'hover:bg-[#F5F5F0]'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-serif font-bold text-[#2C3E50] block">{c.name}</span>
                          <span className="text-[9px] text-[#7F8C8D] uppercase tracking-wider font-mono">User: <strong>{c.username}</strong></span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-[#2C3E50] block">
                            {c.sessionsRemaining} left
                          </span>
                          <span className="text-[8px] text-[#7F8C8D] block">of {c.sessionsPaid} paid</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Workspace: Details or Create Form */}
                <div className="lg:col-span-7 bg-white border border-[#E5E2DE] p-6 rounded-sm shadow-xs h-[550px] flex flex-col justify-between overflow-y-auto">
                  
                  {isCreatingClient ? (
                    <form onSubmit={handleCreateClientSubmit} className="space-y-4">
                      <div className="border-b border-[#E5E2DE] pb-2">
                        <h4 className="font-serif text-lg text-[#2C3E50]">Create Client Account</h4>
                        <p className="text-stone-400 text-xs">Register a client so they can login and book free hours themselves.</p>
                      </div>

                      {clientFormError && (
                        <div className="p-2.5 bg-red-50 text-[#C0392B] text-xs rounded-sm border border-red-100">
                          {clientFormError}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold uppercase text-[#7F8C8D]">Client Name</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Richard Cooper" 
                            value={newClientName}
                            onChange={(e) => setNewClientName(e.target.value)}
                            className="w-full bg-[#FDFCFB] border border-[#E5E2DE] p-2 text-sm rounded-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold uppercase text-[#7F8C8D]">Client Email</label>
                          <input 
                            type="email" 
                            placeholder="richard@example.com" 
                            value={newClientEmail}
                            onChange={(e) => setNewClientEmail(e.target.value)}
                            className="w-full bg-[#FDFCFB] border border-[#E5E2DE] p-2 text-sm rounded-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold uppercase text-[#7F8C8D]">Phone Number</label>
                          <input 
                            type="text" 
                            placeholder="(516) 555-9112" 
                            value={newClientPhone}
                            onChange={(e) => setNewClientPhone(e.target.value)}
                            className="w-full bg-[#FDFCFB] border border-[#E5E2DE] p-2 text-sm rounded-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[9px] font-bold uppercase text-[#7F8C8D]">Initial Session Package</label>
                          <input 
                            type="number" 
                            value={newClientPaid}
                            onChange={(e) => setNewClientPaid(Number(e.target.value))}
                            className="w-full bg-[#FDFCFB] border border-[#E5E2DE] p-2 text-sm rounded-sm"
                          />
                        </div>
                      </div>

                      <div className="bg-[#F5F5F0] p-4 rounded-sm border border-[#E5E2DE]">
                        <p className="text-[10px] text-stone-500 italic">
                          <strong>Note:</strong> To allow this client to log in, you must also create a user in the Firebase Authentication console using the exact same email address.
                        </p>
                      </div>

                      <div className="flex gap-2.5 justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setIsCreatingClient(false)}
                          className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold uppercase px-4 py-2.5 rounded-sm"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-[#C0392B] hover:bg-[#A93226] text-white text-[10px] font-bold uppercase px-5 py-2.5 rounded-sm"
                        >
                          Create Account
                        </button>
                      </div>
                    </form>
                  ) : activeClient ? (
                    <div className="space-y-5">
                      <div className="border-b border-[#E5E2DE] pb-4">
                        <span className="text-[9px] text-[#7F8C8D] uppercase font-bold tracking-widest block">Client Profile Account</span>
                        <h3 className="font-serif font-bold text-xl text-[#2C3E50]">{activeClient.name}</h3>
                        <p className="text-[10px] text-stone-400">Username credentials: <code className="bg-stone-100 px-1 font-mono font-bold text-[#2C3E50]">{activeClient.username}</code> / password: <code className="bg-stone-100 px-1 font-mono font-bold text-[#2C3E50]">{activeClient.password || 'password123'}</code></p>
                      </div>

                      {/* Sessions Bank Adjuster */}
                      <div className="bg-[#F5F5F0] p-4 rounded-sm border border-[#E5E2DE] space-y-4">
                        <h4 className="font-serif italic text-sm text-[#2C3E50] border-b border-[#E5E2DE] pb-1.5">Session Package Ledger</h4>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="bg-white p-2 border border-[#E5E2DE] rounded-sm">
                            <span className="text-[9px] text-[#7F8C8D] uppercase font-bold block mb-1">Sessions Paid</span>
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => onUpdateClientSessions(activeClient.id, activeClient.sessionsPaid - 1, activeClient.sessionsDone)}
                                className="w-5 h-5 bg-stone-100 rounded flex items-center justify-center text-xs font-black cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xl font-serif font-bold text-[#2C3E50]">{activeClient.sessionsPaid}</span>
                              <button 
                                onClick={() => onUpdateClientSessions(activeClient.id, activeClient.sessionsPaid + 1, activeClient.sessionsDone)}
                                className="w-5 h-5 bg-stone-100 rounded flex items-center justify-center text-xs font-black cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="bg-white p-2 border border-[#E5E2DE] rounded-sm">
                            <span className="text-[9px] text-[#7F8C8D] uppercase font-bold block mb-1">Sessions Used</span>
                            <div className="flex items-center justify-center gap-1.5">
                              <button 
                                onClick={() => onUpdateClientSessions(activeClient.id, activeClient.sessionsPaid, activeClient.sessionsDone - 1)}
                                className="w-5 h-5 bg-stone-100 rounded flex items-center justify-center text-xs font-black cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xl font-serif font-bold text-[#2C3E50]">{activeClient.sessionsDone}</span>
                              <button 
                                onClick={() => onUpdateClientSessions(activeClient.id, activeClient.sessionsPaid, activeClient.sessionsDone + 1)}
                                className="w-5 h-5 bg-stone-100 rounded flex items-center justify-center text-xs font-black cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="bg-[#2C3E50] text-[#FDFCFB] p-2 rounded-sm border border-[#2C3E50]">
                            <span className="text-[9px] uppercase tracking-wider font-bold block opacity-75 mb-1">REMAINING</span>
                            <span className="text-xl font-serif font-black block leading-none pt-1">{activeClient.sessionsRemaining}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact details */}
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="p-3 bg-[#FDFCFB] border border-[#E5E2DE] rounded-sm space-y-1">
                          <span className="text-[9px] font-bold text-stone-400 block uppercase">Email Contact</span>
                          <span className="block text-[#2C3E50]">{activeClient.email}</span>
                        </div>
                        <div className="p-3 bg-[#FDFCFB] border border-[#E5E2DE] rounded-sm space-y-1">
                          <span className="text-[9px] font-bold text-stone-400 block uppercase">Phone Number</span>
                          <span className="block text-[#2C3E50]">{activeClient.phone}</span>
                        </div>
                      </div>

                      {/* Trainer progressive assessment notes */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-[#7F8C8D] uppercase font-bold tracking-wider">Trainer Bio & Progression Log</span>
                          <button
                            onClick={() => {
                              setIsEditingClientNotes(!isEditingClientNotes);
                              setClientNotesDraft(activeClient.notes || '');
                            }}
                            className="text-[#C0392B] hover:text-[#A93226] text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                          >
                            {isEditingClientNotes ? 'Cancel' : 'Edit Log'}
                          </button>
                        </div>

                        {isEditingClientNotes ? (
                          <div className="space-y-2 text-right">
                            <textarea
                              value={clientNotesDraft}
                              onChange={(e) => setClientNotesDraft(e.target.value)}
                              rows={4}
                              className="w-full bg-[#FDFCFB] border border-[#E5E2DE] p-3 text-xs rounded-sm focus:outline-none"
                              placeholder="Write progressive bio, hip stability comments, or balance limits..."
                            />
                            <button
                              onClick={() => {
                                onUpdateClientNotes(activeClient.id, clientNotesDraft);
                                setIsEditingClientNotes(false);
                              }}
                              className="bg-[#C0392B] hover:bg-[#A93226] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm cursor-pointer"
                            >
                              Save Client Log
                            </button>
                          </div>
                        ) : (
                          <div className="bg-[#FDFCFB] border border-dashed border-[#D4AF37] p-4 rounded-sm text-xs text-stone-500 whitespace-pre-wrap leading-relaxed italic">
                            {activeClient.notes || 'No progression bio saved yet for this client.'}
                          </div>
                        )}
                      </div>

                      {/* Delete Client */}
                      <div className="pt-4 border-t border-[#E5E2DE] flex justify-between items-center text-[10px] text-stone-400">
                        <span>Database Key: {activeClient.id}</span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you absolutely sure you want to permanently delete the profile of ${activeClient.name}? This will revoke their portal access.`)) {
                              onDeleteClient(activeClient.id);
                              setSelectedClientId(null);
                            }
                          }}
                          className="text-[#C0392B] hover:underline"
                        >
                          Delete Account Permanent
                        </button>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center text-stone-400 py-12">
                      Please select or register a client.
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 3: SCHEDULE MANAGER (Set Hours) */}
            {trainerTab === 'schedule' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT: Set New Availability Slots */}
                <div className="lg:col-span-5 bg-white border border-[#E5E2DE] p-6 rounded-sm shadow-xs h-[550px] flex flex-col justify-between">
                  <form onSubmit={handleCreateScheduleBlock} className="space-y-4">
                    <div className="border-b border-[#E5E2DE] pb-2">
                      <h4 className="font-serif text-lg text-[#2C3E50]">Add Available Training Block</h4>
                      <p className="text-stone-400 text-[11px] leading-relaxed mt-0.5">
                        Set a free block of time (e.g. 09:00 AM - 10:30 AM). Clients can reserve a 45-minute session starting at the start of this block. The rest is blocked for your commute!
                      </p>
                    </div>

                    {scheduleError && (
                      <div className="p-2 bg-red-50 text-[#C0392B] text-xs border border-red-100 rounded-sm">
                        {scheduleError}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-bold text-[#7F8C8D] uppercase tracking-wider">Date of Availability</label>
                      <input 
                        type="date" 
                        value={newBlockDate}
                        onChange={(e) => setNewBlockDate(e.target.value)}
                        className="w-full bg-[#FDFCFB] border border-[#E5E2DE] p-2.5 rounded-sm text-xs"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold text-[#7F8C8D] uppercase tracking-wider">Start Time</label>
                        <select 
                          value={newBlockStart}
                          onChange={(e) => setNewBlockStart(e.target.value)}
                          className="w-full bg-[#FDFCFB] border border-[#E5E2DE] p-2 rounded-sm text-xs"
                        >
                          {['07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[9px] font-bold text-[#7F8C8D] uppercase tracking-wider">End Time (Travel Window Included)</label>
                        <select 
                          value={newBlockEnd}
                          onChange={(e) => setNewBlockEnd(e.target.value)}
                          className="w-full bg-[#FDFCFB] border border-[#E5E2DE] p-2 rounded-sm text-xs"
                        >
                          {['08:30 AM', '09:30 AM', '10:30 AM', '11:30 AM', '12:30 PM', '01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM', '05:30 PM', '06:30 PM', '07:30 PM'].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#C0392B] hover:bg-[#A93226] text-white text-xs font-bold uppercase tracking-widest py-3 rounded-sm cursor-pointer"
                    >
                      Publish Free Block
                    </button>
                  </form>

                  <div className="p-4 bg-[#F5F5F0] border border-[#E5E2DE] text-[11px] text-[#5D6D7E] rounded-sm leading-relaxed space-y-1">
                    <p className="font-bold text-[#2C3E50]">💡 Travel Time Magic Example:</p>
                    <p>If you set a free block of <strong>09:00 AM - 10:30 AM (1.5 hrs)</strong>:</p>
                    <p>• The client sees they can book a session for <strong>09:00 AM - 09:45 AM</strong>.</p>
                    <p>• This leaves you with 45 minutes of flexible buffer space for travel, setup, and cleanup!</p>
                  </div>
                </div>

                {/* RIGHT: Calendar & Available Slots List */}
                <div className="lg:col-span-7 bg-white border border-[#E5E2DE] p-6 rounded-sm shadow-xs h-[550px] flex flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="border-b border-[#E5E2DE] pb-4 mb-4">
                      <h4 className="font-serif text-lg text-[#2C3E50] italic">Schedules Calendar List</h4>
                      <p className="text-stone-400 text-xs">Review available slots and client reservations.</p>
                    </div>

                    <div className="space-y-3">
                      {scheduleBlocks.length === 0 ? (
                        <div className="p-10 text-center text-stone-400 text-xs italic">
                          No schedule blocks defined. Use the builder on the left to add your first availability slots!
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {scheduleBlocks.map((block) => (
                            <div 
                              key={block.id}
                              className={`p-4 border rounded-sm flex justify-between items-center text-xs ${
                                block.isBooked 
                                  ? 'bg-emerald-50/50 border-emerald-200' 
                                  : 'bg-[#FDFCFB] border-[#E5E2DE]'
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 font-bold text-[#2C3E50]">
                                  <Calendar className="w-3.5 h-3.5 text-[#C0392B]" />
                                  <span>{block.date}</span>
                                  <span>•</span>
                                  <span>{block.startTime} - {block.endTime}</span>
                                </div>
                                <div className="text-stone-500 font-mono text-[10px]">
                                  {block.isBooked ? (
                                    <span className="text-emerald-800 font-semibold uppercase tracking-wider">
                                      Reserved by: {block.bookedByClientName || 'Registered Client'} (45-Min Call)
                                    </span>
                                  ) : (
                                    <span className="text-stone-400">Available free block</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {block.isBooked && (
                                  <button
                                    onClick={() => onBookScheduleBlock(block.id, null, null)}
                                    className="bg-white hover:bg-stone-100 text-stone-600 text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded-sm border border-stone-200 cursor-pointer"
                                  >
                                    Release Slot
                                  </button>
                                )}
                                <button
                                  onClick={() => onDeleteScheduleBlock(block.id)}
                                  className="text-[#C0392B] hover:text-[#A93226] p-1 rounded"
                                  title="Delete Block"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-[#7F8C8D] italic text-center pt-4">
                    Deleting a block will permanently purge it from both client screens and schedules lists.
                  </p>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
