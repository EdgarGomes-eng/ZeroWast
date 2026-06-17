/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'DONOR' | 'RECIPIENT';

export type DonationStatus = 'AVAILABLE' | 'RESERVED' | 'COMPLETED';

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar_url?: string;
}

export interface Donation {
  id: string;
  created_at: string;
  title: string;
  description: string;
  quantity: string;
  latitude: number;
  longitude: number;
  expiry_time: string;
  status: DonationStatus;
  donor_id: string;
  donor_name: string; // denormalized for client performance
  donor_phone?: string;
  recipient_id?: string | null;
  pickup_instructions?: string;
}

export interface DonationDraft {
  title: string;
  description: string;
  quantity: string;
  latitude: number;
  longitude: number;
  expiry_time: string;
  pickup_instructions?: string;
}

export type Language = 'pt' | 'en' | 'es' | 'fr';

export interface FilterState {
  status: 'ALL' | 'AVAILABLE' | 'RESERVED';
  searchQuery: string;
}
