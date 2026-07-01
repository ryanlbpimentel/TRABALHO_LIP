import React, { useState, useEffect } from 'react';
import { html } from './utils/html.js';
import { AuthService } from './services/AuthService.js';
import { LoginForm } from './components/LoginForm.js';
import { Dashboard } from './components/Dashboard.js';

export const App = () => {
  const [activeUser, setActiveUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    try {
      const user = AuthService.getActiveUser();
      if (user) {
        setActiveUser(user);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão ativa:', error);
    } finally {
      setIsCheckingSession(false);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setActiveUser(user);
  };

  const handleLogout = () => {
    AuthService.logout();
    setActiveUser(null);
  };

  if (isCheckingSession) {
    return html`
      <div 
        style=${{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-sans)',
        }}
      >
        <span>Carregando sessão...</span>
      </div>
    `;
  }

  return html`
    ${activeUser 
      ? html`<${Dashboard} user=${activeUser} onLogout=${handleLogout} />` 
      : html`<${LoginForm} onLoginSuccess=${handleLoginSuccess} />`}
  `;
};

export default App;
