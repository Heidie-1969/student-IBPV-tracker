import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Camera } from 'lucide-react';
interface ChatBoxProps {
  studentId: string;
  userRole: 'student' | 'teacher';
}

export function ChatBox({ studentId, userRole }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!studentId || !supabase) return;

    // Haal bestaande berichten op
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('student_id', studentId)
          .order('created_at', { ascending: true });

        if (!error && data) setMessages(data);
      } catch (err) {
        console.error('Fout bij ophalen chat:', err);
      }
    };

    fetchMessages();

    // Realtime database kanaal openen
    const channel = supabase
      .channel(`public:messages:student_id=eq.${studentId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `student_id=eq.${studentId}` },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [studentId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !studentId || !supabase) return;

    const messageText = newMessage;
    setNewMessage('');

    try {
      const { error } = await supabase.from('messages').insert([
        {
          student_id: studentId,
          text: messageText,
          sender: userRole,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) console.error('Supabase insert error:', error.message);
    } catch (err) {
      console.error('Fout bij verzenden:', err);
    }
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3 flex flex-col h-64 justify-between mt-4">
      <div className="overflow-y-auto space-y-2 pr-1 mb-2">
        {messages.length === 0 ? (
          <p className="text-[11px] text-slate-500 italic text-center pt-8">Nog geen berichten. Typ hieronder een bericht om te chatten.</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === userRole ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-xs ${msg.sender === userRole ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                {msg.text}
              </div>
              <span className="text-[9px] text-slate-500 mt-0.5 px-1">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
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
