import React, { useState } from 'react';
import { useTheme } from '../../../shared/lib/contexts';
import type { ThemeColors } from '../../../shared/lib/contexts';
import { useEscapeKey } from '../../../shared/lib/hooks/useEscapeKey';

export const ThemeCustomizer: React.FC = () => {
  const {
    currentTheme,
    updateCurrentTheme,
    addCustomTheme,
    isCustomizerOpen,
    setIsCustomizerOpen
  } = useTheme();

  const [customThemeName, setCustomThemeName] = useState('Моя тема');
  const [tempColors, setTempColors] = useState<ThemeColors>({ ...currentTheme.colors });

  useEscapeKey(() => setIsCustomizerOpen(false), isCustomizerOpen);

  const handleColorChange = (colorKey: keyof ThemeColors, value: string) => {
    const newColors = { ...tempColors, [colorKey]: value };
    setTempColors(newColors);
    updateCurrentTheme({ [colorKey]: value });
  };

  const handleSaveAsNew = () => {
    const newTheme = {
      name: customThemeName,
      colors: { ...tempColors }
    };
    addCustomTheme(newTheme);
    setIsCustomizerOpen(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsCustomizerOpen(false);
    }
  };

  if (!isCustomizerOpen) return null;

  const colorFields: { key: keyof ThemeColors; label: string }[] = [
    { key: 'primary', label: 'Основной цвет кнопок' },
    { key: 'secondary', label: 'Цвет столбца со временем "00:00, 01:00 и т.д."' },
    { key: 'background', label: 'Основной фон' },
    { key: 'surface', label: 'Фон модальных окон' },
    { key: 'text', label: 'Основной текст' },
    { key: 'textSecondary', label: 'Не основной текст' },
    { key: 'border', label: 'Все границы' },
    { key: 'success', label: 'Кнопки "Выполнить задачу" и "Сохранить изменения"' },
    { key: 'error', label: 'Кнопка "Отменить выполнение" и "Удалить задачу"' },
    { key: 'edit', label: 'Кнопка редактирования задачи' },
    { key: 'priorityHigh', label: 'Цвет высокого приоритета (1)' },
    { key: 'priorityLow', label: 'Цвет низкого приоритета (10)' },
    { key: 'calendarHeader', label: 'Цвет шапки календаря' },
    { key: 'calendarNavigation', label: 'Цвет фона навигации недель' },
  ];

  return (
    <div 
      className="modal-overlay" 
      onClick={handleBackgroundClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div 
        style={{
          backgroundColor: currentTheme.colors.surface,
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '80vh',
          overflow: 'auto',
          border: `1px solid ${currentTheme.colors.border}`
        }}
      >
        <h2 style={{ 
          marginBottom: '20px', 
          textAlign: 'center',
          color: currentTheme.colors.text,
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Настройка темы
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '500',
            color: currentTheme.colors.text
          }}>
            Название темы:
          </label>
          <input
            type="text"
            value={customThemeName}
            onChange={(e) => setCustomThemeName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: `1px solid ${currentTheme.colors.border}`,
              borderRadius: '6px',
              fontSize: '16px',
              backgroundColor: currentTheme.colors.background,
              color: currentTheme.colors.text
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {colorFields.map(({ key, label }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '5px',
                  fontSize: '14px',
                  color: currentTheme.colors.text
                }}>
                  {label}:
                </label>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  padding: '8px',
                  backgroundColor: currentTheme.colors.background,
                  borderRadius: '6px',
                  border: `1px solid ${currentTheme.colors.border}`
                }}>
                  <input
                    type="color"
                    value={tempColors[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ 
                    fontSize: '14px', 
                    color: currentTheme.colors.textSecondary,
                    fontFamily: 'monospace'
                  }}>
                    {tempColors[key]}
                  </span>
                </div>
              </div>
              <div
                style={{
                  width: '60px',
                  height: '40px',
                  backgroundColor: tempColors[key],
                  border: `1px solid ${currentTheme.colors.border}`,
                  borderRadius: '6px'
                }}
              />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
          <button
            onClick={handleSaveAsNew}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: currentTheme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}

          >
            Сохранить как новую тему
          </button>
          <button
            onClick={() => setIsCustomizerOpen(false)}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: currentTheme.colors.background,
              color: currentTheme.colors.text,
              border: `1px solid ${currentTheme.colors.border}`,
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              transform: 'scale(1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};