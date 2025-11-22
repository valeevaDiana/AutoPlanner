import React, { useState } from 'react';
import { useTheme } from '../../../shared/lib/contexts';

interface AuthModalProps {
  isOpen: boolean;
  onAuthSuccess: (userId: number) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onAuthSuccess
}) => {
  const { currentTheme } = useTheme();
  const [isLogin, setIsLogin] = useState(false); // false = регистрация, true = авторизация
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !password.trim()) {
      setError('Заполните все поля');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/user/auth' : '/api/user/registrate';
      const params = new URLSearchParams({
        nickname: nickname.trim(),
        password: password.trim()
      });

      const response = await fetch(`${endpoint}?${params}`);
      
      if (response.ok) {
        const userId = await response.json();
        onAuthSuccess(userId);
      } else {
        const errorText = await response.text();
        setError(isLogin ? 'Ошибка авторизации: ' + errorText : 'Ошибка регистрации: ' + errorText);
      }
    } catch (err) {
      setError('Ошибка сети: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNickname('');
    setPassword('');
    setError('');
  };

  const switchToLogin = () => {
    setIsLogin(true);
    resetForm();
  };

  const switchToRegister = () => {
    setIsLogin(false);
    resetForm();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
      }}
    >
      <div
        style={{
          backgroundColor: currentTheme.colors.surface,
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          width: '90%',
          maxWidth: '400px',
          border: `1px solid ${currentTheme.colors.border}`,
        }}
      >
        <h2 style={{
          marginBottom: '25px',
          textAlign: 'center',
          color: currentTheme.colors.text,
          fontSize: '24px',
          fontWeight: '600'
        }}>
          {isLogin ? 'Вход в аккаунт' : 'Регистрация'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: currentTheme.colors.text
            }}>
              Имя пользователя:
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${currentTheme.colors.border}`,
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.text,
                cursor: isLoading ? 'not-allowed' : 'text'
              }}
              placeholder="Введите имя пользователя"
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: currentTheme.colors.text
            }}>
              Пароль:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${currentTheme.colors.border}`,
                borderRadius: '6px',
                fontSize: '16px',
                backgroundColor: currentTheme.colors.background,
                color: currentTheme.colors.text,
                cursor: isLoading ? 'not-allowed' : 'text'
              }}
              placeholder="Введите пароль"
            />
          </div>

          {error && (
            <div style={{
              padding: '10px',
              backgroundColor: currentTheme.colors.error + '20',
              color: currentTheme.colors.error,
              borderRadius: '4px',
              marginBottom: '15px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: isLoading ? currentTheme.colors.textSecondary : currentTheme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '15px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={isLogin ? switchToRegister : switchToLogin}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: currentTheme.colors.primary,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              textDecoration: 'underline',
            }}
          >
            {isLogin ? 'Еще нет аккаунта?' : 'Уже есть аккаунт?'}
          </button>
        </div>
      </div>
    </div>
  );
};