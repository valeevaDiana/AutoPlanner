import React from 'react';
import type { Task } from '../../../entities/task/model/types';
import { useEscapeKey } from '../../../shared/lib/hooks/useEscapeKey';
import { useTheme } from '../../../shared/lib/contexts';

interface ConfirmDeleteModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (task: Task) => void;
  position: { top: number; left: number };
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirm,
  position
}) => {
  const { currentTheme } = useTheme();
  
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm(task);
    onClose();
  };

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
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: currentTheme.colors.surface,
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          minWidth: '300px',
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translate(-50%, -50%)',
          border: `1px solid ${currentTheme.colors.border}`,
        }}
      >
        <h3 style={{
          marginBottom: '15px',
          textAlign: 'center',
          color: currentTheme.colors.text
        }}>
          Удалить задачу?
        </h3>   
       
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {/* Кнопка Нет */}
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: currentTheme.colors.error,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              flex: 1
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Нет
          </button>

          {/* Кнопка Да */}
          <button
            onClick={handleConfirm}
            style={{
              padding: '10px 20px',
              backgroundColor: currentTheme.colors.success,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              flex: 1
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Да
          </button>
        </div>
      </div>
    </div>
  );
};