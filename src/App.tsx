import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Activity,
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  RotateCcw, 
  Compass, 
  SlidersHorizontal, 
  Search, 
  User, 
  Users, 
  UserPlus,
  Plus,
  Trash2,
  Filter,
  CheckCircle, 
  Phone, 
  Clock, 
  Lock, 
  X,
  FileDown, 
  Eye, 
  HeartHandshake, 
  HelpCircle,
  Camera,
  Map,
  LogOut,
  Settings,
  Bell,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Calendar,
  Check,
  ChevronRight,
  Info,
  Video,
  Award,
  FileText,
  CheckSquare
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import { Student, StudentStatus, LocationAccuracy, AuditLog } from './types';
import { supabase } from './supabaseClient';

const getMapUrl = (student: any): string => {
  if (!student) return "https://www.openstreetmap.org/export/embed.html?bbox=-4.5,36.5,-4.3,36.9&layer=mapnik";
  const lat = student.latitude || 36.7213;
  const lng = student.longitude || -4.4214;
  const delta = 0.01;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - delta},${lat - delta},${lng + delta},${lat + delta}&layer=mapnik&marker=${lat},${lng}`;
};

const generateUniqueId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000000)}`;
};

const PRESET_CITIES = [
  { name: 'Nairobi', country: 'Kenia', latitude: -1.2921, longitude: 36.8219, org: 'Nairobi Sports Academy' },
  { name: 'Mombasa', country: 'Kenia', latitude: -4.0435, longitude: 39.6682, org: 'Coast Gymkhana Club' },
  { name: 'Oles', country: 'Spanje', latitude: 43.5350, longitude: -5.4690, org: 'Asturias Sport Center' },
  { name: 'Marín', country: 'Spanje', latitude: 42.3881, longitude: -8.7024, org: 'Galicia Surf School' },
  { name: 'Málaga', country: 'Spanje', latitude: 36.7213, longitude: -4.4214, org: 'Club de Padel Málaga' },
  { name: 'Kaapstad', country: 'Zuid-Afrika', latitude: -33.9249, longitude: 18.4241, org: 'Cape Town Township Sports Initiative' },
  { name: 'Eiland Réunion', country: 'Frankrijk', latitude: -21.1151, longitude: 55.5364, org: 'Réunion Surf & Active Lodge' },
  { name: 'Zakynthos', country: 'Griekenland', latitude: 37.7870, longitude: 20.8999, org: 'Zakynthos Watersports Academy' }
];

export default function App() {
  const [currentRole, setCurrentRole] = useState<'STUDENT' | 'COÖRDINATOR'>('STUDENT');
  const [loggedInStudentId, setLoggedInStudentId] = useState<string>('1');
  const [students, setStudents] = useState<Student[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(true);
  const [typedEmail, setTypedEmail] = useState('');

  // Sync met Supabase Database
  useEffect(() => {
    fetchInitialData();

    const studentSubscription = supabase
      .channel('realtime-monitoring')
      .on('postgres_changes', { event: '*', scheme: 'public', table: 'students' }, (payload) => {
        fetchInitialData();
        if (payload.eventType === 'UPDATE') {
          const updatedStudent = payload.new as any;
          if (updatedStudent.has_active_emergency) {
            triggerPushNotification(`🚨 NOODOPROEP: ${updatedStudent.name}`, `${updatedStudent.emergency_message || 'Dringend contact gewenst!'}`, 'warning');
          } else {
            triggerPushNotification(`🔄 Update van ${updatedStudent.name}`, `Status gewijzigd naar: ${updatedStudent.status}`, 'success');
          } 
         // Realtime Chatberichten ophalen op basis van activeStudentId
  useEffect(() => {
    if (!activeStudentId) {
      setChatMessages([]);
      return;
    }

    const fetchChatMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('student_id', activeStudentId)
        .order('created_at', { ascending: true });
      
      if (!error && data) {
        setChatMessages(data);
      }
    };

    fetchChatMessages();

    const channel = supabase
      .channel('realtime-chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `student_id=eq.${activeStudentId}` },
        (payload) => {
          setChatMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeStudentId]); 
        }
      })
      .on('postgres_changes', { event: 'INSERT', scheme: 'public', table: 'audit_logs' }, (payload) => {
        const newLog = payload.new as any;
        setAuditLogs(prev => [newLog, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(studentSubscription);
    };
  }, []);

const fetchInitialData = async () => {
    const { data: studs } = await supabase.from('students').select('*').order('name', { ascending: true });
    const { data: logs } = await supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(50);
    
    if (studs) {
      const formattedStudents: Student[] = studs.map((s: any) => ({
        id: String(s.id),
        name: s.name || 'Onbekende Student',
        email: s.email || '',
        phone: s.phone || '',
        country: s.country || '',
        city: s.city || '',
        status: s.status || 'Thuis',
        locationAccuracy: s.location_accuracy || 'exact',
        lastMessage: s.last_message || '',
        lastUpdate: s.last_update || new Date().toISOString(),
        consentGiven: s.consent_given ?? true,
        hasActiveEmergency: s.has_active_emergency ?? false,
        emergencyMessage: s.emergency_message || '',
        hostOrganization: s.host_organization || s.partner_bpv || '',
        emergencyContactName: s.emergency_contact_name || '',
        emergencyContactPhone: s.emergency_contact_phone || '',
        isSafeEnv: s.is_safe_env ?? true,
        safeEnvDetails: s.safe_env_details || '',
        needsSupport: s.needs_support ?? false,
        supportDetails: s.support_details || '',
        uploadedPhotos: s.uploaded_photos || [],
        departureDate: s.departure_date || '',
        returnDate: s.return_date || '',
        supervisorName: s.supervisor_name || '',
        supervisorPhone: s.supervisor_phone || '',
        supervisorEmail: s.supervisor_email || '',
        googleMeetUrl: s.google_meet_url || '',
        latitude: s.latitude || 36.7213,
        longitude: s.longitude || -4.4214
      }));
      setStudents(formattedStudents);
    }
    if (logs) setAuditLogs(logs);
  };
  // UI States & Filters
  const [activeStudentId, setActiveStudentId] = useState<string>('1');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('+31 6 ');
  const [newStudentHostOrg, setNewStudentHostOrg] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [showManualCoords, setShowManualCoords] = useState(false);
  const [isSearchingCoords, setIsSearchingCoords] = useState(false);
  const [coordSearchMessage, setCoordSearchMessage] = useState('');
  const [selectedFullImage, setSelectedFullImage] = useState<string | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [pushNotifications, setPushNotifications] = useState<any[]>([]);

  // Reis- en Dossierdata states
  const [newStudentDepartureDate, setNewStudentDepartureDate] = useState('');
  const [newStudentReturnDate, setNewStudentReturnDate] = useState('');
  const [dossierDepartureDate, setDossierDepartureDate] = useState('');
  const [dossierReturnDate, setDossierReturnDate] = useState('');

  // Contact info states
  const [isEditingContactInfo, setIsEditingContactInfo] = useState(false);
  const [editPhone, setEditPhone] = useState('');
  const [editHostOrg, setEditHostOrg] = useState('');
  const [editEmergencyContactName, setEditEmergencyContactName] = useState('');
  const [editEmergencyContactPhone, setEditEmergencyContactPhone] = useState('');
  const [editSupervisorName, setEditSupervisorName] = useState('');
  const [editSupervisorPhone, setEditSupervisorPhone] = useState('');
  const [editSupervisorEmail, setEditSupervisorEmail] = useState('');

  // Active student profile mapping
  const myStudentProfile = students.find(s => s.id === loggedInStudentId) || students[0];
  const [formStatus, setFormStatus] = useState<StudentStatus>('Bezig op stage met activiteiten');
  const [formMessage, setFormMessage] = useState('');
  const [formAccuracy, setFormAccuracy] = useState<LocationAccuracy>('exact');
  const [formConsent, setFormConsent] = useState(true);
  const [formIsSafeEnv, setFormIsSafeEnv] = useState<boolean>(true);
  const [formSafeEnvDetails, setFormSafeEnvDetails] = useState<string>('');
  const [formNeedsSupport, setFormNeedsSupport] = useState<boolean>(false);
  const [formSupportDetails, setFormSupportDetails] = useState<string>('');
  const [formPhotos, setFormPhotos] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyText, setEmergencyText] = useState('');

  useEffect(() => {
    if (myStudentProfile) {
      setFormStatus(myStudentProfile.status);
      setFormMessage(myStudentProfile.lastMessage || '');
      setFormAccuracy(myStudentProfile.locationAccuracy || 'exact');
      setFormConsent(myStudentProfile.consentGiven);
      setFormIsSafeEnv(myStudentProfile.isSafeEnv ?? true);
      setFormSafeEnvDetails(myStudentProfile.safeEnvDetails || '');
      setFormNeedsSupport(myStudentProfile.needsSupport ?? false);
      setFormSupportDetails(myStudentProfile.supportDetails || '');
      setFormPhotos(myStudentProfile.uploadedPhotos || []);
    }
  }, [loggedInStudentId, students]);

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

  // Realtime Geocoding op basis van stadstype
  useEffect(() => {
    if (!customCity.trim() || showManualCoords) return;

    const delayDebounce = setTimeout(async () => {
      setIsSearchingCoords(true);
      setCoordSearchMessage('Realtime coördinaten zoeken...');
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(customCity)}&limit=1`);
        const data = await response.json();
        if (data && data.length > 0) {
          setManualLat(data[0].lat);
          setManualLng(data[0].lon);
          setCoordSearchMessage(`📍 Coördinaten gevonden! (${parseFloat(data[0].lat).toFixed(4)}, ${parseFloat(data[0].lon).toFixed(4)})`);
        } else {
          setCoordSearchMessage('Stad niet live gevonden. Gebruik handmatige invoer.');
        }
      } catch (err) {
        setCoordSearchMessage('Locatieserver offline. Voer handmatig in.');
      } finally {
        setIsSearchingCoords(false);
      }
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [customCity, showManualCoords]);

  const triggerPushNotification = (title: string, body: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const newNotif = {
      id: generateUniqueId('notif'),
      title,
      body,
      timestamp: new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
      type
    };
    setPushNotifications(prev => [newNotif, ...prev]);

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(type === 'warning' ? 220 : 587.33, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      }
    } catch (e) {}

    setTimeout(() => {
      setPushNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 7000);
  };

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
              const MAX_WIDTH = 500;
              const MAX_HEIGHT = 500;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
              } else {
                if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
                setFormPhotos(prev => [...prev, compressedDataUrl]);
              }
              processedCount++;
              if (processedCount === filesArray.length) setIsCompressing(false);
            };
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveFormPhoto = (idx: number) => {
    setFormPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleStudentUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myStudentProfile) return;

    await supabase.from('students').update({
      status: formStatus,
      last_message: formMessage,
      location_accuracy: formAccuracy,
      consent_given: formConsent,
      last_update: new Date().toISOString(),
      is_safe_env: formIsSafeEnv,
      safe_env_details: formSafeEnvDetails,
      needs_support: formNeedsSupport,
      support_details: formSupportDetails,
      uploaded_photos: formPhotos
    }).eq('id', myStudentProfile.id);

    await supabase.from('audit_logs').insert({
      id: generateUniqueId('log'),
      actor: `${myStudentProfile.name} (Student)`,
      action: `Check-in ingestuurd: Status "${formStatus}"`,
      target_student: myStudentProfile.name,
      log_type: 'success'
    });

    alert("Check-in succesvol verzonden naar cloud-monitor!");
  };

  const triggerEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myStudentProfile) return;
    
    await supabase.from('students').update({
      status: 'Noodgeval',
      has_active_emergency: true,
      emergency_message: emergencyText || 'Knop ingedrukt - Dringend hulp gewenst!',
      last_update: new Date().toISOString()
    }).eq('id', myStudentProfile.id);

    await supabase.from('audit_logs').insert({
      id: generateUniqueId('log'),
      actor: `${myStudentProfile.name} (Student)`,
      action: `🚨 CALAMITEIT SIGNALERING: "${emergencyText}"`,
      target_student: myStudentProfile.name,
      log_type: 'emergency'
    });

    setShowEmergencyModal(false);
    setEmergencyText('');
    alert("ALARM VERZONDEN. Je coördinator is realtime op de hoogte gesteld.");
  };

  const resolveEmergency = async (studentId: string) => {
    const target = students.find(s => s.id === studentId);
    if (!target) return;

    await supabase.from('students').update({
      status: 'Bezig op stage met activiteiten',
      has_active_emergency: false,
      emergency_message: null,
      last_update: new Date().toISOString()
    }).eq('id', studentId);

    await supabase.from('audit_logs').insert({
      id: generateUniqueId('log'),
      actor: 'H. van Remortele (Coördinator)',
      action: `🚨 Calamiteit opgelost i.s.m. student`,
      target_student: target.name,
      log_type: 'success'
    });
  };

const handleAddNewStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentName = typeof newStudentName === 'string' ? newStudentName.trim() : '';
    const currentEmail = typeof newStudentEmail === 'string' ? newStudentEmail.trim() : '';
    
    if (!currentName || !currentEmail) {
      alert("Vul tenminste een naam en e-mailadres in.");
      return;
    }

    const finalCity = typeof customCity === 'string' && customCity.trim() ? customCity.trim() : 'Málaga';
    const finalCountry = typeof customCountry === 'string' && customCountry.trim() ? customCountry.trim() : 'Spanje';
    const organization = typeof newStudentHostOrg === 'string' && newStudentHostOrg.trim() ? newStudentHostOrg.trim() : 'Sport Academy';
    const currentPhone = typeof newStudentPhone === 'string' ? newStudentPhone.trim() : '+31 6 ';
    
    // De app leest nu veilig de live coördinaten uit de zoeker uit
    let finalLat = 36.7213;
    let finalLng = -4.4214;

    if (typeof manualLat !== 'undefined' && manualLat && !isNaN(parseFloat(manualLat))) {
      finalLat = parseFloat(manualLat);
    }
    if (typeof manualLng !== 'undefined' && manualLng && !isNaN(parseFloat(manualLng))) {
      finalLng = parseFloat(manualLng);
    }

    const newId = generateUniqueId('stud');

    try {
      const { error: insertError } = await supabase.from('students').insert({
        id: newId,
        name: currentName,
        email: currentEmail.toLowerCase(),
        phone: currentPhone,
        country: finalCountry,
        city: finalCity,
        latitude: finalLat,
        longitude: finalLng,
       host_organization: organization,
        status: 'Thuis',
        google_meet_url: 'https://meet.google.com/chv-yduc-skx',
        consent_given: true,
        last_update: new Date().toISOString() 
      });

      if (insertError) {
        console.error('Supabase invoegfout:', insertError);
        alert('Database weigerde de student: ' + insertError.message);
        return;
      }

      await supabase.from('audit_logs').insert({
        id: generateUniqueId('log'),
        actor: 'H. van Remortele (Coördinator)',
        action: 'Student succesvol aangemaakt',
        target_student: currentName,
        log_type: 'success'
      });

      if (typeof setNewStudentName === 'function') setNewStudentName('');
      if (typeof setNewStudentEmail === 'function') setNewStudentEmail('');
      if (typeof setNewStudentPhone === 'function') setNewStudentPhone('+31 6 ');
      if (typeof setCustomCity === 'function'); setCustomCity('');
      if (typeof setCustomCountry === 'function') setCustomCountry('');
      if (typeof setNewStudentHostOrg === 'function') setNewStudentHostOrg('');
      if (typeof setManualLat === 'function') setManualLat('');
      if (typeof setManualLng === 'function') setManualLng('');
      if (typeof setShowManualCoords === 'function') setShowManualCoords(false);
      if (typeof setCoordSearchMessage === 'function') setCoordSearchMessage('');
      if (typeof setShowAddStudentForm === 'function') setShowAddStudentForm(false);
      
      window.location.href = window.location.pathname + window.location.search;
    } catch (err) {
      console.error('Fout in try-catch bij opslaan:', err);
    }
  };
  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    await supabase.from('students').delete().eq('id', studentToDelete.id);
    await supabase.from('audit_logs').insert({
      id: generateUniqueId('log'),
      actor: 'H. van Remortele (Coördinator)',
      action: `Dossier van ${studentToDelete.name} permanent gewist conform AVG`,
      target_student: studentToDelete.name,
      log_type: 'warning'
    });
    setStudentToDelete(null);
    fetchInitialData();
  };

  const handleSaveTravelDates = async () => {
    if (!activeStudent) return;
    await supabase.from('students').update({
      departure_date: dossierDepartureDate || null,
      return_date: dossierReturnDate || null
    }).eq('id', activeStudent.id);
    fetchInitialData();
    triggerPushNotification('📅 Reisdata bewaard', `Periode opgeslagen voor ${activeStudent.name}`, 'success');
  };

const handleSaveContactInfo = async () => {
  if (!activeStudent) return;
  try {
    const { error: updateError } = await supabase
      .from('students')
      .update({
        phone: editPhone,
        host_organization: editHostOrg,
        emergency_contact_name: editEmergencyContactName,
        emergency_contact_phone: editEmergencyContactPhone,
        supervisor_name: editSupervisorName,
        supervisor_phone: editSupervisorPhone,
        supervisor_email: editSupervisorEmail,
        last_update: new Date().toISOString()
      })
      .eq('id', activeStudent.id);

    if (updateError) {
      alert("Supabase Foutmelding:\n" + updateError.message);
      return;
    }

    setIsEditingContactInfo(false);
    window.location.href = window.location.pathname + window.location.search;
  } catch (err: any) {
    alert("Systeemfout bij opslaan:\n" + (err.message || err));
  }
};
  const handleStartGoogleMeet = async (studentId: string) => {
    const meetUrl = `https://meet.google.com/aaa-cios-bbb`;
    await supabase.from('students').update({ google_meet_url: meetUrl }).eq('id', studentId);
    fetchInitialData();
    window.open(meetUrl, '_blank');
  };

  const handleStopGoogleMeet = async (studentId: string) => {
    await supabase.from('students').update({ google_meet_url: null }).eq('id', studentId);
    fetchInitialData();
  };

  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = typedEmail.trim().toLowerCase();
    if (trimmed === 'heidie' || trimmed === 'heidie@cios.nl') {
      setCurrentRole('COÖRDINATOR'); setShowLoginModal(false);
    } else {
      const matched = students.find(s => s.email.toLowerCase() === trimmed);
      if (matched) { setLoggedInStudentId(matched.id); setCurrentRole('STUDENT'); setShowLoginModal(false); }
      else alert('Onbekend e-mailadres.');
    }
    setTypedEmail('');
  };

 const filteredStudents = students.filter(s => {
  const matches = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.city.toLowerCase().includes(searchQuery.toLowerCase());
  if (statusFilter === 'ALL' || statusFilter === '') return matches;
  if (statusFilter === 'EMERGENCY') return matches && s.hasActiveEmergency;
  return matches && s.status.toLowerCase() === statusFilter.toLowerCase();
});

  const activeStudent = students.find(s => String(s.id) === String(activeStudentId)) || students[0] || null;

  if (currentRole === 'COÖRDINATOR' && !activeStudent && students.length > 0) {
    setActiveStudentId(students[0].id);
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">Dashboard laden...</div>;
  }

  if (currentRole === 'COÖRDINATOR' && students.length === 0 && !showAddStudentForm) { 
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md w-full bg-white border p-8 rounded-2xl shadow-xl">
          <h2 className="text-lg font-bold text-slate-800">Welkom in het Coördinator Dashboard</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">Er staan momenteel nog geen studenten in de cloud-database.</p>
          <button 
            onClick={() => setShowAddStudentForm(true)} 
            className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg uppercase tracking-wide cursor-pointer"
          >
            ＋ Voeg je eerste student toe
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      
      {/* Realtime Notificaties Push Overlay */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {pushNotifications.map((notif) => (
            <motion.div key={notif.id} initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-slate-950 backdrop-blur-md text-white border p-4 rounded-2xl shadow-2xl pointer-events-auto border-l-4 border-l-indigo-500">
              <div className="flex justify-between items-center text-[9px] font-mono tracking-wider text-indigo-400">
                <span>CIOS GLOBAL LIVE REALTIME UPDATE</span>
                <button onClick={() => setPushNotifications(p => p.filter(n => n.id !== notif.id))} className="cursor-pointer">✕</button>
              </div>
              <h4 className="font-bold text-xs mt-1 text-slate-100">{notif.title}</h4>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed whitespace-pre-line">{notif.body}</p>
            </motion.div>
          ))}
        </AnimatePresence> 
      </div>

      {/* Header */}
      <nav className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-8 shadow-xs z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
          <div>
            <h1 className="text-base font-bold text-slate-800">CIOS GlobalLink <span className="font-light text-slate-500 text-xs">Cloud Monitor</span></h1>
            <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block leading-none">Realtime Supabase Gekoppeld • 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl flex border border-slate-200 shadow-2xs">
            <button onClick={() => setCurrentRole('COÖRDINATOR')} className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${currentRole === 'COÖRDINATOR' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'}`}>Coördinator View</button>
            <button onClick={() => { setCurrentRole('STUDENT'); if (students.length > 0) setLoggedInStudentId(students[0].id); }} className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${currentRole === 'STUDENT' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}>Student View</button>
          </div>
          <button onClick={() => setShowLoginModal(true)} className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold rounded-lg cursor-pointer">Inlogportaal</button>
        </div>
      </nav>

      {/* Emergency Strip Banner */}
      {students.some(s => s.hasActiveEmergency) && (
        <div className="bg-rose-600 text-white p-2.5 text-center text-xs font-bold animate-pulse">
          🚨 CRUCIALE CALAMITEIT IN HET BUITENLAND: {students.filter(s => s.hasActiveEmergency).length} student(en) hebben alarm geslagen!
        </div>
      )}

      {/* Main Container Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* STUDENT PORTAL INTERFACE */}
        {currentRole === 'STUDENT' && myStudentProfile && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white border rounded-xl p-5 shadow-2xs">
                <h3 className="font-bold text-sm text-indigo-750 flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Cloud-Synchronisatie</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Je bent ingelogd als <strong>{myStudentProfile.name}</strong>. Elke statuswijziging of foto die je hieronder indient, verschijnt per direct live op het dashboard van Heidie van Remortele.
                </p>
              </div>
            </div>

            {/* Smartphone Simulator Content Screen */}
            <div className="lg:col-span-8 flex justify-center">
              <div className="w-full max-w-sm bg-slate-950 rounded-[44px] p-4.5 border-[10px] border-slate-800 shadow-2xl text-white relative">
                <div className="bg-slate-900 rounded-[30px] p-5 pt-8 min-h-[580px] flex flex-col justify-between">
                  
                  <div className="border-b border-white/5 pb-3">
                    <p className="text-[8.5px] text-indigo-400 font-mono uppercase tracking-widest font-bold">CIOS LIVE APP</p>
                    <h3 className="text-sm font-bold text-slate-100 mt-0.5">Hallo, {myStudentProfile.name.split(' ')[0]} 👋</h3>
                  </div>

                  <div className="flex-1 flex flex-col gap-4 mt-4">
                    {myStudentProfile.hasActiveEmergency ? (
                      <div className="bg-rose-950/90 border border-rose-500/50 p-4 rounded-xl flex flex-col gap-2">
                        <span className="text-xs font-bold text-rose-400 animate-pulse flex items-center gap-1">🚨 NOODALARM GEMELD</span>
                        <p className="text-xs italic bg-rose-950 p-2 rounded border border-rose-900">"{myStudentProfile.emergencyMessage}"</p>
                        <button type="button" onClick={() => resolveEmergency(myStudentProfile.id)} className="w-full py-1.5 bg-white text-rose-950 rounded-lg text-xs font-bold cursor-pointer">Ik ben inmiddels weer safe</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setShowEmergencyModal(true)} className="py-3 px-4 bg-rose-950/40 border border-rose-600/30 rounded-xl flex items-center gap-3 text-left cursor-pointer transition-transform hover:scale-[1.01]">
                        <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-sm shadow-md">🚨</div>
                        <div>
                          <p className="font-bold text-xs text-rose-150 uppercase tracking-widest">Noodknop Inschakelen</p>
                          <p className="text-[10px] text-rose-300">Stuur direct alarm naar Heidie</p>
                        </div>
                      </button>
                    )}

                    {myStudentProfile.googleMeetUrl && (
                      <div className="bg-indigo-950/80 border border-indigo-400/40 rounded-xl p-3.5 flex flex-col gap-2 shadow-lg">
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest font-mono block">🎥 Live Gesprek Gestart</span>
                        <p className="text-[11px] text-indigo-200">Heidie van Remortele vraagt je deel te nemen aan de online live check-in.</p>
                        <a href={myStudentProfile.googleMeetUrl} target="_blank" rel="noopener noreferrer" className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg text-center block shadow-sm">Deelnemen aan Meet</a>
                      </div>
                    )}

                    <form onSubmit={handleStudentUpdate} className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col gap-4 max-h-[380px] overflow-y-auto">
                      <div>
                        <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">1a. Mijn Actuele Status</label>
                        <select value={formStatus} onChange={(e) => setFormStatus(e.target.value as StudentStatus)} className="w-full text-xs p-2 bg-slate-900 border border-slate-800 text-white rounded-lg cursor-pointer">
                          <option value="Veilig aangekomen">Veilig aangekomen</option>
                          <option value="Bezig op stage met activiteiten">Bezig op stage met activiteiten</option>
                          <option value="Vrije tijd">Vrije tijd</option>
                          <option value="Slapen">Slapen</option>
                          <option value="Onderweg">Onderweg</option>
                          <option value="Thuis">Thuis</option>
                          <option value="Meldingen (Calamiteit)">Meldingen (Calamiteit)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">1b. Korte Check-in Tekst</label>
                        <textarea rows={2} value={formMessage} onChange={(e) => setFormMessage(e.target.value)} className="w-full text-xs p-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-hidden" placeholder="Omschrijf kort hoe het gaat..." />
                      </div>

                      <div className="border-t border-slate-900 pt-2">
                        <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">2. Voelt de omgeving veilig?</label>
                        <div className="grid grid-cols-2 gap-2 mb-1">
                          <button type="button" onClick={() => setFormIsSafeEnv(true)} className={`py-1 rounded text-xs font-bold border cursor-pointer ${formIsSafeEnv ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-slate-900 text-slate-400 border-transparent'}`}>Ja, veilig ✅</button>
                          <button type="button" onClick={() => setFormIsSafeEnv(false)} className={`py-1 rounded text-xs font-bold border cursor-pointer ${!formIsSafeEnv ? 'bg-rose-950 border-rose-500 text-rose-300' : 'bg-slate-900 text-slate-400 border-transparent'}`}>Nee, zorgen ⚠️</button>
                        </div>
                        <textarea rows={2} value={formSafeEnvDetails} onChange={(e) => setFormSafeEnvDetails(e.target.value)} className="w-full text-xs p-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-hidden" placeholder="Toelichting over sfeer/omgeving..." />
                      </div>

<div className="border-t border-slate-900 pt-2">
      <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
        3. Begeleidingsgesprek gewenst?
      </label>
      <div className="grid grid-cols-2 gap-2 mb-1">
        <button 
          type="button" 
          onClick={() => setFormNeedsSupport(true)} 
          className={`py-1 rounded text-xs font-bold border ${formNeedsSupport ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-900/40 text-slate-400 border-slate-800'}`}
        >
          Contact gewenst 💬
        </button>
        <button 
          type="button" 
          onClick={() => setFormNeedsSupport(false)} 
          className={`py-1 rounded text-xs font-bold border ${!formNeedsSupport ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900/40 text-slate-400 border-slate-800'}`}
        >
          Nee, gaat goed
        </button>
      </div>
      <textarea 
        rows={2} 
        value={formSupportDetails} 
        onChange={(e) => setFormSupportDetails(e.target.value)} 
        placeholder="Toelichting ondersteuning..." 
        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500" 
      />
    </div>

    <div className="border-t border-slate-900 pt-2">
      <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">
        3b. Foto's toevoegen (Sfeer of Bewijs)
      </label>
      <label className="flex items-center justify-center gap-1.5 border border-dashed border-indigo-500/55 bg-indigo-950/30 py-2 rounded-lg cursor-pointer text-xs font-medium text-indigo-300 hover:bg-indigo-950/55 transition-colors">
        <Camera className="h-4 w-4" /> <span>Kies of maak foto</span>
        <input type="file" accept="image/*" multiple onChange={handlePhotoUploadChange} className="hidden" />
      </label>
    </div>

    <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors mt-4">
      CLOUD CHECK-IN INSTUREN
    </button>
  </form>
</div>

<footer className="mt-8 border-t border-slate-900 pt-4 text-center text-[10px] text-slate-600 space-y-1">
  <div>Zuidwest-Nederland Cloud monitor</div>
  <div>© 2026 CIOS GlobalLink – Realtime Supabase Database</div>
</footer>

</div> 
);
}

export default App;
