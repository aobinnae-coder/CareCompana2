import { create } from 'zustand';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'family' | 'companion';
  avatar?: string;
  avgRating?: number;
  status?: 'Available' | 'Invisible' | 'Away';
  skills?: string[];
  riskScore?: number;
}

export interface Senior {
  id: string;
  name: string;
  age: number;
  condition: string;
  specializedCare: string[];
  lastVisit?: string;
  rating: number;
  familyAdmin?: string;
}

export interface Job {
  id: string;
  seniorId: string;
  familyId: string;
  companionId?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  payout: number;
  date: string;
  priority: boolean;
  reqSkills: string[];
  distance: number;
  aiMatchScore: number;
}

interface AppState {
  currentUser: User;
  seniors: Senior[];
  jobs: Job[];
  companions: User[];
  
  // Actions
  setRole: (role: 'admin' | 'family' | 'companion') => void;
  addJob: (job: Job) => void;
  updateJob: (jobId: string, updates: Partial<Job>) => void;
  addSenior: (senior: Senior) => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: {
    id: 'USR-001',
    name: 'Alexander Obinna',
    email: 'a.obinnae@gmail.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
  },
  
  seniors: [
    { id: 'SNR-001', name: 'Eleanor Riggs', age: 82, condition: 'Dementia', specializedCare: ['Memory Care'], rating: 4.8, familyAdmin: 'The Smiths' },
    { id: 'SNR-002', name: 'Arthur Dent', age: 75, condition: 'Mobility', specializedCare: ['Physical Therapy'], rating: 4.5, familyAdmin: 'The Smiths' },
    { id: 'SNR-003', name: 'Martha Stewart', age: 80, condition: 'General Care', specializedCare: ['Medication'], rating: 4.2, familyAdmin: 'Unknown' }
  ],
  
  jobs: [
    { 
      id: 'JOB-001', 
      seniorId: 'SNR-001', 
      familyId: 'USR-002', 
      status: 'pending', 
      payout: 35, 
      date: '2026-05-06', 
      priority: false, 
      reqSkills: ['Dementia Care'], 
      distance: 2.5, 
      aiMatchScore: 98 
    },
    { 
      id: 'JOB-003', 
      seniorId: 'SNR-003', 
      familyId: 'USR-002', 
      status: 'pending', 
      payout: 55, 
      date: '2026-05-12', 
      priority: true, 
      reqSkills: ['General Care', 'Medication'], 
      distance: 0.8, 
      aiMatchScore: 92 
    },
    { 
      id: 'JOB-004', 
      seniorId: 'SNR-001', 
      familyId: 'USR-002', 
      status: 'pending', 
      payout: 42, 
      date: '2026-05-15', 
      priority: true, 
      reqSkills: ['Memory Care'], 
      distance: 3.2, 
      aiMatchScore: 88 
    },
    { 
      id: 'JOB-002', 
      seniorId: 'SNR-002', 
      familyId: 'USR-003', 
      status: 'in_progress', 
      companionId: 'USR-004',
      payout: 45, 
      date: '2026-05-05', 
      priority: true, 
      reqSkills: ['Physical Therapy Assist'], 
      distance: 1.1, 
      aiMatchScore: 85 
    }
  ],
  
  companions: [
    { 
      id: 'USR-004', 
      name: 'Sarah Chen', 
      email: 'sarah@example.com', 
      role: 'companion', 
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      avgRating: 4.9,
      status: 'Available',
      skills: ['Dementia Care', 'Medication Management']
    }
  ],

  setRole: (role) => set((state) => ({ currentUser: { ...state.currentUser, role } })),
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (jobId, updates) => set((state) => ({
    jobs: state.jobs.map(j => j.id === jobId ? { ...j, ...updates } : j)
  })),
  addSenior: (senior) => set((state) => ({ seniors: [...state.seniors, senior] }))
}));
