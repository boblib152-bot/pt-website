/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  ageGroup: 'senior' | 'general';
  specificGoal: 'strength' | 'weight_loss' | 'balance_mobility' | 'other';
  sessionDate: string;
  sessionTimeSlot: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  additionalNotes?: string;
  createdTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  trainerNotes?: string; // Private trainer assessment & workout design notes
}

export interface AssessmentQuery {
  name: string;
  ageGrp: 'under_40' | '40_59' | '60_74' | '75_plus';
  fitnessGoal: 'strength' | 'weight_loss' | 'balance_mobility' | 'longevity';
  currentActivityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  physicalLimitations: string;
  exerciseLocationInHome: 'living_room' | 'garage_patio' | 'bedroom_office' | 'other';
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'elderly' | 'logistics' | 'pricing';
}

export interface ReviewItem {
  name: string;
  age: number;
  location: string;
  text: string;
  rating: number;
  tags: string[];
  transformation?: string;
}

export interface TrainingPlan {
  dailyCalorieEst: number;
  dailyProteinGrams: number;
  warmupMinutes: number;
  focusArea: string;
  equipmentRequired: string[];
  recommendedSchedules: string[];
  sampleWorkoutBlocks: {
    phase: string;
    durationMin: number;
    exercises: { name: string; reps: string; benefit: string }[];
  }[];
}

export interface ClientProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password?: string;
  sessionsPaid: number;
  sessionsDone: number;
  sessionsRemaining: number;
  notes?: string;
}

export interface FreeScheduleBlock {
  id: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "10:30 AM"
  isBooked: boolean;
  bookedByClientId?: string;
  bookedByClientName?: string;
}

