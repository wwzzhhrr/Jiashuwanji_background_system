import { useEffect, createContext, useContext, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import http from '../../http';

// 更新接口与后端枚举匹配
interface TrackEventPayload {
  sessionId: string;
  deviceId: string;
  eventType: 'EVENT' | 'PAGEVIEW' | 'SESSION'; // 限制为后端接受的值
  url?: string;
  elementId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

interface TrackingContextType {
  trackEvent: (event: Omit<TrackEventPayload, 'sessionId' | 'deviceId' | 'timestamp'>) => void;
}

const TrackingContext = createContext<TrackingContextType>({
  trackEvent: () => {},
});

// 生成设备指纹（带缓存）
let cachedFingerprint: string | null = null;
const getDeviceFingerprint = async (): Promise<string> => {
  if (cachedFingerprint) return cachedFingerprint;

  try {
    const fp = await FingerprintJS.load();
    const { visitorId } = await fp.get();
    cachedFingerprint = visitorId;
    localStorage.setItem('deviceId', visitorId);
    return visitorId;
  } catch (error) {
    console.error('设备指纹生成失败:', error);
    return 'unknown_device';
  }
};

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [deviceId, setDeviceId] = useState('');
  const [isFingerprintReady, setIsFingerprintReady] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    return sessionStorage.getItem('sessionId') || crypto.randomUUID();
  });

  const formatTimestamp = (date: Date) => date.toISOString().slice(0, -5);

  useEffect(() => {
    sessionStorage.setItem('sessionId', sessionId);
  }, [sessionId]);

  useEffect(() => {
    const initDeviceId = async () => {
      const id = localStorage.getItem('deviceId') || await getDeviceFingerprint();
      setDeviceId(id);
      setIsFingerprintReady(true);
    };
    initDeviceId();
  }, []);

  // 初始化会话跟踪
  useEffect(() => {
    const initializeTracking = async () => {
      try {
        await http.post('/api/events', {
          sessionId,
          deviceId,
          eventType: 'SESSION', // 修改为大写且符合枚举
          metadata: {
            userAgent: navigator.userAgent,
            screen: `${window.screen.width}x${window.screen.height}`,
            browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Unknown'
          },
          timestamp: formatTimestamp(new Date())
        });
      } catch (error) {
        console.error('会话跟踪初始化失败:', error);
      }
    };

    if (isFingerprintReady) {
      initializeTracking();
    }
  }, [isFingerprintReady]);

  useEffect(() => {
    if (!isFingerprintReady) return;

    const trackPageView = async () => {
      try {
        await http.post('/api/events', {
          sessionId,
          deviceId,
          eventType: 'PAGEVIEW', // 修改为大写
          url: window.location.href,
          metadata: {
            browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Unknown'
          },
          timestamp: formatTimestamp(new Date())
        });
      } catch (error) {
        console.error('页面浏览跟踪失败:', error);
      }
    };

    trackPageView();
  }, [location, isFingerprintReady]);

  const buildPayload = (
      eventType: 'EVENT' | 'PAGEVIEW' | 'SESSION',
      data: Partial<Omit<TrackEventPayload, 'sessionId' | 'deviceId' | 'timestamp' | 'eventType'>>
  ): TrackEventPayload => ({
    sessionId,
    deviceId: deviceId || 'unknown_device',
    eventType, // 直接使用大写枚举值
    url: data.url,
    elementId: data.elementId,
    metadata: {
      browser: navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Unknown',
      ...data.metadata
    },
    timestamp: formatTimestamp(new Date())
  });

  const trackEvent = async (
      event: Omit<TrackEventPayload, 'sessionId' | 'deviceId' | 'timestamp'>
  ) => {
    try {
      await http.post('/api/events', buildPayload(event.eventType, {
        url: event.url,
        elementId: event.elementId,
        metadata: event.metadata
      }));
    } catch (error) {
      console.error('自定义事件跟踪失败:', error);
    }
  };

  return (
      <TrackingContext.Provider value={{ trackEvent }}>
        {children}
      </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};