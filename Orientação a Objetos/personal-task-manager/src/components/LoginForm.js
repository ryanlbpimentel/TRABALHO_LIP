import React, { useState } from 'react';
import { html } from '../utils/html.js';
import { LogIn, UserPlus, CheckCircle, AlertCircle } from 'lucide-react';
import { AuthService } from '../services/AuthService.js';

export const LoginForm = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Por favor, informe seu nome para o cadastro.');
      return;
    }

    if (password.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const user = await AuthService.login(username, password);
        setSuccess('Login efetuado com sucesso! Redirecionando...');
        setTimeout(() => {
          onLoginSuccess(user);
        }, 1000);
      } else {
        await AuthService.register(name, username, password);
        setSuccess('Cadastro realizado com sucesso! Faça login para continuar.');
        setIsLogin(true);
        setName('');
        setUsername('');
        setPassword('');
      }
    } catch (err) {
      setError(err.message || 'Ocorreu um erro no processamento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    setName('');
    setUsername('');
    setPassword('');
  };

  return html`
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo">
            ${isLogin 
              ? html`<${LogIn} size=${24} />` 
              : html`<${UserPlus} size=${24} />`}
          </div>
          <h1 class="auth-title">
            ${isLogin ? 'Bem-vindo de Volta' : 'Criar Nova Conta'}
          </h1>
          <p class="auth-subtitle">
            ${isLogin 
              ? 'Organize suas tarefas diárias de forma simples' 
              : 'Comece a gerenciar suas atividades pessoais hoje mesmo'}
          </p>
        </div>

        ${error && html`
          <div class="alert-message alert-error">
            <${AlertCircle} size=${18} />
            <span>${error}</span>
          </div>
        `}

        ${success && html`
          <div class="alert-message alert-success">
            <${CheckCircle} size=${18} />
            <span>${success}</span>
          </div>
        `}

        <form onSubmit=${handleSubmit}>
          ${!isLogin && html`
            <div class="form-group">
              <label class="form-label" for="name">Nome Completo</label>
              <input
                id="name"
                type="text"
                class="form-input"
                placeholder="Ex: João Silva"
                value=${name}
                onChange=${e => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          `}

          <div class="form-group">
            <label class="form-label" for="username">Usuário</label>
            <input
              id="username"
              type="text"
              class="form-input"
              placeholder="Ex: joaosilva"
              value=${username}
              onChange=${e => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Senha</label>
            <input
              id="password"
              type="password"
              class="form-input"
              placeholder="••••••••"
              value=${password}
              onChange=${e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            class="btn btn-primary"
            disabled=${isLoading}
            id="auth-submit-btn"
          >
            ${isLoading 
              ? 'Processando...' 
              : isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div class="auth-footer">
          ${isLogin ? html`
            Não tem uma conta?
            <span class="auth-link" onClick=${toggleMode}>
              Cadastre-se
            </span>
          ` : html`
            Já possui uma conta?
            <span class="auth-link" onClick=${toggleMode}>
              Faça login
            </span>
          `}
        </div>
      </div>
    </div>
  `;
};
