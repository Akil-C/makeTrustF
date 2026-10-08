import { useEffect, useRef, useCallback, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const WS_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/ws`
  : 'http://localhost:8080/ws'

const RECONNECT_DELAY = 5000

/**
 * Custom hook for STOMP-over-SockJS WebSocket connection.
 *
 * @param {string|null} userId  Current user ID; pass null/undefined to skip connection.
 * @returns {{
 *   connected: boolean,
 *   sendMessage: (destination: string, body: object) => void,
 *   subscribe: (destination: string, callback: Function) => string,
 *   unsubscribe: (subId: string) => void,
 * }}
 */
export function useWebSocket(userId) {
  const [connected, setConnected]   = useState(false)
  const clientRef                   = useRef(null)
  const subscriptionsRef            = useRef({})   // subId → STOMP subscription object
  const pendingSubsRef              = useRef([])   // queued before connection
  const subCounterRef               = useRef(0)

  useEffect(() => {
    if (!userId) return

    const token = localStorage.getItem('accessToken')

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
        login: userId.toString(),
      },
      reconnectDelay: RECONNECT_DELAY,
      onConnect: () => {
        setConnected(true)

        // Flush queued subscriptions
        pendingSubsRef.current.forEach(({ destination, callback, id }) => {
          const sub = client.subscribe(destination, (frame) => {
            try { callback(JSON.parse(frame.body)) } catch { callback(frame.body) }
          })
          subscriptionsRef.current[id] = sub
        })
        pendingSubsRef.current = []

        // Default subscriptions for the current user
        client.subscribe(
          `/user/${userId}/queue/notifications`,
          (frame) => {
            try {
              const notification = JSON.parse(frame.body)
              window.dispatchEvent(
                new CustomEvent('ws:notification', { detail: notification }),
              )
            } catch { /* ignore malformed */ }
          },
        )
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => {
        console.error('[WS] STOMP error:', frame.headers?.message)
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
      clientRef.current = null
      subscriptionsRef.current = {}
      pendingSubsRef.current = []
      setConnected(false)
    }
  }, [userId])

  /**
   * Send a message to a STOMP destination.
   */
  const sendMessage = useCallback((destination, body) => {
    const client = clientRef.current
    if (!client?.connected) {
      console.warn('[WS] Not connected – message dropped:', destination)
      return
    }
    client.publish({
      destination,
      body: JSON.stringify(body),
    })
  }, [])

  /**
   * Subscribe to a destination.
   * @returns {string} subscription ID (use to unsubscribe)
   */
  const subscribe = useCallback((destination, callback) => {
    const id = `sub-${++subCounterRef.current}`
    const client = clientRef.current

    if (client?.connected) {
      const sub = client.subscribe(destination, (frame) => {
        try { callback(JSON.parse(frame.body)) } catch { callback(frame.body) }
      })
      subscriptionsRef.current[id] = sub
    } else {
      // Queue for when connection is established
      pendingSubsRef.current.push({ destination, callback, id })
    }
    return id
  }, [])

  /**
   * Unsubscribe by the ID returned from subscribe().
   */
  const unsubscribe = useCallback((subId) => {
    const sub = subscriptionsRef.current[subId]
    if (sub) {
      sub.unsubscribe()
      delete subscriptionsRef.current[subId]
    }
    pendingSubsRef.current = pendingSubsRef.current.filter(
      (s) => s.id !== subId,
    )
  }, [])

  return { connected, sendMessage, subscribe, unsubscribe }
}

export default useWebSocket
