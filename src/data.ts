/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FAQItem, ReviewItem, Booking } from './types';

export const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'general',
    question: 'Why choose an in-home certified trainer?',
    answer: 'In-home training eliminates the intimidation of busy commercial gyms, commute times, and waiting for clean equipment. Hanoch brings specialized, pre-sanitized training gear directly to your residence, tailoring the workspace entirely to your home environment.'
  },
  {
    category: 'elderly',
    question: 'How do you structure training for seniors / older adults?',
    answer: 'Our specialized active-aging protocols prioritize joint safety, proper alignment, fall prevention stability work, bone density support, and functional mobility. We utilize light resistance, supportive padding, and slow, controlled movement patterns to build strength pain-free.'
  },
  {
    category: 'logistics',
    question: 'What equipment do I need to own?',
    answer: 'None. Hanoch brings all required tools—including supportive mats, resistance bands, and soft-grip weights—fully sanitized before each session. We only require a clear 6x6 foot open space.'
  },
  {
    category: 'pricing',
    question: 'What does a diagnostic session include?',
    answer: 'The initial consultation consists of a comprehensive movement assessment (posture screening, single-leg stability check, and core strength baseline) followed by goal-mapping and a gentle introductory movement sequence. It is fully personalized, comfortable, and zero-pressure.'
  },
  {
    category: 'logistics',
    question: 'Why exactly 45 minutes per session?',
    answer: 'A 45-minute format represents the optimal duration for home-based training. It features a 5-minute targeted warm-up, 35 minutes of focused core stability and functional strength work, and a 5-minute progressive stretch cool-down. This maximizes workout density without causing energy crash or joint fatigue.'
  }
];

export const TESTIMONIALS: ReviewItem[] = [
  {
    name: 'Eleanor Miller',
    age: 74,
    location: 'Cedarhurst',
    text: 'Hanoch is incredibly gentle yet highly precise. I was terrified of falling after a hip slip last winter. Through our 45-minute balance workouts, I can walk comfortably on carpets now and easily step into my garden tub without holding onto the wall.',
    rating: 5,
    tags: ['Senior Balance', 'Mobility'],
    transformation: 'Regained independent standing balance & garden mobility.'
  },
  {
    name: 'David Sterling',
    age: 48,
    location: 'Woodmere',
    text: 'Working in venture capital, my schedule is chaotic. Having Hanoch arrive at my home at 6:30 AM twice a week made consistency automatic. Over six months, my functional strength improved significantly, and my chronic lower back tightness completely resolved.',
    rating: 5,
    tags: ['Body Transformation', 'Strength'],
    transformation: 'Significant improvements in lean strength and complete relief from chronic lumbar tightness.'
  },
  {
    name: 'Margaret & Arthur',
    age: 81,
    location: 'Lawrence',
    text: 'We train together twice a week. Arthur wanted to improve his bone density and I wanted to climb stairs with groceries. Hanoch monitors our heart rates, brings soft pads, and writes custom charts. It has given us our physical freedom back.',
    rating: 5,
    tags: ['Active Aging', 'Joint Coordination & Balance'],
    transformation: 'Vastly improved posture score & enhanced capability for daily tasks.'
  }
];

// Seed initial bookings so the dashboard has rich content immediately
export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-1',
    clientName: 'Virginia Harrison',
    clientEmail: 'harrison.v@verizon.net',
    clientPhone: '(516) 555-8291',
    ageGroup: 'senior',
    specificGoal: 'balance_mobility',
    sessionDate: '2026-06-01',
    sessionTimeSlot: '09:00 AM - 09:45 AM',
    streetAddress: '1426 Mountain Crest Road',
    city: 'Cedarhurst',
    zipCode: '11516',
    additionalNotes: 'Seeking to regain confidence after an ankle sprain. Hard time standing long enough to cook a meal without needing support. My partner recommended Hanoch.',
    createdTime: 'May 27, 2026',
    status: 'pending'
  },
  {
    id: 'bk-2',
    clientName: 'Dr. Arthur Pendelton',
    clientEmail: 'arthur.p@ucla.edu',
    clientPhone: '(516) 555-0144',
    ageGroup: 'senior',
    specificGoal: 'strength',
    sessionDate: '2026-06-01',
    sessionTimeSlot: '10:30 AM - 11:15 AM',
    streetAddress: '984 Windsor Parkway',
    city: 'Lawrence',
    zipCode: '11559',
    additionalNotes: 'Cleared by post-op physical therapist for light core stabilization. Posture correction and back strength is our primary milestone.',
    createdTime: 'May 26, 2026',
    status: 'confirmed',
    trainerNotes: 'Focus on balance, basic core exercises. Gentle glute bridges to restore hip extension. Avoid spinal rotation under load.'
  },
  {
    id: 'bk-3',
    clientName: 'Sarah Jenkins',
    clientEmail: 's.jenkins@gmail.com',
    clientPhone: '(516) 555-1200',
    ageGroup: 'general',
    specificGoal: 'weight_loss',
    sessionDate: '2026-05-24',
    sessionTimeSlot: '04:30 PM - 05:15 PM',
    streetAddress: '512 Maple Wood Avenue',
    city: 'Hewlett',
    zipCode: '11557',
    additionalNotes: 'Sedentary desk job posture. Trying to get stronger, tone arms, and feel healthy. Excited about direct home travel training.',
    createdTime: 'May 23, 2026',
    status: 'completed',
    trainerNotes: 'First session complete! Outstanding leg strength, but tight hips limit simple movements. Taught her simple hip flexor stretches. Program designed: 2x/week bodyweight and dumbbell squat progression.'
  }
];

export const INITIAL_CLIENTS: any[] = [
  {
    id: 'client-1',
    name: 'Eleanor Miller',
    email: 'eleanor.miller@gmail.com',
    phone: '(516) 555-8291',
    username: 'eleanor',
    password: 'password123',
    sessionsPaid: 12,
    sessionsDone: 8,
    sessionsRemaining: 4,
    notes: 'Prioritize single-leg stability on carpet. Hip alignment is excellent. Responds well to positive feedback!'
  },
  {
    id: 'client-2',
    name: 'David Sterling',
    email: 'sterling.d@vcpartners.com',
    phone: '(516) 555-0144',
    username: 'david',
    password: 'password123',
    sessionsPaid: 24,
    sessionsDone: 15,
    sessionsRemaining: 9,
    notes: 'Lower back tension completely solved. Focus on thoracic extension and progressive volume for posture stability.'
  },
  {
    id: 'client-3',
    name: 'Virginia Harrison',
    email: 'harrison.v@verizon.net',
    phone: '(516) 555-1200',
    username: 'virginia',
    password: 'password123',
    sessionsPaid: 8,
    sessionsDone: 2,
    sessionsRemaining: 6,
    notes: 'Mild knee stiffness. Needs gentle knee-stabilizing warm-up.'
  }
];

export const INITIAL_SCHEDULE_BLOCKS: any[] = [
  {
    id: 'block-1',
    date: '2026-06-25',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    isBooked: false
  },
  {
    id: 'block-2',
    date: '2026-06-25',
    startTime: '11:00 AM',
    endTime: '12:30 PM',
    isBooked: true,
    bookedByClientId: 'client-1',
    bookedByClientName: 'Eleanor Miller'
  },
  {
    id: 'block-3',
    date: '2026-06-26',
    startTime: '01:30 PM',
    endTime: '03:00 PM',
    isBooked: false
  },
  {
    id: 'block-4',
    date: '2026-06-26',
    startTime: '04:00 PM',
    endTime: '05:30 PM',
    isBooked: false
  }
];

