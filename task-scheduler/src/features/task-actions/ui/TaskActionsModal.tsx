import React from 'react';
import type { Task, TaskAction } from '../../../entities/task/model/types';
import { useEscapeKey } from '../../../shared/lib/hooks/useEscapeKey';
import { useTheme } from '../../../shared/lib/contexts';

interface TaskActionsModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: TaskAction) => void;
  onEdit?: (task: Task) => void; 
  position: { top: number; left: number };
}

export const TaskActionsModal: React.FC<TaskActionsModalProps> = ({
  task,
  isOpen,
  onClose,
  onAction,
  onEdit,
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

  const handleAction = (action: TaskAction) => {
    onAction(action);
    onClose();
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(task);
      onClose();
    }
  };

  const getActionButton = () => {
    if (task.completed) {
      return (
        <button
          className="action-button uncomplete-button"
          onClick={() => handleAction('complete')}
          style={{
            padding: '10px 15px',
            backgroundColor: currentTheme.colors.error,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Отменить выполнение
        </button>
      );
    } else {
      return (
        <button
          className="action-button complete-button"
          onClick={() => handleAction('complete')}
          style={{
            padding: '10px 15px',
            backgroundColor: currentTheme.colors.success,
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Выполнить задачу
        </button>
      );
    }
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
          minWidth: '250px',
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
          Выберите действие
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {getActionButton()}
          
          <button
            className="action-button edit-button"
            onClick={() => handleAction('edit')}
            style={{
              padding: '10px 15px',
              backgroundColor: currentTheme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Открыть задачу
          </button>

          <button
            className="action-button direct-edit-button"
            onClick={handleEditClick}
            style={{
              padding: '10px 15px',
              backgroundColor: currentTheme.colors.edit, 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
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
            Редактировать задачу
          </button>
        </div>
      </div>
    </div>
  );
};