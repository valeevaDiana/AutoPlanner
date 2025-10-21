import React from 'react';
import { useTheme } from '../../../shared/lib/contexts';

interface TaskFormActionsProps {
  mode: 'create' | 'edit' | 'view';
  isViewMode: boolean;
  onSave: () => void;
  onClose: () => void;
  onEdit?: () => void;
}

export const TaskFormActions: React.FC<TaskFormActionsProps> = ({
  mode,
  isViewMode,
  onSave,
  onClose,
  onEdit,
}) => {
  const { currentTheme } = useTheme();

  if (!isViewMode) {
    return (
      <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
        <button
          onClick={onSave}
          style={{
            flex: 1,
            padding: '14px',
            backgroundColor: currentTheme.colors.success,
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
          {mode === 'create' ? 'Создать задачу' : 'Сохранить изменения'}
        </button>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: '14px',
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
          Отмена
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
      <button
        onClick={onEdit}
        style={{
          flex: 1,
          padding: '14px',
          backgroundColor: currentTheme.colors.edit,
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
        Редактировать
      </button>
      <button
        onClick={onClose}
        style={{
          flex: 1,
          padding: '14px',
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
  );
};