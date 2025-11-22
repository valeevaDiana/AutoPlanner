import React from 'react';
import { useTheme } from '../../../shared/lib/contexts';
import { useEscapeKey } from '../../../shared/lib/hooks/useEscapeKey';
import type { PenaltyTask } from '../../../shared/api/types'; 

// interface PenaltyTask {
//   userId: number;
//   myTaskId: number;
//   name: string;
//   description: string;
//   priority: number;
//   startDateTime: string;
//   endDateTime: string;
//   duration: string;
//   countFrom: number;
//   isComplete: boolean;
//   completeDateTime: string | null;
//   startDateTimeRange: string | null;
//   endDateTimeRange: string | null;
//   ruleOneTask: boolean;
//   startDateTimeRuleOneTask: string | null;
//   endDateTimeRuleOneTask: string | null;
//   ruleTwoTask: boolean;
//   timePositionRegardingTaskId: number;
//   secondTaskId: number;
//   relationRangeId: number;
//   dateTimeRange: string | null;
// }

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

  const getPenaltyTaskDisplayData = (task: PenaltyTask) => {
    if (task.startDateTimeRange && task.endDateTimeRange) {
      return {
        start: task.startDateTimeRange,
        end: task.endDateTimeRange,
        duration: task.duration
      };
    }
    
    if (task.startDateTime && task.endDateTime) {
      return {
        start: task.startDateTime,
        end: task.endDateTime,
        duration: task.duration
      };
    }
    
    return {
      start: null,
      end: null,
      duration: task.duration
    };
  };

  const getDisplayText = (task: PenaltyTask) => {
    const data = getPenaltyTaskDisplayData(task);
    
    if (data.start && data.end) {
      return `Начало: ${formatDate(data.start)} ${formatTime(data.start)}\nКонец: ${formatDate(data.end)} ${formatTime(data.end)}\nДлительность: ${data.duration}`;
    } else {
      return `Длительность: ${data.duration}\n(Время не определено)`;
    }
  };

  const getTaskSpecificInfo = (task: PenaltyTask) => {    
    // 1. Для зависимых задач (RuleTwoTask = true) 
    if (task.ruleTwoTask) {
      const getPositionText = (position: number) => {
        return position === 0 ? 'ДО' : 'ПОСЛЕ';
      };

      const getOperatorText = (operator: number) => {
        switch (operator) {
          case 0: return 'больше чем';
          case 1: return 'ровно';
          case 2: return 'меньше чем';
          default: return '';
        }
      };

      return (
        <div style={{
          padding: '8px',
          backgroundColor: currentTheme.colors.background,
          borderRadius: '4px',
          marginBottom: '8px',
          borderLeft: `3px solid ${currentTheme.colors.secondary}`
        }}>
          <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary, marginBottom: '4px' }}>
            🔗 Зависимая задача
          </div>
          <div style={{ fontSize: '12px' }}>
            <strong>Позиция:</strong> {getPositionText(task.timePositionRegardingTaskId)} задачи #{task.secondTaskId}
          </div>
          {task.dateTimeRange && (
            <div style={{ fontSize: '12px' }}>
              <strong>Временной интервал:</strong> {getOperatorText(task.relationRangeId)} {task.dateTimeRange}
            </div>
          )}
          {task.startDateTimeRange && task.endDateTimeRange && (
            <div style={{ fontSize: '12px' }}>
              <strong>Доступный диапазон:</strong> {formatDate(task.startDateTimeRange)} {formatTime(task.startDateTimeRange)} - {formatDate(task.endDateTimeRange)} {formatTime(task.endDateTimeRange)}
            </div>
          )}
        </div>
      );
    }

    // 2. Для задач с возможным временем (RuleOneTask = true)
    if (task.ruleOneTask) {
      return (
        <div style={{
          padding: '8px',
          backgroundColor: currentTheme.colors.background,
          borderRadius: '4px',
          marginBottom: '8px',
          borderLeft: `3px solid ${currentTheme.colors.edit}`
        }}>
          <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary, marginBottom: '4px' }}>
            🕘 Задача с возможным временем
          </div>
          {task.startDateTimeRuleOneTask && (
            <div style={{ fontSize: '12px' }}>
              <strong>Возможно начать с:</strong> {formatDate(task.startDateTimeRuleOneTask)} {formatTime(task.startDateTimeRuleOneTask)}
            </div>
          )}
          {task.endDateTimeRuleOneTask && (
            <div style={{ fontSize: '12px' }}>
              <strong>Возможно закончить до:</strong> {formatDate(task.endDateTimeRuleOneTask)} {formatTime(task.endDateTimeRuleOneTask)}
            </div>
          )}
          {task.startDateTimeRange && task.endDateTimeRange && (
            <div style={{ fontSize: '12px' }}>
              <strong>Диапазон поиска времени:</strong> {formatDate(task.startDateTimeRange)} {formatTime(task.startDateTimeRange)} - {formatDate(task.endDateTimeRange)} {formatTime(task.endDateTimeRange)}
            </div>
          )}
        </div>
      );
    }

    // 3. Для повторяющихся задач (isRepit = true)
    if (task.countFrom > 0) {
      return (
        <div style={{
          padding: '8px',
          backgroundColor: currentTheme.colors.background,
          borderRadius: '4px',
          marginBottom: '8px',
          borderLeft: `3px solid ${currentTheme.colors.primary}`
        }}>
          <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary, marginBottom: '4px' }}>
            ♾️ Повторяющаяся задача
          </div>
          <div style={{ fontSize: '12px' }}>
            <strong>Повтор:</strong> {task.countFrom}
          </div>
          {task.startDateTimeRepit && (
            <div style={{ fontSize: '12px' }}>
              <strong>Начало периода:</strong> {formatDate(task.startDateTimeRepit)} {formatTime(task.startDateTimeRepit)}
            </div>
          )}
          {task.endDateTimeRepit && (
            <div style={{ fontSize: '12px' }}>
              <strong>Конец периода:</strong> {formatDate(task.endDateTimeRepit)} {formatTime(task.endDateTimeRepit)}
            </div>
          )}
        </div>
      );
    }

    // 4. Для обычных задач с конкретным временем
    if (task.startDateTime && task.endDateTime) {
      return (
        <div style={{
          padding: '8px',
          backgroundColor: currentTheme.colors.background,
          borderRadius: '4px',
          marginBottom: '8px',
          borderLeft: `3px solid ${currentTheme.colors.success}`
        }}>
          <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary, marginBottom: '4px' }}>
            🗓 Задача с конкретным временем
          </div>
        </div>
      );
    }

    return null;
  };

  const getPenaltyReason = (task: PenaltyTask): string => {
    if (task.ruleTwoTask) {
      return "Не удалось выполнить условие зависимости от другой задачи";
    }
    if (task.ruleOneTask) {
      return "Не найдено подходящего времени в указанном диапазоне";
    }
    if (task.countFrom > 0) {
      return "Не удалось распределить повторяющуюся задачу из-за конфликта времени";
    }
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
                key={`${task.myTaskId}_${task.countFrom}_${index}`}
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

                {/* Добавляем специфичную информацию для типа задачи */}
                {getTaskSpecificInfo(task)}

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px',
                  marginBottom: '10px',
                  fontSize: '14px'
                }}>
                  {/* Показываем стандартные поля только если они есть и задача не особого типа */}
                  {!task.ruleTwoTask && !task.ruleOneTask && !task.isRepit && (
                    <>
                      <div>
                        <span style={{ color: currentTheme.colors.textSecondary }}>Начало: </span>
                        {task.startDateTime 
                          ? `${formatDate(task.startDateTime)} ${formatTime(task.startDateTime)}`
                          : 'Не определено'
                        }
                      </div>
                      <div>
                        <span style={{ color: currentTheme.colors.textSecondary }}>Конец: </span>
                        {task.endDateTime 
                          ? `${formatDate(task.endDateTime)} ${formatTime(task.endDateTime)}`
                          : 'Не определено'
                        }
                      </div>
                    </>
                  )}
                  
                  <div>
                    <span style={{ color: currentTheme.colors.textSecondary }}>Длительность: </span>
                    {task.duration}
                  </div>

                  {/* Для повторяющихся задач показываем номер повторения */}
                  {task.isRepit && task.countFrom && (
                    <div>
                      <span style={{ color: currentTheme.colors.textSecondary }}>Повторение: </span>
                      #{task.countFrom}
                    </div>
                  )}
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