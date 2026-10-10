import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  Search,
  PanelLeftClose,
  PanelLeft,
  Sprout,
  X,
  Clock
} from 'lucide-react';
import { SupportedLanguage, ChatMessage, ChatThread } from '../types/index.ts';
import { getTranslation } from '../utils/i18n.ts';

interface AgronomistChatProps {
  language: SupportedLanguage;
  cropContext?: string;
  diseaseContext?: string;
  initialQuery?: string;
}

const LOCAL_STORAGE_KEY = 'verdant_ai_chat_threads_v1';
const ACTIVE_THREAD_KEY = 'verdant_ai_active_thread_id_v1';

export const AgronomistChat: React.FC<AgronomistChatProps> = ({
  language,
  cropContext,
  diseaseContext,
  initialQuery
}) => {
  const t = (k: string) => getTranslation(language, k);

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitleText, setEditingTitleText] = useState<string>('');
  
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const initialQueryProcessedRef = useRef<string | null>(null);

  // Load chat threads on mount
  useEffect(() => {
    loadThreads();
  }, []);

  const loadThreads = async () => {
    try {
      // Fetch from server
      const res = await fetch('/api/v1/chats');
      if (res.ok) {
        const data: ChatThread[] = await res.json();
        if (data.length > 0) {
          setThreads(data);
          const savedActiveId = localStorage.getItem(ACTIVE_THREAD_KEY);
          if (savedActiveId && data.some(t => t.id === savedActiveId)) {
            setActiveThreadId(savedActiveId);
          } else {
            setActiveThreadId(data[0].id);
          }
          return;
        }
      }
    } catch (e) {
      console.warn('Could not fetch chats from server, falling back to local storage:', e);
    }

    // Fallback to local storage if available
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed: ChatThread[] = JSON.parse(stored);
        if (parsed.length > 0) {
          setThreads(parsed);
          setActiveThreadId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.warn('Local storage parse error:', e);
    }

    // If completely empty, create an initial welcome thread
    createNewThread();
  };

  const createNewThread = (optionalCrop?: string, optionalDisease?: string): string => {
    const newId = 'thread_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const newThread: ChatThread = {
      id: newId,
      title: optionalCrop ? `${optionalCrop} Field Consultation` : 'New Agronomic Consultation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cropContext: optionalCrop || cropContext,
      diseaseContext: optionalDisease || diseaseContext,
      messages: [
        {
          id: 'welcome_' + Date.now(),
          sender: 'agronomist',
          text: `Namaste! I am Kisan Sahayak, your Verdant AI Field Agronomist. 🌾\n\nHow can I help you today with crop health, organic bio-remedies, chemical spray dosages, pre-harvest safety intervals, or soil nutrition?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setThreads(prev => {
      const updated = [newThread, ...prev];
      syncThreads(updated);
      return updated;
    });

    setActiveThreadId(newId);
    localStorage.setItem(ACTIVE_THREAD_KEY, newId);
    return newId;
  };

  const syncThreads = (updatedThreads: ChatThread[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedThreads));
    } catch (e) {
      console.warn('Local storage save error:', e);
    }

    // Sync to backend asynchronously
    const active = updatedThreads.find(t => t.id === activeThreadId);
    if (active) {
      fetch('/api/v1/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(active)
      }).catch(err => console.warn('Server sync error:', err));
    }
  };

  // Process initial query if passed from other tabs (e.g., "Consult Agronomist on spray timing")
  useEffect(() => {
    if (initialQuery && initialQuery !== initialQueryProcessedRef.current) {
      initialQueryProcessedRef.current = initialQuery;
      // If active thread already has multiple messages or different topic, create a new thread
      const currentActive = threads.find(t => t.id === activeThreadId);
      if (currentActive && currentActive.messages.length > 2) {
        const newId = createNewThread(cropContext, diseaseContext);
        setTimeout(() => {
          handleSendMessageToThread(newId, initialQuery);
        }, 150);
      } else {
        handleSendMessageToThread(activeThreadId || threads[0]?.id, initialQuery);
      }
    }
  }, [initialQuery, activeThreadId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads, activeThreadId, isLoading]);

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    localStorage.setItem(ACTIVE_THREAD_KEY, id);
    // On mobile screens, automatically close sidebar after choosing a thread
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteThread = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this chat consultation?')) return;

    try {
      await fetch(`/api/v1/chats/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Server delete error:', err);
    }

    const remaining = threads.filter(t => t.id !== id);
    if (remaining.length === 0) {
      createNewThread();
    } else {
      setThreads(remaining);
      syncThreads(remaining);
      if (activeThreadId === id) {
        setActiveThreadId(remaining[0].id);
        localStorage.setItem(ACTIVE_THREAD_KEY, remaining[0].id);
      }
    }
  };

  const handleStartRename = (thread: ChatThread, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTitleId(thread.id);
    setEditingTitleText(thread.title);
  };

  const handleSaveRename = (id: string) => {
    if (!editingTitleText.trim()) return;
    const updated = threads.map(t => t.id === id ? { ...t, title: editingTitleText.trim(), updatedAt: new Date().toISOString() } : t);
    setThreads(updated);
    syncThreads(updated);
    setEditingTitleId(null);
  };

  const handleClearAllChats = async () => {
    if (!confirm('Clear all conversation history with Kisan Sahayak? This cannot be undone.')) return;
    try {
      await fetch('/api/v1/chats', { method: 'DELETE' });
    } catch (err) {
      console.warn('Clear all error:', err);
    }
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_THREAD_KEY);
    setThreads([]);
    createNewThread();
  };

  const handleSendMessageToThread = async (targetThreadId: string, queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    let targetThread = threads.find(t => t.id === targetThreadId);
    if (!targetThread) {
      targetThreadId = createNewThread();
      targetThread = threads.find(t => t.id === targetThreadId);
    }

    const userMessage: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Optimistically append user message
    const updatedMessages = [...(targetThread?.messages || []), userMessage];
    const isFirstUserMessage = (targetThread?.messages.filter(m => m.sender === 'user').length || 0) === 0;

    const updatedThread: ChatThread = {
      ...(targetThread || {
        id: targetThreadId,
        title: 'New Consultation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: []
      }),
      updatedAt: new Date().toISOString(),
      messages: updatedMessages
    };

    setThreads(prev => {
      const filtered = prev.filter(t => t.id !== targetThreadId);
      const res = [updatedThread, ...filtered];
      syncThreads(res);
      return res;
    });

    setInputText('');
    setIsLoading(true);

    try {
      // Build multi-turn history payload
      const historyPayload = updatedMessages
        .slice(0, -1)
        .map(m => ({
          role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
          text: m.text
        }));

      const response = await fetch('/api/v1/agronomist-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          context: {
            crop: targetThread?.cropContext || cropContext,
            disease: targetThread?.diseaseContext || diseaseContext,
            language: language
          },
          history: historyPayload
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: 'bot_' + Date.now(),
        sender: 'agronomist',
        text: data.answer || 'Thank you for your question. Always verify chemical application details with your local agricultural officer.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updatedMessages, botMessage];
      const newTitle = (isFirstUserMessage && data.suggestedTitle) ? data.suggestedTitle : updatedThread.title;

      const finalizedThread: ChatThread = {
        ...updatedThread,
        title: newTitle,
        updatedAt: new Date().toISOString(),
        messages: finalMessages
      };

      setThreads(prev => {
        const filtered = prev.filter(t => t.id !== targetThreadId);
        const res = [finalizedThread, ...filtered];
        syncThreads(res);
        return res;
      });

    } catch (err: any) {
      console.error('Agronomist chat error:', err);
      const errorMessage: ChatMessage = {
        id: 'err_' + Date.now(),
        sender: 'agronomist',
        text: 'I apologize, but I could not reach the agricultural inference server. Please verify your connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updatedMessages, errorMessage];
      const finalizedThread: ChatThread = {
        ...updatedThread,
        messages: finalMessages
      };

      setThreads(prev => {
        const filtered = prev.filter(t => t.id !== targetThreadId);
        const res = [finalizedThread, ...filtered];
        syncThreads(res);
        return res;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Group threads by date like ChatGPT
  const groupThreadsByDate = () => {
    const today: ChatThread[] = [];
    const yesterday: ChatThread[] = [];
    const previous7Days: ChatThread[] = [];
    const older: ChatThread[] = [];

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const filtered = threads.filter(t => {
      const q = searchFilter.toLowerCase().trim();
      return !q || t.title.toLowerCase().includes(q) || t.messages.some(m => m.text.toLowerCase().includes(q));
    });

    for (const thread of filtered) {
      const threadDate = new Date(thread.updatedAt);
      const diffMs = now.getTime() - threadDate.getTime();
      const diffDays = diffMs / oneDay;

      if (diffDays < 1 && threadDate.getDate() === now.getDate()) {
        today.push(thread);
      } else if (diffDays < 2) {
        yesterday.push(thread);
      } else if (diffDays < 7) {
        previous7Days.push(thread);
      } else {
        older.push(thread);
      }
    }

    return { today, yesterday, previous7Days, older };
  };

  const { today, yesterday, previous7Days, older } = groupThreadsByDate();

  const QUICK_PROMPTS = [
    'How to prepare 0.5% neem oil spray for leaf blights?',
    'What is the pre-harvest interval (PHI) for Mancozeb?',
    'Can I apply copper fungicide during sunny midday heat?',
    'What are the first symptoms of nitrogen vs magnesium deficiency?'
  ];

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[780px] relative">
      
      {/* LEFT SIDEBAR: ChatGPT-Style Chat History */}
      <aside
        className={`${
          isSidebarOpen ? 'w-full md:w-80 flex' : 'hidden'
        } flex-col bg-stone-900 text-stone-200 border-r border-stone-800 transition-all z-20 absolute md:relative inset-y-0 left-0`}
      >
        {/* Top Action: New Chat & Close */}
        <div className="p-3.5 border-b border-stone-800/80 flex items-center justify-between gap-2">
          <button
            onClick={() => createNewThread()}
            className="flex-1 py-2.5 px-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Consultation</span>
          </button>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-stone-400 hover:text-white rounded-lg transition"
            title="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Conversations Input */}
        <div className="p-3 border-b border-stone-800/80">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search chat history..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-950/70 border border-stone-800 rounded-lg text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Scrollable Threads List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          
          {/* Today Group */}
          {today.length > 0 && (
            <div>
              <span className="block px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Today
              </span>
              <div className="space-y-1">
                {today.map(thread => renderThreadItem(thread))}
              </div>
            </div>
          )}

          {/* Yesterday Group */}
          {yesterday.length > 0 && (
            <div>
              <span className="block px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Yesterday
              </span>
              <div className="space-y-1">
                {yesterday.map(thread => renderThreadItem(thread))}
              </div>
            </div>
          )}

          {/* Previous 7 Days Group */}
          {previous7Days.length > 0 && (
            <div>
              <span className="block px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Previous 7 Days
              </span>
              <div className="space-y-1">
                {previous7Days.map(thread => renderThreadItem(thread))}
              </div>
            </div>
          )}

          {/* Older Group */}
          {older.length > 0 && (
            <div>
              <span className="block px-2.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Older
              </span>
              <div className="space-y-1">
                {older.map(thread => renderThreadItem(thread))}
              </div>
            </div>
          )}

          {threads.length === 0 && (
            <div className="p-4 text-center text-xs text-stone-500">
              No conversations found.
            </div>
          )}

        </div>

        {/* Bottom Bar: Clear All & Status */}
        <div className="p-3 border-t border-stone-800/80 bg-stone-950/40 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px] font-medium">{threads.length} saved threads</span>
          </div>

          <button
            onClick={handleClearAllChats}
            className="text-[11px] text-stone-400 hover:text-rose-400 transition cursor-pointer flex items-center gap-1"
            title="Clear all chat history"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear all</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN CHAT AREA */}
      <section className="flex-1 flex flex-col h-full bg-stone-50/50 min-w-0">
        
        {/* Top Navbar */}
        <div className="p-3.5 sm:p-4 bg-white border-b border-stone-200 flex items-center justify-between gap-3 shadow-2xs">
          
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
              title={isSidebarOpen ? "Hide sidebar" : "Show chat history"}
            >
              {isSidebarOpen ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeft className="w-5 h-5" />
              )}
            </button>

            {/* Conversation Title & Inline Rename */}
            {editingTitleId === activeThread?.id ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={editingTitleText}
                  onChange={(e) => setEditingTitleText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(activeThread.id)}
                  autoFocus
                  className="text-xs sm:text-sm font-bold bg-white border border-emerald-500 rounded px-2 py-0.5 focus:outline-none"
                />
                <button
                  onClick={() => handleSaveRename(activeThread.id)}
                  className="p-1 text-emerald-700 hover:text-emerald-800"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-stone-900 truncate font-['Plus_Jakarta_Sans']">
                  {activeThread?.title || 'Kisan Sahayak Agronomist AI'}
                </h3>
                {activeThread && (
                  <button
                    onClick={(e) => handleStartRename(activeThread, e)}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded transition"
                    title="Rename thread"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Context Badges */}
          <div className="flex items-center gap-2 shrink-0">
            {activeThread?.cropContext && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-0.5 rounded-md">
                <Sprout className="w-3 h-3 text-emerald-600" />
                <span>{activeThread.cropContext}</span>
              </span>
            )}
            {activeThread?.diseaseContext && (
              <span className="hidden md:inline-flex text-[11px] font-semibold bg-stone-100 border border-stone-200 text-stone-700 px-2 py-0.5 rounded-md">
                {activeThread.diseaseContext}
              </span>
            )}
          </div>

        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {activeThread?.messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  m.sender === 'user'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                }`}
              >
                {m.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4 stroke-[2.5]" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 shadow-2xs relative group ${
                  m.sender === 'user'
                    ? 'bg-emerald-800 text-white rounded-tr-xs'
                    : 'bg-white border border-stone-200 text-stone-800 rounded-tl-xs'
                }`}
              >
                {/* Text Content with formatted spacing */}
                <div className="text-xs sm:text-sm whitespace-pre-line leading-relaxed selection:bg-emerald-300 selection:text-stone-900">
                  {m.text}
                </div>

                {/* Footer of bubble: Timestamp and Copy button */}
                <div className="mt-2 pt-1 border-t border-black/5 flex items-center justify-between text-[10px]">
                  <span className={m.sender === 'user' ? 'text-emerald-200' : 'text-stone-400'}>
                    {m.timestamp}
                  </span>

                  {m.sender === 'agronomist' && (
                    <button
                      onClick={() => handleCopyMessage(m.id, m.text)}
                      className="opacity-0 group-hover:opacity-100 transition text-stone-400 hover:text-emerald-700 p-0.5 rounded cursor-pointer flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedMsgId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 bg-white border border-stone-200 rounded-2xl text-xs text-stone-600 flex items-center gap-2.5 shadow-2xs">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-700" />
                <span>Kisan Sahayak is consulting agronomic databases...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-4 py-2 bg-stone-100/70 border-t border-stone-200 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 pl-1">
            Suggested:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessageToThread(activeThread.id, prompt)}
              className="text-[11px] font-medium bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 px-3 py-1 rounded-lg border border-stone-200 shrink-0 transition cursor-pointer shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessageToThread(activeThread.id, inputText);
          }}
          className="p-3 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask Kisan Sahayak about treatments, dosage, tank mixes in ${language.toUpperCase()}...`}
            className="flex-1 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-bold">Ask</span>
          </button>
        </form>

      </section>

    </div>
  );

  // Helper render for thread item in sidebar
  function renderThreadItem(thread: ChatThread) {
    const isActive = thread.id === activeThreadId;

    return (
      <div
        key={thread.id}
        onClick={() => handleSelectThread(thread.id)}
        className={`group relative rounded-xl p-2.5 transition flex items-center justify-between cursor-pointer text-xs ${
          isActive
            ? 'bg-emerald-950/80 text-white border border-emerald-600/70 shadow-sm'
            : 'text-stone-300 hover:bg-stone-800 hover:text-white'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1 pr-1">
          <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-400' : 'text-stone-500'}`} />
          <span className="truncate font-medium">
            {thread.title}
          </span>
        </div>

        {/* Hover Actions: Rename and Delete */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={(e) => handleStartRename(thread, e)}
            className="p-1 text-stone-400 hover:text-stone-200 rounded transition"
            title="Rename"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => handleDeleteThread(thread.id, e)}
            className="p-1 text-stone-400 hover:text-rose-400 rounded transition"
            title="Delete thread"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }
};
