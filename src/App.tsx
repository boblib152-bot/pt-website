/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, ShieldCheck, Mail, Phone, MapPin, Heart, ChevronRight, Briefcase } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Methodology from './components/Methodology';
import BookingForm from './components/BookingForm';
import FAQ from './components/FAQ';
import Portal from './components/Portal';
import { sendEmailNotification } from './notifications';

import { Booking, ClientProfile, FreeScheduleBlock, CompletedSession } from './types';
import {
  seedDatabaseIfEmpty,
  listenToBookings,
  listenToClients,
  listenToScheduleBlocks,
  addBookingInFirestore,
  updateBookingStatusInFirestore,
  updateBookingNotesInFirestore,
  deleteBookingFromFirestore,
  addClientInFirestore,
  updateClientSessionsInFirestore,
  updateClientNotesInFirestore,
  deleteClientFromFirestore,
  addScheduleBlockInFirestore,
  deleteScheduleBlockFromFirestore,
  bookScheduleBlockInFirestore,
  addCompletedSession,
  updateCompletedSessionNotes,
  deleteCompletedSession,
  listenToCompletedSessions
} from './supabase';

export default function App() {
  // Sync states directly with Firestore real-time snapshots
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<ClientProfile[]>([]);
  const [scheduleBlocks, setScheduleBlocks] = useState<FreeScheduleBlock[]>([]);
  const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);

  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Initialize and synchronize Firestore
  useEffect(() => {
    // 1. Seed sample data if collections are empty
    seedDatabaseIfEmpty();

    // 2. Establish real-time sync listeners
    const unsubBookings = listenToBookings(setBookings);
    const unsubClients = listenToClients(setClients);
    const unsubSchedule = listenToScheduleBlocks(setScheduleBlocks);
    const unsubCompleted = listenToCompletedSessions(setCompletedSessions);

    // 3. Clean up listeners on component unmount
    return () => {
      unsubBookings();
      unsubClients();
      unsubSchedule();
      unsubCompleted();
    };
  }, []);

  // Smooth Scroll Helper
  const handleScrollTo = (selectorId: string) => {
    const el = document.getElementById(selectorId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // State modifiers for lead inquiries calling real-time Firestore database
  const handleAddBooking = async (newBk: Booking) => {
    try {
      await addBookingInFirestore(newBk);
      sendEmailNotification(
        'New Consultation Inquiry Received',
        `A new client has requested a free consultation.\n\nName: ${newBk.clientName}\nEmail: ${newBk.clientEmail}\nPhone: ${newBk.clientPhone}\nTarget Date: ${newBk.sessionDate}\nTime Slot: ${newBk.sessionTimeSlot}\n\nAdditional Notes: ${newBk.additionalNotes || 'None'}\n\nPlease review this in the PT Portal queue.`
      );
    } catch (err) {
      console.error('Error adding booking in Firestore:', err);
      throw err;
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      await updateBookingStatusInFirestore(id, status);
    } catch (err) {
      console.error('Error updating booking status in Firestore:', err);
      throw err;
    }
  };

  const handleUpdateBookingNotes = async (id: string, notes: string) => {
    try {
      await updateBookingNotesInFirestore(id, notes);
    } catch (err) {
      console.error('Error updating booking notes in Firestore:', err);
      throw err;
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteBookingFromFirestore(id);
    } catch (err) {
      console.error('Error deleting booking from Firestore:', err);
      throw err;
    }
  };

  // Client management handlers calling real-time Firestore database
  const handleAddClient = async (newClient: ClientProfile) => {
    try {
      await addClientInFirestore(newClient);
    } catch (err) {
      console.error('Error adding client in Firestore:', err);
      throw err;
    }
  };

  const handleUpdateClientSessions = async (id: string, paid: number, done: number) => {
    try {
      await updateClientSessionsInFirestore(id, paid, done);
    } catch (err) {
      console.error('Error updating client sessions in Firestore:', err);
      throw err;
    }
  };

  const handleUpdateClientNotes = async (id: string, notes: string) => {
    try {
      await updateClientNotesInFirestore(id, notes);
    } catch (err) {
      console.error('Error updating client notes in Firestore:', err);
      throw err;
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await deleteClientFromFirestore(id);
    } catch (err) {
      console.error('Error deleting client from Firestore:', err);
      throw err;
    }
  };

  // Schedule management handlers calling real-time Firestore database
  const handleAddScheduleBlock = async (newBlock: FreeScheduleBlock) => {
    try {
      await addScheduleBlockInFirestore(newBlock);
    } catch (err) {
      console.error('Error adding schedule block in Firestore:', err);
      throw err;
    }
  };

  const handleDeleteScheduleBlock = async (id: string) => {
    try {
      await deleteScheduleBlockFromFirestore(id);
    } catch (err) {
      console.error('Error deleting schedule block from Firestore:', err);
      throw err;
    }
  };

  const handleBookScheduleBlock = async (blockId: string, clientId: string | null, clientName: string | null) => {
    try {
      const block = scheduleBlocks.find(b => b.id === blockId);
      await bookScheduleBlockInFirestore(blockId, clientId, clientName);
      if (block) {
        if (clientId) {
          sendEmailNotification(
            'Session Reserved by Client',
            `Client ${clientName} has reserved a training session slot.\n\nDate: ${block.date}\nTime: ${block.startTime} - ${block.endTime}\n\nPlease check the PT Portal.`
          );
        } else {
          sendEmailNotification(
            'Session Released / Cancelled',
            `A training session slot has been released/cancelled.\n\nPrevious Booked Client: ${block.bookedByClientName || 'N/A'}\nDate: ${block.date}\nTime: ${block.startTime} - ${block.endTime}\n\nPlease check the PT Portal.`
          );
        }
      }
    } catch (err) {
      console.error('Error booking schedule block in Firestore:', err);
      throw err;
    }
  };

  // Completed session handlers
  const handleAddCompletedSession = async (session: CompletedSession) => {
    try {
      await addCompletedSession(session);
    } catch (err) {
      console.error('Error adding completed session:', err);
      throw err;
    }
  };

  const handleUpdateCompletedSessionNotes = async (id: string, privateNotes: string, sharedNotes: string) => {
    try {
      await updateCompletedSessionNotes(id, privateNotes, sharedNotes);
    } catch (err) {
      console.error('Error updating completed session notes:', err);
      throw err;
    }
  };

  const handleDeleteCompletedSession = async (id: string) => {
    try {
      await deleteCompletedSession(id);
    } catch (err) {
      console.error('Error deleting completed session:', err);
      throw err;
    }
  };



  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between" id="app_frame">
      
      {/* Header element */}
      <Header
        onScrollTo={handleScrollTo}
        isDashboardOpen={isDashboardOpen}
        onToggleDashboard={() => {
          setIsDashboardOpen(!isDashboardOpen);
          if (!isDashboardOpen) {
            // Scroll to dashboard block smoothly on entrance
            setTimeout(() => {
              window.scrollTo({ top: 80, behavior: 'smooth' });
            }, 50);
          }
        }}
      />

      {/* Main Core Work Space */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {isDashboardOpen ? (
            /* TRAINER BACK-END DASHBOARD VIEW */
            <motion.div
              key="crm_dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Portal
                bookings={bookings}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onUpdateBookingNotes={handleUpdateBookingNotes}
                onDeleteBooking={handleDeleteBooking}
                
                clients={clients}
                onAddClient={handleAddClient}
                onUpdateClientSessions={handleUpdateClientSessions}
                onUpdateClientNotes={handleUpdateClientNotes}
                onDeleteClient={handleDeleteClient}
                
                scheduleBlocks={scheduleBlocks}
                onAddScheduleBlock={handleAddScheduleBlock}
                onDeleteScheduleBlock={handleDeleteScheduleBlock}
                onBookScheduleBlock={handleBookScheduleBlock}

                completedSessions={completedSessions}
                onAddCompletedSession={handleAddCompletedSession}
                onUpdateCompletedSessionNotes={handleUpdateCompletedSessionNotes}
                onDeleteCompletedSession={handleDeleteCompletedSession}
                
                onClose={() => setIsDashboardOpen(false)}
              />
            </motion.div>
          ) : (
            /* CONSUMER-FACING FRONT-END WEBSITE */
            <motion.div
              key="client_website"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-0"
            >
              {/* Hero segment */}
              <div id="hero">
                <Hero onScrollTo={handleScrollTo} />
              </div>

              {/* Specialized age demographics */}
              <Features />

              {/* Biomechanical training method vertical timeline timeline */}
              <Methodology />

              {/* Direct Booking scheduler */}
              <BookingForm
                onAddBooking={handleAddBooking}
              />

              {/* Logistics questions accordion FAQ list */}
              <FAQ />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#2C3E50] text-[#FDFCFB]/80 py-16 border-t border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-sans">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-start text-left mb-12">
            
            {/* Branding Column */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-sm bg-[#C0392B] flex items-center justify-center text-white shrink-0">
                  <Award className="w-5 h-5 text-[#FDFCFB]" />
                </div>
                <span className="font-serif font-bold italic text-white text-base tracking-tight block leading-tight">
                  Hanoch Lib Training
                </span>
              </div>
              <p className="text-white/70 text-xs leading-relaxed">
                Premium specialized in-home strength & balance training. Delivering safe balance training, post-therapy physical fitness, and sustainable body transformations directly to Five Towns residents.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-4 h-4 text-[#C0392B]" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#D4AF37]">NASM-CPT RECOGNIZED</span>
              </div>
            </div>

            {/* Travel Area Bounds Column */}
            <div className="space-y-3">
              <h4 className="text-[#D4AF37] font-serif font-bold italic text-sm border-b border-white/10 pb-1.5">
                Service Areas
              </h4>
              <p className="text-white/70 text-xs leading-relaxed">
                Providing premium, private personal training services directly to residences throughout:
              </p>
              <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-white/85">
                <li className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">✦</span>
                  <span>Cedarhurst</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">✦</span>
                  <span>Woodmere</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">✦</span>
                  <span>Lawrence</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">✦</span>
                  <span>Hewlett</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#D4AF37]">✦</span>
                  <span>Inwood</span>
                </li>
              </ul>
            </div>

            {/* Trainer Directory Contacts Column */}
            <div className="space-y-3">
              <h4 className="text-[#D4AF37] font-serif font-bold italic text-sm border-b border-white/10 pb-1.5">
                Contact Directory
              </h4>
              <div className="space-y-2.5 text-xs text-white/85">
                <a href="mailto:hanochlib@gmail.com" className="flex items-center gap-2 text-white/85 hover:text-[#D4AF37] transition">
                  <Mail className="w-4 h-4 text-[#C0392B] shrink-0" />
                  <span>hanochlib@gmail.com</span>
                </a>
                <div className="flex items-center gap-2 text-white/85">
                  <Phone className="w-4 h-4 text-[#C0392B] shrink-0" />
                  <span>Phone: (516) 555-0199</span>
                </div>
                <div className="flex items-center gap-2 text-white/85">
                  <MapPin className="w-4 h-4 text-[#C0392B] shrink-0" />
                  <span>Serving: Five Towns, NY</span>
                </div>
              </div>
            </div>

            {/* Credentials Info Column */}
            <div className="space-y-3">
              <h4 className="text-[#D4AF37] font-serif font-bold italic text-sm border-b border-white/10 pb-1.5">
                NASM Guidelines
              </h4>
              <p className="text-white/70 text-xs leading-relaxed">
                Our in-home training program complies strictly with the National Academy of Sports Medicine guidelines. No complex gym machines are required—just natural, comfortable resistance and balance tools that we bring directly to your home.
              </p>
            </div>

          </div>

          {/* Sub-footer metadata bottom bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/60 text-left">
            <div className="space-y-1">
              <p>© {new Date().getFullYear()} Hanoch Lib, NASM-CPT. All Rights Reserved. Private residential training.</p>
              <p className="text-[10px] text-white/45 font-mono">Certified National Academy of Sports Medicine Provider</p>
            </div>

            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setIsDashboardOpen(true)}
                className="hover:text-white text-white/85 font-mono text-[10px] tracking-widest uppercase flex items-center gap-1.5 cursor-pointer"
                id="footer_dashboard_trigger"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#C0392B]" />
                <span>Trainer & Client Portal</span>
              </button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
