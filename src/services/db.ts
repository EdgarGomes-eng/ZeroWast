import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Donation, DonationDraft, Profile, UserRole, DonationStatus } from '../types';

// Detect if Supabase keys are setup with clean TS bypass
const VITE_SUPABASE_URL = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || '';
const VITE_SUPABASE_ANON_KEY = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || '';

let supabaseClient: SupabaseClient | null = null;

if (VITE_SUPABASE_URL && VITE_SUPABASE_ANON_KEY) {
  try {
    supabaseClient = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
    console.log('ZeroWaste Connect: Supabase client initialized and connected successfully.');
  } catch (err) {
    console.error('ZeroWaste Connect: Failed to initialize Supabase client:', err);
  }
}

// Predefined Demo Profiles representing typical actors
export const DEMO_PROFILES: Profile[] = [
  {
    id: 'donor-1',
    name: 'Restaurante Sabor Verde',
    email: 'contacto@saborverde.pt',
    role: 'DONOR',
    phone: '+351 912 345 678',
    address: 'Av. da Liberdade 120, Lisboa',
    avatar_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=120&auto=format&fit=crop'
  },
  {
    id: 'donor-2',
    name: 'Padaria Espiga de Ouro',
    email: 'geral@espigadeouro.pt',
    role: 'DONOR',
    phone: '+351 923 456 789',
    address: 'Rua Garrett 42, Chiado, Lisboa',
    avatar_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=120&auto=format&fit=crop'
  },
  {
    id: 'recipient-1',
    name: 'Associação Abrigo Esperança (João Silva)',
    email: 'apoio@abrigoesperanca.org',
    role: 'RECIPIENT',
    phone: '+351 961 112 233',
    address: 'Rua de São Bento 18, Lisboa',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop'
  },
  {
    id: 'recipient-2',
    name: 'Catarina Mendes (Família Voluntária)',
    email: 'catarina.m@gmail.com',
    role: 'RECIPIENT',
    phone: '+351 934 987 654',
    address: 'Largo do Rato 4, Lisboa',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=120&auto=format&fit=crop'
  }
];

// Initial preseeded Mock Donations
const DEFAULT_DONATIONS: Donation[] = [
  {
    id: 'donation-1',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    title: 'Sopa de Legumes e Pães Rústicos',
    description: 'Sopa cremosa de legumes da época (quente e preservada em recipientes térmicos) acompanhada de 12 pães rústicos do dia.',
    quantity: '15 doses individuais',
    latitude: 38.7272,
    longitude: -9.1465,
    expiry_time: new Date(Date.now() + 3600000 * 2).toISOString(), // expires in 2 hours
    status: 'AVAILABLE',
    donor_id: 'donor-1',
    donor_name: 'Restaurante Sabor Verde',
    donor_phone: '+351 912 345 678',
    recipient_id: null,
    pickup_instructions: 'Levantar na porta de serviço lateral das 19:30 às 20:30. Trazer recipientes se possível.'
  },
  {
    id: 'donation-2',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    title: 'Cesta de Croissants e Sanduíches Variadas',
    description: 'Excesso de vitrine de padaria artesanal. Croissants folhados simples, chocolate, e sanduíches de fiambre/queijo preparadas esta manhã.',
    quantity: '25 itens variados',
    latitude: 38.7112,
    longitude: -9.1420,
    expiry_time: new Date(Date.now() + 3600000 * 4).toISOString(), // expires in 4 hours
    status: 'AVAILABLE',
    donor_id: 'donor-2',
    donor_name: 'Padaria Espiga de Ouro',
    donor_phone: '+351 923 456 789',
    recipient_id: null,
    pickup_instructions: 'Pedir por André no balcão principal. Indicar que vem da plataforma ZeroWaste.'
  },
  {
    id: 'donation-3',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
    title: 'Arroz de Pato e Saladas Saudáveis',
    description: 'Catering Premium com excesso de doses individuais prontas, mantidas sob refrigeração certificada. Extremamente nutritivo.',
    quantity: '8 marmitas completas',
    latitude: 38.7335,
    longitude: -9.1380,
    expiry_time: new Date(Date.now() + 3600000 * 1).toISOString(), // expires in 1 hour
    status: 'RESERVED',
    donor_id: 'donor-1',
    donor_name: 'Restaurante Sabor Verde',
    donor_phone: '+351 912 345 678',
    recipient_id: 'recipient-1',
    pickup_instructions: 'Código de levantamento: RW982. Dirigir-se ao guiché de entrega das refeições rápidas.'
  },
  {
    id: 'donation-4',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    title: 'Frutas Frescas e Polpas Orgânicas',
    description: 'Bananas, maçãs e kiwis excedentes ideais para consumo imediato ou sumos de fruta. Maduras e sem imperfeições graves.',
    quantity: '5 kg de frutas mistas',
    latitude: 38.7180,
    longitude: -9.1350,
    expiry_time: new Date(Date.now() + 3600000 * 6).toISOString(),
    status: 'AVAILABLE',
    donor_id: 'donor-2',
    donor_name: 'Padaria Espiga de Ouro',
    donor_phone: '+351 923 456 789',
    recipient_id: null,
    pickup_instructions: 'Levantar na zona de cargas traseira da loja.'
  }
];

// Initialize LocalStorage Database if empty
const LOCAL_STORAGE_KEY = 'zerowaste_donations_db';
if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_DONATIONS));
}

export const isSupabaseConfigured = (): boolean => {
  return supabaseClient !== null;
};

// --- DATA ACCESS LAYER FUNCTIONS ---

export async function fetchDonations(): Promise<Donation[]> {
  if (supabaseClient) {
    try {
      // Fetch from Supabase (including donor profiles)
      const { data, error } = await supabaseClient
        .from('donations')
        .select(`
          *,
          donor:profiles!donations_donor_id_fkey(name, phone)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((item: any) => ({
        id: item.id,
        created_at: item.created_at,
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        latitude: item.latitude,
        longitude: item.longitude,
        expiry_time: item.expiry_time,
        status: item.status as DonationStatus,
        donor_id: item.donor_id,
        donor_name: item.donor?.name || 'Restaurante Doador',
        donor_phone: item.donor?.phone || '',
        recipient_id: item.recipient_id,
        pickup_instructions: item.pickup_instructions
      }));
    } catch (err) {
      console.error('Failed to fetch from Supabase, falling back to LocalStorage:', err);
    }
  }

  // Fallback to LocalStorage
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function insertDonation(donation: DonationDraft, activeProfile: Profile): Promise<Donation> {
  const newDonation: Donation = {
    ...donation,
    id: 'donation-' + Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
    status: 'AVAILABLE',
    recipient_id: null,
    donor_id: activeProfile.id,
    donor_name: activeProfile.name,
    donor_phone: activeProfile.phone || ''
  };

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('donations')
        .insert({
          title: donation.title,
          description: donation.description,
          quantity: donation.quantity,
          latitude: donation.latitude,
          longitude: donation.longitude,
          expiry_time: donation.expiry_time,
          status: 'AVAILABLE',
          donor_id: activeProfile.id,
          pickup_instructions: donation.pickup_instructions
        })
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        return {
          id: data.id,
          created_at: data.created_at,
          title: data.title,
          description: data.description,
          quantity: data.quantity,
          latitude: data.latitude,
          longitude: data.longitude,
          expiry_time: data.expiry_time,
          status: data.status as DonationStatus,
          donor_id: data.donor_id,
          donor_name: activeProfile.name,
          donor_phone: activeProfile.phone || '',
          pickup_instructions: data.pickup_instructions,
          recipient_id: null
        };
      }
    } catch (err) {
      console.error('Failed to insert into Supabase, writing to LocalStorage instead:', err);
    }
  }

  // LocalStorage insert
  const donations = await fetchDonations();
  donations.unshift(newDonation);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(donations));
  return newDonation;
}

export async function updateDonationStatus(donationId: string, status: DonationStatus, recipientId: string | null): Promise<boolean> {
  if (supabaseClient) {
    try {
      const { error } = await supabaseClient
        .from('donations')
        .update({
          status: status,
          recipient_id: recipientId
        })
        .eq('id', donationId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to update Supabase donation status, applying local fallback:', err);
    }
  }

  // LocalStorage update
  const donations = await fetchDonations();
  const index = donations.findIndex(d => d.id === donationId);
  if (index !== -1) {
    donations[index].status = status;
    donations[index].recipient_id = recipientId;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(donations));
    return true;
  }
  return false;
}

export async function resetLocalStorageDatabase(): Promise<void> {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_DONATIONS));
}
