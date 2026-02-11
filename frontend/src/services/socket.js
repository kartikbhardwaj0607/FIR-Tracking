import { io } from 'socket.io-client';

const SOCKET_URL = 'https://fir-tracking.onrender.com';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  joinFIRRoom(firId) {
    if (this.socket) {
      this.socket.emit('join-fir', firId);
    }
  }

  leaveFIRRoom(firId) {
    if (this.socket) {
      this.socket.emit('leave-fir', firId);
    }
  }

  onFIRUpdated(callback) {
    if (this.socket) {
      this.socket.on('fir-updated', callback);
    }
  }

  onFIRCreated(callback) {
    if (this.socket) {
      this.socket.on('fir-created', callback);
    }
  }

  onFIRListUpdated(callback) {
    if (this.socket) {
      this.socket.on('fir-list-updated', callback);
    }
  }

  removeListener(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

export default new SocketService();
