import { useState, useEffect, useRef } from 'react'
import {
  Send,
  ShieldAlert,
  MessageSquare,
  CheckCheck,
  Package,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import chatService from '../../services/chatService'
import { formatCredits } from '../../utils/formatters'
import { detectOffPlatformRisk } from '../../utils/sanitize'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function BuyerChat() {
  const { user } = useAuth()
  const [rooms, setRooms] = useState([])
  const [activeRoom, setActiveRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Load rooms on mount
  useEffect(() => {
    async function loadRooms() {
      setLoadingRooms(true)
      try {
        const res = await chatService.getMyRooms()
        const list = res.data || []
        setRooms(list)
        if (list.length > 0) {
          setActiveRoom(list[0])
        }
      } catch {
        setRooms([])
      } finally {
        setLoadingRooms(false)
      }
    }
    loadRooms()
  }, [])

  // Load messages when active room changes
  useEffect(() => {
    if (!activeRoom?.id) return

    async function loadMessages() {
      setLoadingMessages(true)
      try {
        const res = await chatService.getRoomMessages(activeRoom.id)
        setMessages(res.data || [])
        await chatService.markAsRead(activeRoom.id)
      } catch {
        setMessages([])
      } finally {
        setLoadingMessages(false)
      }
    }
    loadMessages()

    // 5-second polling for active room messages as reliable live fallback
    const interval = setInterval(async () => {
      try {
        const res = await chatService.getRoomMessages(activeRoom.id)
        setMessages(res.data || [])
      } catch {
        // quiet
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [activeRoom?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || !activeRoom?.id || sending) return

    const text = inputMessage.trim()
    setInputMessage('')
    setSending(true)

    // Security check: intercept off-platform scam cues or external payment schemes
    const risk = detectOffPlatformRisk(text)
    if (risk.flagged) {
      toast('Security Warning: Avoid sharing phone numbers, UPI IDs, or paying outside the escrow vault. Off-platform deals are not protected.', {
        icon: '🛡️',
        duration: 5000,
      })
    }

    try {
      const res = await chatService.sendMessage(activeRoom.id, { content: text, type: 'TEXT' })
      if (res.data) {
        setMessages((prev) => [...prev, res.data])
      }
    } catch (err) {
      toast.error('Unable to send message')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Buyer Channel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2.5">
              <MessageSquare className="w-7 h-7 text-blue-600" />
              <span>Merchant Dialogues & Inquiry</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Real-time secure chat with verified merchants. Agree on terms, condition, and exchange details with escrow fraud protection.
            </p>
          </div>
        </div>

        {/* Anti-Fraud Banner */}
        <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 flex items-center gap-3 text-amber-900 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <p>
            <strong>Nexora Escrow Shield:</strong> Never share phone numbers or transfer funds outside Nexora. All purchases must proceed through <strong>Authorize Escrow Order</strong> to be insured.
          </p>
        </div>

        {/* Chat Interface Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[620px]">
          {/* Left Panel: Conversation Rooms */}
          <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Conversations</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[11px]">
                {rooms.length} active
              </span>
            </div>

            <div className="divide-y divide-slate-200 overflow-y-auto flex-1">
              {loadingRooms ? (
                <div className="p-8 flex justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              ) : rooms.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
                  <p>No active chat rooms yet.</p>
                  <p className="text-[11px] text-slate-500">Visit any product listing and click <strong>"Message Seller"</strong> to initiate an inquiry.</p>
                </div>
              ) : (
                rooms.map((room) => {
                  const otherName = room.otherUser?.name || 'Seller'
                  const productTitle = room.product?.title || 'Listing Inquiry'
                  const isSelected = activeRoom?.id === room.id

                  return (
                    <div
                      key={room.id}
                      onClick={() => setActiveRoom(room)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected ? 'bg-white border-l-4 border-slate-900' : 'hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 truncate max-w-[140px]">{otherName}</span>
                        <span className="text-[10px] text-slate-400">
                          {room.lastMessageAt ? new Date(room.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium truncate mb-1">{productTitle}</p>
                      <p className="text-[11px] text-slate-400 truncate">{room.lastMessage || 'Room created'}</p>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Panel: Chat Thread */}
          <div className="flex-1 flex flex-col bg-white">
            {activeRoom ? (
              <>
                {/* Active Chat Header */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm border border-slate-200">
                      {activeRoom.otherUser?.name ? activeRoom.otherUser.name[0].toUpperCase() : 'S'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {activeRoom.otherUser?.name || 'Verified Merchant'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          Escrow Protected
                        </span>
                      </div>
                      {activeRoom.product && (
                        <p className="text-xs text-slate-500 truncate max-w-md">
                          Regarding: <strong>{activeRoom.product.title}</strong> ({formatCredits(activeRoom.product.priceInCredits ?? 0)})
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages Stream */}
                <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-50/50">
                  {loadingMessages ? (
                    <div className="p-8 flex justify-center">
                      <LoadingSpinner size="md" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 text-xs">
                      Say hello to {activeRoom.otherUser?.name || 'the seller'}! Ask about availability, condition, or pickup location.
                    </div>
                  ) : (
                    messages.map((m) => {
                      const isMe = m.sender?.id === user?.id || m.senderId === user?.id

                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm ${
                              isMe
                                ? 'bg-slate-900 text-white rounded-br-xs'
                                : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs shadow-xs'
                            }`}
                          >
                            <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 px-1">
                            {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                      )
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Field */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type an inquiry or negotiate terms..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || sending}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-700">Select a Conversation</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Choose a dialogue from the left list to review chat logs, send messages, or coordinate delivery.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
