import React from 'react';
import type { Task, TaskAction } from '../../../entities/task/model/types';
import { useEscapeKey } from '../../../shared/lib/hooks/useEscapeKey';


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
            backgroundColor: '#ff6b6b',
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
            backgroundColor: '#84c65e',
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
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          minWidth: '250px',
          position: 'absolute',
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>
          Выберите действие
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {getActionButton()}
          
          <button
            className="action-button edit-button"
            onClick={() => handleAction('edit')}
            style={{
              padding: '10px 15px',
              backgroundColor: '#c68b5e',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Открыть задачу
          </button>

          {/* Новая кнопка для прямого редактирования */}
          <button
            className="action-button direct-edit-button"
            onClick={handleEditClick}
            style={{
              padding: '10px 15px',
              backgroundColor: '#21b8f3ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Редактировать задачу
          </button>
        </div>
      </div>
    </div>
  );
};