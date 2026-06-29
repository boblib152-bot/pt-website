/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Mail, Phone, MapPin, User, Sparkles, Check, Download, AlertCircle } from 'lucide-react';
import { Booking } from '../types';

interface BookingFormProps {
  onAddBooking: (booking: Booking) => void;
}

export default function BookingForm({ onAddBooking }: BookingFormProps) {
  // Booking Form States
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [ageGroup, setAgeGroup] = useState<'senior' | 'general'>('senior');
  const [specificGoal, setSpecificGoal] = useState<'strength' | 'weight_loss' | 'balance_mobility' | 'other'>('balance_mobility');
  
  // Date and Time selection
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00 AM - 09:45 AM');

  // Address (defaulted for phone call consultation)
  const [streetAddress, setStreetAddress] = useState('Phone Consultation');
  const [city, setCity] = useState('Remote');
  const [zipCode, setZipCode] = useState('00000');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // UI Flow indicators
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Next 5 operational days list generator
  const getNextDays = () => {
    const list = [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // We start from current date
    const today = new Date();
    for (let i = 1; i <= 6; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      const dayName = days[nextDate.getDay()];
      const dayNum = nextDate.getDate();
      const monthName = months[nextDate.getMonth()];
      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(dayNum).padStart(2, '0');
      
      list.push({
        rawDate: `${yyyy}-${mm}-${dd}`,
        label: `${dayName}, ${monthName} ${dayNum}`
      });
    }
    return list;
  };

  const dayOptions = getNextDays();

  // Set default rawDate for safety
  useEffect(() => {
    if (dayOptions.length > 0 && !selectedDate) {
      setSelectedDate(dayOptions[0].rawDate);
    }
  }, []);

  const timeSlots = [
    { value: '09:00 AM - 09:45 AM', label: '09:00 AM - 09:45 AM' },
    { value: '11:00 AM - 11:45 AM', label: '11:00 AM - 11:45 AM' },
    { value: '01:30 PM - 02:15 PM', label: '01:30 PM - 02:15 PM' },
    { value: '04:00 PM - 04:45 PM', label: '04:00 PM - 04:45 PM' },
    { value: '05:30 PM - 06:15 PM', label: '05:30 PM - 06:15 PM' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName || !clientEmail || !clientPhone) {
      setErrorMessage('Please fill out all contact details.');
      return;
    }

    setErrorMessage('');

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      clientName,
      clientEmail,
      clientPhone,
      ageGroup,
      specificGoal,
      sessionDate: selectedDate,
      sessionTimeSlot: selectedTimeSlot,
      streetAddress,
      city,
      zipCode,
      additionalNotes,
      createdTime: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'pending'
    };

    onAddBooking(newBooking);
    setConfirmedTicket(newBooking);
    setIsSuccess(true);
    
    // Clear inputs (keeping defaults for address)
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setStreetAddress('Phone Consultation');
    setZipCode('00000');
    setAdditionalNotes('');
  };

  return (
    <section id="book" className="py-20 md:py-28 bg-[#FDFCFB] border-b border-[#E5E2DE]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Module Title Card */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="font-sans text-[10px] uppercase tracking-widest text-[#C0392B] font-bold block">
            Get Started Today
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#2C3E50] tracking-tight">
            Request a Free Consultation.
          </h2>
          <div className="w-12 h-0.5 bg-[#D4AF37] mx-auto mt-2"></div>
          <p className="text-[#5D6D7E] text-sm leading-relaxed max-w-lg mx-auto">
            Ready to take the first step? Select a convenient date and time for a complimentary 15-minute consultation. We'll discuss your fitness goals, health history, and how we can best support you.
          </p>
        </div>

        <div className="max-w-3xl mx-auto text-left">
          {isSuccess && confirmedTicket ? (
            /* CONFIRMATION TICKET DISPLAY */
            <div className="bg-white p-6 sm:p-10 rounded-sm border border-[#E5E2DE] shadow-md space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif font-bold text-2xl text-[#2C3E50]">Consultation Call Scheduled!</h3>
                <p className="text-[#7F8C8D] text-xs max-w-sm mx-auto">
                  Hanoch has received your request. Your consultation call details are generated below:
                </p>
              </div>

              {/* Admission Ticket Outer Box */}
              <div className="relative border-2 border-stone-250 border-dashed rounded-sm p-6 bg-[#FDFCFB] text-left overflow-hidden">
                
                {/* Ticket side punches */}
                <div className="absolute top-1/2 left-[-10px] w-5 h-5 bg-white border border-[#E5E2DE] border-l-0 rounded-full shrink-0 -translate-y-1/2" />
                <div className="absolute top-1/2 right-[-10px] w-5 h-5 bg-white border border-[#E5E2DE] border-r-0 rounded-full shrink-0 -translate-y-1/2" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-[#E5E2DE] pb-4 mb-4">
                  <div>
                    <span className="font-sans text-[9px] text-[#7F8C8D] uppercase font-bold tracking-widest block mb-0.5">Name</span>
                    <span className="text-sm font-serif font-bold text-[#2C3E50]">{confirmedTicket.clientName}</span>
                  </div>
                  <div>
                    <span className="font-sans text-[9px] text-[#7F8C8D] uppercase font-bold tracking-widest block mb-0.5">Contact Email</span>
                    <span className="text-xs font-bold text-[#2C3E50]">{confirmedTicket.clientEmail}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-[#E5E2DE] pb-4 mb-4">
                  <div>
                    <span className="font-sans text-[9px] text-[#7F8C8D] uppercase font-bold tracking-widest block mb-0.5">Schedule Day</span>
                    <span className="text-xs font-bold text-[#2C3E50] flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#C0392B]" />
                      {dayOptions.find(d => d.rawDate === confirmedTicket.sessionDate)?.label || confirmedTicket.sessionDate}
                    </span>
                  </div>
                  <div>
                    <span className="font-sans text-[9px] text-[#7F8C8D] uppercase font-bold tracking-widest block mb-0.5">Session Time Slot</span>
                    <span className="text-xs font-bold text-[#2C3E50] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {confirmedTicket.sessionTimeSlot}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-sans text-[9px] text-[#7F8C8D] uppercase font-bold tracking-widest block mb-0.5">Contact Number</span>
                  <span className="text-xs font-medium text-[#2C3E50] flex items-start gap-1">
                    <Phone className="w-4 h-4 text-[#C0392B] shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-bold text-stone-900">{confirmedTicket.clientPhone}</span>
                      <span className="text-stone-500">We will call you at your selected time.</span>
                    </div>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 font-sans">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setConfirmedTicket(null);
                  }}
                  className="bg-[#C0392B] hover:bg-[#A93226] text-white font-bold text-[10px] uppercase tracking-widest px-6 py-3.5 rounded-sm transition-all cursor-pointer"
                >
                  Schedule Another Call
                </button>
                <p className="text-[10px] text-[#7F8C8D] italic self-center">
                  Hanoch will call your number to verify details and discuss your goals.
                </p>
              </div>
            </div>
          ) : (
            /* FORM INTERACTIVE INPUT LAYOUT */
            <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-sm border border-[#E5E2DE] shadow-xs space-y-7">
              
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-sm p-4 flex gap-3 items-center text-xs text-left">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Section 1: Choose Timing */}
              <div className="space-y-4">
                <h4 className="font-serif font-bold text-base text-[#2C3E50] border-b border-[#E5E2DE] pb-2">
                  Step 1: Select Date & Time
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-sans uppercase font-semibold text-[#7F8C8D] mb-2 tracking-wider">Available Dates</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {dayOptions.map((day) => (
                        <button
                          key={day.rawDate}
                          id={`booking_date_${day.rawDate}`}
                          type="button"
                          onClick={() => setSelectedDate(day.rawDate)}
                          className={`px-3.5 py-3 rounded-sm border text-center text-xs transition-all duration-300 cursor-pointer ${
                            selectedDate === day.rawDate
                              ? 'bg-[#2C3E50] text-[#FDFCFB] font-bold border-[#1A1A1A] shadow-sm'
                              : 'bg-white border-[#E5E2DE] hover:bg-[#F5F5F0] text-[#2C3E50] font-normal'
                          }`}
                        >
                          <CalendarIcon className="w-3.5 h-3.5 mx-auto mb-1 opacity-70" />
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans uppercase font-semibold text-[#7F8C8D] mb-1.5 tracking-wider">Available Times</label>
                    <div className="space-y-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.value}
                          id={`booking_time_${slot.value.replace(/[^a-zA-Z0-9]/g, '')}`}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot.value)}
                          className={`w-full p-3.5 rounded-sm border text-left text-xs transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                            selectedTimeSlot === slot.value
                              ? 'bg-[#F5F5F0] border-[#D4AF37] text-[#2C3E50] font-bold'
                              : 'bg-white border-[#E5E2DE] hover:bg-[#F5F5F0] text-stone-600'
                          }`}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full ${selectedTimeSlot === slot.value ? 'bg-[#C0392B]' : 'bg-stone-300'}`} />
                          <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{slot.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact & Additional info */}
              <div className="space-y-4 pt-1">
                <h4 className="font-serif font-bold text-base text-[#2C3E50] border-b border-[#E5E2DE] pb-2">
                  Step 2: Contact Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label htmlFor="booking_client_name" className="block text-[10px] font-sans uppercase font-semibold text-[#7F8C8D] mb-1.5 tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      <span>First & Last Name</span>
                    </label>
                    <input 
                      id="booking_client_name"
                      name="clientName"
                      type="text" 
                      placeholder="Arthur Pendleton"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-[#FDFCFB] border border-[#E5E2DE] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#2C3E50] focus:bg-white transition"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="booking_client_email" className="block text-[10px] font-sans uppercase font-semibold text-[#7F8C8D] mb-1.5 tracking-wider flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Address</span>
                    </label>
                    <input 
                      id="booking_client_email"
                      name="clientEmail"
                      type="email" 
                      placeholder="arthur@gmail.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-[#FDFCFB] border border-[#E5E2DE] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#2C3E50] focus:bg-white transition"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="booking_client_phone" className="block text-[10px] font-sans uppercase font-semibold text-[#7F8C8D] mb-1.5 tracking-wider flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>Phone Number</span>
                    </label>
                    <input 
                      id="booking_client_phone"
                      name="clientPhone"
                      type="tel" 
                      placeholder="(516) 555-0199"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-[#FDFCFB] border border-[#E5E2DE] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#2C3E50] focus:bg-white transition"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label htmlFor="booking_client_notes" className="block text-[10px] font-sans uppercase font-semibold text-[#7F8C8D] mb-1.5 tracking-wider">Additional Information</label>
                  <textarea 
                    id="booking_client_notes"
                    name="additionalNotes"
                    placeholder="e.g. Any health goals, fitness history, or specific questions you'd like to discuss on the call..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={3.5}
                    className="w-full bg-[#FDFCFB] border border-[#E5E2DE] rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-[#2C3E50] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Submit button container */}
              <div className="pt-4 border-t border-[#E5E2DE] flex flex-col sm:flex-row justify-between items-center gap-6 text-left">
                <div className="text-stone-400 text-[10px] leading-relaxed max-w-sm font-sans">
                  We respect your privacy. Your information is kept secure and will only be used to contact you for your scheduled consultation.
                </div>
                
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#C0392B] hover:bg-[#A93226] text-white font-bold uppercase tracking-widest text-xs px-8 py-4.5 rounded-sm border border-[#C0392B] hover:shadow transition-all duration-200 cursor-pointer"
                  id="submit_booking_form"
                >
                  Schedule Consultation
                </button>
              </div>

            </form>
          )}

          {/* Trust Checklists / Reassurance beneath the card */}
          <div className="mt-12 bg-white p-6 rounded-sm border border-[#E5E2DE] grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left shadow-2xs">
            <div className="flex items-center md:items-start justify-center md:justify-start gap-2.5">
              <Check className="w-5 h-5 text-[#C0392B] shrink-0 mt-0.5" />
              <div className="text-xs text-[#5D6D7E]">
                <strong className="block text-[#2C3E50] font-semibold">Fully Certified & Insured</strong>
                <span>$2M professional liability coverage</span>
              </div>
            </div>
            <div className="flex items-center md:items-start justify-center md:justify-start gap-2.5">
              <Check className="w-5 h-5 text-[#C0392B] shrink-0 mt-0.5" />
              <div className="text-xs text-[#5D6D7E]">
                <strong className="block text-[#2C3E50] font-semibold">NASM Specialist Certified</strong>
                <span>Highest gold-standard training credentials</span>
              </div>
            </div>
            <div className="flex items-center md:items-start justify-center md:justify-start gap-2.5">
              <Check className="w-5 h-5 text-[#C0392B] shrink-0 mt-0.5" />
              <div className="text-xs text-[#5D6D7E]">
                <strong className="block text-[#2C3E50] font-semibold">Active CPR & AED Certified</strong>
                <span>Certified safety protocols for client protection</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
