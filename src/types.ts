export type LocationAccuracy = 'land' | 'stad' | 'exact';

export type StudentStatus = 'Bezig op stage met activiteiten' | 'Vrije tijd' | 'Slapen' | 'Onderweg' | 'Thuis' | 'Meldingen (Calamiteit)' | 'Noodgeval' | 'Veilig aangekomen';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  locationAccuracy: LocationAccuracy;
  status: StudentStatus;
  lastMessage: string;
  lastUpdate: string; // ISO string
  consentGiven: boolean;
  hasActiveEmergency: boolean;
  emergencyMessage?: string;
  hostOrganization: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  // Vraag 2: Veiligheid & Sfeer op stage/verblijf
  isSafeEnv?: boolean;
  safeEnvDetails?: string;
  // Vraag 3: Behoefte aan contact of extra CIOS-begeleiding
  needsSupport?: boolean;
  supportDetails?: string;
  // BPV Reisperiode planning
  departureDate?: string;
  returnDate?: string;
  // Stagebegeleider contactgegevens
  supervisorName?: string;
  supervisorPhone?: string;
  supervisorEmail?: string;
  // Foto's geüpload door studenten vanaf mobiel
  uploadedPhotos?: string[];
  // Actieve Google Meet vergadering URL
  googleMeetUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  targetStudent: string;
}
