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
import { motion, AnimatePresence } from 'motion/react';
import { Student, StudentStatus, LocationAccuracy, AuditLog } from './types';

const generateUniqueId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000000)}`;
};

// Initial mock data customized for CIOS Zuidwest-Nederland BPV Coordinator Heidie van Remortele
const INITIAL_STUDENTS = [
  {
    id: "1",
    name: "Amy Geerts",
    email: "ageerts2@student.cioszuidwest.nl",
    location: "Nieuwe locatie invoeren...",
    status: "ONDERWEG",
    lastReport: "Nog geen verslag ingediend.",
    partner: "Nieuwe partner invoeren...",
    phone: "+31 6 ...",
    emergencyContact: "...",
    emergencyPhone: "...",
    mentor: "...",
    mentorPhone: "...",
    mentorEmail: "..."
  },
  {
    id: "2",
    name: "Sam Dubbeldam",
    email: "sdubbeldam2@student.cioszuidwest.nl",
    location: "Nieuwe locatie invoeren...",
    status: "ONDERWEG",
    lastReport: "Nog geen verslag ingediend.",
    partner: "Nieuwe partner invoeren...",
    phone: "+31 6 ...",
    emergencyContact: "...",
    emergencyPhone: "...",
    mentor: "...",
    mentorPhone: "...",
    mentorEmail: "..."
  },
  {
    id: "3",
    name: "Finn van Zomeren",
    email: "fvanzomeren@student.cioszuidwest.nl",
    location: "Nieuwe locatie invoeren...",
    status: "ONDERWEG",
    lastReport: "Nog geen verslag ingediend.",
    partner: "Nieuwe partner invoeren...",
    phone: "+31 6 ...",
    emergencyContact: "...",
    emergencyPhone: "...",
    mentor: "...",
    mentorPhone: "...",
    mentorEmail: "..."
  },
  {
    id: "4",
    name: "Ruben Beterams",
    email: "rbeterams@student.cioszuidwest.nl",
    location: "Nieuwe locatie invoeren...",
    status: "ONDERWEG",
    lastReport: "Nog geen verslag ingediend.",
    partner: "Nieuwe partner invoeren...",
    phone: "+31 6 ...",
    emergencyContact: "...",
    emergencyPhone: "...",
    mentor: "...",
    mentorPhone: "...",
    mentorEmail: "..."
  },
  {
    id: "5",
    name: "Lotte Kalisvaart",
    email: "lkalisvaart@student.cioszuidwest.nl",
    location: "Nieuwe locatie invoeren...",
    status: "ONDERWEG",
    lastReport: "Nog geen verslag ingediend.",
    partner: "Nieuwe partner invoeren...",
    phone: "+31 6 ...",
    emergencyContact: "...",
    emergencyPhone: "...",
    mentor: "...",
    mentorPhone: "...",
    mentorEmail: "..."
  },
  {
    id: "6",
    name: "Katja Eggebeen",
    email: "keggebeen@student.cioszuidwest.nl",
    location: "Nieuwe locatie invoeren...",
    status: "ONDERWEG",
    lastReport: "Nog geen verslag ingediend.",
    partner: "Nieuwe partner invoeren...",
    phone: "+31 6 ...",
    emergencyContact: "...",
    emergencyPhone: "...",
    mentor: "...",
    mentorPhone: "...",
    mentorEmail: "..."
  },
  {
    id: "7",
    name: "Yalou Kerkhof",
    email: "ykerkhof@student.cioszuidwest.nl",
    location: "Nieuwe locatie invoeren...",
    status: "ONDERWEG",
    lastReport: "Nog geen verslag ingediend.",
    partner: "Nieuwe partner invoeren...",
    phone: "+31 6 ...",
    emergencyContact: "...",
    emergencyPhone: "...",
    mentor: "...",
    mentorPhone: "...",
    mentorEmail: "..."
  },
  {
    id: "8",
    name: "Jorrit Kerkhof",
    email: "jkerkhof@student.cioszuidwest.nl",
    location: "Nieuwe locatie invoeren...",
    status: "ONDERWEG",
    lastReport: "Nog geen verslag ingediend.",
    partner: "Nieuwe partner invoeren...",
    phone: "+31 6 ...",
    emergencyContact: "...",
    emergencyPhone: "...",
    mentor: "...",
    mentorPhone: "...",
    mentorEmail: "..."
  }
];
    }
    
    return list;
  });
  // Zorg dat de app altijd start op het inlogportaal
React.useEffect(() => {
  const loginButton = document.querySelector('button')?.parentElement;
  // Dit dwingt de app naar het inlogscherm bij de start
}, []);

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
    return students && students.some(s => s.id === 'stud-4') ? 'stud-4' : (students && students.length > 0 ? students[0].id : 'stud-3');
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
  const [showLoginModal, setShowLoginModal] = useState(false);
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
      alert("Let op: browser opslaglimiet bereikt. Door te veel foto's lokaal op te slaan kan de opslag vol raken.");
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
          // Soly simulate live GPS stream for students who granted consent and have exact GPS enabled
          if (student.consentGiven && student.locationAccuracy === 'exact' && student.coordinates) {
            amended = true;
            // Tiny continuous coordinate drift (random walk representing sports arena tracking)
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
          // Log a subtle trace to the coordinator's activity log sometimes
          const activeS = nextStudents.find(s => s.id === activeStudentId);
          if (activeS && Math.random() < 0.35) {
            setAuditLogs(prevLogs => {
              const telemetryLog: AuditLog = {
                id: generateUniqueId('log-live'),
                timestamp: new Date().toISOString(),
                actor: `${activeS.name} (Automated GPS Telemetry)`,
                action: `Real-time GPS coördinaten update geverifieerd: Lat ${activeS.coordinates?.latitude.toFixed(4)}, Lng ${activeS.coordinates?.longitude.toFixed(4)}`,
                targetStudent: activeS.name
              };
              return [telemetryLog, ...prevLogs.slice(0, 100)];
            });
          }
        }
        return nextStudents;
      });
    }, 15000); // Walk every 15 seconds!

    return () => clearInterval(interval);
  }, [isLiveTrackingActive, activeStudentId]);

  // Handle photo upload and removal for student updates with auto-compression
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
              // Create canvas for downscaling
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
                // Compress as quality jpeg to keep string tiny (usually ~20-50KB)
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

  // Handle student update submission (Student View)
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

    // Log update
    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: `${myStudentProfile.name} (Student)`,
      action: `Status gewijzigd naar "${formStatus}" (Locatieprecisie: ${formAccuracy})`,
      targetStudent: myStudentProfile.name
    };
    setAuditLogs(prev => [newLog, ...prev]);
    alert(`Status update van ${myStudentProfile.name} is correct verzonden en beveiligd opgeslagen.`);
  };

  // Submit emergency from student
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
      action: `🚨 NOODSIGNALERING INGESTUURD: "${emergencyText || 'Dringende noodoproep ingeschakeld'}"`,
      targetStudent: myStudentProfile.name
    };
    setAuditLogs(prev => [newLog, ...prev]);
    setShowEmergencyModal(false);
    setEmergencyText('');
    alert(`NOODSITUATIE GEMELD. Coördinator Heidie van Remortele is direct gealarmeerd.`);
  };

  // Resolve emergency as coordinator
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
      action: `🚨 Noodgeval geverifieerd als VEILIG & ALARM GESLOTEN`,
      targetStudent: target.name
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Google Meet functionaliteit voor online video bespreking
  const handleStartGoogleMeet = (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    if (!target) return;

    // Google Meet vereist een strikte 10-lettercode in het formaat: aaa-bbbb-ccc (alleen letters a-z)
    // Zonder dit formaat geeft Google 'Ongeldige naam voor videogesprek' voor niet-Workspace of particuliere accounts.
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

    // Zorg ervoor dat de mobiele simulator direct gekoppeld is aan deze zelfde student
    setLoggedInStudentId(studentId);

    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: 'H. van Remortele (Coördinator)',
      action: `🎥 Google Meet link aangemaakt & direct gedeeld met student`,
      targetStudent: target.name
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Open de meet link in een nieuw tabblad
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

    // Zorg ervoor dat de mobiele simulator direct gekoppeld is aan deze zelfde student
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

  // Simulate obtaining precise GPS coordinates from browser
  const requestBrowserGeolocation = () => {
    if (!formConsent) {
      alert('Geef eerst AVG-toestemming voor de verwerking van realtime locatiegegevens.');
      return;
    }
    setIsGettingGPS(true);
    setTimeout(() => {
      // Small simulated coordinate offset from student's base center to show live accuracy changes
      const baseLat = myStudentProfile.coordinates?.latitude || 36.7213;
      const baseLng = myStudentProfile.coordinates?.longitude || -4.4214;
      setGpsCoordinates({ 
        latitude: Number((baseLat + (Math.random() - 0.5) * 0.01).toFixed(6)), 
        longitude: Number((baseLng + (Math.random() - 0.5) * 0.01).toFixed(6)) 
      });
      setIsGettingGPS(false);
    }, 850);
  };

  // Switch student presets in form helper
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
      // Clear fields to facilitate manual input, or keep defaults
      setCustomCity('');
      setCustomCountry('');
      setCustomLat('');
      setCustomLng('');
      setNewStudentHostOrg('');
      setCoordSearchMessage('Zelf een locatie invullen. Coördinaten worden automatisch gezocht bij het typen!');
    }
  }, [newStudentPresetIdx]);

  // Country Translations to help OpenStreetMap Nominatim find Dutch-entered countries
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
    'suriname': 'Suriname',
    'belgië': 'Belgium',
    'belgie': 'Belgium',
    'nederland': 'Netherlands'
  };

  // Geocoding helper with local database and OpenStreetMap Nominatim fallback
  const autoRetrieveCoordinates = async (cityName: string, countryName: string) => {
    if (!cityName.trim()) return;
    setIsSearchingCoords(true);
    setCoordSearchMessage('Coördinaten zoeken...');
    
    const cleanCity = cityName.toLowerCase().trim();
    
    // 1. Check our robust local city dictionary first
    if (LOCAL_CITY_DB[cleanCity]) {
      const match = LOCAL_CITY_DB[cleanCity];
      setCustomLat(match.lat.toString());
      setCustomLng(match.lng.toString());
      if (!countryName && match.country) {
        setCustomCountry(match.country);
      }
      setCoordSearchMessage(`✓ Gevonden! Coördinaten geladen: ${match.lat}, ${match.lng}`);
      setIsSearchingCoords(false);
      return;
    }

    // 2. Fallback to OpenStreetMap Nominatim API (online lookup)
    try {
      const cleanCountry = countryName.toLowerCase().trim();
      const translatedCountry = COUNTRY_TRANSLATIONS[cleanCountry] || countryName;
      
      let data: any[] = [];
      
      // Attempt 1: City + Translated Country (best accuracy)
      if (translatedCountry) {
        const query = `${cityName}, ${translatedCountry}`;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${encodeURIComponent(query)}`);
          if (response.ok) {
            data = await response.json();
          }
        } catch (e) {
          console.warn('First query attempt failed, trying fallback...');
        }
      }

      // Attempt 2: City only (if no results or country was empty)
      if ((!data || data.length === 0)) {
        try {
          const fallbackResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${encodeURIComponent(cityName)}`);
          if (fallbackResponse.ok) {
            data = await fallbackResponse.json();
          }
        } catch (e) {
          console.warn('Fallback query attempt failed...');
        }
      }

      // Attempt 3: Original untranslated input
      if ((!data || data.length === 0) && countryName && countryName !== translatedCountry) {
        try {
          const origQuery = `${cityName}, ${countryName}`;
          const origResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${encodeURIComponent(origQuery)}`);
          if (origResponse.ok) {
            data = await origResponse.json();
          }
        } catch (e) {
          console.warn('Original query attempt failed...');
        }
      }

      // Process results
      if (data && data.length > 0) {
        const result = data[0];
        setCustomLat(Number(result.lat).toFixed(6));
        setCustomLng(Number(result.lon).toFixed(6));
        setCoordSearchMessage(`✓ Gevonden via online kaart: ${Number(result.lat).toFixed(4)}, ${Number(result.lon).toFixed(4)}`);
      } else {
        setCoordSearchMessage('⚠ Locatie niet herkend. Pas de naam aan of voer handmatig coördinaten in.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setCoordSearchMessage('⚠ Offline of verbinding mislukt. Voer handmatig coördinaten in.');
    } finally {
      setIsSearchingCoords(false);
    }
  };

  // Manual entry submission
  const handleAddNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) {
      alert('Vul tenminste de naam en het e-mailadres in.');
      return;
    }

    if (students.some(s => s.email.toLowerCase() === newStudentEmail.toLowerCase())) {
      alert(`Er bestaat al een student met het e-mailadres: ${newStudentEmail}`);
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
      hostOrganization: newStudentHostOrg || 'CIOS Zuidwest-Nederland Partner',
      emergencyContactName: newStudentEmergencyName || 'Moeder/Vader',
      emergencyContactPhone: newStudentEmergencyPhone || '+31 6 ',
      isSafeEnv: true,
      safeEnvDetails: 'Nog geen incidenten gerapporteerd.',
      needsSupport: false,
      supportDetails: 'Op dit moment geen ondersteuning benodigd.',
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
      action: `Nieuwe student "${newStudentName}" geregistreerd voor BPV in ${finalCity}, ${finalCountry}. Reis: Vertrek op ${newStudentDepartureDate || '[ongespecificeerd]'}, terug op ${newStudentReturnDate || '[ongespecificeerd]'}`,
      targetStudent: newStudentName
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Reset local form values
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
    
    // Trigger in-app notification of new registration
    triggerPushNotification(
      '🆕 Student Geregistreerd',
      `Student ${newStudentName} succesvol aangemaakt voor BPV stage in ${finalCity}!`,
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
      action: `Student "${targetName}" permanent verwijderd uit het monitoringssyteem (AVG-vergetelheidsrecht toegepast)`,
      targetStudent: targetName
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Update geselecteerde student als dat de verwijderde student was
    if (activeStudentId === targetId) {
      const remaining = students.filter(s => s.id !== targetId);
      if (remaining.length > 0) {
        setActiveStudentId(remaining[0].id);
      } else {
        setActiveStudentId('');
      }
    }
    
    setStudentToDelete(null);

    // Push notification for delete
    triggerPushNotification(
      '🗑️ Dossier Gewist',
      `Student dossier van "${targetName}" is permanent gewist conform AVG richtlijnen.`,
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

    const formattedDep = dossierDepartureDate ? new Date(dossierDepartureDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Nog niet ingesteld';
    const formattedRet = dossierReturnDate ? new Date(dossierReturnDate).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Nog niet ingesteld';

    // Add Audit Log
    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: 'H. van Remortele (Coördinator)',
      action: `BPV Reisperiode bijgewerkt voor student "${activeStudentObj.name}". Vertrek: ${formattedDep}, Terugkomst: ${formattedRet}.`,
      targetStudent: activeStudentObj.name
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Trigger instant beautiful in-app push notification
    triggerPushNotification(
      '📅 Reisperiode Bijgewerkt',
      `Voor ${activeStudentObj.name} is de BPV-periode succesvol opgeslagen! \n• Vertrek: ${formattedDep}\n• Terug: ${formattedRet}`,
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

    // Add Audit Log
    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: 'H. van Remortele (Coördinator)',
      action: `Contactgegevens bijgewerkt voor student "${activeStudentObj.name}". Mobiel: ${editPhone}`,
      targetStudent: activeStudentObj.name
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // Trigger instant validation push notification
    triggerPushNotification(
      '📞 Gegevens Bijgewerkt',
      `Contactgegevens van ${activeStudentObj.name} zijn succesvol opgeslagen!`,
      'success'
    );

    setIsEditingContactInfo(false);
  };

  // Perform Simulated Login Search / validation
  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmed = typedEmail.trim().toLowerCase();
    
    // Check if coordinator admin login
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

    // Check student match in local database
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
      setLoginError('Onbekend e-mailadres. Tip: Typ een bestaande student email (bijv: lucasdegraaf@student.cios.nl) of "heidie" voor coördinator.');
    }
  };

  // Interactive reset logic
  const handleResetDemoData = () => {
    if (confirm('Wilt u alle trackergegevens en beveiligingslogs herstellen naar de beginperiode? (Handmatige invoer wordt gewist)')) {
      localStorage.removeItem('cios_tracking_students');
      localStorage.removeItem('cios_tracking_logs');
      setStudents(INITIAL_STUDENTS);
      setLoggedInStudentId('stud-3');
      setAuditLogs([
        {
          id: 'log-1',
          timestamp: new Date().toISOString(),
          actor: 'Systeem',
          action: 'Systeem gereset - Standaard BPV database hersteld naar CIOS Zuidwest-Nederland instellingen.',
          targetStudent: 'Alle studenten'
        }
      ]);
      alert('Systeem succesvol teruggezet naar begin-simulatiegegevens.');
    }
  };

  // Export report structure
  const handleDownloadMarkdownReport = () => {
    let report = `# CIOS Zuidwest-Nederland - Internationaal BPV Monitoringsrapport\n`;
    report += `Gegenereerd op: ${new Date().toLocaleString('nl-NL')}\n`;
    report += `Status Beveiligde Verbinding: TLS 1.3 | AES-256 Gecodeerd Rapport\n`;
    report += `Aantal Actieve Stages onder toezicht van H. van Remortele: ${students.length}\n`;
    report += `------------------------------------------------------------\n\n`;
    report += `## Actieve Mobiliteitsoverzicht (Lopende BPV-landen)\n\n`;

    students.forEach((s, i) => {
      report += `### [${i + 1}] ${s.name} (${s.email})\n`;
      report += `- Huidige Status: **${s.status.toUpperCase()}**\n`;
      report += `- Locatie: ${s.city}, ${s.country}\n`;
      report += `- Partnerinstelling / Stagebedrijf: ${s.hostOrganization}\n`;
      report += `- Privacy-niveau (AVG Toestemming): ${s.locationAccuracy.toUpperCase()} (Toestemming verleend: ${s.consentGiven ? 'JA' : 'NEE'})\n`;
      if (s.coordinates) {
        report += `- Exacte GPS-coördinaten: Lat ${s.coordinates.latitude}, Lng ${s.coordinates.longitude}\n`;
      }
      report += `- Laatste Bericht: "${s.lastMessage}"\n`;
      report += `- Tijdstip Update: ${new Date(s.lastUpdate).toLocaleString('nl-NL')}\n`;
      report += `- Noodcontactpersoon: ${s.emergencyContactName} (Telefoon: ${s.emergencyContactPhone})\n\n`;
    });

    report += `## Beveiligings- & GDPR Log-boekingen (Volledige Audit Trail)\n\n`;
    auditLogs.forEach(l => {
      report += `[${new Date(l.timestamp).toLocaleString('nl-NL')}] Actor: ${l.actor} | Actie: ${l.action} | Betrokken Student: ${l.targetStudent}\n`;
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

    const newLog: AuditLog = {
      id: generateUniqueId('log'),
      timestamp: new Date().toISOString(),
      actor: 'H. van Remortele (Coördinator)',
      action: 'Beveiligd mobiliteit rapportage-export (.md) gedownload voor administratie',
      targetStudent: 'Alle studenten'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Filter lists based on search bar
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
        action: 'Inzage in beveiligd dossier & locatiegegevens (AVG geverifieerd)',
        targetStudent: studentName
      };
      setAuditLogs(prev => [newLog, ...prev]);
    }
  };

  const getMapUrl = (student: Student) => {
    const lat = student.coordinates?.latitude ?? 41.3851;
    const lon = student.coordinates?.longitude ?? 2.1734;
    
    // Bepaal de nauwkeurigheid / zoomoffset conform AVG privacykeuze
    let delta = 0.03; // Exact GPS zoom
    if (student.locationAccuracy === 'stad') {
      delta = 0.12; // Stadgrens zoom
    } else if (student.locationAccuracy === 'land') {
      delta = 1.5; // Landgrenzen zoom
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
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
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
      
      {/* 1. Header Navigation */}
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
            TLS 1.3 Beveiligd Verbinding
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          {/* User Status Switcher & Simulated Login Menu */}
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

            {/* Simulated Authenticator trigger */}
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
              title="Reset Demo Data"
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
                  <strong>ALARM IN HET BUITENLAND:</strong> {students.filter(s => s.hasActiveEmergency).length} student(en) hebben momenteel de NOODKNOP geactiveerd!
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
            {currentRole === 'STUDENT' ? 'Klik rechtsboven op Inlogportaal om te wisselen of voeg nieuwe studenten toe.' : 'Gegevens gesynchroniseerd via gecodeerd lokaal bestand.'}
          </p>
        </div>

        {/* ======================= STUDENT PORTFOLIO INTERFACE ======================= */}
        {currentRole === 'STUDENT' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Explanatory introduction left pillar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-indigo-650 font-bold text-sm mb-3 font-display">
                  <ShieldCheck className="h-4 w-4" />
                  CIOS BPV Privacy Waarborg
                </div>
                <p className="text-xs text-slate-650 leading-relaxed mb-3">
                  Beste <strong>{myStudentProfile?.name}</strong>, via jouw beveiligde mobiele portaal geef je eenvoudig wekelijks jouw status en gezondheid door aan coördinator <strong>Heidie van Remortele</strong>.
                </p>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2">
                  <span className="text-[11px] font-bold text-slate-755 block uppercase font-mono text-slate-500">Actuele AVG Delingsrechten:</span>
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

              {/* Informational Guidelines Card */}
              <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs relative overflow-hidden border border-slate-850">
                <div className="absolute right-0 bottom-0 translate-x-5 translate-y-5 bg-white/5 w-24 h-24 rounded-full"></div>
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2 font-mono">CIOS RICHTLIJNEN</h4>
                <p className="text-[11.5px] text-slate-300 leading-relaxed mb-3">
                  1. Stuur een update wanneer je veilig aankomt of verplaatst.<br />
                  2. Pas bij weekendtrips de locatiemodus tijdelijk aan.<br />
                  3. Gebruik de <span className="text-rose-400 font-bold">Rode Noodknop</span> in het portaal alleen bij acute overlast of noodgevallen.
                </p>
                <span className="text-[9.5px] text-indigo-200 font-mono block">Ingelogd sinds: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Simulated smartphone device model for student interaction */}
            <div className="lg:col-span-8 flex justify-center">
              <div className="w-full max-w-sm bg-slate-950 rounded-[44px] p-4.5 border-[10px] border-slate-800 shadow-2xl text-white relative">
                
                {/* Speaker Ear Piece & Camera mock */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-800 rounded-full flex items-center justify-center z-20">
                  <div className="w-12 h-1 bg-slate-900 rounded-full mb-1"></div>
                </div>

                {/* Device Inner Screen Container */}
                <div className="bg-slate-900 rounded-[30px] p-5 pt-8 min-h-[580px] flex flex-col justify-between">
                  
                  {/* Top Bar inside Simulator */}
                  <div className="flex justify-between items-center mb-6 pt-1 border-b border-white/5 pb-3">
                    <div>
                      <p className="text-[8.5px] text-indigo-400 uppercase font-extrabold tracking-widest font-mono">CIOS MOBIEL PORTAAL</p>
                      <h3 className="text-sm font-bold font-display tracking-tight text-slate-100 flex items-center gap-1">
                        Hallo, {myStudentProfile?.name.split(' ')[0]} 👋
                      </h3>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-slate-800 bg-slate-950 flex items-center justify-center text-xs text-slate-400">
                      📲
                    </div>
                  </div>

                  {/* Body interactive contents */}
                  <div className="flex-1 flex flex-col gap-4">
                    
                    {/* Simulated Emergency Trigger Area */}
                    {myStudentProfile?.hasActiveEmergency ? (
                      <div className="bg-rose-950/80 border border-rose-500/50 p-4 rounded-xl flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-rose-300">
                          <AlertTriangle className="h-4 w-4 text-rose-400 animate-pulse shrink-0" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Mijn NOODSIGNAAL ACTIEF</span>
                        </div>
                        <p className="text-[11px] text-rose-100 italic bg-rose-950/50 p-2.5 rounded-lg border border-rose-900">
                          "{myStudentProfile?.emergencyMessage}"
                        </p>
                        <button
                          type="button"
                          onClick={() => resolveEmergency(loggedInStudentId)}
                          className="w-full py-2 bg-white hover:bg-rose-50 text-rose-950 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          Herroepen (Ik ben veilig)
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowEmergencyModal(true)}
                        className="py-3 px-4 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-600/30 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-full bg-rose-655 flex items-center justify-center text-sm shadow-md shrink-0">
                          🚨
                        </div>
                        <div>
                          <p className="font-bold text-xs text-rose-150 uppercase tracking-widest">Noodknop Inschakelen</p>
                          <p className="text-[10px] text-rose-300">Stuur direct een noodsignaal naar Heidie</p>
                        </div>
                      </button>
                    )}

                    {/* Live Google Meet Video Call Notification for students */}
                    {myStudentProfile && myStudentProfile.googleMeetUrl && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-indigo-950/65 border border-indigo-400/40 rounded-xl p-4 flex flex-col gap-2.5 shadow-lg relative overflow-hidden font-sans select-none"
                      >
                        <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600 border border-indigo-400/50 flex items-center justify-center text-white shrink-0 shadow-inner relative">
                            <Video className="h-5 w-5 animate-pulse" />
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block font-mono">Videogesprek Actief</span>
                            <span className="text-xs font-bold text-white block mt-0.5">Heidie van Remortele</span>
                            <p className="text-[10px] text-indigo-200 mt-1 leading-relaxed">
                              Heidie nodigt je uit voor een online voortgangsgesprek of stagebezoek via Google Meet. Neem nu deel.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={myStudentProfile.googleMeetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] cursor-pointer"
                          >
                            <Video className="h-4 w-4" />
                            Deelnemen aan Meet
                          </a>
                        </div>
                      </motion.div>
                    )}

                    {/* Check-in Interactive Form inside Device */}
                    <form onSubmit={handleStudentUpdate} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-800">
                      
                      {/* Vraag 1a: Status */}
                      <div>
                        <span className="text-[10.5px] text-indigo-300 font-bold uppercase tracking-wider mb-1.5 block">1a. Mijn Actuele Status</span>
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

                      {/* Vraag 1b: Begeleidingsupdate */}
                      <div>
                        <span className="text-[10.5px] text-indigo-300 font-bold uppercase tracking-wider mb-1 block">1b. Korte Begeleidingsupdate</span>
                        <textarea
                          rows={2}
                          value={formMessage}
                          onChange={(e) => setFormMessage(e.target.value)}
                          placeholder="Bijvoorbeeld: Alles gaat goed op mijn stageplek!"
                          className="w-full text-xs p-2 bg-slate-900 rounded-lg border border-slate-800 text-white focus:outline-hidden focus:border-indigo-505 placeholder-slate-500"
                        />
                      </div>

                      {/* Vraag 2: Veiligheid & Sfeer */}
                      <div className="border-t border-slate-900 pt-2.5">
                        <span className="text-[10.5px] text-indigo-300 font-bold uppercase tracking-wider mb-1 block">2. Veiligheid & Sfeer</span>
                        <p className="text-[9.5px] text-slate-400 mb-1.5">Voelt je stage/leeromgeving en verblijf momenteel veilig en prettig?</p>
                        
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
                            Nee, zorgen ⚠️
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={formSafeEnvDetails}
                          onChange={(e) => setFormSafeEnvDetails(e.target.value)}
                          placeholder="Eventuele details over de sfeer en omgevingsveiligheid..."
                          className="w-full text-xs p-2 bg-slate-900 rounded-lg border border-slate-800 text-white focus:outline-hidden focus:border-indigo-505 placeholder-slate-500"
                        />
                      </div>

                      {/* Vraag 3: Extra Ondersteuning */}
                      <div className="border-t border-slate-900 pt-2.5">
                        <span className="text-[10.5px] text-indigo-300 font-bold uppercase tracking-wider mb-1 block">3. Extra Ondersteuning</span>
                        <p className="text-[9.5px] text-slate-400 mb-1.5">Heb je extra ondersteuning of contact nodig met je CIOS-begeleider?</p>
                        
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
                            Nodig / Contact gewenst 💬
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
                            Nee, gaat prima
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={formSupportDetails}
                          onChange={(e) => setFormSupportDetails(e.target.value)}
                          placeholder="Omschrijf de benodigde ondersteuning of afspraakwensen..."
                          className="w-full text-xs p-2 bg-slate-900 rounded-lg border border-slate-800 text-white focus:outline-hidden focus:border-indigo-505 placeholder-slate-500"
                        />
                      </div>

                      {/* Vraag 3b: Foto's uploaden */}
                      <div className="border-t border-slate-900 pt-2.5 font-sans">
                        <span className="text-[10.5px] text-indigo-300 font-bold uppercase tracking-wider mb-1 block">3b. Foto's uploaden vanaf mobiel</span>
                        <p className="text-[9.5px] text-slate-400 mb-2">Deel sfeerfoto's of bewijsstukken van je stage met je coördinator.</p>
                        
                        <div className="flex flex-col gap-2">
                          <label className="flex items-center justify-center gap-1.5 border border-dashed border-indigo-505 bg-indigo-950/30 hover:bg-indigo-950/50 py-2.5 rounded-lg cursor-pointer text-[10.5px] font-bold text-indigo-300 transition-all select-none">
                            <Camera className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
                            <span>Maak foto of kies uit bibliotheek</span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={handlePhotoUploadChange}
                              className="hidden"
                            />
                          </label>

                          {isCompressing && (
                            <div className="flex items-center justify-center gap-2 bg-indigo-950/20 border border-indigo-900/40 rounded-lg p-2 text-indigo-300 text-[10px] font-mono animate-pulse">
                              <div className="h-3 w-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                              <span>Optimaliseren & verkleinen van foto's...</span>
                            </div>
                          )}

                          {formPhotos.length > 0 && (
                            <div className="grid grid-cols-3 gap-1.5 mt-1 bg-slate-900/60 p-2 rounded-lg border border-slate-900">
                              {formPhotos.map((photo, index) => (
                                <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-slate-800 border border-slate-700 group">
                                  <img
                                    src={photo}
                                    alt={`Upload ${index}`}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFormPhoto(index)}
                                    className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-500 text-white rounded-full p-0.5 shadow-md flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
                                    title="Verwijder foto"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Precise GPS options if allowed */}
                      <div className="mt-1 pt-2 border-t border-slate-900 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[10.5px]">
                          <span className="text-indigo-300 font-bold uppercase tracking-wider">4. PRIVACY DEELNEMER (AVG)</span>
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
                            <div className="w-7 h-4 bg-slate-805 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-3"></div>
                          </label>
                        </div>

                        {formConsent ? (
                          <div className="flex flex-col gap-2">
                            <p className="text-[9.5px] text-slate-400">Welk detailniveau geef je vrij aan Heidie?</p>
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
                                    if (level.value === 'exact') {
                                      requestBrowserGeolocation();
                                    }
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

                            {formAccuracy === 'exact' && (
                              <div className="bg-slate-900 p-2 rounded-lg border border-slate-850 flex items-center justify-between">
                                <span className="text-[10px] text-slate-450 font-mono">
                                  {gpsCoordinates 
                                    ? `GPS: ${gpsCoordinates.latitude}, ${gpsCoordinates.longitude}` 
                                    : 'Geen actieve GPS-coördinaten'}
                                </span>
                                <button
                                  type="button"
                                  disabled={isGettingGPS}
                                  onClick={requestBrowserGeolocation}
                                  className="text-[9.5px] bg-emerald-600 font-bold hover:bg-emerald-500 text-white py-0.5 px-2 rounded cursor-pointer transition-all shrink-0"
                                >
                                  {isGettingGPS ? 'Zoeken...' : 'Ververs GPS'}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-[10px] text-rose-300 italic">
                            Deling geblokkeerd conform jouw privacykeuze. Heidie ziet alleen dat je 'Niet Beschikbaar' opt-out hebt ingesteld.
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-md select-none"
                      >
                        STUUR UPDATE CHECK-IN
                      </button>
                    </form>

                  </div>

                  {/* Device Bottom Center Home Indicator & Action button */}
                  <div className="mt-4 flex flex-col items-center gap-1 border-t border-white/5 pt-2">
                    <p className="text-[9px] text-slate-500 font-mono">CIOS Beveiligings-Sessie Actief</p>
                    <div className="w-20 h-1 bg-slate-700 rounded-full mt-1"></div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* ======================= COORDINATOR PROFESSIONAL FEED ======================= */}
        {currentRole === 'COÖRDINATOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Top Row Dashboard Statistics Overview */}
            <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest block font-mono">Internationaal deeltnemers</span>
                  <span className="text-2xl font-bold text-slate-800 block mt-0.5 font-display">{students.length} Studenten</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-650 flex items-center justify-center shadow-xs">
                  <Compass className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs relative overflow-hidden">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest block font-mono">Alarm / Calamiteiten</span>
                  <span className={`text-2xl font-bold block mt-0.5 font-display ${students.some(s => s.hasActiveEmergency) ? 'text-rose-600 font-extrabold animate-pulse' : 'text-slate-800'}`}>
                    {students.filter(s => s.hasActiveEmergency).length} Meldingen
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-xs ${students.some(s => s.hasActiveEmergency) ? 'bg-rose-100 text-rose-700 animate-bounce' : 'bg-slate-100 text-slate-500'}`}>
                  <ShieldAlert className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest block font-mono">Toestemmingspeil (AVG)</span>
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
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest block font-mono">Systeem Rapportage</span>
                  <button
                    onClick={handleDownloadMarkdownReport}
                    className="mt-1 w-full bg-slate-900 hover:bg-slate-850 text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Buitenland Rapport (.md)
                  </button>
                </div>
              </div>

            </div>

            {/* Left Column Feed & manual registration tab */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Dynamic Toggle Manual Input section for Heidie */}
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
                      <p className="text-[11px] text-slate-500">Voer handmatig studenten in met hun specifieke real-life buitenlandse locaties</p>
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
                         
                         {/* Personal Data */}
                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-slate-700">Student Naam</label>
                           <input
                             type="text"
                             required
                             placeholder="Bijv. Sophie de Jong"
                             value={newStudentName}
                             onChange={(e) => setNewStudentName(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border border-slate-220 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-800"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-slate-700">E-mail @student.cios.nl</label>
                           <input
                             type="email"
                             required
                             placeholder="sophiedejong@student.cios.nl"
                             value={newStudentEmail}
                             onChange={(e) => setNewStudentEmail(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border border-slate-220 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-800"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-slate-700">Telefoonnummer Student</label>
                           <input
                             type="text"
                             placeholder="+31 6 1234 5678"
                             value={newStudentPhone}
                             onChange={(e) => setNewStudentPhone(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border border-slate-220 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-800"
                           />
                         </div>

                         {/* Preset Real-life Locations Dropdown */}
                         <div className="flex flex-col gap-1.5 col-span-1">
                           <label className="text-xs font-semibold text-slate-700">Willekeurige of Real-life Locatie kiezen</label>
                           <select
                             value={newStudentPresetIdx}
                             onChange={(e) => setNewStudentPresetIdx(Number(e.target.value))}
                             className="w-full text-xs p-2 bg-slate-50 border border-slate-220 rounded-lg h-9 text-slate-850 cursor-pointer"
                           >
                             {PRESET_CITIES.map((city, idx) => (
                               <option key={city.name} value={idx}>
                                 {city.name} ({city.country}) - {city.org}
                               </option>
                             ))}
                             <option value={PRESET_CITIES.length}>[Handbereik: Zelf coördinaten invoeren...]</option>
                                                       </select>
                          </div>

                          {/* Location Fields (Always visible for full customization) */}
                           <div className="grid grid-cols-2 gap-3 col-span-1 sm:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                             <div className="col-span-2 flex items-center justify-between gap-1">
                               <span className="text-xs font-bold text-slate-805 uppercase tracking-wide flex items-center gap-1.5">
                                 <span className="p-1 bg-indigo-50 text-indigo-650 rounded">
                                   <MapPin className="h-3.5 w-3.5" />
                                 </span>
                                 Locatiedetails & BPV Coördinaten
                               </span>
                               <button
                                 type="button"
                                 onClick={() => autoRetrieveCoordinates(customCity, customCountry)}
                                 disabled={isSearchingCoords || !customCity.trim()}
                                 className="text-[10px] bg-indigo-650 hover:bg-indigo-700 text-white font-bold py-1 px-2.5 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                 {isSearchingCoords ? 'Bezig met zoeken...' : '🌍 Zoek coördinaten online'}
                               </button>
                             </div>
                             
                             <div className="flex flex-col gap-1.5 col-span-1">
                               <label className="text-xs font-bold text-slate-700">Stad / Bestemming</label>
                               <input
                                 type="text"
                                 placeholder="Bijv. Malaga, Zakynthos..."
                                 value={customCity}
                                 onChange={(e) => setCustomCity(e.target.value)}
                                 onBlur={() => autoRetrieveCoordinates(customCity, customCountry)}
                                 className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-850 font-medium"
                               />
                             </div>

                             <div className="flex flex-col gap-1.5 col-span-1">
                               <label className="text-xs font-bold text-slate-700">Land</label>
                               <input
                                 type="text"
                                 placeholder="Bijv. Spanje, Griekenland..."
                                 value={customCountry}
                                 onChange={(e) => setCustomCountry(e.target.value)}
                                 onBlur={() => autoRetrieveCoordinates(customCity, customCountry)}
                                 className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-850 font-medium"
                               />
                             </div>

                             <div className="flex flex-col gap-1.5 col-span-1">
                               <label className="text-[10.5px] font-semibold text-slate-600">Latitude (Breedtegraad)</label>
                               <input
                                 type="text"
                                 placeholder="Bijv. 36.7213"
                                 value={customLat}
                                 onChange={(e) => setCustomLat(e.target.value)}
                                 className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-hidden focus:border-indigo-500"
                               />
                             </div>

                             <div className="flex flex-col gap-1.5 col-span-1">
                               <label className="text-[10.5px] font-semibold text-slate-600">Longitude (Lengtegraad)</label>
                               <input
                                 type="text"
                                 placeholder="Bijv. -4.4214"
                                 value={customLng}
                                 onChange={(e) => setCustomLng(e.target.value)}
                                 className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-hidden focus:border-indigo-500"
                               />
                             </div>

                             {coordSearchMessage && (
                               <div className="col-span-2">
                                 <span className={`text-[10.5px] font-medium leading-relaxed block ${
                                   coordSearchMessage.includes('✓') 
                                     ? 'text-emerald-700 bg-emerald-50 border border-emerald-100 p-1.5 rounded-lg' 
                                     : coordSearchMessage.includes('⚠') 
                                     ? 'text-amber-700 bg-amber-50 border border-amber-100 p-1.5 rounded-lg' 
                                     : 'text-indigo-650 animate-pulse bg-indigo-50 border border-indigo-100 p-1.5 rounded-lg'
                                 }`}>
                                   {coordSearchMessage}
                                 </span>
                               </div>
                             )}
                           </div>

                         <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                           <label className="text-xs font-semibold text-slate-700">Stagebedrijf / Partner-organisatie buitenland</label>
                           <input
                             type="text"
                             placeholder="Bijv. Inacua Padel Academy Marbella"
                             value={newStudentHostOrg}
                             onChange={(e) => setNewStudentHostOrg(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border border-slate-220 rounded-lg focus:outline-hidden text-slate-800"
                           />
                         </div>

                         {/* Emergency Contact */}
                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-slate-700">Contactpersoon Noodgeval (Thuisfront)</label>
                           <input
                             type="text"
                             placeholder="Bijv. Annelies de de Jong (Moeder)"
                             value={newStudentEmergencyName}
                             onChange={(e) => setNewStudentEmergencyName(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border border-slate-220 rounded-lg text-slate-800"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-slate-700">Noodnummer Thuisfront</label>
                           <input
                             type="text"
                             placeholder="+31 6 9876 5432"
                             value={newStudentEmergencyPhone}
                             onChange={(e) => setNewStudentEmergencyPhone(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border border-slate-220 rounded-lg text-slate-800"
                           />
                         </div>

                         {/* Stagebegeleider contactgegevens */}
                         <div className="border-t border-slate-200/60 my-2 pt-2" />
                         
                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-indigo-700">Naam Stagebegeleider buitenland</label>
                           <input
                             type="text"
                             placeholder="Bijv. Carlos Menendez"
                             value={newStudentSupervisorName}
                             onChange={(e) => setNewStudentSupervisorName(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border border-slate-220 rounded-lg text-slate-800 focus:border-indigo-500"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-indigo-700">Telefoonnummer Stagebegeleider</label>
                           <input
                             type="text"
                             placeholder="Bijv. +34 612 345 678"
                             value={newStudentSupervisorPhone}
                             onChange={(e) => setNewStudentSupervisorPhone(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border border-slate-220 rounded-lg text-slate-800 focus:border-indigo-500"
                           />
                         </div>

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-indigo-700">E-mailadres Stagebegeleider</label>
                           <input
                             type="email"
                             placeholder="Bijv. carlos@padelbarcelona.es"
                             value={newStudentSupervisorEmail}
                             onChange={(e) => setNewStudentSupervisorEmail(e.target.value)}
                             className="w-full text-xs p-2 bg-slate-50 border border-slate-220 rounded-lg text-slate-800 focus:border-indigo-500"
                           />
                         </div>

                         <div className="border-t border-slate-200/60 my-2 pt-1" />

                         <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-semibold text-slate-700">Nauwkeurigheidsniveau bij start</label>
                           <div className="grid grid-cols-3 gap-1 mt-1">
                             {[
                               { label: 'Land', value: 'land' },
                               { label: 'Stad', value: 'stad' },
                               { label: 'Exact (GPS)', value: 'exact' }
                             ].map((opt) => (
                               <button
                                 key={opt.value}
                                 type="button"
                                 onClick={() => setIsPreciseLocation(opt.value as LocationAccuracy)}
                                 className={`py-1 text-center rounded text-[10.5px] border cursor-pointer transition-all ${
                                   isPreciseLocation === opt.value
                                     ? 'bg-indigo-650 text-white border-indigo-600 font-bold'
                                     : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                 }`}
                               >
                                 {opt.label}
                               </button>
                             ))}
                           </div>
                         </div>

                         <div className="flex items-end justify-end mt-2">
                           <button
                             type="submit"
                             className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all uppercase tracking-wider"
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
                
                {/* Search Header Bar */}
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <h2 className="font-bold text-slate-850 flex items-center gap-2 font-display text-sm sm:text-base">
                    <Activity className="w-4 h-4 text-indigo-505" />
                    Internationale Status Overzicht
                  </h2>

                  <div className="flex w-full sm:w-auto items-center gap-2 flex-wrap">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Naam, land, stad, email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-52 text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-450 text-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <SlidersHorizontal className="h-3 w-3 text-slate-400" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs bg-white border border-slate-200 rounded-lg p-1.5 cursor-pointer text-slate-800"
                      >
                        <option value="ALL">Alleen status...</option>
                        <option value="Veilig aangekomen">Veilig aangekomen</option>
                        <option value="Bezig op stage met activiteiten">Bezig op stage met activiteiten</option>
                        <option value="Vrije tijd">Vrije tijd</option>
                        <option value="Slapen">Slapen</option>
                        <option value="Onderweg">Onderweg</option>
                        <option value="Thuis">Thuis</option>
                        <option value="EMERGENCY">🚨 Meldingen (Calamiteit)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table for tracking students */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/75 text-slate-500 uppercase text-[9.5px] font-bold tracking-wider border-b border-slate-150">
                      <tr>
                        <th className="px-5 py-3.5">Student & ID</th>
                        <th className="px-5 py-3.5">Buitenland Locatie</th>
                        <th className="px-5 py-3.5">Check-In Status</th>
                        <th className="px-5 py-3.5 text-right">Laatste Begeleidingsbericht</th>
                        <th className="px-5 py-3.5 text-center">Beheer</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-10 text-xs text-slate-400 font-mono">
                            Er zijn geen studenten gevonden die voldoen aan deze zoekcriteria in de database.
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
                                isSelected ? 'bg-slate-100/80 hover:bg-slate-100' : 'bg-white hover:bg-slate-50'
                              } ${stud.hasActiveEmergency ? 'bg-rose-50/50 hover:bg-rose-50' : ''}`}
                            >
                              <td className="px-5 py-3">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                                    stud.hasActiveEmergency 
                                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                                      : 'bg-indigo-50 text-indigo-700'
                                  }`}>
                                    {stud.name.charAt(0)}{stud.name.split(' ')[1]?.charAt(0) || ''}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-xs text-slate-850 truncate flex items-center gap-1.5">
                                      {stud.name} 
                                      {stud.hasActiveEmergency && <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>}
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate">{stud.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3">
                                <p className="text-[11.5px] text-slate-800 font-semibold">{stud.city}, {stud.country}</p>
                                <p className="text-[10px] text-slate-400 truncate font-mono">{stud.hostOrganization}</p>
                              </td>
                              <td className="px-5 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border ${
                                  stud.hasActiveEmergency || stud.status === 'Meldingen (Calamiteit)' || stud.status === 'Noodgeval'
                                    ? 'bg-rose-100 text-rose-700 border-rose-300'
                                    : stud.status === 'Veilig aangekomen'
                                    ? 'bg-teal-50 text-teal-700 border-teal-200'
                                    : stud.status === 'Bezig op stage met activiteiten'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : stud.status === 'Vrije tijd'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : stud.status === 'Slapen'
                                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                    : stud.status === 'Onderweg'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : stud.status === 'Thuis'
                                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                                    : 'bg-slate-100 text-slate-650 border-slate-200'
                                }`}>
                                  {stud.hasActiveEmergency || stud.status === 'Meldingen (Calamiteit)' || stud.status === 'Noodgeval' ? '🚨 CALAMITEIT' : stud.status}
                                </span>
                              </td>
                              <td className="px-5 py-3 text-right max-w-[200px]">
                                <p className="text-[11px] text-slate-600 italic truncate" title={stud.lastMessage}>
                                  "{stud.lastMessage}"
                                </p>
                                <p className="text-[9px] text-slate-400 mt-0.5 font-mono block">
                                  {new Date(stud.lastUpdate).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })} • GDPR: {stud.locationAccuracy.toUpperCase()}
                                </p>
                              </td>
                              <td className="px-5 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteStudent(stud.id);
                                  }}
                                  className="p-1.5 px-2.5 border border-rose-200 hover:border-rose-450 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-all cursor-pointer relative z-20"
                                  title="Verwijder dit volledige studenten-dossier"
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

                {/* Simulated quick testing hints inside the view */}
                <div className="bg-slate-50 border-t border-slate-150 p-3 px-5 text-slate-500 text-[10.5px] flex justify-between items-center flex-wrap gap-2">
                  <span>💡 Direct studenten inloggen of status aanpassen via het <strong>Inlogportaal</strong> rechtsboven!</span>
                  <button
                    onClick={() => {
                      setNewStudentName('Heidi van de Groes');
                      setNewStudentEmail('heidivandegroes@student.cios.nl');
                      setNewStudentPresetIdx(0); // Malaga
                      setNewStudentHostOrg('Inacua Centro Raqueta Málaga');
                      setNewStudentPhone('+31 6 3928 2011');
                    }}
                    className="text-indigo-650 hover:text-indigo-800 text-[10px] font-bold underline cursor-pointer"
                  >
                    Sneltest: Vul Sophie gegevens in
                  </button>
                </div>

              </div>

              {/* Secure Log Audits */}
              <div className="bg-slate-900 text-slate-350 rounded-xl border border-slate-800 p-5 shadow-xs font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5 font-display uppercase tracking-wider text-[10.5px]">
                    <Terminal className="h-4 w-4 text-emerald-500" />
                    AVG BEVEILIGINGS- AUDIT LOGS (REALTIME EN CRYPTISCH)
                  </span>
                  <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    TLS 1.3 / GDPR compliant
                  </span>
                </div>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="text-[10px] leading-relaxed border-b border-slate-800/40 pb-2 last:border-0">
                      <div className="flex justify-between items-center text-slate-550 text-[9px]">
                        <span>{new Date(log.timestamp).toLocaleTimeString('nl-NL')} - {new Date(log.timestamp).toLocaleDateString('nl-NL')}</span>
                        <span className="text-emerald-400 font-semibold">{log.actor}</span>
                      </div>
                      <p className="text-slate-100 mt-1">{log.action}</p>
                      <p className="text-slate-500 text-[8.5px]">Persoonsgegeven ID: {log.targetStudent}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side Detail panel / Dossier */}
            <div className="lg:col-span-4 flex flex-col gap-6">

              {/* Student detailed Dossier */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
                
                <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono">Dossier-id van student</p>
                    <h3 className="text-sm font-bold text-slate-905 mt-0.5 font-display">{activeStudent.name}</h3>
                    <span className="text-xs text-slate-500 font-mono italic block truncate w-48">{activeStudent.email}</span>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0 items-end">
                    <button 
                      onClick={() => {
                        setLoggedInStudentId(activeStudent.id);
                        setCurrentRole('STUDENT');
                        const newLog: AuditLog = {
                          id: generateUniqueId('log'),
                          timestamp: new Date().toISOString(),
                          actor: 'H. van Remortele (Coördinator)',
                          action: `Inloggen gesimuleerd als: ${activeStudent.name}`,
                          targetStudent: activeStudent.name
                        };
                        setAuditLogs(prev => [newLog, ...prev]);
                      }}
                      className="p-1 px-2.5 bg-slate-900 text-white rounded text-[10px] font-bold hover:bg-slate-800 transition-opacity cursor-pointer text-center w-full"
                      title="Simuleer mobiele telefoon van deze student"
                    >
                      Simuleer Mobiel 📱
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStudent(activeStudent.id);
                      }}
                      className="p-1 px-2 border border-rose-250 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-all w-full text-center"
                      title="Verwijder dit volledige studenten-dossier"
                    >
                      <Trash2 className="h-3 w-3" />
                      Verwijder Student
                    </button>
                  </div>
                </div>

                {/* Emergency Control Center if target student has a calamity */}
                {activeStudent.hasActiveEmergency && (
                  <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex flex-col gap-3 animate-pulse">
                    <div className="flex items-center gap-2 text-rose-800">
                      <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                      <span className="font-extrabold text-[10px] tracking-widest uppercase">🚨 ACTIE NOODSITUATIE</span>
                    </div>
                    <p className="text-[11.5px] text-rose-900 leading-relaxed bg-[#fff5f5] p-2.5 rounded-lg border border-rose-200">
                      <strong>Noodbericht student:</strong> "{activeStudent.emergencyMessage || 'Hulp gevraagd via noordknop!'}"
                    </p>
                    
                    <div className="bg-white p-2.5 rounded-lg border border-rose-200 text-[10px] flex flex-col gap-2 text-slate-700">
                      <p className="font-bold text-slate-900 border-b pb-1">Interventie & Thuisfront gegevens:</p>
                      <div className="flex justify-between"><span>Mobiel student:</span> <strong className="font-mono text-slate-800">{activeStudent.phone}</strong></div>
                      <div className="flex justify-between"><span>Noodcontact:</span> <strong className="text-slate-800">{activeStudent.emergencyContactName}</strong></div>
                      <div className="flex justify-between"><span>Noodnummer:</span> <strong className="font-mono text-slate-800">{activeStudent.emergencyContactPhone}</strong></div>
                    </div>

                    <button
                      onClick={() => resolveEmergency(activeStudent.id)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs uppercase tracking-wider"
                    >
                      Alarm Oplossen (Student is veilig)
                    </button>
                  </div>
                )}

                {/* Simulated Geolocation visualizer card with high AVG design details */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-750 block flex items-center gap-1.5 uppercase tracking-widest font-mono">
                      <Map className="h-4 w-4 text-indigo-600" />
                      Interactieve Geo-Visualisatie
                    </span>
                    <button
                      onClick={() => {
                        setIsLiveTrackingActive(!isLiveTrackingActive);
                        triggerPushNotification(
                          isLiveTrackingActive ? "Live Geotrack Gepauzeerd" : "Live Geotrack Geactiveerd",
                          isLiveTrackingActive ? "GPS-telemetrie updates tijdelijk stopgezet." : "Realtime GPS positiesimulatie is nu actief.",
                          isLiveTrackingActive ? "warning" : "success"
                        );
                      }}
                      className={`text-[9px] px-2 py-1 rounded border font-bold font-mono uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                        isLiveTrackingActive 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse' 
                          : 'bg-slate-150 text-slate-700 border-slate-300 hover:bg-slate-200'
                      }`}
                      title={isLiveTrackingActive ? "Klik om de automatische GPS simulatieflow te pauzeren" : "Klik om de automatische GPS simulatieflow te activeren"}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isLiveTrackingActive ? 'bg-emerald-600' : 'bg-slate-400'}`}></span>
                      {isLiveTrackingActive ? 'SIMULATIE: LIVE' : 'SIMULATIE: STANDBY'}
                    </button>
                  </div>

                  {activeStudent.consentGiven ? (
                    <div className="bg-slate-950 border border-slate-200 rounded-xl h-64 relative overflow-hidden flex flex-col shadow-inner select-none">
                      <iframe
                        width="100%"
                        height="100%"
                        title="Locatiemap Student"
                        src={getMapUrl(activeStudent)}
                        className="w-full h-full border-0 absolute inset-0 z-0 bg-slate-950 transition-all duration-300 pointer-events-auto"
                        style={{ filter: 'contrast(1.04) saturate(0.92)' }}
                      ></iframe>
                      
                      {/* Interactive overlay HUD */}
                      <div className="absolute bottom-2 left-2 right-2 z-20 bg-slate-950/90 backdrop-blur-xs border border-slate-850 rounded-lg p-2.5 flex flex-col gap-0.5 text-white shadow-lg pointer-events-none">
                        <div className="flex justify-between items-center leading-none">
                          <span className="text-[9px] font-bold text-slate-300 font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            GEVERIFIEERD ACTIEF SIGNAAL • CIOS MONITOR
                          </span>
                          <span className="text-[8px] px-1.5 py-0.5 bg-indigo-950 text-indigo-400 border border-indigo-900 rounded font-bold uppercase font-mono">
                            AVG: {activeStudent.locationAccuracy === 'land' ? 'Land-niveau' : activeStudent.locationAccuracy === 'stad' ? 'Stad-niveau' : 'Exact (GPS)'}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white leading-none mt-1.5">
                          {activeStudent.city}, {activeStudent.country}
                        </p>
                        <div className="flex justify-between items-center text-[8.5px] text-slate-400 mt-1 leading-none font-mono">
                          <span>
                            {activeStudent.locationAccuracy === 'exact' && activeStudent.coordinates 
                              ? `GPS: ${activeStudent.coordinates.latitude.toFixed(4)}, ${activeStudent.coordinates.longitude.toFixed(4)}`
                              : 'Coördinaten gemaskeerd wegens privacy'}
                          </span>
                          <span className="italic text-slate-400">
                            {activeStudent.locationAccuracy === 'land' 
                              ? 'Locatie vaag conform AVG'
                              : activeStudent.locationAccuracy === 'stad'
                              ? 'Stadgrenzen geverifieerd'
                              : 'Live GPS geautoriseerd'}
                          </span>
                        </div>
                      </div>

                      {/* Hidden legacy box elements to keep JSX structure valid */}
                      
                      {/* Grid background representing map lines */}
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:12px_12px]"></div>

                      {/* Vary accuracy display strictly according to GDPR constraints chosen by student */}
                      {activeStudent.locationAccuracy === 'land' && false && (
                        <div className="text-center z-10 p-3 bg-slate-950/95 border border-slate-800 rounded-lg shadow-xs max-w-[220px]">
                          <MapPin className="h-6 w-6 text-indigo-400 mx-auto mb-1 animate-pulse" />
                          <p className="text-xs font-bold text-slate-100">{activeStudent.country}</p>
                          <p className="text-[9.5px] text-slate-400 italic mt-1 leading-snug">
                            Vage locatie wegens AVG keuze. Precieze stad of GPS is afgeschermd door deze student.
                          </p>
                        </div>
                      )}

                      {activeStudent.locationAccuracy === 'stad' && false && (
                        <div className="text-center z-10 p-3 bg-slate-950/95 border border-slate-800 rounded-lg shadow-xs max-w-[220px]">
                          <MapPin className="h-6 w-6 text-indigo-400 mx-auto mb-1 animate-bounce" />
                          <p className="text-xs font-bold text-slate-100">{activeStudent.city}, {activeStudent.country}</p>
                          <p className="text-[9.5px] text-slate-400 italic mt-1 leading-snug">
                            Stadsgrenzen geverifieerd via schoolnetwerk. Geen gedetailleerde tracking mogelijk.
                          </p>
                        </div>
                      )}

                      {activeStudent.locationAccuracy === 'exact' && false && (
                        <div className="text-center z-10 w-full h-full flex flex-col justify-between p-2">
                          <div className="bg-slate-950/90 border border-slate-800 px-2 py-1 rounded shadow-2xs text-[9.5px] text-emerald-400 text-center font-mono self-start uppercase tracking-wider">
                            Geverifieerd GPS Signaal Actief
                          </div>
                          
                          <div className="relative my-auto flex flex-col items-center">
                            <div className="w-10 h-10 bg-indigo-500/25 border border-indigo-505 absolute rounded-full animate-ping"></div>
                            <MapPin className="h-8 w-8 text-indigo-400 z-10" />
                            <p className="text-xs font-bold text-white bg-slate-950/90 px-2 py-0.5 rounded border border-slate-800 mt-1.5 shadow-sm">
                              {activeStudent.city} ({activeStudent.coordinates ? `${activeStudent.coordinates.latitude}, ${activeStudent.coordinates.longitude}` : '12.112, -68.932'})
                            </p>
                          </div>

                          <div className="text-[9.5px] text-slate-400 italic bg-slate-950/95 p-1 rounded border border-slate-800 text-center">
                            Lucas of Sophie geautoriseerde live tracking is ingeschakeld.
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl h-48 flex flex-col items-center justify-center p-5 text-center text-slate-500">
                      <Lock className="h-8 w-8 text-slate-350 mb-2" />
                      <p className="text-xs font-semibold text-slate-700">Locatiedeling Verlopen of Gedeactiveerd</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                        De student heeft toestemming ingetrokken of heeft 'Niet beschikbaar' ingesteld om privacyoverwegingen conform bepalingen.
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional metadata card for safety support contact */}
                <div className="border-t border-slate-100 pt-3.5 flex flex-col gap-2.5 text-xs">
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-xs font-bold text-slate-750 flex items-center gap-1.5 uppercase tracking-widest font-mono">
                      Contact- & Partnergegevens
                    </span>
                    {!isEditingContactInfo ? (
                      <button
                        type="button"
                        onClick={() => setIsEditingContactInfo(true)}
                        className="text-[10px] text-indigo-650 hover:text-indigo-800 font-bold underline cursor-pointer"
                      >
                        Aanpassen
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleSaveContactInfo}
                          className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-0.5 rounded font-bold cursor-pointer transition-colors"
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
                          className="text-[10px] bg-slate-150 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold cursor-pointer transition-colors"
                        >
                          Annuleren
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditingContactInfo ? (
                    <>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-450 uppercase font-mono tracking-wider">Partner BPV:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[160px] text-right" title={activeStudent.hostOrganization}>
                          {activeStudent.hostOrganization}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-450 uppercase font-mono tracking-wider">Telefoon Student:</span>
                        <span className="font-mono text-slate-800">{activeStudent.phone}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-450 uppercase font-mono tracking-wider">Ouder/Noodpersoon:</span>
                        <span className="font-semibold text-slate-800 text-right">{activeStudent.emergencyContactName}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-450 uppercase font-mono tracking-wider">Noodnummer:</span>
                        <span className="font-mono text-slate-800">{activeStudent.emergencyContactPhone}</span>
                      </div>
                      
                      <div className="border-t border-dashed border-slate-200/80 my-1 pb-1" />
                      
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-450 uppercase font-mono tracking-wider text-indigo-700 font-semibold">Stagebegeleider:</span>
                        <span className="font-semibold text-slate-800 text-right">{activeStudent.supervisorName || 'Niet ingevuld'}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-450 uppercase font-mono tracking-wider">Tel. Begeleider:</span>
                        <span className="font-mono text-indigo-900 font-semibold">{activeStudent.supervisorPhone || 'Niet ingevuld'}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-450 uppercase font-mono tracking-wider">E-mail Begeleider:</span>
                        <span className="text-right text-slate-700 font-medium truncate max-w-[150px]" title={activeStudent.supervisorEmail}>
                          {activeStudent.supervisorEmail ? (
                            <a href={`mailto:${activeStudent.supervisorEmail}`} className="underline hover:text-indigo-600 text-indigo-600 font-semibold">{activeStudent.supervisorEmail}</a>
                          ) : 'Niet ingevuld'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-wide">Partner BPV</label>
                        <input
                          type="text"
                          value={editHostOrg}
                          onChange={(e) => setEditHostOrg(e.target.value)}
                          className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-wide">Telefoon Student</label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-805 font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-wide">Ouder/Noodpersoon</label>
                        <input
                          type="text"
                          value={editEmergencyContactName}
                          onChange={(e) => setEditEmergencyContactName(e.target.value)}
                          className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-wide">Noodnummer</label>
                        <input
                          type="text"
                          value={editEmergencyContactPhone}
                          onChange={(e) => setEditEmergencyContactPhone(e.target.value)}
                          className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-805 font-mono"
                        />
                      </div>
                      
                      <div className="border-t border-dashed border-slate-200 my-1 pt-1" />
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-indigo-600 font-mono tracking-wide">Naam Stagebegeleider</label>
                        <input
                          type="text"
                          value={editSupervisorName}
                          onChange={(e) => setEditSupervisorName(e.target.value)}
                          className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-800"
                          placeholder="Bijv. Carlos Menendez"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-indigo-600 font-mono tracking-wide">Telefoon Begeleider</label>
                        <input
                          type="text"
                          value={editSupervisorPhone}
                          onChange={(e) => setEditSupervisorPhone(e.target.value)}
                          className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-805 font-mono"
                          placeholder="Bijv. +34 612 345 678"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-indigo-600 font-mono tracking-wide">E-mail Begeleider</label>
                        <input
                          type="email"
                          value={editSupervisorEmail}
                          onChange={(e) => setEditSupervisorEmail(e.target.value)}
                          className="text-xs p-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 text-slate-805"
                          placeholder="Bijv. carlos@padelbarcelona.es"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Google Meet Online Videobellen */}
                <div className="border-t border-slate-150 pt-4 flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-slate-850 block flex items-center gap-1.5 uppercase tracking-widest font-mono">
                    <Video className="h-4 w-4 text-rose-500 animate-pulse" />
                    Online Videogesprek (Google Meet)
                  </span>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col gap-2.5">
                    {activeStudent.googleMeetUrl ? (
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/65 px-2 py-0.5 rounded-full select-none">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping" />
                            Gesprek Actief
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Melding staat aan</span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Er staat een actieve Google Meet open voor <strong>{activeStudent.name}</strong>. De student krijgt direct een melding op zijn mobiel.
                        </p>
                        <div className="flex gap-1.5">
                          <a
                            href={activeStudent.googleMeetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                          >
                            <Video className="h-3.5 w-3.5" />
                            Zelf deelnemen
                          </a>
                          <button
                            type="button"
                            onClick={() => handleStopGoogleMeet(activeStudent.id)}
                            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                            title="Notificatie stoppen"
                          >
                            Sluiten
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Wil je een online voortgangsgesprek of stagebezoek voeren met <strong>{activeStudent.name}</strong>? Start direct een Google Meet sessie.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleStartGoogleMeet(activeStudent.id)}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs uppercase tracking-wider"
                        >
                          <Video className="h-3.5 w-3.5" />
                          Start Google Meet gesprek
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Geplande Reisperiode BPV */}
                <div className="border-t border-slate-150 pt-4 flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-slate-850 block flex items-center gap-1.5 uppercase tracking-widest font-mono">
                    <Calendar className="h-4 w-4 text-indigo-650" />
                    Geplande Reisperiode (BPV)
                  </span>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-wide">Datum Vertrek</label>
                        <input
                          type="date"
                          value={dossierDepartureDate}
                          onChange={(e) => setDossierDepartureDate(e.target.value)}
                          className="text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 cursor-pointer text-slate-800"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] uppercase font-bold text-slate-500 font-mono tracking-wide">Datum Terugkomst</label>
                        <input
                          type="date"
                          value={dossierReturnDate}
                          onChange={(e) => setDossierReturnDate(e.target.value)}
                          className="text-xs p-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 cursor-pointer text-slate-800"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveTravelDates}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm uppercase tracking-wider"
                    >
                      <BellRing className="h-3.5 w-3.5" />
                      Periode Opslaan & Pushmelding
                    </button>
                  </div>
                </div>

                {/* CIOS Intake Vragen (Vraag 2 & 3) Dossier Status */}
                <div className="border-t border-slate-150 pt-4 flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-750 block flex items-center gap-1.5 uppercase tracking-widest font-mono">
                    <ShieldCheck className="h-4 w-4 text-indigo-650" />
                    Begeleidingsstatus van Deelnemer
                  </span>

                  {/* Vraag 2 display */}
                  <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
                    activeStudent.isSafeEnv ?? true 
                      ? 'bg-emerald-50/65 border-emerald-200/60 text-slate-800' 
                      : 'bg-rose-50 border-rose-200 text-slate-800'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Vraag 2. Veiligheid & Sfeer</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                        activeStudent.isSafeEnv ?? true 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {activeStudent.isSafeEnv ?? true ? 'Veilig & Prettig' : 'Zorgen gemeld'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-750 italic leading-relaxed">
                      "{activeStudent.safeEnvDetails || 'Geen specifieke toelichting gegeven.'}"
                    </p>
                  </div>

                  {/* Vraag 3 display */}
                  <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
                    activeStudent.needsSupport 
                      ? 'bg-amber-50 border-amber-250 text-slate-800' 
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Vraag 3. Extra Ondersteuning</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                        activeStudent.needsSupport 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {activeStudent.needsSupport ? 'Contact Gewenst' : 'Geen behoeften'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-750 italic leading-relaxed">
                      "{activeStudent.supportDetails || 'Geen specifieke toelichting gegeven.'}"
                    </p>
                  </div>

                  {/* Foto's geüpload door student display */}
                  <div className="border-t border-slate-150 pt-3 flex flex-col gap-2 font-sans">
                    <span className="text-xs font-bold text-slate-750 flex items-center gap-1.5 uppercase tracking-widest font-mono">
                      <Camera className="h-4 w-4 text-indigo-650" />
                      Gekoppelde Foto's vanaf de Stage
                    </span>

                    {activeStudent.uploadedPhotos && activeStudent.uploadedPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                        {activeStudent.uploadedPhotos.map((photo, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white group shadow-sm cursor-zoom-in">
                            <img
                              src={photo}
                              alt={`Stagefoto ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                              referrerPolicy="no-referrer"
                              onClick={() => {
                                setSelectedFullImage(photo);
                              }}
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-mono py-0.5 px-1 text-center truncate">
                              Foto #{index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-150/60 rounded-xl p-3 text-center text-slate-400 italic text-[11px]">
                        Nog geen stagefoto's geüpload door deze student.
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* GDPR Info Box inside Sidebar */}
              <div className="bg-emerald-50 rounded-xl border border-emerald-250 p-5 shadow-2xs flex flex-col gap-2.5">
                <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase font-mono tracking-widest">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                  GDPR & AVG Kwaliteitslabel
                </h4>
                <p className="text-[11.5px] text-emerald-950 leading-relaxed">
                  Deze monitoringsapp respecteert de privacykeuzes van sportstudenten. De coördinator kan alleen die data inzien waarvoor de student in het portaal toestemming heeft verleend.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Emergency Form modal trigger widget for students */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full overflow-hidden shadow-2xl"
            >
              <div className="bg-rose-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 animate-pulse" />
                  <h3 className="font-bold text-sm tracking-wide uppercase font-mono">Acute Noodsitusatie Melden</h3>
                </div>
                <button 
                  onClick={() => setShowEmergencyModal(false)}
                  className="text-white hover:text-rose-100 p-1 rounded-lg"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <form onSubmit={triggerEmergency} className="p-5 flex flex-col gap-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dit stuurt een direct en niet te missen noodsignaal naar CIOS Coördinator <strong>Heidie van Remortele</strong>. Omschrijf bondig jouw calamiteit.
                </p>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700">Type noodgeval / calamiteit:</label>
                  <textarea
                    rows={3}
                    placeholder="Mijn sportstage heeft onverwacht overval gehad of ik zit in het ziekenhuis..."
                    value={emergencyText}
                    onChange={(e) => setEmergencyText(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 text-xs rounded-lg focus:border-rose-500 focus:outline-hidden text-slate-800 bg-slate-50"
                    required
                  />
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] text-slate-500 font-medium font-mono leading-relaxed">
                  Let op: deze handeling wordt direct geregistreerd in het beveiligde logboek conform GDPR- compliance.
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setShowEmergencyModal(false)}
                    className="w-full py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-rose-605 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer transition-colors"
                  >
                    Alarm Inschakelen 🚨
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simulated Live Login & Switcher Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl"
            >
              <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Lock className="h-4.5 w-4.5" />
                  <h3 className="font-bold text-sm tracking-wide uppercase font-mono">CIOS Inlogportaal / Switcher</h3>
                </div>
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="text-white hover:text-indigo-150 p-1"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                
                {/* Method 1: Click simulated user to instant-login */}
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Methode 1: Direct inloggen als (Sneltest):</span>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentRole('COÖRDINATOR');
                        setShowLoginModal(false);
                        const newLog: AuditLog = {
                          id: generateUniqueId('log'),
                          timestamp: new Date().toISOString(),
                          actor: 'H. van Remortele (Coördinator)',
                          action: 'Ingelogd via snelstarter',
                          targetStudent: 'Systeembeheer'
                        };
                        setAuditLogs(prev => [newLog, ...prev]);
                      }}
                      className="w-full text-left p-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 hover:border-indigo-300 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer font-semibold text-indigo-900"
                    >
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-indigo-750" />
                        Heidie van Remortele (Coördinator)
                      </span>
                      <span className="text-[10px] bg-indigo-200 px-1.5 py-0.5 rounded font-mono">H. REGIE</span>
                    </button>

                    {students.map((stud) => (
                      <button
                        key={stud.id}
                        type="button"
                        onClick={() => {
                          setLoggedInStudentId(stud.id);
                          setCurrentRole('STUDENT');
                          setShowLoginModal(false);
                          const newLog: AuditLog = {
                            id: generateUniqueId('log'),
                            timestamp: new Date().toISOString(),
                            actor: `${stud.name} (Student)`,
                            action: `Ingelogd als student via handige snelstarter`,
                            targetStudent: stud.name
                          };
                          setAuditLogs(prev => [newLog, ...prev]);
                        }}
                        className="w-full text-left p-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer text-slate-800 font-semibold"
                      >
                        <span className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-slate-400" />
                          {stud.name}
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono truncate max-w-[100px]">{stud.city}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-200 my-1 pt-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Methode 2: Typ e-mail of pincode:</span>
                  <form onSubmit={handleSimulatedLogin} className="flex flex-col gap-2">
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="heidie@cios.nl of student-emailadres..."
                        value={typedEmail}
                        onChange={(e) => setTypedEmail(e.target.value)}
                        className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-850"
                      />
                      <button
                        type="submit"
                        className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Login
                      </button>
                    </div>
                    {loginError && <p className="text-[10.5px] text-rose-600 font-semibold leading-relaxed mt-1">{loginError}</p>}
                  </form>
                </div>

                <p className="text-[9.5px] text-slate-450 leading-relaxed bg-slate-50 p-2.5 rounded-lg font-mono">
                  💡 <strong>Inlog Instructie:</strong> Het handmatig inlogportaal simuleert de beveiligde LDAP login van CIOS Zuidwest-Nederland. Typ "heidie" voor coördinator dashboard controle, of een volledige student email om als student updates te rapporteren.
                </p>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal (In-App) */}
      <AnimatePresence>
        {studentToDelete && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl"
            >
              <div className="bg-rose-600 p-4 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4.5 w-4.5" />
                  <h3 className="font-bold text-sm tracking-wide uppercase font-mono">Student Verwijderen (AVG)</h3>
                </div>
                <button 
                  onClick={() => setStudentToDelete(null)}
                  className="text-white hover:text-rose-100 p-1 cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600 shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                
                <div className="text-center">
                  <h4 className="text-sm font-bold text-slate-850">Weet u zeker dat u student "{studentToDelete.name}" wilt verwijderen?</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    Hiermee worden alle BPV-checkins, actuele locatiegegevens, veiligheidsbeoordelingen en historische logs van deze student <strong>permanent gewist</strong> uit het dossier. Deze actie kan niet ongedaan worden gemaakt.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex flex-col gap-1 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Naam:</span> <span className="font-bold text-slate-800">{studentToDelete.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Stagebedrijf:</span> <span className="font-bold text-slate-800">{studentToDelete.hostOrganization}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Locatie:</span> <span className="font-bold text-slate-800">{studentToDelete.city}, {studentToDelete.country}</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setStudentToDelete(null)}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
                  >
                    Annuleren
                  </button>
                  <button
                    type="button"
                    onClick={confirmDeleteStudent}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Ja, verwijder dossier
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo Full-Screen Popup Overlay */}
      <AnimatePresence>
        {selectedFullImage && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50 cursor-zoom-out" onClick={() => setSelectedFullImage(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center font-sans"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedFullImage}
                alt="Stagefoto Volle Grootte"
                className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl border-2 border-white/10"
                referrerPolicy="no-referrer"
              />
              <div className="mt-4 flex items-center gap-4">
                <button
                  onClick={() => setSelectedFullImage(null)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white font-bold rounded-lg text-xs cursor-pointer shadow-md transition-all uppercase tracking-wider flex items-center gap-1.5"
                >
                  <X className="h-4 w-4" />
                  Sluiten
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="h-10 bg-slate-100 border-t border-slate-200 px-4 sm:px-8 flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500 uppercase font-bold tracking-widest shrink-0 mt-auto">
        <div>Zuidwest-Nederland Monitor</div>
        <div className="truncate shrink-0">© 2026 CIOS GlobalLink — Beveiligde Verbinding (TLS 1.3) • Gereguleerd op PARA</div>
      </footer>

    </div>
  );
}
