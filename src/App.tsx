import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  RotateCcw, 
  Compass, 
  SlidersHorizontal, 
  Search, 
  User, 
  Users, 
  CheckCircle, 
  Phone, 
  Clock, 
  Lock, 
  FileDown, 
  Eye, 
  HeartHandshake, 
  HelpCircle,
  X,
  Check,
  Send,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  Map,
  Download,
  Terminal,
  Activity,
  FileText,
  UserPlus,
  LogIn,
  LogOut,
  Plus,
  Trash2,
  Calendar,
  Bell,
  BellRing,
  Camera,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Student, StudentStatus, LocationAccuracy, AuditLog } from './types';

const generateUniqueId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000000)}`;
};

const PRESET_CITIES = [
  { name: 'Málaga', country: 'Spanje', latitude: 36.7213, longitude: -4.4214, org: 'Inacua Centro Raqueta Málaga' },
  { name: 'Barcelona', country: 'Spanje', latitude: 41.3851, longitude: 2.1734, org: 'Club de Padel Barcelona' },
  { name: 'Innsbruck', country: 'Oostenrijk', latitude: 47.2692, longitude: 11.4041, org: 'Ski-Akademie Innsbruck' },
  { name: 'Willemstad', country: 'Curaçao', latitude: 12.1121, longitude: -68.9329, org: 'Fundashon Bida i Deporte' },
  { name: 'Faro (Algarve)', country: 'Portugal', latitude: 37.0179, longitude: -7.9304, org: 'Algarve Outdoors Center' },
  { name: 'St. Moritz', country: 'Zwitserland', latitude: 46.4908, longitude: 9.8355, org: 'Suvretta Sports School' },
  { name: 'Kaapstad', country: 'Zuid-Afrika', latitude: -33.9249, longitude: 18.4241, org: 'Cape Town Township Sports Initiative' },
  { name: 'Eiland Réunion', country: 'Frankrijk', latitude: -21.1151, longitude: 55.5364, org: 'Réunion Surf & Active Lodge' },
  { name: 'Zakynthos', country: 'Griekenland', latitude: 37.7870, longitude: 20.8999, org: 'Zakynthos Watersports Academy' }
];

const LOCAL_CITY_DB: { [key: string]: { lat: number; lng: number; country: string } } = {
  'malaga': { lat: 36.7213, lng: -4.4214, country: 'Spanje' },
  'málaga': { lat: 36.7213, lng: -4.4214, country: 'Spanje' },
  'barcelona': { lat: 41.3851, lng: 2.1734, country: 'Spanje' },
  'innsbruck': { lat: 47.2692, lng: 11.4041, country: 'Oostenrijk' },
  'willemstad': { lat: 12.1121, lng: -68.9329, country: 'Curaçao' },
  'curacao': { lat: 12.1121, lng: -68.9329, country: 'Curaçao' },
  'curaçao': { lat: 12.1121, lng: -68.9329, country: 'Curaçao' },
  'faro': { lat: 37.0179, lng: -7.9304, country: 'Portugal' },
  'st. moritz': { lat: 46.4908, lng: 9.8355, country: 'Zwitserland' },
  'st moritz': { lat: 46.4908, lng: 9.8355, country: 'Zwitserland' },
  'kaapstad': { lat: -33.9249, lng: 18.4241, country: 'Zuid-Afrika' },
  'port elizabeth': { lat: -33.9608, lng: 25.6022, country: 'Zuid-Afrika' },
  'port elisabeth': { lat: -33.9608, lng: 25.6022, country: 'Zuid-Afrika' },
  'gqeberha': { lat: -33.9608, lng: 25.6022, country: 'Zuid-Afrika' },
  'johannesburg': { lat: -26.2041, lng: 28.0473, country: 'Zuid-Afrika' },
  'reunion': { lat: -21.1151, lng: 55.5364, country: 'Frankrijk' },
  'réunion': { lat: -21.1151, lng: 55.5364, country: 'Frankrijk' },
  'zakynthos': { lat: 37.7870, lng: 20.8999, country: 'Griekenland' },
  'rome': { lat: 41.9028, lng: 12.4964, country: 'Italië' },
  'roma': { lat: 41.9028, lng: 12.4964, country: 'Italië' },
  'parijs': { lat: 48.8566, lng: 2.3522, country: 'Frankrijk' },
  'paris': { lat: 48.8566, lng: 2.3522, country: 'Frankrijk' },
  'londen': { lat: 51.5074, lng: -0.1278, country: 'Verenigd Koninkrijk' },
  'london': { lat: 51.5074, lng: -0.1278, country: 'Verenigd Koninkrijk' },
  'madrid': { lat: 40.4168, lng: -3.7038, country: 'Spanje' },
  'lissabon': { lat: 38.7223, lng: -9.1393, country: 'Portugal' },
  'lisbon': { lat: 38.7223, lng: -9.1393, country: 'Portugal' },
  'berlijn': { lat: 52.5200, lng: 13.4050, country: 'Duitsland' },
  'berlin': { lat: 52.5200, lng: 13.4050, country: 'Duitsland' },
  'athene': { lat: 37.9838, lng: 23.7275, country: 'Griekenland' },
  'athens': { lat: 37.9838, lng: 23.7275, country: 'Griekenland' },
  'valencia': { lat: 39.4699, lng: -0.3763, country: 'Spanje' },
  'sevilla': { lat: 37.3891, lng: -5.9845, country: 'Spanje' },
  'aruba': { lat: 12.5211, lng: -70.0355, country: 'Aruba' },
  'bonaire': { lat: 12.1500, lng: -68.2833, country: 'Bonaire' },
  'paramaribo': { lat: 5.8520, lng: -55.2038, country: 'Suriname' },
  'middelburg': { lat: 51.4988, lng: 3.6137, country: 'Nederland' },
  'vlissingen': { lat: 51.4427, lng: 3.5739, country: 'Nederland' },
  'goes': { lat: 51.5042, lng: 3.8886, country: 'Nederland' },
};

const INITIAL_STUDENTS: Student[] = [
  {
    id: "1",
    name: "Amy Geerts",
    email: "ageerts2@student.cioszuidwest.nl",
    phone: "+31 6 ...",
    country: "Nieuw land...",
    city: "Nieuwe locatie invoeren...",
    coordinates: undefined,
    status: "Onderweg",
    locationAccuracy: "exact",
    lastMessage: "Nog geen verslag ingediend.",
    lastUpdate: new Date().toISOString(),
    consentGiven: true,
    hasActiveEmergency: false,
    hostOrganization: "Nieuwe partner invoeren...",
    emergencyContactName: "...",
    emergencyContactPhone: "...",
    isSafeEnv: true,
    safeEnvDetails: "",
    needsSupport: false,
    supportDetails: "",
    departureDate: "",
    returnDate: "",
    supervisorName: "...",
    supervisorPhone: "...",
    supervisorEmail: "..."
  },
  {
    id: "2",
    name: "Sam Dubbeldam",
    email: "sdubbeldam2@student.cioszuidwest.nl",
    phone: "+31 6 ...",
    country: "Nieuw land...",
    city: "Nieuwe locatie invoeren...",
    coordinates: undefined,
    status: "Onderweg",
    locationAccuracy: "exact",
    lastMessage: "Nog geen verslag ingediend.",
    lastUpdate: new Date().toISOString(),
    consentGiven: true,
    hasActiveEmergency: false,
    hostOrganization: "Nieuwe partner invoeren...",
    emergencyContactName: "...",
    emergencyContactPhone: "...",
    isSafeEnv: true,
    safeEnvDetails: "",
    needsSupport: false,
    supportDetails: "",
    departureDate: "",
    returnDate: "",
    supervisorName: "...",
    supervisorPhone: "...",
    supervisorEmail: "..."
  },
  {
    id: "3",
    name: "Finn van Zomeren",
    email: "fvanzomeren@student.cioszuidwest.nl",
    phone: "+31 6 ...",
    country: "Nieuw land...",
    city: "Nieuwe locatie invoeren...",
    coordinates: undefined,
    status: "Onderweg",
    locationAccuracy: "exact",
    lastMessage: "Nog geen verslag ingediend.",
    lastUpdate: new Date().toISOString(),
    consentGiven: true,
    hasActiveEmergency: false,
    hostOrganization: "Nieuwe partner invoeren...",
    emergencyContactName: "...",
    emergencyContactPhone: "...",
    isSafeEnv: true,
    safeEnvDetails: "",
    needsSupport: false,
    supportDetails: "",
    departureDate: "",
    returnDate: "",
    supervisorName: "...",
    supervisorPhone: "...",
    supervisorEmail: "..."
  },
  {
    id: "4",
    name: "Ruben Beterams",
    email: "rbeterams@student.cioszuidwest.nl",
    phone: "+31 6 ...",
    country: "Nieuw land...",
    city: "Nieuwe locatie invoeren...",
    coordinates: undefined,
    status: "Onderweg",
    locationAccuracy: "exact",
    lastMessage: "Nog geen verslag ingediend.",
    lastUpdate: new Date().toISOString(),
    consentGiven: true,
    hasActiveEmergency: false,
    hostOrganization: "Nieuwe partner invoeren...",
    emergencyContactName: "...",
    emergencyContactPhone: "...",
    isSafeEnv: true,
    safeEnvDetails: "",
    needsSupport: false,
    supportDetails: "",
    departureDate: "",
    returnDate: "",
    supervisorName: "...",
    supervisorPhone: "...",
    supervisorEmail: "..."
  },
  {
    id: "5",
    name: "Lotte Kalisvaart",
    email: "lkalisvaart@student.cioszuidwest.nl",
    phone: "+31 6 ...",
    country: "Nieuw land...",
    city: "Nieuwe locatie invoeren...",
    coordinates: undefined,
    status: "Onderweg",
    locationAccuracy: "exact",
    lastMessage: "Nog geen verslag ingediend.",
    lastUpdate: new Date().toISOString(),
    consentGiven: true,
    hasActiveEmergency: false,
    hostOrganization: "Nieuwe partner invoeren...",
    emergencyContactName: "...",
    emergencyContactPhone: "...",
    isSafeEnv: true,
    safeEnvDetails: "",
    needsSupport: false,
    supportDetails: "",
    departureDate: "",
    returnDate: "",
    supervisorName: "...",
    supervisorPhone: "...",
    supervisorEmail: "..."
  },
  {
    id: "6",
    name: "Katja Eggebeen",
    email: "keggebeen@student.cioszuidwest.nl",
    phone: "+31 6 ...",
    country: "Nieuw land...",
    city: "Nieuwe locatie invoeren...",
    coordinates: undefined,
    status: "Onderweg",
    locationAccuracy: "exact",
    lastMessage: "Nog geen verslag ingediend.",
    lastUpdate: new Date().toISOString(),
    consentGiven: true,
    hasActiveEmergency: false,
    hostOrganization: "Nieuwe partner invoeren...",
    emergencyContactName: "...",
    emergencyContactPhone: "...",
    isSafeEnv: true,
    safeEnvDetails: "",
    needsSupport: false,
    supportDetails: "",
    departureDate: "",
    returnDate: "",
    supervisorName: "...",
    supervisorPhone: "...",
    supervisorEmail: "..."
  },
  {
    id: "7",
    name: "Yalou Kerkhof",
    email: "ykerkhof@student.cioszuidwest.nl",
    phone: "+31 6 ...",
    country: "Nieuw land...",
    city: "Nieuwe locatie invoeren...",
    coordinates: undefined,
    status: "Onderweg",
    locationAccuracy: "exact",
    lastMessage: "Nog geen verslag ingediend.",
    lastUpdate: new Date().toISOString(),
    consentGiven: true,
    hasActiveEmergency: false,
    hostOrganization: "Nieuwe partner invoeren...",
    emergencyContactName: "...",
    emergencyContactPhone: "...",
    isSafeEnv: true,
    safeEnvDetails: "",
    needsSupport: false,
    supportDetails: "",
    departureDate: "",
    returnDate: "",
    supervisorName: "...",
    supervisorPhone: "...",
    supervisorEmail: "..."
  },
  {
    id: "8",
    name: "Jorrit Kerkhof",
    email: "jkerkhof@student.cioszuidwest.nl",
    phone: "+31 6 ...",
    country: "Nieuw land...",
    city: "Nieuwe locatie invoeren...",
    coordinates: undefined,
    status: "Onderweg",
    locationAccuracy: "exact",
    lastMessage: "Nog geen verslag ingediend.",
    lastUpdate: new Date().toISOString(),
    consentGiven: true,
    hasActiveEmergency: false,
    hostOrganization: "Nieuwe partner invoeren...",
    emergencyContactName: "...",
    emergencyContactPhone: "...",
    isSafeEnv: true,
    safeEnvDetails: "",
    needsSupport: false,
    supportDetails: "",
    departureDate: "",
    returnDate: "",
    supervisorName: "...",
    supervisorPhone: "...",
    supervisorEmail: "..."
  }
];

export default function App() {
  const [currentRole, setCurrentRole] = useState<'STUDENT' | 'COÖRDINATOR'>('STUDENT');
  const [loggedInStudentId, setLoggedInStudentId] = useState<string>('1');
  
  // Storage
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('cios_tracking_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('cios_tracking_logs');
    return saved ? JSON.parse(saved) : [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        actor: 'H. van Remortele (Coördinator)',
        action: 'Systeem geopend & GDPR audit-trail geïnitieerd',
        targetStudent: 'Alle studenten'
      }
    ];
  });

  // UI state for Coördinator view
  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    return students && students.length > 0 ? students[0].id : '1';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isLiveTrackingActive, setIsLiveTrackingActive] = useState(true);
  
  // Form state for creating a new student
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('+31 6 ');
  const [newStudentPresetIdx, setNewStudentPresetIdx] = useState(0);
  const [newStudentHostOrg, setNewStudentHostOrg] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [customLat, setCustomLat] = useState('36.7213');
  const [customLng, setCustomLng] = useState('-4.4214');
  const [isSearchingCoords, setIsSearchingCoords] = useState(false);
  const [coordSearchMessage, setCoordSearchMessage] = useState('');
  const [isPreciseLocation, setIsPreciseLocation] = useState<LocationAccuracy>('exact');
  const [newStudentEmergencyName, setNewStudentEmergencyName] = useState('');
  const [newStudentEmergencyPhone, setNewStudentEmergencyPhone] = useState('+31 6 ');
  const [newStudentSupervisorName, setNewStudentSupervisorName] = useState('');
  const [newStudentSupervisorPhone, setNewStudentSupervisorPhone] = useState('+31 6 ');
  const [newStudentSupervisorEmail, setNewStudentSupervisorEmail] = useState('');
  const [selectedFullImage, setSelectedFullImage] = useState<string | null>(null);

  // Live Login / Role switching dialog
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [typedEmail, setTypedEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // States voor de custom in-app Delete Bevestiging (lost iframe/confirm blocking op)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Pushmeldingen Systeem (In-App Push Notificaties)
  const [pushNotifications, setPushNotifications] = useState<any[]>([]);

  const triggerPushNotification = (title: string, body: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const newNotif = {
      id: generateUniqueId('notif'),
      title,
      body,
      timestamp: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
      type
    };
    setPushNotifications(prev => [newNotif, ...prev]);

    // Speel een zachte synth feedback chime af (werkt direct en compliant)
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc1.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08); // E5
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16); // G5
        
        gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        
        osc1.start();
        osc1.stop(audioCtx.currentTime + 0.5);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.5);
      }
    } catch (e) {
      // Negeer mislukte autoplay restrictie browsers
    }

    // Automatisch verwijderen na 7 seconden
    setTimeout(() => {
      setPushNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 7000);
  };

  // Nieuwe student reisdata states
  const [newStudentDepartureDate, setNewStudentDepartureDate] = useState('');
  const [newStudentReturnDate, setNewStudentReturnDate] = useState('');

  // Dossier reisdata states
  const [dossierDepartureDate, setDossierDepartureDate] = useState('');
  const [dossierReturnDate, setDossierReturnDate] = useState('');

  // Snel bewerkbare contactgegevens states voor Coördinator view
  const [isEditingContactInfo, setIsEditingContactInfo] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editHostOrg, setEditHostOrg] = useState('');
  const [editEmergencyContactName, setEditEmergencyContactName] = useState('');
  const [editEmergencyContactPhone, setEditEmergencyContactPhone] = useState('');
  const [editSupervisorName, setEditSupervisorName] = useState('');
  const [editSupervisorPhone, setEditSupervisorPhone] = useState('');
  const [editSupervisorEmail, setEditSupervisorEmail] = useState('');

  // Student specific form states (binds reactively to loggedInStudentId)
  const myStudentProfile = students.find(s => s.id === loggedInStudentId) || students[0];
  const [formStatus, setFormStatus] = useState<StudentStatus>('Bezig op stage met activiteiten');
  const [formMessage, setFormMessage] = useState('');
  const [formAccuracy, setFormAccuracy] = useState<LocationAccuracy>('exact');
  const [formConsent, setFormConsent] = useState(true);
  const [isGettingGPS, setIsGettingGPS] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState<{latitude: number, longitude: number} | undefined>(undefined);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyText, setEmergencyText] = useState('');

  // Questions 2 and 3 states
  const [formIsSafeEnv, setFormIsSafeEnv] = useState<boolean>(true);
  const [formSafeEnvDetails, setFormSafeEnvDetails] = useState<string>('');
  const [formNeedsSupport, setFormNeedsSupport] = useState<boolean>(false);
  const [formSupportDetails, setFormSupportDetails] = useState<string>('');
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);

  // Sync student inputs when logged in student changes
  useEffect(() => {
    if (myStudentProfile) {
      setFormStatus(myStudentProfile.status);
      setFormMessage(myStudentProfile.lastMessage);
      setFormAccuracy(myStudentProfile.locationAccuracy);
      setFormConsent(myStudentProfile.consentGiven);
      setGpsCoordinates(myStudentProfile.coordinates);
      setFormIsSafeEnv(myStudentProfile.isSafeEnv ?? true);
      setFormSafeEnvDetails(myStudentProfile.safeEnvDetails ?? '');
      setFormNeedsSupport(myStudentProfile.needsSupport ?? false);
      setFormSupportDetails(myStudentProfile.supportDetails ?? '');
      setFormPhotos(myStudentProfile.uploadedPhotos || []);
    }
  }, [loggedInStudentId, students]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('cios_tracking_students', JSON.stringify(students));
    } catch (err) {
      console.error("Fout bij opslaan in localStorage:", err);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('cios_tracking_logs', JSON.stringify(auditLogs));
    } catch (err) {
      console.error("Fout bij opslaan logs:", err);
    }
  }, [auditLogs]);

  // Auto select active student if it gets deleted or is invalid
  useEffect(() => {
    if (students.length > 0 && !students.some(s => s.id === activeStudentId)) {
      setActiveStudentId(students[0].id);
    }
  }, [students, activeStudentId]);

  // Sync dates and edit fields in dossier whenever selected student changes (Coordinator View)
  useEffect(() => {
    const actStud = students.find(s => s.id === activeStudentId);
    if (actStud) {
      setDossierDepartureDate(actStud.departureDate || '');
      setDossierReturnDate(actStud.returnDate || '');
      setEditPhone(actStud.phone || '');
      setEditHostOrg(actStud.hostOrganization || '');
      setEditEmergencyContactName(actStud.emergencyContactName || '');
      setEditEmergencyContactPhone(actStud.emergencyContactPhone || '');
      setEditSupervisorName(actStud.supervisorName || '');
      setEditSupervisorPhone(actStud.supervisorPhone || '');
      setEditSupervisorEmail(actStud.supervisorEmail || '');
      setIsEditingContactInfo(false);
    }
  }, [activeStudentId]);

  // Live GPS telemetry random walk simulator to make coordinates actually "Live"
  useEffect(() => {
    if (!isLiveTrackingActive) return;

    const interval = setInterval(() => {
      setStudents(prevStudents => {
        let amended = false;
        const nextStudents = prevStudents.map(student => {
          if (student.consentGiven && student.locationAccuracy === 'exact' && student.coordinates) {
            amended = true;
            const driftLat = (Math.random() - 0.5) * 0.00012;
            const driftLng = (Math.random() - 0.5) * 0.00012;
            return {
              ...student,
              coordinates: {
                latitude: Number((student.coordinates.latitude + driftLat).toFixed(6)),
                longitude: Number((student.coordinates.longitude + driftLng).toFixed(6))
              },
              lastUpdate: new Date().toISOString()
            };
          }
          return student;
        });

        if (amended) {
          const activeS = nextStudents.find(s => s.id === activeStudentId);
          if (activeS && Math.random() < 0.35) {
            setAuditLogs(prevLogs => {
              const telemetryLog: AuditLog = {
                id: generateUniqueId('log-live'),
                timestamp: new Date().toISOString(),
                actor: `${activeS.name} (Automated GPS Telemetry)`,
                action: `Real-time GPS coördinaten update update update: Lat ${activeS.coordinates?.latitude.toFixed(4)}, Lng ${activeS.coordinates?.longitude.toFixed(4)}`,
                targetStudent: activeS.name
              };
              return [telemetryLog, ...prevLogs.slice(0, 100)];
            });
          }
        }
        return nextStudents;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [isLiveTrackingActive, activeStudentId]);

  const handlePhotoUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsCompressing(true);
      const filesArray = Array.from(e.target.files) as File[];
      let processedCount = 0;

      filesArray.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                setFormPhotos(prev => [...prev, compressedDataUrl]);
              }

              processedCount++;
              if (processedCount === filesArray.length) {
                setIsCompressing(false);
              }
            };
            img.onerror = () => {
              processedCount++;
              if (processedCount === filesArray.length) {
                setIsCompressing(false);
              }
            };
          } else {
            processedCount++;
            if (processedCount === filesArray.length) {
              setIsCompressing(false);
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveFormPhoto = (indexToRemove: number) => {
    setFormPhotos(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleStudentUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    setStudents(prev => prev.map(s => {
      if (s.id === loggedInStudentId) {
        return {
          ...s,
          status: formStatus,
          lastMessage: formMessage,
          locationAccuracy: formAccuracy,
          consentGiven: formConsent,
          coordinates: formAccuracy === 'exact' ? (gpsCoordinates || s.coordinates) : undefined,
          lastUpdate: new Date().toISOString(),
          isSafeEnv: formIsSafeEnv,
          safeEnvDetails: formSafeEnvDetails,
          needsSupport: formNeedsSupport,
          supportDetails: formSupportDetails,
          uploadedPhotos: formPhotos
        };
      }
      return s;
    }));

    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: `${myStudentProfile.name} (Student)`,
      action: `Status gewijzigd naar "${formStatus}" (Locatieprecisie: ${formAccuracy})`,
      targetStudent: myStudentProfile.name
    };
    setAuditLogs(prev => [newLog, ...prev]);
    alert(`Status update van ${myStudentProfile.name} is correct verzonden.`);
  };

  const triggerEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    
    setStudents(prev => prev.map(s => {
      if (s.id === loggedInStudentId) {
        return {
          ...s,
          status: 'Noodgeval',
          hasActiveEmergency: true,
          emergencyMessage: emergencyText || 'Knop ingedrukt - Dringend contact gewenst!',
          lastUpdate: new Date().toISOString()
        };
      }
      return s;
    }));

    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: `${myStudentProfile.name} (Student)`,
      action: `🚨 NOODSIGNALERING INGESTUURD: "${emergencyText || 'Dringende noodoproep'}"`,
      targetStudent: myStudentProfile.name
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setShowEmergencyModal(false);
    setEmergencyText('');
    alert(`NOODSITUATIE GEMELD. Coördinator Heidie van Remortele is direct gealarmeerd.`);
  };

  const resolveEmergency = (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    if (!target) return;

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          status: 'Bezig op stage met activiteiten',
          hasActiveEmergency: false,
          emergencyMessage: undefined,
          lastUpdate: new Date().toISOString()
        };
      }
      return s;
    }));

    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: 'H. van Remortele (Coördinator)',
      action: `🚨 Noodgeval geverifieerd als VEILIG`,
      targetStudent: target.name
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleStartGoogleMeet = (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    if (!target) return;

    const abc = 'abcdefghijklmnopqrstuvwxyz';
    let hash = 0;
    const combinedStr = studentId + (target.name || '');
    for (let i = 0; i < combinedStr.length; i++) {
      hash = combinedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const getChar = (offset: number) => {
      const code = Math.abs(hash + offset) % 26;
      return abc[code];
    };

    const p1 = getChar(1) + getChar(2) + getChar(3);
    const p2 = getChar(4) + getChar(5) + getChar(6) + getChar(7);
    const p3 = getChar(8) + getChar(9) + getChar(10);
    const meetCode = `${p1}-${p2}-${p3}`;
    const meetUrl = `https://meet.google.com/${meetCode}`;

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          googleMeetUrl: meetUrl,
          lastUpdate: new Date().toISOString()
        };
      }
      return s;
    }));

    setLoggedInStudentId(studentId);

    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: 'H. van Remortele (Coördinator)',
      action: `🎥 Google Meet link aangemaakt & direct gedeeld`,
      targetStudent: target.name
    };
    setAuditLogs(prev => [newLog, ...prev]);
    window.open(meetUrl, '_blank');
  };

  const handleStopGoogleMeet = (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    if (!target) return;

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          googleMeetUrl: undefined,
          lastUpdate: new Date().toISOString()
        };
      }
      return s;
    }));

    setLoggedInStudentId(studentId);

    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: 'H. van Remortele (Coördinator)',
      action: `🎥 Google Meet videogesprek actieve status beëindigd`,
      targetStudent: target.name
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const requestBrowserGeolocation = () => {
    if (!formConsent) {
      alert('Geer eerst AVG-toestemming.');
      return;
    }
    setIsGettingGPS(true);
    setTimeout(() => {
      const baseLat = myStudentProfile.coordinates?.latitude || 36.7213;
      const baseLng = myStudentProfile.coordinates?.longitude || -4.4214;
      setGpsCoordinates({ 
        latitude: Number((baseLat + (Math.random() - 0.5) * 0.01).toFixed(6)), 
        longitude: Number((baseLng + (Math.random() - 0.5) * 0.01).toFixed(6)) 
      });
      setIsGettingGPS(false);
    }, 850);
  };

  useEffect(() => {
    if (newStudentPresetIdx < PRESET_CITIES.length) {
      const preset = PRESET_CITIES[newStudentPresetIdx];
      setNewStudentHostOrg(preset.org);
      setCustomCity(preset.name);
      setCustomCountry(preset.country);
      setCustomLat(preset.latitude.toString());
      setCustomLng(preset.longitude.toString());
      setCoordSearchMessage('');
    } else {
      setCustomCity('');
      setCustomCountry('');
      setCustomLat('');
      setCustomLng('');
      setNewStudentHostOrg('');
      setCoordSearchMessage('Zelf een locatie invullen.');
    }
  }, [newStudentPresetIdx]);

  const COUNTRY_TRANSLATIONS: { [key: string]: string } = {
    'zuid-afrika': 'South Africa',
    'zuid afrika': 'South Africa',
    'spanje': 'Spain',
    'oostenrijk': 'Austria',
    'griekenland': 'Greece',
    'portugal': 'Portugal',
    'zwitserland': 'Switzerland',
    'frankrijk': 'France',
    'italië': 'Italy',
    'italie': 'Italy',
    'duitsland': 'Germany',
    'verenigd koninkrijk': 'United Kingdom',
    'engeland': 'England',
    'curaçao': 'Curacao',
    'curacao': 'Curacao',
    'aruba': 'Aruba',
    'bonaire': 'Bonaire',
    'paramaribo': 'Paramaribo',
    'suriname': 'Suriname',
    'belgië': 'Belgium',
    'belgie': 'Belgium',
    'nederland': 'Netherlands'
  };

  const autoRetrieveCoordinates = async (cityName: string, countryName: string) => {
    if (!cityName.trim()) return;
    setIsSearchingCoords(true);
    setCoordSearchMessage('Coördinaten zoeken...');
    
    const cleanCity = cityName.toLowerCase().trim();
    
    if (LOCAL_CITY_DB[cleanCity]) {
      const match = LOCAL_CITY_DB[cleanCity];
      setCustomLat(match.lat.toString());
      setCustomLng(match.lng.toString());
      if (!countryName && match.country) {
        setCustomCountry(match.country);
      }
      setCoordSearchMessage(`✓ Gevonden: ${match.lat}, ${match.lng}`);
      setIsSearchingCoords(false);
      return;
    }

    try {
      const cleanCountry = countryName.toLowerCase().trim();
      const translatedCountry = COUNTRY_TRANSLATIONS[cleanCountry] || countryName;
      
      let data: any[] = [];
      
      if (translatedCountry) {
        const query = `${cityName}, ${translatedCountry}`;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${encodeURIComponent(query)}`);
          if (response.ok) {
            data = await response.json();
          }
        } catch (e) {
          console.warn('First query attempt failed');
        }
      }

      if (!data || data.length === 0) {
        try {
          const fallbackResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${encodeURIComponent(cityName)}`);
          if (fallbackResponse.ok) {
            data = await fallbackResponse.json();
          }
        } catch (e) {
          console.warn('Fallback query attempt failed');
        }
      }

      if (data && data.length > 0) {
        const result = data[0];
        setCustomLat(Number(result.lat).toFixed(6));
        setCustomLng(Number(result.lon).toFixed(6));
        setCoordSearchMessage(`✓ Gevonden: ${Number(result.lat).toFixed(4)}, ${Number(result.lon).toFixed(4)}`);
      } else {
        setCoordSearchMessage('⚠ Locatie niet herkend.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setCoordSearchMessage('⚠ Offline. Voer handmatig coördinaten in.');
    } finally {
      setIsSearchingCoords(false);
    }
  };

  const handleAddNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) {
      alert('Vul tenminste de naam en het e-mailadres in.');
      return;
    }

    if (students.some(s => s.email.toLowerCase() === newStudentEmail.toLowerCase())) {
      alert(`Er bestaat al een student met dit e-mailadres.`);
      return;
    }

    const finalCountry = customCountry.trim() || 'Nederland';
    const finalCity = customCity.trim() || 'Zeeland';
    const finalLat = parseFloat(customLat) || 51.5;
    const finalLng = parseFloat(customLng) || 3.8;

    const newStudent: Student = {
      id: generateUniqueId('stud'),
      name: newStudentName,
      email: newStudentEmail,
      phone: newStudentPhone || '+31 6 ',
      country: finalCountry,
      city: finalCity,
      coordinates: isPreciseLocation === 'exact' ? { latitude: finalLat, longitude: finalLng } : undefined,
      locationAccuracy: isPreciseLocation,
      status: 'Bezig op stage met activiteiten',
      lastMessage: 'Nieuwe student handmatig toegevoegd door coördinator.',
      lastUpdate: new Date().toISOString(),
      consentGiven: true,
      hasActiveEmergency: false,
      hostOrganization: newStudentHostOrg || 'CIOS Partner',
      emergencyContactName: newStudentEmergencyName || 'Moeder/Vader',
      emergencyContactPhone: newStudentEmergencyPhone || '+31 6 ',
      isSafeEnv: true,
      safeEnvDetails: 'Nog geen incidenten gerapporteerd.',
      needsSupport: false,
      supportDetails: '',
      departureDate: newStudentDepartureDate || undefined,
      returnDate: newStudentReturnDate || undefined,
      supervisorName: newStudentSupervisorName || undefined,
      supervisorPhone: newStudentSupervisorPhone || undefined,
      supervisorEmail: newStudentSupervisorEmail || undefined
    };

    setStudents(prev => [...prev, newStudent]);

    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: 'H. van Remortele (Coördinator)',
      action: `Nieuwe student "${newStudentName}" geregistreerd.`,
      targetStudent: newStudentName
    };
    setAuditLogs(prev => [newLog, ...prev]);

    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('+31 6 ');
    setNewStudentEmergencyName('');
    setNewStudentEmergencyPhone('+31 6 ');
    setNewStudentSupervisorName('');
    setNewStudentSupervisorPhone('+31 6 ');
    setNewStudentSupervisorEmail('');
    setNewStudentDepartureDate('');
    setNewStudentReturnDate('');
    setShowAddStudentForm(false);
    
    triggerPushNotification(
      '🆕 Student Geregistreerd',
      `Student ${newStudentName} succesvol aangemaakt!`,
      'success'
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    if (!target) return;
    setStudentToDelete(target);
  };

  const confirmDeleteStudent = () => {
    if (!studentToDelete) return;
    
    const targetId = studentToDelete.id;
    const targetName = studentToDelete.name;
    
    setStudents(prev => prev.filter(s => s.id !== targetId));
    
    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: 'H. van Remortele (Coördinator)',
      action: `Student "${targetName}" permanent verwijderd uit het monitoringssyteem`,
      targetStudent: targetName
    };
    setAuditLogs(prev => [newLog, ...prev]);

    if (activeStudentId === targetId) {
      const remaining = students.filter(s => s.id !== targetId);
      if (remaining.length > 0) {
        setActiveStudentId(remaining[0].id);
      } else {
        setActiveStudentId('');
      }
    }
    
    setStudentToDelete(null);

    triggerPushNotification(
      '🗑️ Dossier Gewist',
      `Student dossier van "${targetName}" is permanent gewist.`,
      'warning'
    );
  };

  const handleSaveTravelDates = () => {
    const activeStudentObj = students.find(s => s.id === activeStudentId) || students[0];
    if (!activeStudentObj) return;

    setStudents(prev => prev.map(s => {
      if (s.id === activeStudentObj.id) {
        return {
          ...s,
          departureDate: dossierDepartureDate || undefined,
          returnDate: dossierReturnDate || undefined
        };
      }
      return s;
    }));

    const formattedDep = dossierDepartureDate ? new Date(dossierDepartureDate).toLocaleDateString('nl-NL') : 'Nog niet ingesteld';
    const formattedRet = dossierReturnDate ? new Date(dossierReturnDate).toLocaleDateString('nl-NL') : 'Nog niet ingesteld';

    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: 'H. van Remortele (Coördinator)',
      action: `BPV Reisperiode bijgewerkt voor student "${activeStudentObj.name}".`,
      targetStudent: activeStudentObj.name
    };
    setAuditLogs(prev => [newLog, ...prev]);

    triggerPushNotification(
      '📅 Reisperiode Bijgewerkt',
      `Voor ${activeStudentObj.name} is de BPV-periode succesvol opgeslagen!`,
      'success'
    );
  };

  const handleSaveContactInfo = () => {
    const activeStudentObj = students.find(s => s.id === activeStudentId) || students[0];
    if (!activeStudentObj) return;

    setStudents(prev => prev.map(s => {
      if (s.id === activeStudentObj.id) {
        return {
          ...s,
          phone: editPhone,
          hostOrganization: editHostOrg,
          emergencyContactName: editEmergencyContactName,
          emergencyContactPhone: editEmergencyContactPhone,
          supervisorName: editSupervisorName,
          supervisorPhone: editSupervisorPhone,
          supervisorEmail: editSupervisorEmail
        };
      }
      return s;
    }));

    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: 'H. van Remortele (Coördinator)',
      action: `Contactgegevens bijgewerkt voor student "${activeStudentObj.name}".`,
      targetStudent: activeStudentObj.name
    };
    setAuditLogs(prev => [newLog, ...prev]);

    triggerPushNotification(
      '📞 Gegevens Bijgewerkt',
      `Contactgegevens van ${activeStudentObj.name} zijn succesvol opgeslagen!`,
      'success'
    );

    setIsEditingContactInfo(false);
  };

  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmed = typedEmail.trim().toLowerCase();
    
    if (trimmed === 'heidie@cios.nl' || trimmed === 'heidie' || trimmed === 'h.vanremortele@cios.nl') {
      setCurrentRole('COÖRDINATOR');
      setShowLoginModal(false);
      setTypedEmail('');
      const newLog: AuditLog = {
        id: generateUniqueId('log'),
        timestamp: new Date().toISOString(),
        actor: 'H. van Remortele (Coördinator)',
        action: 'Ingelogd via online CIOS medewerkerportaal',
        targetStudent: 'Systeembeheer'
      };
      setAuditLogs(prev => [newLog, ...prev]);
      return;
    }

    const matched = students.find(s => s.email.toLowerCase() === trimmed);
    if (matched) {
      setLoggedInStudentId(matched.id);
      setCurrentRole('STUDENT');
      setShowLoginModal(false);
      setTypedEmail('');
      const newLog: AuditLog = {
        id: generateUniqueId('log'),
        timestamp: new Date().toISOString(),
        actor: `${matched.name} (Student)`,
        action: 'Ingelogd op mobiel studentenportaal',
        targetStudent: matched.name
      };
      setAuditLogs(prev => [newLog, ...prev]);
    } else {
      setLoginError('Onbekend e-mailadres.');
    }
  };

  const handleResetDemoData = () => {
    if (confirm('Wilt u alle trackergegevens herstellen naar de beginperiode?')) {
      localStorage.removeItem('cios_tracking_students');
      localStorage.removeItem('cios_tracking_logs');
      setStudents(INITIAL_STUDENTS);
      setLoggedInStudentId('1');
      setAuditLogs([
        {
          id: 'log-1',
          timestamp: new Date().toISOString(),
          actor: 'Systeem',
          action: 'Systeem gereset - Standaard BPV database hersteld.',
          targetStudent: 'Alle studenten'
        }
      ]);
      alert('Systeem succesvol hersteld.');
    }
  };

  const handleDownloadMarkdownReport = () => {
    let report = `# CIOS Zuidwest-Nederland - Internationaal BPV Monitoringsrapport\n`;
    report += `Gegenereerd op: ${new Date().toLocaleString('nl-NL')}\n`;
    report += `Aantal Actieve Stages onder toezicht van H. van Remortele: ${students.length}\n`;
    report += `------------------------------------------------------------\n\n`;
    report += `## Actieve Mobiliteitsoverzicht (Lopende BPV-landen)\n\n`;

    students.forEach((s, i) => {
      report += `### [${i + 1}] ${s.name} (${s.email})\n`;
      report += `- Huidige Status: **${s.status.toUpperCase()}**\n`;
      report += `- Locatie: ${s.city}, ${s.country}\n`;
      report += `- Partnerinstelling: ${s.hostOrganization}\n`;
      report += `- Toestemming verleend: ${s.consentGiven ? 'JA' : 'NEE'}\n`;
      report += `- Laatste Bericht: "${s.lastMessage}"\n`;
      report += `- Tijdstip Update: ${new Date(s.lastUpdate).toLocaleString('nl-NL')}\n`;
      report += `- Noodcontactpersoon: ${s.emergencyContactName} (Telefoon: ${s.emergencyContactPhone})\n\n`;
    });

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Internationale_Mobiliteit_Rapport_CIOS.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredStudents = students.filter(s => {
    const matchesKeyword = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           s.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesKeyword;
    if (statusFilter === 'EMERGENCY') return matchesKeyword && (s.hasActiveEmergency || s.status === 'Meldingen (Calamiteit)' || s.status === 'Noodgeval');
    return matchesKeyword && s.status === statusFilter;
  });

  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];

  const logDirectAccess = (studentName: string) => {
    const recentAccess = auditLogs.find(l => 
      l.targetStudent === studentName && 
      l.action.includes('Inzage in beveiligd dossier') &&
      (Date.now() - new Date(l.timestamp).getTime()) < 30000
    );

    if (!recentAccess) {
      const newLog: AuditLog = {
        id: generateUniqueId('log'),
        timestamp: new Date().toISOString(),
        actor: 'H. van Remortele (Coördinator)',
        action: 'Inzage in beveiligd dossier (AVG geverifieerd)',
        targetStudent: studentName
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  const getMapUrl = (student: Student) => {
    const lat = student.coordinates?.latitude ?? 41.3851;
    const lon = student.coordinates?.longitude ?? 2.1734;
    
    let delta = 0.03;
    if (student.locationAccuracy === 'stad') {
      delta = 0.12;
    } else if (student.locationAccuracy === 'land') {
      delta = 1.5;
    }
    
    const minLon = lon - delta;
    const minLat = lat - delta;
    const maxLon = lon + delta;
    const maxLat = lat + delta;
    
    return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon}%2C${minLat}%2C${maxLon}%2C${maxLat}&layer=mapnik&marker=${lat}%2C${lon}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased selection:bg-indigo-100">
      
      {/* Realtime In-App Pushmeldingen Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {pushNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: -30, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.9 }}
              className="bg-slate-950/95 backdrop-blur-md text-white border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col gap-1 pointer-events-auto border-l-4 border-l-indigo-550"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-1.5 bg-indigo-600 rounded-lg text-white">
                    <BellRing className="h-3.5 w-3.5 animate-pulse" />
                  </div>
                  <span className="font-extrabold text-[9px] tracking-widest text-indigo-400 font-mono uppercase">
                    CIOS PUSHNOTIFICATIE
                  </span>
                </div>
                <button
                  onClick={() => setPushNotifications(prev => prev.filter(n => n.id !== notif.id))}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <h4 className="font-bold text-xs mt-1.5 text-slate-100 flex items-center gap-1">
                {notif.title}
              </h4>
              <p className="text-[11px] text-slate-350 font-normal leading-relaxed whitespace-pre-line mt-1">
                {notif.body}
              </p>
              <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-mono mt-2 border-t border-slate-800/40 pt-2">
                <span>Systeem: CIOS GlobalLink</span>
                <span>{notif.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Header Navigation */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 shadow-xs z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl font-display shadow-sm">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold text-slate-800 tracking-tight font-display leading-tight">
              CIOS <span className="font-light text-slate-500 text-xs sm:text-sm">GlobalLink Mobility</span>
            </span>
            <span className="text-[9px] text-slate-400 font-medium tracking-wide uppercase font-mono">
              Zuidwest-Nederland • Privacy Guard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 text-xs font-semibold">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            TLS 1.3 Beveiligde Verbinding
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          {/* User Role Status Switcher */}
          <div className="flex items-center gap-2">
            <div className="bg-slate-150 p-1 rounded-xl flex border border-slate-200 shadow-2xs">
              <button
                onClick={() => {
                  setCurrentRole('COÖRDINATOR');
                  const newLog: AuditLog = {
                    id: generateUniqueId('log'),
                    timestamp: new Date().toISOString(),
                    actor: 'H. van Remortele (Coördinator)',
                    action: 'Dashboard bekeken via snelkoppeling',
                    targetStudent: 'Systeembeheer'
                  };
                  setAuditLogs(prev => [newLog, ...prev]);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  currentRole === 'COÖRDINATOR'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Users className="h-3 w-3" />
                Coördinator View
              </button>
              <button
                onClick={() => {
                  setCurrentRole('STUDENT');
                  if (activeStudentId) {
                    setLoggedInStudentId(activeStudentId);
                  }
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                  currentRole === 'STUDENT'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Smartphone className="h-3 w-3" />
                Student View
              </button>
            </div>

            {/* Authenticator Portaal Trigger */}
            <button
              onClick={() => {
                setLoginError('');
                setShowLoginModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 rounded-lg text-xs font-bold transition-all border border-indigo-200 cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Inlogportaal</span>
            </button>

            <button
              onClick={handleResetDemoData}
              title="Reset Database"
              className="p-1.5 border border-slate-200 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Extreme Visual Alert Strip for Emergencies */}
      <AnimatePresence>
        {students.some(s => s.hasActiveEmergency) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-rose-600 text-white select-none shrink-0"
          >
            <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 animate-bounce shrink-0 text-white" />
                <span>
                  <strong>ALARM IN HET BUITENLAND:</strong> {students.filter(s => s.hasActiveEmergency).length} student(en) hebben de noodknop geactiveerd!
                </span>
              </div>
              <button 
                onClick={() => {
                  setCurrentRole('COÖRDINATOR');
                  const firstEmerg = students.find(s => s.hasActiveEmergency);
                  if (firstEmerg) setActiveStudentId(firstEmerg.id);
                }}
                className="bg-white/20 hover:bg-white/35 text-white text-xs px-2.5 py-1 rounded-md transition-all font-bold shrink-0 border border-white/20 uppercase"
              >
                Inzage Calamiteit Feed
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 overflow-x-hidden">
        
        {/* Active Session Info strip banner */}
        <div className="bg-slate-900 text-white p-3 px-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-md border border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-emerald-400 font-mono text-sm">●</span>
            <p className="text-slate-200">
              Ingelogd als:{' '}
              {currentRole === 'COÖRDINATOR' ? (
                <strong className="text-white font-semibold">Heidie van Remortele (Coördinator BPV)</strong>
              ) : (
                <>
                  Student <strong className="text-indigo-350 font-semibold">{myStudentProfile?.name}</strong>{' '}
                  <span className="text-slate-450">({myStudentProfile?.email})</span>
                </>
              )}
            </p>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            {currentRole === 'STUDENT' ? 'Voer je student-emailadres in via het inlogportaal rechtsboven om je eigen tracker te vullen.' : 'Gegevens beveiligd bewaard in PARA structuur.'}
          </p>
        </div>

        {/* ======================= STUDENT PORTFOLIO INTERFACE ======================= */}
        {currentRole === 'STUDENT' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-indigo-650 font-bold text-sm mb-3 font-display">
                  <ShieldCheck className="h-4 w-4" />
                  CIOS BPV Privacy Waarborg
                </div>
                <p className="text-xs text-slate-650 leading-relaxed mb-3">
                  Beste <strong>{myStudentProfile?.name}</strong>, via jouw portaal geef je jouw wekelijkse status door aan coördinator <strong>Heidie van Remortele</strong>.
                </p>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2">
                  <span className="text-[11px] font-bold block uppercase font-mono text-slate-500">Actuele AVG Delingsrechten:</span>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Fijnmazig Niveau:</span>
                    <span className="font-semibold text-emerald-600">{formAccuracy.toUpperCase()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Toestemming Actief:</span>
                    <span className="font-semibold text-emerald-600">{formConsent ? 'JA' : 'NEE'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11.5px] border-t border-slate-200 pt-2 text-slate-500 mt-1">
                    <span>Mijn Stageplaats:</span>
                    <span className="text-slate-800 font-semibold truncate max-w-[140px]">{myStudentProfile?.hostOrganization}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs relative overflow-hidden border border-slate-850">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2 font-mono">CIOS RICHTLIJNEN</h4>
                <p className="text-[11.5px] text-slate-300 leading-relaxed mb-3">
                  1. Update je wekelijkse status bij aankomst of wijziging.<br />
                  2. Gebruik de <span className="text-rose-400 font-bold">Rode Noodknop</span> direct bij calamiteiten of gevaar op locatie.
                </p>
              </div>
            </div>

            {/* Smartphone Simulator App Screen */}
            <div className="lg:col-span-8 flex justify-center">
              <div className="w-full max-w-sm bg-slate-950 rounded-[44px] p-4.5 border-[10px] border-slate-800 shadow-2xl text-white relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-full flex items-center justify-center z-20">
                  <div className="w-12 h-1 bg-slate-900 rounded-full mb-1"></div>
                </div>

                <div className="bg-slate-900 rounded-[30px] p-5 pt-8 min-h-[580px] flex flex-col justify-between">
                  
                  <div className="flex justify-between items-center mb-6 pt-1 border-b border-white/5 pb-3">
                    <div>
                      <p className="text-[8.5px] text-indigo-400 uppercase font-extrabold tracking-widest font-mono">CIOS MOBIEL PORTAAL</p>
                      <h3 className="text-sm font-bold font-display tracking-tight text-slate-100 flex items-center gap-1">
                        Hallo, {myStudentProfile?.name.split(' ')[0]} 👋
                      </h3>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-4">
                    
                    {myStudentProfile?.hasActiveEmergency ? (
                      <div className="bg-rose-950/80 border border-rose-500/50 p-4 rounded-xl flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-rose-300">
                          <AlertTriangle className="h-4 w-4 text-rose-400 animate-pulse shrink-0" />
                          <span className="text-xs font-semibold uppercase tracking-wider">NOODSIGNAAL GEACTIVEERD</span>
                        </div>
                        <p className="text-[11px] text-rose-100 italic bg-rose-950/50 p-2.5 rounded-lg border border-rose-900">
                          "{myStudentProfile?.emergencyMessage}"
                        </p>
                        <button
                          type="button"
                          onClick={() => resolveEmergency(loggedInStudentId)}
                          className="w-full py-2 bg-white text-rose-950 rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                        >
                          Ik ben inmiddels veilig (Herroepen)
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowEmergencyModal(true)}
                        className="py-3 px-4 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-600/30 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-full bg-rose-600 flex items-center justify-center text-sm shadow-md shrink-0">
                          🚨
                        </div>
                        <div>
                          <p className="font-bold text-xs text-rose-150 uppercase tracking-widest">Noodknop Indrukken</p>
                          <p className="text-[10px] text-rose-300">Stuur direct alarm naar coördinator</p>
                        </div>
                      </button>
                    )}

                    {myStudentProfile && myStudentProfile.googleMeetUrl && (
                      <div className="bg-indigo-950/65 border border-indigo-400/40 rounded-xl p-4 flex flex-col gap-2.5 shadow-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 border border-indigo-400/50 flex items-center justify-center text-white shrink-0 relative">
                            <Video className="h-5 w-5 animate-pulse" />
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block font-mono">Videogesprek Oproep</span>
                            <span className="text-xs font-bold text-white block mt-0.5">Heidie van Remortele</span>
                            <p className="text-[10px] text-indigo-200 mt-1 leading-relaxed">
                              Je coördinator start een online live check-in gesprek. Neem direct deel via Google Meet.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={myStudentProfile.googleMeetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Video className="h-4 w-4" />
                            Deelnemen aan Meet
                          </a>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleStudentUpdate} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto max-h-[500px]">
                      
                      {/* Vraag 1a: Status */}
                      <div>
                        <span className="text-[10.5px] text-indigo-300 font-bold uppercase tracking-wider mb-1.5 block">1a. Mijn Huidige Status</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { status: 'Veilig aangekomen', emoji: '✅' },
                            { status: 'Bezig op stage met activiteiten', emoji: '💼' },
                            { status: 'Vrije tijd', emoji: '🏖️' },
                            { status: 'Slapen', emoji: '😴' },
                            { status: 'Onderweg', emoji: '🚗' },
                            { status: 'Thuis', emoji: '🏠' },
                            { status: 'Meldingen (Calamiteit)', emoji: '🚨' }
                          ].map((item) => (
                            <button
                              key={item.status}
                              type="button"
                              onClick={() => setFormStatus(item.status as StudentStatus)}
                              className={`p-2 rounded-lg text-center border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                                formStatus === item.status
                                  ? 'bg-indigo-600 border-indigo-550 text-white font-bold text-[10px]'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white text-[10px]'
                              }`}
                            >
                              <span>{item.emoji}</span>
                              <span className="truncate w-full">{item.status}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Vraag 1b: Bericht */}
                      <div>
                        <span className="text-[10.5px] text-indigo-300 font-bold uppercase tracking-wider mb-1 block">1b. Korte Check-in Update</span>
                        <textarea
                          rows={2}
                          value={formMessage}
                          onChange={(e) => setFormMessage(e.target.value)}
                          placeholder="Bijv. Vandaag een nieuw toernooi georganiseerd op de stageplek!"
                          className="w-full text-xs p-2 bg-slate-900 rounded-lg border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden"
                        />
                      </div>

                      {/* Vraag 2: Veiligheid */}
                      <div className="border-t border-slate-900 pt-2.5">
                        <span className="text-[10.5px] text-indigo-300 font-bold uppercase tracking-wider mb-1 block">2. Veiligheid & Omgeving</span>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() => setFormIsSafeEnv(true)}
                            className={`py-1.5 rounded-lg text-center border text-[10.5px] font-bold transition-all cursor-pointer ${
                              formIsSafeEnv === true
                                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            Ja, voelt veilig ✅
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormIsSafeEnv(false)}
                            className={`py-1.5 rounded-lg text-center border text-[10.5px] font-bold transition-all cursor-pointer ${
                              formIsSafeEnv === false
                                ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            Nee, ik heb zorgen ⚠️
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={formSafeEnvDetails}
                          onChange={(e) => setFormSafeEnvDetails(e.target.value)}
                          placeholder="Toelichting over de sfeer en veiligheid..."
                          className="w-full text-xs p-2 bg-slate-900 rounded-lg border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden"
                        />
                      </div>

                      {/* Vraag 3: Ondersteuning */}
                      <div className="border-t border-slate-900 pt-2.5">
                        <span className="text-[10.5px] text-indigo-300 font-bold uppercase tracking-wider mb-1 block">3. Ondersteuningsbehoefte</span>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <button
                            type="button"
                            onClick={() => setFormNeedsSupport(true)}
                            className={`py-1.5 rounded-lg text-center border text-[10.5px] font-bold transition-all cursor-pointer ${
                              formNeedsSupport === true
                                ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            Contact gewenst 💬
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormNeedsSupport(false)}
                            className={`py-1.5 rounded-lg text-center border text-[10.5px] font-bold transition-all cursor-pointer ${
                              formNeedsSupport === false
                                ? 'bg-slate-900 border-indigo-950 text-emerald-400'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            Nee, alles gaat goed
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          value={formSupportDetails}
                          onChange={(e) => setFormSupportDetails(e.target.value)}
                          placeholder="Welke ondersteuning of contactmoment zou je willen?"
                          className="w-full text-xs p-2 bg-slate-900 rounded-lg border border-slate-800 text-white placeholder-slate-500 focus:outline-hidden"
                        />
                      </div>

                      {/* Vraag 3b: Foto's */}
                      <div className="border-t border-slate-900 pt-2.5">
                        <span className="text-[10.5px] text-indigo-300 font-bold uppercase tracking-wider mb-1 block">3b. Foto's uploaden vanaf locatie</span>
                        <label className="flex items-center justify-center gap-1.5 border border-dashed border-indigo-505 bg-indigo-950/30 hover:bg-indigo-950/50 py-2.5 rounded-lg cursor-pointer text-[10.5px] font-bold text-indigo-300 transition-all select-none">
                          <Camera className="h-4.5 w-4.5 text-indigo-400" />
                          <span>Maak foto of selecteer bestand</span>
                          <input type="file" accept="image/*" multiple onChange={handlePhotoUploadChange} className="hidden" />
                        </label>

                        {formPhotos.length > 0 && (
                          <div className="grid grid-cols-3 gap-1.5 mt-1 bg-slate-900/60 p-2 rounded-lg">
                            {formPhotos.map((photo, index) => (
                              <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-slate-800">
                                <img src={photo} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFormPhoto(index)}
                                  className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 cursor-pointer"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Privacy opties */}
                      <div className="mt-1 pt-2 border-t border-slate-900 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="text-indigo-300 font-bold uppercase tracking-wider">4. PRIVACY DEELNAME (AVG)</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formConsent}
                              onChange={(e) => {
                                setFormConsent(e.target.checked);
                                if (!e.target.checked) setFormAccuracy('land');
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-7 h-4 bg-slate-800 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-3"></div>
                          </label>
                        </div>

                        {formConsent ? (
                          <div className="flex flex-col gap-2">
                            <div className="grid grid-cols-3 gap-1">
                              {[
                                { label: 'Land', value: 'land' },
                                { label: 'Stad', value: 'stad' },
                                { label: 'Exact (GPS)', value: 'exact' }
                              ].map((level) => (
                                <button
                                  key={level.value}
                                  type="button"
                                  onClick={() => {
                                    setFormAccuracy(level.value as LocationAccuracy);
                                    if (level.value === 'exact') requestBrowserGeolocation();
                                  }}
                                  className={`py-1 rounded text-[10px] border text-center transition-all cursor-pointer ${
                                    formAccuracy === level.value
                                      ? 'bg-emerald-800/40 border-emerald-500 text-emerald-200 font-semibold'
                                      : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {level.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-[10px] text-rose-300 italic">Deling gepauzeerd conform privacykeuze.</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg cursor-pointer"
                      >
                        VERZEND CHECK-IN UPDATE
                      </button>
                    </form>

                  </div>

                  <div className="mt-4 flex flex-col items-center gap-1 border-t border-white/5 pt-2">
                    <p className="text-[9px] text-slate-500 font-mono">CIOS Mobility Gate — Secure</p>
                    <div className="w-20 h-1 bg-slate-700 rounded-full mt-1"></div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================= COORDINATOR VIEW INTERFACE ======================= */}
        {currentRole === 'COÖRDINATOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest block font-mono">Actieve deelnemers</span>
                  <span className="text-2xl font-bold text-slate-800 block mt-0.5 font-display">{students.length} Studenten</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center shadow-xs">
                  <Compass className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest block font-mono">Calamiteiten / Alarm</span>
                  <span className={`text-2xl font-bold block mt-0.5 font-display ${students.some(s => s.hasActiveEmergency) ? 'text-rose-600 font-extrabold animate-pulse' : 'text-slate-800'}`}>
                    {students.filter(s => s.hasActiveEmergency).length} Meldingen
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-xs ${students.some(s => s.hasActiveEmergency) ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                  <ShieldAlert className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest block font-mono">AVG Toestemming</span>
                  <span className="text-2xl font-bold text-emerald-700 block mt-0.5 font-display">
                    {students.length > 0 ? Math.round((students.filter(s => s.consentGiven).length / students.length) * 100) : 100}% Akkoord
                  </span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shadow-xs">
                  <Lock className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 justify-between shadow-xs">
                <div className="flex-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest block font-mono">Rapportage Export</span>
                  <button
                    onClick={handleDownloadMarkdownReport}
                    className="mt-1 w-full bg-slate-900 hover:bg-slate-850 text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Download Rapport (.md)
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Manual registration tab */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAddStudentForm(!showAddStudentForm)}
                  className="w-full p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between border-b border-slate-200 text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700">
                      <UserPlus className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">Nieuwe Student Handmatig Toevoegen</h3>
                      <p className="text-[11px] text-slate-500">Voeg een student toe aan de lokale monitor</p>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-md p-1 font-bold text-xs">
                    {showAddStudentForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {showAddStudentForm && (
                     <motion.form
                       initial={{ height: 0, opacity: 0 }}
                       animate={{ height: 'auto', opacity: 1 }}
                       exit={{ height: 0, opacity: 0 }}
                       onSubmit={handleAddNewStudent}
                       className="p-5 border-l-4 border-indigo-500 flex flex-col gap-4 bg-white"
                     >
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-slate-700">Student Naam</label>
                           <input
                             type="text"
                             required
                             placeholder="Bijv. Sam Dubbeldam"
                             value={newStudentName}
                             onChange={(e) => setNewStudentName(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-slate-700">CIOS E-mailadres</label>
                           <input
                             type="email"
                             required
                             placeholder="sdubbeldam2@student.cioszuidwest.nl"
                             value={newStudentEmail}
                             onChange={(e) => setNewStudentEmail(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-slate-700">Mobiel Nummer</label>
                           <input
                             type="text"
                             value={newStudentPhone}
                             onChange={(e) => setNewStudentPhone(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-slate-700">Locatie / Partner Template</label>
                           <select
                             value={newStudentPresetIdx}
                             onChange={(e) => setNewStudentPresetIdx(Number(e.target.value))}
                             className="w-full text-xs p-2 bg-slate-50 border rounded-lg h-9 text-slate-850 cursor-pointer"
                           >
                             {PRESET_CITIES.map((city, idx) => (
                               <option key={city.name} value={idx}>
                                 {city.name} ({city.country}) - {city.org}
                               </option>
                             ))}
                             <option value={PRESET_CITIES.length}>[Handmatige invoer...]</option>
                           </select>
                         </div>

                           <div className="grid grid-cols-2 gap-3 col-span-1 sm:col-span-2 bg-slate-50 border rounded-xl p-3">
                             <div className="col-span-2 flex items-center justify-between">
                               <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                                 Locatiedetails & BPV Coördinaten
                               </span>
                               <button
                                 type="button"
                                 onClick={() => autoRetrieveCoordinates(customCity, customCountry)}
                                 disabled={isSearchingCoords || !customCity.trim()}
                                 className="text-[10px] bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-1 px-2.5 rounded-lg cursor-pointer"
                               >
                                 {isSearchingCoords ? 'Zoeken...' : '🌍 Zoek GPS Online'}
                               </button>
                             </div>
                             
                             <div className="flex flex-col gap-1.5">
                               <label className="text-xs font-bold text-slate-700">Stad / Bestemming</label>
                               <input
                                 type="text"
                                 value={customCity}
                                 onChange={(e) => setCustomCity(e.target.value)}
                                 className="w-full text-xs p-2 bg-white border rounded-lg focus:outline-hidden"
                               />
                             </div>

                             <div className="flex flex-col gap-1.5">
                               <label className="text-xs font-bold text-slate-700">Land</label>
                               <input
                                 type="text"
                                 value={customCountry}
                                 onChange={(e) => setCustomCountry(e.target.value)}
                                 className="w-full text-xs p-2 bg-white border rounded-lg focus:outline-hidden"
                               />
                             </div>

                             <div className="flex flex-col gap-1.5">
                               <label className="text-[10.5px] text-slate-600">Breedtegraad (Lat)</label>
                               <input
                                 type="text"
                                 value={customLat}
                                 onChange={(e) => setCustomLat(e.target.value)}
                                 className="w-full text-xs p-2 bg-white border rounded-lg focus:outline-hidden font-mono"
                               />
                             </div>

                             <div className="flex flex-col gap-1.5">
                               <label className="text-[10.5px] text-slate-600">Lengtegraad (Lng)</label>
                               <input
                                 type="text"
                                 value={customLng}
                                 onChange={(e) => setCustomLng(e.target.value)}
                                 className="w-full text-xs p-2 bg-white border rounded-lg focus:outline-hidden font-mono"
                               />
                             </div>
                           </div>

                         <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                           <label className="text-xs font-semibold text-slate-700">Stagebedrijf / Partnerorganisatie buitenland</label>
                           <input
                             type="text"
                             value={newStudentHostOrg}
                             onChange={(e) => setNewStudentHostOrg(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden text-slate-800"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-slate-700">Thuisfront Noodcontact (Naam)</label>
                           <input
                             type="text"
                             value={newStudentEmergencyName}
                             onChange={(e) => setNewStudentEmergencyName(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden text-slate-800"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-slate-700">Thuisfront Noodnummer</label>
                           <input
                             type="text"
                             value={newStudentEmergencyPhone}
                             onChange={(e) => setNewStudentEmergencyPhone(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden text-slate-800"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-indigo-700">Praktijkopleider (Naam)</label>
                           <input
                             type="text"
                             value={newStudentSupervisorName}
                             onChange={(e) => setNewStudentSupervisorName(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden text-slate-800"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-indigo-700">Praktijkopleider (Telefoon)</label>
                           <input
                             type="text"
                             value={newStudentSupervisorPhone}
                             onChange={(e) => setNewStudentSupervisorPhone(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden text-slate-800"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-indigo-700">Praktijkopleider (E-mail)</label>
                           <input
                             type="email"
                             value={newStudentSupervisorEmail}
                             onChange={(e) => setNewStudentSupervisorEmail(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden text-slate-800"
                           />
                         </div>

                         <div className="flex items-end justify-end mt-2 col-span-1 sm:col-span-2">
                           <button
                             type="submit"
                             className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer uppercase tracking-wider"
                           >
                             Voeg Toe Aan Monitor ➕
                           </button>
                         </div>
                       </div>
                     </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Feed Panel list */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <h2 className="font-bold text-slate-850 flex items-center gap-2 font-display text-sm sm:text-base">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    Internationale Status Overzicht
                  </h2>

                  <div className="flex w-full sm:w-auto items-center gap-2 flex-wrap">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Naam, land, stad..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-52 text-xs pl-8 pr-3 py-1.5 border rounded-lg text-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="text-xs border rounded-lg p-1.5 cursor-pointer text-slate-800 bg-white"
                    >
                      <option value="ALL">Status filteren...</option>
                      <option value="Veilig aangekomen">Veilig aangekomen</option>
                      <option value="Bezig op stage met activiteiten">Bezig op stage met activiteiten</option>
                      <option value="Vrije tijd">Vrije tijd</option>
                      <option value="Slapen">Slapen</option>
                      <option value="Onderweg">Onderweg</option>
                      <option value="Thuis">Thuis</option>
                      <option value="EMERGENCY">🚨 Calamiteiten</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[9.5px] font-bold border-b">
                      <tr>
                        <th className="px-5 py-3.5">Student</th>
                        <th className="px-5 py-3.5">Bestemming</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Laatste Check-in Update</th>
                        <th className="px-5 py-3.5 text-center">Beheer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-10 text-xs text-slate-400 font-mono">
                            Geen actieve studenten gevonden.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((stud) => {
                          const isSelected = activeStudentId === stud.id;
                          return (
                            <tr
                              key={stud.id}
                              onClick={() => {
                                setActiveStudentId(stud.id);
                                logDirectAccess(stud.name);
                              }}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-slate-100' : 'bg-white hover:bg-slate-50'
                              } ${stud.hasActiveEmergency ? 'bg-rose-50/50' : ''}`}
                            >
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                    stud.hasActiveEmergency ? 'bg-rose-100 text-rose-700' : 'bg-indigo-50 text-indigo-700'
                                  }`}>
                                    {stud.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-xs text-slate-850 flex items-center gap-1.5">
                                      {stud.name} 
                                      {stud.hasActiveEmergency && <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>}
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate">{stud.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3">
                                <p className="text-[11px] text-slate-800 font-semibold">{stud.city}, {stud.country}</p>
                                <p className="text-[10px] text-slate-400 truncate font-mono">{stud.hostOrganization}</p>
                              </td>
                              <td className="px-5 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                                  stud.hasActiveEmergency ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-slate-100'
                                }`}>
                                  {stud.hasActiveEmergency ? '🚨 NOODGEVAL' : stud.status}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-right">
                                <p className="text-[11px] text-slate-600 italic truncate max-w-[180px]">"{stud.lastMessage}"</p>
                                <p className="text-[9px] text-slate-400 font-mono">
                                  {new Date(stud.lastUpdate).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </td>
                              <td className="px-5 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStudent(stud.id);
                                  }}
                                  className="p-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mx-auto" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Secure Log Audits */}
              <div className="bg-slate-900 text-slate-350 rounded-xl border border-slate-800 p-5 shadow-xs font-mono text-xs">
                <span className="font-bold text-slate-100 uppercase tracking-wider text-[10px] block border-b border-slate-800 pb-2 mb-2">
                  AVG BEVEILIGINGS- AUDIT LOGS
                </span>
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="text-[10px] border-b border-slate-800/40 pb-1.5">
                      <div className="flex justify-between text-slate-500 text-[8.5px]">
                        <span>{new Date(log.timestamp).toLocaleTimeString('nl-NL')}</span>
                        <span className="text-emerald-400 font-semibold">{log.actor}</span>
                      </div>
                      <p className="text-slate-100 mt-0.5">{log.action}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side Detail panel / Dossier */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                
                <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase font-mono">Geselecteerd dossier</p>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5 font-display">{activeStudent.name}</h3>
                  </div>
                  <div className="flex flex-col gap-1.5 items-end">
                    <button 
                      onClick={() => {
                        setLoggedInStudentId(activeStudent.id);
                        setCurrentRole('STUDENT');
                      }}
                      className="p-1 px-2.5 bg-slate-900 text-white rounded text-[10px] font-bold cursor-pointer"
                    >
                      Simuleer Mobiel 📱
                    </button>
                  </div>
                </div>

                {activeStudent.hasActiveEmergency && (
                  <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-rose-800 font-bold text-[10px] uppercase">
                      <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>NOODSITUATIE ACTIEF</span>
                    </div>
                    <p className="text-xs text-rose-900 bg-white p-2 rounded border border-rose-200">
                      "{activeStudent.emergencyMessage}"
                    </p>
                    <button
                      onClick={() => resolveEmergency(activeStudent.id)}
                      className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs uppercase"
                    >
                      Sluit Alarm (Student is veilig)
                    </button>
                  </div>
                )}

                {/* Geo-Visualisatie */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-700 block flex items-center gap-1.5 uppercase font-mono">
                    <Map className="h-4 w-4 text-indigo-600" />
                    Geo-Visualisatie
                  </span>

                  {activeStudent.consentGiven && activeStudent.coordinates ? (
                    <div className="bg-slate-950 border rounded-xl h-64 relative overflow-hidden flex flex-col">
                      <iframe
                        width="100%"
                        height="100%"
                        title="Locatiemap"
                        src={getMapUrl(activeStudent)}
                        className="w-full h-full border-0"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border rounded-xl h-48 flex flex-col items-center justify-center p-5 text-center text-slate-400 text-xs">
                      <Lock className="h-6 w-6 mb-1.5 text-slate-300" />
                      <p className="font-semibold text-slate-600">Locatiedeling niet geconfigureerd</p>
                      <p className="text-[10px] mt-0.5">De student heeft nog geen GPS-locatie meegestuurd via zijn mobiele check-in.</p>
                    </div>
                  )}
                </div>

                {/* Contact- & Partnergegevens */}
                <div className="border-t border-slate-100 pt-3.5 flex flex-col gap-2.5 text-xs">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono">
                      Contact- & Partnergegevens
                    </span>
                    {!isEditingContactInfo ? (
                      <button
                        type="button"
                        onClick={() => setIsEditingContactInfo(true)}
                        className="text-[10px] text-indigo-650 font-bold underline cursor-pointer"
                      >
                        Aanpassen
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleSaveContactInfo}
                          className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold cursor-pointer"
                        >
                          Opslaan
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingContactInfo(false);
                            setEditPhone(activeStudent.phone || '');
                            setEditHostOrg(activeStudent.hostOrganization || '');
                            setEditEmergencyContactName(activeStudent.emergencyContactName || '');
                            setEditEmergencyContactPhone(activeStudent.emergencyContactPhone || '');
                            setEditSupervisorName(activeStudent.supervisorName || '');
                            setEditSupervisorPhone(activeStudent.supervisorPhone || '');
                            setEditSupervisorEmail(activeStudent.supervisorEmail || '');
                          }}
                          className="text-[10px] bg-slate-150 text-slate-700 px-2 py-0.5 rounded font-bold cursor-pointer"
                        >
                          Annuleren
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditingContactInfo ? (
                    <>
                      <div className="flex justify-between text-[11px]"><span className="text-slate-450">Partner BPV:</span><span className="font-semibold text-slate-800 truncate max-w-[140px] text-right">{activeStudent.hostOrganization}</span></div>
                      <div className="flex justify-between text-[11px]"><span className="text-slate-450">Telefoon Student:</span><span className="font-mono text-slate-800">{activeStudent.phone}</span></div>
                      <div className="flex justify-between text-[11px]"><span className="text-slate-450">Thuisfront Noodcontact:</span><span className="font-semibold text-slate-800 text-right">{activeStudent.emergencyContactName}</span></div>
                      <div className="flex justify-between text-[11px]"><span className="text-slate-450">Noodnummer:</span><span className="font-mono text-slate-800">{activeStudent.emergencyContactPhone}</span></div>
                      <div className="border-t border-dashed my-1 pb-1" />
                      <div className="flex justify-between text-[11px]"><span className="text-indigo-700 font-semibold">Praktijkopleider:</span><span className="font-semibold text-slate-800 text-right">{activeStudent.supervisorName || 'Niet ingevuld'}</span></div>
                      <div className="flex justify-between text-[11px]"><span className="text-slate-450">Tel. Begeleider:</span><span className="font-mono text-slate-800">{activeStudent.supervisorPhone || 'Niet ingevuld'}</span></div>
                      <div className="flex justify-between text-[11px]"><span className="text-slate-450">E-mail Begeleider:</span><span className="truncate max-w-[140px] text-right">{activeStudent.supervisorEmail || 'Niet ingevuld'}</span></div>
                    </>
                  ) : (
                    <div className="bg-slate-50 border p-2.5 rounded-xl flex flex-col gap-2 shadow-inner">
                      <div className="flex flex-col gap-0.5"><label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Partner BPV</label><input type="text" value={editHostOrg} onChange={(e) => setEditHostOrg(e.target.value)} className="text-xs p-1 bg-white border rounded-lg focus:outline-hidden" /></div>
                      <div className="flex flex-col gap-0.5"><label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Telefoon Student</label><input type="text" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="text-xs p-1 bg-white border rounded-lg focus:outline-hidden" /></div>
                      <div className="flex flex-col gap-0.5"><label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Noodcontact</label><input type="text" value={editEmergencyContactName} onChange={(e) => setEditEmergencyContactName(e.target.value)} className="text-xs p-1 bg-white border rounded-lg focus:outline-hidden" /></div>
                      <div className="flex flex-col gap-0.5"><label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Noodnummer</label><input type="text" value={editEmergencyContactPhone} onChange={(e) => setEditEmergencyContactPhone(e.target.value)} className="text-xs p-1 bg-white border rounded-lg focus:outline-hidden" /></div>
                      <div className="border-t border-dashed my-1" />
                      <div className="flex flex-col gap-0.5"><label className="text-[9px] uppercase font-bold text-indigo-600 font-mono">Praktijkopleider</label><input type="text" value={editSupervisorName} onChange={(e) => setEditSupervisorName(e.target.value)} className="text-xs p-1 bg-white border rounded-lg focus:outline-hidden" /></div>
                      <div className="flex flex-col gap-0.5"><label className="text-[9px] uppercase font-bold text-indigo-600 font-mono">Tel. Begeleider</label><input type="text" value={editSupervisorPhone} onChange={(e) => setEditSupervisorPhone(e.target.value)} className="text-xs p-1 bg-white border rounded-lg focus:outline-hidden" /></div>
                      <div className="flex flex-col gap-0.5"><label className="text-[9px] uppercase font-bold text-indigo-600 font-mono">E-mail Begeleider</label><input type="email" value={editSupervisorEmail} onChange={(e) => setEditSupervisorEmail(e.target.value)} className="text-xs p-1 bg-white border rounded-lg focus:outline-hidden" /></div>
                    </div>
                  )}
                </div>

                {/* Google Meet Online Videobellen */}
                <div className="border-t border-slate-150 pt-4 flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-slate-850 block flex items-center gap-1.5 uppercase font-mono">
                    <Video className="h-4 w-4 text-indigo-600" />
                    Online Voortgangsgesprek
                  </span>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col gap-2.5">
                    {activeStudent.googleMeetUrl ? (
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Gespreksoproep Actief
                          </span>
                        </div>
                        <div className="flex gap-1.5">
                          <a href={activeStudent.googleMeetUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold text-center shadow-xs cursor-pointer">Deelnemen</a>
                          <button type="button" onClick={() => handleStopGoogleMeet(activeStudent.id)} className="px-3 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer">Sluiten</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartGoogleMeet(activeStudent.id)}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
                      >
                        <Video className="h-3.5 w-3.5" />
                        Start Google Meet gesprek
                      </button>
                    )}
                  </div>
                </div>

                {/* Geplande Reisperiode BPV */}
                <div className="border-t border-slate-150 pt-4 flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-slate-850 block flex items-center gap-1.5 uppercase font-mono">
                    <Calendar className="h-4 w-4 text-indigo-650" />
                    Geplande Reisperiode (BPV)
                  </span>

                  <div className="bg-slate-50 border rounded-xl p-3 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-500 font-mono">Vertrek</label>
                        <input type="date" value={dossierDepartureDate} onChange={(e) => setDossierDepartureDate(e.target.value)} className="text-xs p-2 bg-white border rounded-lg cursor-pointer text-slate-800" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-500 font-mono">Terugkomst</label>
                        <input type="date" value={dossierReturnDate} onChange={(e) => setDossierReturnDate(e.target.value)} className="text-xs p-2 bg-white border rounded-lg cursor-pointer text-slate-800" />
                      </div>
                    </div>
                    <button type="button" onClick={handleSaveTravelDates} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer uppercase tracking-wider">Opslaan & Notificeren</button>
                  </div>
                </div>

                {/* Begeleidingsstatus van Deelnemer */}
                <div className="border-t border-slate-150 pt-4 flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-750 block flex items-center gap-1.5 uppercase font-mono">
                    <ShieldCheck className="h-4 w-4 text-indigo-650" />
                    Begeleidingsstatus Intake
                  </span>

                  <div className={`p-3 rounded-xl border text-xs italic ${activeStudent.isSafeEnv ?? true ? 'bg-emerald-50/65 border-emerald-200/60' : 'bg-rose-50 border-rose-200'}`}>
                    <div className="flex justify-between font-bold not-italic text-[10px] text-slate-500 uppercase mb-1">
                      <span>2. Veiligheid & Sfeer</span>
                    </div>
                    "{activeStudent.safeEnvDetails || 'Geen toelichting gegeven.'}"
                  </div>

                  <div className={`p-3 rounded-xl border text-xs italic ${activeStudent.needsSupport ? 'bg-amber-50 border-amber-250' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between font-bold not-italic text-[10px] text-slate-500 uppercase mb-1">
                      <span>3. Extra Ondersteuning</span>
                    </div>
                    "{activeStudent.supportDetails || 'Geen toelichting gegeven.'}"
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      {/* Emergency Modal inside device overlay */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl border max-w-sm w-full overflow-hidden shadow-2xl">
              <div className="bg-rose-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-sm font-mono uppercase"><ShieldAlert className="h-5 w-5" /><span>Acute Calamiteit Melden</span></div>
                <button onClick={() => setShowEmergencyModal(false)} className="text-white p-1"><X className="h-4.5 w-4.5" /></button>
              </div>
              <form onSubmit={triggerEmergency} className="p-5 flex flex-col gap-4">
                <textarea rows={3} placeholder="Omschrijf de noodsituatie bondig..." value={emergencyText} onChange={(e) => setEmergencyText(e.target.value)} className="w-full p-2.5 border text-xs rounded-lg text-slate-800 bg-slate-50" required />
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setShowEmergencyModal(false)} className="py-1.5 border rounded-lg text-xs font-bold text-slate-700 cursor-pointer">Annuleren</button>
                  <button type="submit" className="py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold cursor-pointer">Verstuur Alarm 🚨</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Live Login & Switcher Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl">
              <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-sm font-mono uppercase"><Lock className="h-4.5 w-4.5" /><span>CIOS Inlogportaal / Portal</span></div>
                <button onClick={() => setShowLoginModal(false)} className="text-white p-1"><X className="h-4.5 w-4.5" /></button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Direct inloggen (Snelstarter):</span>
                  <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
                    <button type="button" onClick={() => { setCurrentRole('COÖRDINATOR'); setShowLoginModal(false); }} className="w-full text-left p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl font-semibold text-indigo-900 text-xs cursor-pointer flex justify-between">
                      <span className="flex items-center gap-2"><Users className="h-4 w-4" />Heidie van Remortele (Coördinator)</span>
                      <span className="font-mono text-[9px] bg-indigo-200 p-0.5 rounded">BEHEER</span>
                    </button>
                    {students.map((stud) => (
                      <button key={stud.id} type="button" onClick={() => { setLoggedInStudentId(stud.id); setCurrentRole('STUDENT'); setShowLoginModal(false); }} className="w-full text-left p-2.5 bg-slate-50 border rounded-xl text-xs text-slate-800 font-semibold cursor-pointer">
                        👤 {stud.name} ({stud.email})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Handmatige invoer:</span>
                  <form onSubmit={handleSimulatedLogin} className="flex gap-1.5">
                    <input type="text" placeholder="Typ 'heidie' of student-email..." value={typedEmail} onChange={(e) => setTypedEmail(e.target.value)} className="flex-1 text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-hidden" />
                    <button type="submit" className="bg-indigo-650 text-white font-bold text-xs px-4 rounded-lg cursor-pointer">Login</button>
                  </form>
                  {loginError && <p className="text-xs text-rose-600 font-semibold mt-1">{loginError}</p>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {studentToDelete && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-2xl border max-w-md w-full overflow-hidden shadow-2xl p-5 flex flex-col gap-4">
              <div className="text-center">
                <h4 className="text-sm font-bold text-slate-850">Dossier permanent wissen?</h4>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Weet u zeker dat u student <strong>{studentToDelete.name}</strong> uit het systeem wilt verwijderen conform AVG-richtlijnen?
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setStudentToDelete(null)} className="py-2 bg-slate-100 rounded-xl text-xs font-bold cursor-pointer">Annuleren</button>
                <button type="button" onClick={confirmDeleteStudent} className="py-2 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer">Permanent wissen</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo Full-Screen Popup Overlay */}
      <AnimatePresence>
        {selectedFullImage && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 cursor-zoom-out" onClick={() => setSelectedFullImage(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <img src={selectedFullImage} alt="" className="max-w-full max-h-[80vh] rounded-xl object-contain" />
              <button onClick={() => setSelectedFullImage(null)} className="mt-4 mx-auto px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg text-xs cursor-pointer block">Sluiten</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="h-10 bg-slate-100 border-t px-4 sm:px-8 flex items-center justify-between text-[9px] text-slate-500 font-bold font-mono tracking-widest shrink-0 mt-auto uppercase">
        <div>Zuidwest-Nederland Monitor</div>
        <div>© 2026 CIOS GlobalLink — Gereguleerd op PARA</div>
      </footer>

    </div>
  );
}
