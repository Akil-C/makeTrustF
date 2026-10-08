import { useState, useEffect, useRef } from 'react'
import {
  Send,
  ShieldAlert,
  ExternalLink,
  MessageSquare,
  CheckCheck,
} from 'lucide-react'
import chatService from '../../services/chatService'
import { formatCredits, formatRelativeTime } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const MOCK_CONVERSATIONS = [
  {
    id: 'conv-1',
    sellerName: 'TechHub Deals',
    sellerAvatar: 'https://i.pravatar.cc/150?u=techhub',
    product: {
      id: 'f1',
      title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
      price: 950,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop',
    },
    lastMessage: 'Is the phone available for pickup today in Downtown?',
    lastMessageTime: '2026-10-06T10:15:00Z',
    unreadCount: 1,
  },
  {
    id: 'conv-2',
    sellerName: 'AudioFile Store',
    sellerAvatar: 'https://i.pravatar.cc/150?u=audio',
    product: {
      id: 'f2',
      title: 'Sony WH-1000XM5 Wireless Headphones',
      price: 280,
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop',
    },
    lastMessage: 'Yes, includes original box and factory receipt!',
    lastMessageTime: '2026-10-05T14:20:00Z',
    unreadCount: 0,
  },
]

const MOCK_MESSAGES = [
  { id: 'm1', sender: 'seller', text: 'Hi! Thanks for reaching out about the iPhone 15 Pro Max.', time: '10:10 AM' },
  { id: 'm2', sender: 'buyer', text: 'Is the phone available for pickup today in Downtown?', time: '10:15 AM' },
  { id: 'm3', sender: 'seller', text: 'Yes! I can meet near Market St. All payments go through Nexora MC Escrow.', time: '10:16 AM' },
]

export default function BuyerChat() {
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS)
  const [activeConv, setActiveConv] = useState(MOCK_CONVERSATIONS[0])
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'buyer',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, newMsg])
    setInputMessage('')

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-reply-${Date.now()}`,
          sender: 'seller',
          text: 'Got your message! Let me confirm the exact meeting location.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-12 flex flex-col">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col">
        <div className="bg-white border border-[#070707]/10 flex-1 flex flex-col md:flex-row overflow-hidden min-h-[640px]">
          {/* Left Sidebar: Conversations list */}
          <div className="w-full md:w-80 border-r border-[#070707]/10 bg-[#F1F1ED]/50 flex flex-col shrink-0">
            <div className="p-4 border-b border-[#070707]/10 flex items-center justify-between">
              <h2 className="font-serif font-bold text-[#070707] text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#EF6F79]" /> Seller Dialogues
              </h2>
              <span className="furniture-subtitle text-[10px] bg-[#070707] text-white px-2 py-0.5">
                {conversations.length} CONVS
              </span>
            </div>

            <div className="divide-y divide-[#070707]/10 overflow-y-auto flex-1">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  className={`p-4 cursor-pointer transition-colors flex items-center gap-3 ${
                    activeConv.id === c.id ? 'bg-white border-l-4 border-[#EF6F79]' : 'hover:bg-[#E4E5E0]/50'
                  }`}
                >
                  <img src={c.sellerAvatar} alt="" className="w-10 h-10 object-cover shrink-0 border border-[#070707]/10" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-bold text-[#070707] text-xs truncate">{c.sellerName}</span>
                      <span className="text-[10px] text-[#070707]/40 font-mono">{formatRelativeTime(c.lastMessageTime)}</span>
                    </div>
                    <p className="text-xs text-[#EF6F79] font-medium truncate">{c.product.title}</p>
                    <p className="text-xs text-[#070707]/60 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Chat Window */}
          <div className="flex-1 flex flex-col bg-white">
            {/* Product Context Header */}
            <div className="p-4 bg-[#F1F1ED]/80 border-b border-[#070707]/10 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <img
                  src={activeConv.product.image}
                  alt=""
                  className="w-12 h-12 object-cover border border-[#070707]/10 shrink-0"
                />
                <div>
                  <span className="furniture-subtitle text-[10px] text-[#070707]/60 block">DIALOGUE WITH {activeConv.sellerName}</span>
                  <h3 className="font-serif font-bold text-[#070707] text-sm line-clamp-1">{activeConv.product.title}</h3>
                  <span className="text-xs font-mono font-bold text-[#EF6F79]">{formatCredits(activeConv.product.price)}</span>
                </div>
              </div>

              <a
                href={`/products/${activeConv.product.id}`}
                className="px-4 py-2 bg-[#070707] hover:bg-[#EF6F79] text-white furniture-subtitle text-[11px] transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>VIEW PRODUCT</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Off-Platform Warning Banner */}
            <div className="bg-[#F3D6DC]/60 px-4 py-2.5 border-b border-[#EF6F79]/30 text-[#070707] text-xs flex items-center gap-2 shrink-0">
              <ShieldAlert className="w-4 h-4 text-[#EF6F79] shrink-0" />
              <span>
                <strong>Escrow Protection Notice:</strong> Never transfer funds outside Nexora Escrow. Off-platform transactions void buyer protection.
              </span>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#F7F7F4]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'buyer' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-4 text-xs leading-relaxed border ${
                      msg.sender === 'buyer'
                        ? 'bg-[#070707] text-white border-[#070707]'
                        : 'bg-white text-[#070707] border-[#070707]/15'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#070707]/40 mt-1 px-1 flex items-center gap-1">
                    {msg.time}
                    {msg.sender === 'buyer' && <CheckCheck className="w-3 h-3 text-[#EF6F79]" />}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#070707]/10 flex items-center gap-3 bg-white shrink-0">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Inquire about offer details, local pickup or verification..."
                className="flex-1 px-4 py-3 bg-[#F1F1ED] border border-[#070707]/10 focus:border-[#070707] focus:bg-white text-xs outline-none transition-all font-sans"
              />
              <button
                type="submit"
                className="p-3 bg-[#070707] hover:bg-[#EF6F79] text-white transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
