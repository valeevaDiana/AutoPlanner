import React, { useState } from 'react';
import { useTheme } from '../../../shared/lib/contexts';
import { telegramApi } from '../../../shared/api/taskApi';

interface TelegramConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramConnectionModal: React.FC<TelegramConnectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentTheme } = useTheme();
  const [generatedLink, setGeneratedLink] = useState<{ telegramLink: string } | null>(null);

  const generateLink = async () => {
    const linkData = await telegramApi.generateTelegramCode();
    setGeneratedLink(linkData);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000,
    }}>
      <div style={{
        backgroundColor: currentTheme.colors.surface,
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
      }}>
        <h2 style={{ marginBottom: '20px' }}>Привязать Telegram</h2>
        
        {!generatedLink ? (
          <div>
            <p style={{ 
              marginBottom: '20px', 
              fontSize: '16px'
            }}>
              Привяжите Telegram для уведомлений</p>
            <button onClick={generateLink} style={{
              padding: '10px 20px',
              backgroundColor: currentTheme.colors.primary,
              color: currentTheme.colors.text,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px', 
              transition: 'all 0.3s ease',
            }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Получить ссылку
            </button>
          </div>
        ) : (
          <div>
            <p style={{ 
              marginBottom: '15px',
              fontSize: '16px'
            }}>
              Нажмите на ссылку чтобы привязать Telegram:</p>
            <a 
              href={generatedLink.telegramLink} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '10px',
                backgroundColor: currentTheme.colors.background,
                borderRadius: '6px',
                color: currentTheme.colors.primary,
                textDecoration: 'none',
                fontSize: '16px',
                margin: '10px 0',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.secondary;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = currentTheme.colors.background;
              }}
            >
              🔗 Открыть Telegram
            </a>
          </div>
        )}
        
        <button onClick={onClose} style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: currentTheme.colors.background,
          border: `1px solid ${currentTheme.colors.border}`,
          color: currentTheme.colors.text,
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px', 
          transition: 'all 0.3s ease',
        }}>
          Закрыть
        </button>
      </div>
    </div>
  );
};