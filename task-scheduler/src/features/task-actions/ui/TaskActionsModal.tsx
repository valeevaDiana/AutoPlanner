import React, { useEffect, useState } from 'react';
import type { Task, TaskAction } from '../../../entities/task/model/types';

interface TaskActionsModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: TaskAction) => void;
  position: { top: number; left: number };
}

export const TaskActionsModal: React.FC<TaskActionsModalProps> = ({
  task,
  isOpen,
  onClose,
  onAction,
  position
}) => {
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  useEffect(() => {
    if (isOpen) {
      adjustPosition(position);
    }
  }, [isOpen, position]);

  const adjustPosition = (originalPosition: { top: number; left: number }) => {
    const modalWidth = 250; 
    const modalHeight = 150; 
    const margin = 20;

    let { top, left } = originalPosition;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if (left + modalWidth / 2 > windowWidth - margin) {
      left = windowWidth - modalWidth / 2 - margin;
    }

    if (left - modalWidth / 2 < margin) {
      left = modalWidth / 2 + margin;
    }

    if (top + modalHeight / 2 > windowHeight - margin) {
      top = windowHeight - modalHeight / 2 - margin;
    }

    if (top - modalHeight / 2 < margin) {
      top = modalHeight / 2 + margin;
    }

    setAdjustedPosition({ top, left });
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAction = (action: TaskAction) => {
    onAction(action);
    onClose();
  };

  const getActionButton = () => {
    if (task.completed) {
      return (
        <button
          className="action-button uncomplete-button"
          onClick={() => handleAction('complete')}
          style={{
            padding: '10px 15px',
            backgroundColor: '#e55c5c',
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

  if (!isOpen) return null;

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
          top: `${adjustedPosition.top}px`,
          left: `${adjustedPosition.left}px`,
          transform: 'translate(-50%, -50%)',
          maxWidth: 'calc(100vw - 40px)', 
          maxHeight: 'calc(100vh - 40px)', 
          overflow: 'auto', 
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
        </div>
      </div>
    </div>
  );
};