import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../store/authSlice';
import { useUIStore } from '../store/uiSlice';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { user, isAuthenticated } = useAuthStore();
  const { addNotification } = useUIStore();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      socketRef.current.emit('join', user.id);
    });

    socketRef.current.on('notification', (notification) => {
      console.log('Notification received:', notification);
      addNotification(notification);
      
      // Show toast notification
      toast.success(notification.title, {
        duration: 5000,
      });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isAuthenticated, user, addNotification]);

  return socketRef.current;
};
