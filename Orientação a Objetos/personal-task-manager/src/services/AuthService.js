import { User } from '../models/User.js';
import { StorageService } from './StorageService.js';

export class AuthService {
  static SESSION_KEY = 'task_manager_active_session';

  static async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  static async register(name, username, password) {
    const passwordHash = await this.hashPassword(password);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        name: name.trim(),
        username: username.trim().toLowerCase(),
        passwordHash,
        createdAt
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao registrar usuário.');
    }

    return data;
  }

  static async login(username, password) {
    const passwordHash = await this.hashPassword(password);

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.trim().toLowerCase(),
        passwordHash,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Erro ao efetuar login.');
    }

    const user = new User(data);
    StorageService.setItem(this.SESSION_KEY, user.toJSON());
    return user;
  }

  static getActiveUser() {
    const activeData = StorageService.getItem(this.SESSION_KEY);
    if (!activeData) return null;
    return new User(activeData);
  }

  static logout() {
    StorageService.removeItem(this.SESSION_KEY);
  }
}
