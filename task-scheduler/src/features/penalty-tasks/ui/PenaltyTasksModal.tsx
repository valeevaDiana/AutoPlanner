import React from 'react';
import { useTheme } from '../../../shared/lib/contexts';
import { useEscapeKey } from '../../../shared/lib/hooks/useEscapeKey';

interface PenaltyTask {
  userId: number;
  myTaskId: number;
  name: string;
  description: string;
  priority: number;
  startDateTime: string;
  endDateTime: string;
  duration: string;
  countFrom: number;
  isComplete: boolean;
  completeDateTime: string | null;
  startDateTimeRange: string | null;
  endDateTimeRange: string | null;
  ruleOneTask: boolean;
  startDateTimeRuleOneTask: string | null;
  endDateTimeRuleOneTask: string | null;
  ruleTwoTask: boolean;
  timePositionRegardingTaskId: number;
  secondTaskId: number;
  relationRangeId: number;
  dateTimeRange: string | null;
}

interface PenaltyTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  penaltyTasks: PenaltyTask[];
}

export const PenaltyTasksModal: React.FC<PenaltyTasksModalProps> = ({
  isOpen,
  onClose,
  penaltyTasks
}) => {
  const { currentTheme } = useTheme();
  
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC'  
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'  
      });
    } catch {
      return dateString;
    }
  };

  const getPenaltyReason = (task: PenaltyTask): string => {
    return "Не удалось распределить задачу в расписании из-за конфликта времени или ресурсов";
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
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: currentTheme.colors.surface,
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          width: '90%',
          maxWidth: '700px',
          maxHeight: '80vh',
          overflow: 'auto',
          border: `1px solid ${currentTheme.colors.border}`,
        }}
      >
        <h2 style={{
          marginBottom: '20px',
          textAlign: 'center',
          color: currentTheme.colors.text,
          fontSize: '24px',
          fontWeight: '600'
        }}>
          Не распределенные задачи
        </h2>

        {penaltyTasks.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: currentTheme.colors.textSecondary,
            fontSize: '16px'
          }}>
            Все задачи успешно распределены!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {penaltyTasks.map((task, index) => (
              <div
                key={task.myTaskId || index}
                style={{
                  padding: '15px',
                  backgroundColor: currentTheme.colors.background,
                  borderRadius: '8px',
                  border: `1px solid ${currentTheme.colors.border}`,
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '10px'
                }}>
                  <h3 style={{
                    color: currentTheme.colors.text,
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    {task.name}
                  </h3>
                  <span style={{
                    backgroundColor: currentTheme.colors.error,
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Приоритет: {task.priority}
                  </span>
                </div>

                {task.description && (
                  <p style={{
                    color: currentTheme.colors.textSecondary,
                    fontSize: '14px',
                    marginBottom: '10px'
                  }}>
                    {task.description}
                  </p>
                )}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '10px',
                  fontSize: '14px'
                }}>
                  <div>
                    <span style={{ color: currentTheme.colors.textSecondary }}>Начало: </span>
                    {formatDate(task.startDateTime)} {formatTime(task.startDateTime)}
                  </div>
                  <div>
                    <span style={{ color: currentTheme.colors.textSecondary }}>Конец: </span>
                    {formatDate(task.endDateTime)} {formatTime(task.endDateTime)}
                  </div>
                  <div>
                    <span style={{ color: currentTheme.colors.textSecondary }}>Длительность: </span>
                    {task.duration}
                  </div>
                </div>

                <div style={{
                  padding: '10px',
                  backgroundColor: currentTheme.colors.error + '20',
                  borderRadius: '4px',
                  borderLeft: `3px solid ${currentTheme.colors.error}`
                }}>
                  <span style={{
                    color: currentTheme.colors.error,
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Причина: {getPenaltyReason(task)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              backgroundColor: currentTheme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
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