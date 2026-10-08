import { useState, useRef, useEffect } from 'react'
import {
  Send,
  ShieldAlert,
  MessageSquare,
} from 'lucide-react'
import { formatCredits } from '../../utils/formatters'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'

const MOCK_CONVERSATIONS = [
  {
    id: 'conv-1',
    buyerName: 'David K.',
    buyerAvatar: 'https://i.pravatar.cc/150?u=david',
    product: {
      id: 'f1',
      title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
      price: 950,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop',
    },
    lastMessage: 'Is the phone available for pickup today in Downtown?',
    lastMessageTime: '2026-10-06T10:15:00Z',
  },
]

const MOCK_MESSAGES = [
  { id: 'm1', sender: 'seller', text: 'Hi David! Thanks for reaching out about the iPhone 15 Pro Max.', time: '10:10 AM' },
  { id: 'm2', sender: 'buyer', text: 'Is the phone available for pickup today in Downtown?', time: '10:15 AM' },
  { id: 'm3', sender: 'seller', text: 'Yes! All payments go through Nexora MC Escrow.', time: '10:16 AM' },
]

export default function SellerChat() {
  const [conversations] = useState(MOCK_CONVERSATIONS)
  const [activeConv, setActiveConv] = useState(MOCK_CONVERSATIONS[0])
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'seller',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, newMsg])
    setInputMessage('')
  }

  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#070707] pb-12 flex flex-col">
      <DemoDisclaimer />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col">
        <div className="bg-white border border-[#070707]/10 flex-1 flex flex-col md:flex-row overflow-hidden min-h-[640px]">
          {/* Left Sidebar */}
          <div className="w-full md:w-80 border-r border-[#070707]/10 bg-[#F1F1ED]/50 flex flex-col shrink-0">
            <div className="p-4 border-b border-[#070707]/10">
              <h2 className="font-serif font-bold text-[#070707] text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#EF6F79]" /> Buyer Inquiries
              </h2>
            </div>

            <div className="divide-y divide-[#070707]/10 overflow-y-auto flex-1">
              {conversations.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setActiveConv(c)}
                  className={`p-4 cursor-pointer flex items-center gap-3 ${
                    activeConv.id === c.id ? 'bg-white border-l-4 border-[#EF6F79]' : 'hover:bg-[#E4E5E0]/50'
                  }`}
                >
                  <img src={c.buyerAvatar} alt="" className="w-10 h-10 object-cover shrink-0 border border-[#070707]/10" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-[#070707] text-xs block truncate">{c.buyerName}</span>
                    <p className="text-xs text-[#EF6F79] font-medium truncate">{c.product.title}</p>
                    <p className="text-xs text-[#070707]/60 truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Chat Window */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 bg-[#F1F1ED]/80 border-b border-[#070707]/10 flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <img src={activeConv.product.image} alt="" className="w-12 h-12 object-cover border border-[#070707]/10 shrink-0" />
                <div>
                  <span className="furniture-subtitle text-[10px] text-[#070707]/60 block">INQUIRY FROM {activeConv.buyerName}</span>
                  <h3 className="font-serif font-bold text-[#070707] text-sm">{activeConv.product.title}</h3>
                  <span className="text-xs font-mono font-bold text-[#EF6F79]">{formatCredits(activeConv.product.price)}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#F3D6DC]/60 px-4 py-2.5 border-b border-[#EF6F79]/30 text-[#070707] text-xs flex items-center gap-2 shrink-0">
              <ShieldAlert className="w-4 h-4 text-[#EF6F79] shrink-0" />
              <span>
                <strong>Seller Escrow Policy:</strong> Never accept off-platform funds. Only dispatch physical goods when order status displays <strong>CONFIRMED</strong> in escrow.
              </span>
            </div>

            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#F7F7F4]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'seller' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-md p-4 text-xs leading-relaxed border ${
                      msg.sender === 'seller'
                        ? 'bg-[#070707] text-white border-[#070707]'
                        : 'bg-white text-[#070707] border-[#070707]/15'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[10px] font-mono text-[#070707]/40 mt-1 px-1 flex items-center gap-1">
                    {msg.time}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#070707]/10 flex items-center gap-3 bg-white shrink-0">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message to buyer..."
                className="flex-1 px-4 py-3 bg-[#F1F1ED] border border-[#070707]/10 focus:border-[#070707] text-xs outline-none transition-all font-sans"
              />
              <button type="submit" className="p-3 bg-[#070707] hover:bg-[#EF6F79] text-white transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
