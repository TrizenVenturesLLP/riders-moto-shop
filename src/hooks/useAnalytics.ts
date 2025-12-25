import { useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/config/api';

/**
 * Analytics Hook with Event Batching
 * 
 * Efficiently batches events to reduce API calls and improve performance.
 * Events are sent in batches of 10 or every 5 seconds, whichever comes first.
 */

interface AnalyticsEvent {
  eventType: string;
  productId?: string;
  categoryId?: string;
  bikeModelSlug?: string;
  metadata?: Record<string, any>;
  userId?: string | null;
  sessionId?: string | null;
  timestamp?: string;
}

// Event queue class for batching
class EventQueue {
  private queue: AnalyticsEvent[] = [];
  private flushInterval: number = 5000; // 5 seconds
  private maxQueueSize: number = 10;
  private intervalId: NodeJS.Timeout | null = null;
  private isFlushing: boolean = false;

  constructor() {
    // Start periodic flush
    this.startPeriodicFlush();
    
    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush());
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flush();
        }
      });
    }
  }

  add(event: AnalyticsEvent) {
    this.queue.push({
      ...event,
      timestamp: new Date().toISOString(),
    });

    // Flush if queue is full
    if (this.queue.length >= this.maxQueueSize) {
      this.flush();
    }
  }

  async flush() {
    if (this.isFlushing || this.queue.length === 0) return;
    
    this.isFlushing = true;
    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
      const sessionId = this.getSessionId();
      
      await fetch(`${API_BASE_URL}/analytics/track-batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
        },
        body: JSON.stringify({ 
          events: eventsToSend,
          sessionId,
        }),
        // Don't block page unload
        keepalive: true,
      });
    } catch (error) {
      console.error('Analytics batch error:', error);
      // Optionally: Re-queue events on failure (for critical events)
      // For now, we'll just log and continue (fail silently)
    } finally {
      this.isFlushing = false;
    }
  }

  private startPeriodicFlush() {
    this.intervalId = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private getSessionId(): string {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.flush();
  }
}

// Singleton instance
const eventQueue = new EventQueue();

/**
 * Track analytics event (standalone function - can be used anywhere)
 * 
 * @param eventType - Type of event to track
 * @param data - Optional event data
 */
export const trackEvent = (
  eventType: string,
  data?: {
    productId?: string;
    categoryId?: string;
    bikeModelSlug?: string;
    metadata?: Record<string, any>;
  }
) => {
  try {
    // Get user ID from localStorage if available
    const userData = localStorage.getItem('user_data');
    let userId: string | null = null;
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        userId = user.id || null;
      } catch (e) {
        // Ignore parse errors
      }
    }

    // Get session ID
    const sessionId = localStorage.getItem('sessionId') || null;

    eventQueue.add({
      eventType,
      userId,
      sessionId,
      ...data,
    });
  } catch (error) {
    // Fail silently - don't break user experience
    console.error('Analytics tracking error:', error);
  }
};

/**
 * useAnalytics Hook
 * 
 * Provides analytics tracking functionality with automatic batching.
 * 
 * @example
 * const { trackEvent } = useAnalytics();
 * trackEvent('product_view', { productId: '123', categoryId: '456' });
 */
export const useAnalytics = () => {
  const trackEvent = (
    eventType: string,
    data?: {
      productId?: string;
      categoryId?: string;
      bikeModelSlug?: string;
      metadata?: Record<string, any>;
    }
  ) => {
    try {
      // Get user ID from localStorage if available
      const userData = localStorage.getItem('user_data');
      let userId: string | null = null;
      
      if (userData) {
        try {
          const user = JSON.parse(userData);
          userId = user.id || null;
        } catch (e) {
          // Ignore parse errors
        }
      }

      // Get session ID
      const sessionId = localStorage.getItem('sessionId') || null;

      eventQueue.add({
        eventType,
        userId,
        sessionId,
        ...data,
      });
    } catch (error) {
      // Fail silently - don't break user experience
      console.error('Analytics tracking error:', error);
    }
  };

  // Cleanup on unmount (for React strict mode)
  useEffect(() => {
    return () => {
      // Don't destroy queue on component unmount (it's a singleton)
      // Only flush remaining events
      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
          eventQueue.destroy();
        });
      }
    };
  }, []);

  return { trackEvent };
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    eventQueue.destroy();
  });
}

