import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

interface ChatBoxProps {
  studentId: string;
  userRole: string; // Flexibel ingesteld om alle varianten op te vangen
}

export function ChatBox({ studentId, userRole }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Zorg dat de rol altijd 'student' of 'teacher' wordt voor de database
  const isStudent = String(userRole).toLowerCase().includes('student');
  const cleanUserRole = isStudent ? 'student' : 'teacher';
  const effectiveStudentId = studentId;

  const fetchMessages = async () => {
    if (!effectiveStudentId || !supabase) return;
    try {
      const { data, error } = await supabase
        .from('student_messages')
        .select('*')
        .eq('student_id', effectiveStudentId)
        .order('id', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Fout bij ophalen:', err);
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!effectiveStudentId || !supabase) return; 

    const channel = supabase
      .channel(`public:student_messages:student_id=eq.${effectiveStudentId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'student_messages', filter: `student_id=eq.${effectiveStudentId}` },
        (payload) => {
          setMessages((current) => {
            if (current.some(m => m.id === payload.new.id)) return current;
            return [...current, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [effectiveStudentId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !effectiveStudentId || !supabase) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const { error } = await supabase
        .from('student_messages')
        .insert({
          student_id: String(effectiveStudentId),
          message: messageText,
          sender: cleanUserRole
        }); 

      if (error) {
        console.error('Supabase databasefout:', error.message);
      } else {
        fetchMessages();
      }
    } catch (err) {
      console.error('Netwerk/Verzendfout:', err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col h-64 justify-between mt-4">
      <div className="overflow-y-auto space-y-2 pr-1 mb-2">
        {messages.length === 0 ? (
          <p className="text-[11px] text-slate-400 italic text-center pt-8">
            Nog geen berichten. Typ hieronder een bericht om de chat te starten.
          </p>
        ) : (
          messages.map((msg) => {
            const isMyMessage = msg.sender === cleanUserRole;
            return (
              <div key={msg.id} className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-xs ${isMyMessage ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-100'}`}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-800 pt-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Typ een bericht..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
          Stuur
        </button>
      </form>
    </div>
  );
}
