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
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        country: s.country,
        city: s.city,
        status: s.status,
        locationAccuracy: s.location_accuracy,
        lastMessage: s.last_message,
        lastUpdate: s.last_update,
        consentGiven: s.consent_given,
        hasActiveEmergency: s.has_active_emergency,
        emergencyMessage: s.emergency_message,
        hostOrganization: s.host_organization,
        emergencyContactName: s.emergency_contact_name,
        emergencyContactPhone: s.emergency_contact_phone,
        isSafeEnv: s.is_safe_env,
        safeEnvDetails: s.safe_env_details,
        needsSupport: s.needs_support,
        supportDetails: s.support_details,
        uploadedPhotos: s.uploaded_photos || [],
        departureDate: s.departure_date,
        returnDate: s.return_date,
        supervisorName: s.supervisor_name,
        supervisorPhone: s.supervisor_phone,
        supervisorEmail: s.supervisor_email,
        googleMeetUrl: s.google_meet_url,
        latitude: s.latitude,
        longitude: s.longitude
      }));
      setStudents(formattedStudents);
    }
    if (logs) setAuditLogs(logs);
  };

  // UI States & Filters
  const [activeStudentId, setActiveStudentId] = useState<string>('1');
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
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    const finalCity = customCity.trim() || 'Málaga';
    const finalCountry = customCountry.trim() || 'Spanje';
    const newId = generateUniqueId('stud');

    const preset = typeof PRESET_CITIES !== 'undefined' ? PRESET_CITIES.find(c => c.name.toLowerCase() === finalCity.toLowerCase()) : null;
    const lat = manualLat ? parseFloat(manualLat) : (preset ? preset.latitude : 37.8617); 
    const lng = manualLng ? parseFloat(manualLng) : (preset ? preset.longitude : 20.7438);
    const organization = newStudentHostOrg.trim() || (preset ? preset.org : 'Zakynthos Watersports Academy');

    try {
      await supabase.from('students').insert({
        id: newId,
        name: newStudentName.trim(),
        email: newStudentEmail.trim().toLowerCase(),
        phone: newStudentPhone.trim(),
        country: finalCountry,
        city: finalCity,
        latitude: lat,
        longitude: lng,
        partner_bpv: organization,
        host_organization: organization,
        google_meet_url: 'https://meet.google.com/new',
        status: 'Thuis',
        consent_given: true,
        location_accuracy: 'exact',
        last_update: new Date().toISOString()
      });

      await supabase.from('audit_logs').insert({
        id: generateUniqueId('log'),
        actor: 'H. van Remortele (Coördinator)',
        action: `Student ${newStudentName.trim()} succesvol aangemaakt op locatie ${finalCity}`,
        target_student: newStudentName.trim(),
        log_type: 'success'
      });

      setNewStudentName('');
      setNewStudentEmail('');
      setNewStudentPhone('+31 6 ');
      setCustomCity('');
      setCustomCountry('');
      setNewStudentHostOrg('');
      setManualLat('');
      setManualLng('');
      setShowManualCoords(false);
      setCoordSearchMessage('');
      setShowAddStudentForm(false);
      fetchInitialData();
    } catch (err) {
      console.error('Fout bij opslaan:', err);
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
    await supabase.from('students').update({
      phone: editPhone,
      host_organization: editHostOrg,
      partner_bpv: editHostOrg,
      emergency_contact_name: editEmergencyContactName,
      emergency_contact_phone: editEmergencyContactPhone,
      supervisor_name: editSupervisorName,
      supervisor_phone: editSupervisorPhone,
      supervisor_email: editSupervisorEmail
    }).eq('id', activeStudent.id);
    setIsEditingContactInfo(false);
    fetchInitialData();
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
                        <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">3. Begeleidingsgesprek gewenst?</label>
                        <div className="grid grid-cols-2 gap-2 mb-1">
                          <button type="button" onClick={() => setFormNeedsSupport(true)} className={`py-1 rounded text-xs font-bold border cursor-pointer ${formNeedsSupport ? 'bg-amber-950 border-amber-500 text-amber-300' : 'bg-slate-900 text-slate-400 border-transparent'}`}>Contact gewenst 💬</button>
                          <button type="button" onClick={() => setFormNeedsSupport(false)} className={`py-1 rounded text-xs font-bold border cursor-pointer ${!formNeedsSupport ? 'bg-slate-900 text-emerald-400 border-slate-850' : 'bg-slate-900 text-slate-400 border-transparent'}`}>Nee, gaat goed</button>
                        </div>
                        <textarea rows={2} value={formSupportDetails} onChange={(e) => setFormSupportDetails(e.target.value)} className="w-full text-xs p-2 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-hidden" placeholder="Toelichting ondersteuning..." />
                      </div>

                      <div className="border-t border-slate-900 pt-2">
                        <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block mb-1">3b. Foto's toevoegen (Sfeer of Bewijs)</label>
                        <label className="flex items-center justify-center gap-1.5 border border-dashed border-indigo-500 bg-indigo-950/30 py-2 rounded-lg cursor-pointer text-[10.5px] font-bold text-indigo-300 hover:bg-indigo-950/50">
                          <Camera className="h-4 w-4" /> <span>Kies of maak foto</span>
                          <input type="file" accept="image/*" multiple onChange={handlePhotoUploadChange} className="hidden" />
                        </label>
                        {isCompressing && <p className="text-[9px] text-indigo-300 animate-pulse font-mono mt-1">Foto's optimaliseren...</p>}
                        {formPhotos.length > 0 && (
                          <div className="grid grid-cols-3 gap-1 mt-1.5 p-1 bg-slate-900/50 rounded-lg">
                            {formPhotos.map((p, idx) => (
                              <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-slate-800 border">
                                <img src={p} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => handleRemoveFormPhoto(idx)} className="absolute top-0.5 right-0.5 bg-rose-600 rounded-full p-0.5 text-white"><X className="h-2 w-2" /></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg cursor-pointer shadow-md mt-2 uppercase tracking-wide">Cloud Check-in Insturen</button>
                    </form>
                  </div>

                  <div className="border-t border-white/5 pt-2 text-center text-[9px] text-slate-500 font-mono">Gecertificeerd Cloud Kanaal Actief</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COÖRDINATOR CONTROL CENTER FEED */}
        {currentRole === 'COÖRDINATOR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Add manual student trigger form */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="bg-white border rounded-xl shadow-xs overflow-hidden">
                <button onClick={() => setShowAddStudentForm(!showAddStudentForm)} className="w-full p-4 bg-slate-50 hover:bg-slate-100 flex items-center justify-between border-b text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 bg-indigo-50 border rounded-lg text-indigo-700"><UserPlus className="h-4 w-4" /></div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800">Nieuwe Student Handmatig Toevoegen</h3>
                      <p className="text-[11px] text-slate-500">Registreer direct een nieuw leerdossier in de realtime cloud database</p>
                    </div>
                  </div>
                  <div className="border rounded-md p-1 font-bold text-xs">{showAddStudentForm ? '✕' : '＋'}</div>
                </button>

                <AnimatePresence>
                  {showAddStudentForm && (
                    <motion.form initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} onSubmit={handleAddNewStudent} className="p-5 flex flex-col gap-4 bg-white border-l-4 border-indigo-600">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1"><label className="text-xs font-semibold text-slate-700">Naam Student</label><input type="text" required placeholder="Bijv. Amy Geerts" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} className="text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden" /></div>
                        <div className="flex flex-col gap-1"><label className="text-xs font-semibold text-slate-700">CIOS E-mailadres</label><input type="email" required placeholder="ageerts2@student.cioszuidwest.nl" value={newStudentEmail} onChange={(e) => setNewStudentEmail(e.target.value)} className="text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden" /></div>
                        <div className="flex flex-col gap-1"><label className="text-xs font-semibold text-slate-700">Bestemming (Stad)</label><input type="text" required placeholder="Bijv. Zakynthos of Málaga" value={customCity} onChange={(e) => setCustomCity(e.target.value)} className="text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden" /></div>
                        <div className="flex flex-col gap-1"><label className="text-xs font-semibold text-slate-700">Land</label><input type="text" placeholder="Bijv. Griekenland of Spanje" value={customCountry} onChange={(e) => setCustomCountry(e.target.value)} className="text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden" /></div>
                        
                        <div className="flex flex-col gap-1 col-span-1 sm:col-span-2">
                          <div className="flex justify-between items-center mb-0.5">
                            <label className="text-xs font-semibold text-slate-700">Coördinaten & Live Kaart-verificatie</label>
                            <button type="button" onClick={() => setShowManualCoords(!showManualCoords)} className="text-[10px] text-indigo-600 font-bold underline cursor-pointer">
                              {showManualCoords ? '⚡ Gebruik automatische zoeker' : '⚙️ Handmatige cijfers invoeren'}
                            </button>
                          </div>

                          {showManualCoords ? (
                            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border">
                              <div className="flex flex-col gap-0.5"><span className="text-[9px] uppercase font-mono text-slate-400">Breedtegraad (Lat)</span><input type="text" placeholder="37.8617" value={manualLat} onChange={(e) => setManualLat(e.target.value)} className="text-xs p-1.5 bg-white border rounded-md" /></div>
                              <div className="flex flex-col gap-0.5"><span className="text-[9px] uppercase font-mono text-slate-400">Lengtegraad (Lng)</span><input type="text" placeholder="20.7438" value={manualLng} onChange={(e) => setManualLng(e.target.value)} className="text-xs p-1.5 bg-white border rounded-md" /></div>
                            </div>
                          ) : (
                            <div className="text-[11px] font-medium p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 animate-pulse">
                              {coordSearchMessage || 'Typ een stad hierboven. OpenStreetMap zoekt de coördinaten direct live op!'}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 col-span-1 sm:col-span-2"><label className="text-xs font-semibold text-slate-700">Stagebedrijf / Host-Organisatie</label><input type="text" placeholder="Zakynthos Watersports Academy of Lokale Sportorganisatie" value={newStudentHostOrg} onChange={(e) => setNewStudentHostOrg(e.target.value)} className="text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden" /></div>
                      </div>
                      <button type="submit" disabled={isSearchingCoords} className="self-end px-5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg uppercase tracking-wider cursor-pointer shadow-md disabled:bg-slate-300">Opslaan in Cloud ☁️</button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Realtime Table Feed list grid view */}
              <div className="bg-white border rounded-xl shadow-xs flex flex-col overflow-hidden">
                <div className="p-4 border-b bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <h2 className="font-bold text-slate-850 text-sm flex items-center gap-2"><Activity className="h-4 w-4 text-indigo-600" /> Realtime Mobiliteits-Dashboard</h2>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input type="text" placeholder="Zoek op naam of locatie..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="text-xs p-1.5 border rounded-lg bg-white w-full sm:w-48 focus:outline-hidden" />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs border rounded-lg p-1.5 cursor-pointer bg-white">
                      <option value="ALL">Alle statussen</option>
                      <option value="Thuis">Thuis</option>
                      <option value="EMERGENCY">🚨 Calamiteiten</option>
                      <option value="Veilig aangekomen">Veilig aangekomen</option>
                      <option value="Bezig op stage met activiteiten">Bezig op stage met activiteiten</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[9px] font-extrabold tracking-wider border-b">
                      <tr>
                        <th className="px-5 py-3">Deelnemer</th>
                        <th className="px-5 py-3">Stage Bestemming</th>
                        <th className="px-5 py-3">Cloud Status</th>
                        <th className="px-5 py-3 text-right">Laatste Cloud Update</th>
                        <th className="px-5 py-3 text-center">Actie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredStudents.map((stud) => (
                        <tr key={stud.id} onClick={() => setActiveStudentId(stud.id)} className={`cursor-pointer transition-colors ${activeStudentId === stud.id ? 'bg-slate-100/80' : 'bg-white hover:bg-slate-50'} ${stud.hasActiveEmergency ? 'bg-rose-50' : ''}`}>
                          <td className="px-5 py-3 font-semibold">
                            <p className="text-slate-900 flex items-center gap-1.5">{stud.name} {stud.hasActiveEmergency && <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-ping" />}</p>
                            <span className="text-[10px] text-slate-400 font-normal">{stud.email}</span>
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-slate-800 font-medium">{stud.city}, {stud.country}</p>
                            <span className="text-[10px] text-slate-400 font-mono block">{stud.hostOrganization}</span>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase ${stud.hasActiveEmergency ? 'bg-rose-100 text-rose-700 border-rose-300' : 'bg-slate-100 text-slate-700'}`}>
                              {stud.hasActiveEmergency ? '🚨 CALAMITEIT' : stud.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <p className="italic text-slate-600 truncate max-w-[150px]">"{stud.lastMessage || 'Geen check-in tekst'}"</p>
                            <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{stud.lastUpdate ? new Date(stud.lastUpdate).toLocaleTimeString('nl-NL') : 'Niet actief'}</span>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <button type="button" onClick={(e) => { e.stopPropagation(); setStudentToDelete(stud); }} className="p-1 text-rose-600 border border-rose-200 bg-rose-50 rounded-md cursor-pointer hover:bg-rose-100"><Trash2 className="h-3.5 w-3.5" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Secure Log Audits Display terminal box */}
              <div className="bg-slate-900 text-slate-400 p-4 rounded-xl border border-slate-800 font-mono text-[10px] shadow-md">
                <span className="text-white font-bold block border-b border-slate-800 pb-2 mb-2 uppercase tracking-wide">🛡️ Realtime Database & GDPR Audit Trail</span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {auditLogs.map(l => (
                    <div key={l.id} className="border-b border-slate-800/40 pb-1 last:border-0 flex justify-between gap-4">
                      <span className="text-slate-600 shrink-0">{new Date(l.timestamp).toLocaleTimeString('nl-NL')}</span>
                      <p className="text-slate-200 flex-1"><strong className="text-emerald-400 font-normal">{l.actor}:</strong> {l.action}</p>
                      <span className="text-slate-600 truncate max-w-[100px]">Target: {l.target_student || 'Systeem'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Detail Dossier Panel */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {activeStudent && (
                <div className="bg-white border rounded-xl p-5 shadow-xs flex flex-col gap-4">
                  <div className="border-b pb-3 flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase font-mono block">Dossier deelnemer</span>
                      <h3 className="font-bold text-slate-900 text-sm font-display mt-0.5">{activeStudent.name}</h3>
                    </div>
                    <button onClick={() => { setLoggedInStudentId(activeStudent.id); setCurrentRole('STUDENT'); }} className="p-1 px-2 bg-slate-900 text-white rounded text-[10px] font-bold cursor-pointer">Simuleer Mobiel 📱</button>
                  </div>

                  {activeStudent.hasActiveEmergency && (
                    <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 flex flex-col gap-2.5">
                      <span className="text-[10px] font-bold text-rose-700 block">🚨 CALAMITEIT IN BEHANDELING</span>
                      <p className="text-xs bg-white border border-rose-200 p-2 rounded italic">"{activeStudent.emergencyMessage}"</p>
                      <button type="button" onClick={() => resolveEmergency(activeStudent.id)} className="w-full py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg uppercase cursor-pointer shadow-xs">Alarm Sluiten / Veilig</button>
                    </div>
                  )}

                  {/* Geo Visualization OpenStreetMap box embed */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-slate-700 uppercase font-mono flex items-center gap-1.5"><Map className="h-4 w-4 text-indigo-600" /> Geo-Verificatie</span>
                    {activeStudent.consentGiven && activeStudent.status !== 'Onderweg' ? (
                      <div className="bg-slate-950 border rounded-xl h-60 overflow-hidden relative">
                        <iframe width="100%" height="100%" title="Map" src={getMapUrl(activeStudent)} className="w-full h-full border-0 absolute" />
                      </div>
                    ) : (
                      <div className="bg-slate-50 border rounded-xl h-40 flex flex-col items-center justify-center text-center p-4 text-slate-400 text-xs">
                        <Lock className="h-6 w-6 mb-1 text-slate-300" />
                        <p className="font-semibold text-slate-600">Geen actieve GPS-stream</p>
                        <p className="text-[10px] mt-0.5">Zodra de student via de mobiel inlogt en een check-in verstuurt, verschijnt de live kaart hier.</p>
                      </div>
                    )}
                  </div>

                  {/* Contact info metadata grid lists */}
                  <div className="border-t pt-3 flex flex-col gap-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 uppercase font-mono text-[11px]">Contact & Stagegegevens</span>
                      {!isEditingContactInfo ? (
                        <button type="button" onClick={() => setIsEditingContactInfo(true)} className="text-[10px] text-indigo-650 font-bold underline cursor-pointer">Aanpassen</button>
                      ) : (
                        <div className="flex gap-1.5">
                          <button type="button" onClick={handleSaveContactInfo} className="bg-emerald-600 text-white p-0.5 px-2 rounded text-[10px] font-bold cursor-pointer">Opslaan</button>
                          <button type="button" onClick={() => setIsEditingContactInfo(false)} className="bg-slate-100 text-slate-600 p-0.5 px-2 rounded text-[10px] font-bold cursor-pointer">✕</button>
                        </div>
                      )}
                    </div>

                    {!isEditingContactInfo ? (
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between"><span className="text-slate-400">Partner BPV:</span><span className="font-semibold truncate max-w-[150px] text-right">{activeStudent.hostOrganization}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Mobiel Deelnemer:</span><span className="font-mono text-slate-800">{activeStudent.phone || 'Niet ingevuld'}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Thuisfront Contact:</span><span className="font-semibold text-right">{activeStudent.emergencyContactName || 'Niet ingevuld'}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Noodnummer:</span><span className="font-mono text-slate-800">{activeStudent.emergencyContactPhone || 'Niet ingevuld'}</span></div>
                        <div className="border-t border-dashed my-1" />
                        <div className="flex justify-between"><span className="text-indigo-700 font-semibold">Praktijkopleider:</span><span className="font-semibold text-right text-slate-800">{activeStudent.supervisorName || 'Niet ingevuld'}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Tel. Opleider:</span><span className="font-mono text-slate-800">{activeStudent.supervisorPhone || 'Niet ingevuld'}</span></div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border p-2 rounded-lg flex flex-col gap-1.5 text-[10px]">
                        <input type="text" placeholder="Stagebedrijf" value={editHostOrg} onChange={(e) => setEditHostOrg(e.target.value)} className="p-1 bg-white border rounded-md focus:outline-hidden" />
                        <input type="text" placeholder="Telefoon student" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="p-1 bg-white border rounded-md focus:outline-hidden font-mono" />
                        <input type="text" placeholder="Thuisfront naam" value={editEmergencyContactName} onChange={(e) => setEditEmergencyContactName(e.target.value)} className="p-1 bg-white border rounded-md focus:outline-hidden" />
                        <input type="text" placeholder="Noodnummer" value={editEmergencyContactPhone} onChange={(e) => setEditEmergencyContactPhone(e.target.value)} className="p-1 bg-white border rounded-md focus:outline-hidden font-mono" />
                        <div className="border-t border-dashed my-0.5" />
                        <input type="text" placeholder="Naam praktijkopleider" value={editSupervisorName} onChange={(e) => setEditSupervisorName(e.target.value)} className="p-1 bg-white border rounded-md focus:outline-hidden" />
                        <input type="text" placeholder="Telefoon opleider" value={editSupervisorPhone} onChange={(e) => setEditSupervisorPhone(e.target.value)} className="p-1 bg-white border rounded-md focus:outline-hidden font-mono" />
                      </div>
                    )}
                  </div>

                  {/* Google Meet Online call workflow component trigger */}
                  <div className="border-t pt-3 flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-800 uppercase font-mono flex items-center gap-1.5"><Video className="h-4 w-4 text-indigo-600 animate-pulse" /> Online Voortgangsgesprek</span>
                    <div className="bg-slate-50 border rounded-xl p-3 text-xs leading-relaxed text-slate-600">
                      {activeStudent.googleMeetUrl ? (
                        <div className="flex flex-col gap-2">
                          <p className="font-semibold text-emerald-700">● Gesprekskanaal staat momenteel live open.</p>
                          <div className="flex gap-2">
                            <a href={activeStudent.googleMeetUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-center font-bold text-xs">Deelnemen</a>
                            <button type="button" onClick={() => handleStopGoogleMeet(activeStudent.id)} className="px-2.5 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded font-bold text-xs cursor-pointer">Sluiten</button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" onClick={() => handleStartGoogleMeet(activeStudent.id)} className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg uppercase text-xs flex items-center justify-center gap-1 cursor-pointer">🎥 Start Google Meet Gesprek</button>
                      )}
                    </div>
                  </div>

                  {/* Travel periods input boxes dates */}
                  <div className="border-t pt-3 flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-800 uppercase font-mono flex items-center gap-1.5"><Calendar className="h-4 w-4 text-indigo-600" /> Geplande Reisperiode</span>
                    <div className="bg-slate-50 border rounded-xl p-3 flex flex-col gap-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col gap-0.5"><label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Vertrek</label><input type="date" value={dossierDepartureDate} onChange={(e) => setDossierDepartureDate(e.target.value)} className="text-xs p-1 bg-white border rounded cursor-pointer text-slate-800" /></div>
                        <div className="flex flex-col gap-0.5"><label className="text-[9px] uppercase font-bold text-slate-500 font-mono">Terugkomst</label><input type="date" value={dossierReturnDate} onChange={(e) => setDossierReturnDate(e.target.value)} className="text-xs p-1 bg-white border rounded cursor-pointer text-slate-800" /></div>
                      </div>
                      <button type="button" onClick={handleSaveTravelDates} className="w-full py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg uppercase tracking-wide cursor-pointer">Periode Opslaan</button>
                    </div>
                  </div>

                  {/* Sfeer en Ondersteuningsbehoeften Intake logs view panel side block */}
                  <div className="border-t pt-3 flex flex-col gap-3 text-xs leading-relaxed">
                    <span className="font-bold text-slate-800 uppercase font-mono text-[11px] flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-indigo-600" /> Ingestuurde Begeleidingsstatus</span>
                    <div className={`p-2.5 rounded-xl border italic ${activeStudent.isSafeEnv ?? true ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                      <span className="text-[9.5px] font-bold uppercase not-italic tracking-wider text-slate-400 block mb-0.5">2. Veiligheid & Omgeving:</span>
                      "{activeStudent.safeEnvDetails || 'Geen toelichting meegestuurd.'}"
                    </div>
                    <div className={`p-2.5 rounded-xl border italic ${activeStudent.needsSupport ? 'bg-amber-50 border-amber-100' : 'bg-slate-50'}`}>
                      <span className="text-[9.5px] font-bold uppercase not-italic tracking-wider text-slate-400 block mb-0.5">3. Extra Ondersteuningsbehoefte:</span>
                      "{activeStudent.supportDetails || 'Geen behoeften of toelichting meegestuurd.'}"
                    </div>

                    {/* Real cloud uploaded photos visualization grid carousel */}
                    <div className="flex flex-col gap-1.5 pt-1 border-t border-dashed">
                      <span className="text-[10px] font-bold text-slate-700 uppercase font-mono flex items-center gap-1.5"><Camera className="h-4 w-4 text-indigo-600" /> BPV Foto-Dossier (Cloud)</span>
                      {activeStudent.uploadedPhotos && activeStudent.uploadedPhotos.length > 0 ? (
                        <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-xl border">
                          {activeStudent.uploadedPhotos.map((p, i) => (
                            <div key={i} className="relative aspect-square border bg-white rounded-lg overflow-hidden shadow-2xs cursor-zoom-in" onClick={() => setSelectedFullImage(p)}>
                              <img src={p} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic text-center p-2 bg-slate-50 rounded-lg border border-dashed">Nog geen foto's geüpload.</p>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Emergency Modal trigger */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl">
              <div className="bg-rose-600 p-4 text-white font-bold text-sm flex items-center gap-1.5 uppercase font-mono"><ShieldAlert className="h-5 w-5" /><span>Acute Calamiteit Melden</span></div>
              <form onSubmit={triggerEmergency} className="p-5 flex flex-col gap-4">
                <textarea rows={3} placeholder="Omschrijf de noodsituatie bondig..." value={emergencyText} onChange={(e) => setEmergencyText(e.target.value)} className="w-full p-2 bg-slate-50 border text-xs rounded-lg text-slate-800" required />
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setShowEmergencyModal(false)} className="py-1.5 border rounded-lg text-xs font-bold text-slate-600 cursor-pointer">Annuleren</button>
                  <button type="submit" className="py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold cursor-pointer">Verstuur Noodsignaal 🚨</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simulated authentication switcher login dialog popup */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl border max-w-md w-full overflow-hidden shadow-2xl">
              <div className="bg-indigo-600 p-4 text-white font-bold text-sm flex items-center gap-1.5 font-mono uppercase"><Lock className="h-4 w-4" /><span>CIOS Live Cloud Authenticator</span></div>
              <div className="p-5 flex flex-col gap-4">
                
                {students.length === 0 ? (
                  <div className="text-center p-4 bg-slate-50 border border-dashed rounded-xl flex flex-col items-center gap-3">
                    <p className="text-xs text-slate-600 font-medium">De cloud-database is momenteel nog helemaal leeg. Log eerst in als Coördinator om student-accounts te registreren.</p>
                    <button type="button" onClick={() => { setCurrentRole('COÖRDINATOR'); setShowLoginModal(false); }} className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg uppercase cursor-pointer">Inloggen als Coördinator (Heidie)</button>
                  </div>
                ) : (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1.5">Directe Snelstarter (Kies profiel):</span>
                    <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                      <button type="button" onClick={() => { setCurrentRole('COÖRDINATOR'); setShowLoginModal(false); }} className="w-full text-left p-2 bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold rounded-lg text-xs cursor-pointer flex justify-between"><span>🔑 Heidie van Remortele (Coördinator)</span> <span className="text-[8px] bg-indigo-200 p-0.5 px-1 rounded">BEHEER</span></button>
                      {students.map(s => (
                        <button key={s.id} type="button" onClick={() => { setLoggedInStudentId(s.id); setCurrentRole('STUDENT'); setShowLoginModal(false); }} className="w-full text-left p-2 bg-slate-50 border rounded-lg text-xs font-semibold text-slate-700 cursor-pointer">👤 {s.name} ({s.email})</button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Handmatige LDAP-Simulatie:</span>
                  <form onSubmit={handleSimulatedLogin} className="flex gap-1.5">
                    <input type="text" placeholder="Typ 'heidie' of student-email..." value={typedEmail} onChange={(e) => setTypedEmail(e.target.value)} className="flex-1 text-xs p-2 bg-slate-50 border rounded-lg focus:outline-hidden" />
                    <button type="submit" className="bg-indigo-600 text-white font-bold text-xs px-4 rounded-lg cursor-pointer">Login</button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* In-app modal delete confirmation */}
      <AnimatePresence>
        {studentToDelete && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="bg-white rounded-2xl p-5 max-w-sm w-full flex flex-col gap-4 shadow-xl">
              <div className="text-center">
                <h4 className="font-bold text-sm text-slate-850">Dossier van {studentToDelete.name} permanent wissen?</h4>
                <p className="text-xs text-slate-500 leading-relaxed mt-1.5">Deze actie wist alle realtime cloud check-ins en foto's onherroepelijk uit de database conform AVG-richtlijnen.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setStudentToDelete(null)} className="py-2 bg-slate-100 rounded-xl text-xs font-bold cursor-pointer">Annuleren</button>
                <button type="button" onClick={confirmDeleteStudent} className="py-2 bg-rose-600 text-white rounded-xl text-xs font-bold cursor-pointer">Permanent wissen</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Photo lightbox zoom full overlay popups */}
      <AnimatePresence>
        {selectedFullImage && (
          <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center p-4 z-50 cursor-zoom-out" onClick={() => setSelectedFullImage(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative max-w-4xl">
              <img src={selectedFullImage} alt="" className="max-w-full max-h-[80vh] rounded-xl shadow-2xl" />
              <button onClick={() => setSelectedFullImage(null)} className="mt-4 mx-auto px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg cursor-pointer block">Sluiten</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="h-10 bg-slate-100 border-t px-4 sm:px-8 flex items-center justify-between text-[9px] text-slate-500 font-bold font-mono tracking-widest mt-auto uppercase">
        <div>Zuidwest-Nederland Cloud monitor</div>
        <div>© 2026 CIOS GlobalLink — Realtime Supabase Database Connected</div>
      </footer>

    </div>
  );
}
