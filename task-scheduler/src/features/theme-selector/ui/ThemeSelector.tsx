import React, { useState, useRef, useEffect } from 'react';
import { useTheme, predefinedThemes } from '../../../shared/lib/contexts';
import { ThemeCustomizer } from './ThemeCustomizer';

export const ThemeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, customThemes, setTheme, setIsCustomizerOpen } = useTheme();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const allThemes = [...predefinedThemes, ...customThemes];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleThemeChange = (themeName: string) => {
    setTheme(themeName);
    setIsOpen(false);
  };

  const handleCustomize = () => {
    setIsCustomizerOpen(true);
    setIsOpen(false);
  };

  const getContrastColor = (backgroundColor: string) => {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px 16px',
          backgroundColor: currentTheme.colors.primary,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        🎨
        <span style={{ fontSize: '12px' }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '5px',
            backgroundColor: currentTheme.colors.surface,
            border: `1px solid ${currentTheme.colors.border}`,
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1002,
            minWidth: '200px'
          }}
        >
          <div style={{ padding: '8px 12px', fontSize: '12px', color: currentTheme.colors.textSecondary }}>
            Выберите тему:
          </div>
          
          {allThemes.map((theme) => {
            const backgroundColor = theme.colors.calendarHeader;
            
            const textColor = getContrastColor(backgroundColor);
            const isSelected = theme.name === currentTheme.name;

            return (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                style={{
                  width: '100%',
                  padding: '12px 12px',
                  backgroundColor: backgroundColor,
                  color: textColor,
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  borderBottom: `1px solid ${currentTheme.colors.border}`,
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.secondary;
                  e.currentTarget.style.color = getContrastColor(theme.colors.secondary);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = backgroundColor;
                  e.currentTarget.style.color = textColor;
                }}
              >
                {/* Индикатор выбранной темы */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '4px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '16px',
                      backgroundColor: currentTheme.colors.primary,
                      borderRadius: '2px'
                    }}
                  />
                )}
                
                {/* Цветной кружок */}
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: theme.colors.primary,
                    border: `2px solid ${theme.colors.border}`,
                    marginLeft: isSelected ? '8px' : '12px'
                  }}
                />
                
                {/* Название темы */}
                <span style={{ 
                  flex: 1,
                  fontWeight: isSelected ? '600' : '400'
                }}>
                  {theme.name}
                </span>
                
                {/* Индикатор пользовательской темы */}
                {customThemes.includes(theme) && (
                  <span style={{ 
                    fontSize: '12px', 
                    opacity: 0.7 
                  }}>
                    ✎
                  </span>
                )}
              </button>
            );
          })}
          
          <div style={{ borderTop: `1px solid ${currentTheme.colors.border}`, margin: '5px 0' }} />
          
          <button
            onClick={handleCustomize}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'transparent',
              color: currentTheme.colors.text,
              border: 'none',
              textAlign: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = currentTheme.colors.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            🎨 Настроить цвета...
          </button>
        </div>
      )}

      <ThemeCustomizer />
    </div>
  );
};