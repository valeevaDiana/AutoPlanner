import React, { useState, useEffect } from 'react';
import type { Task } from '../../../entities/task/model/types';
import { useEscapeKey } from '../../../shared/lib/hooks/useEscapeKey';
import { useTheme } from '../../../shared/lib/contexts';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  onEdit?: () => void; 
  task?: Task | null;
  mode?: 'create' | 'edit' | 'view';
  initialDate?: { 
    day: number; 
    time: string;
    date: string; 
  };
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onEdit, 
  task,
  mode = 'create',
  initialDate
}) => {
  const { currentTheme } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [durationDays, setDurationDays] = useState('0');
  const [durationHours, setDurationHours] = useState('1');
  const [durationMinutes, setDurationMinutes] = useState('0');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Новые состояния для повторяющихся задач
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatDays, setRepeatDays] = useState('0');
  const [repeatHours, setRepeatHours] = useState('0');
  const [repeatMinutes, setRepeatMinutes] = useState('0');
  const [repeatCount, setRepeatCount] = useState('1');
  const [repeatStartDate, setRepeatStartDate] = useState('');
  const [repeatStartTime, setRepeatStartTime] = useState('');
  const [repeatEndDate, setRepeatEndDate] = useState('');
  const [repeatEndTime, setRepeatEndTime] = useState('');
  
  // Состояния для конкретного времени начала
  const [hasSpecificTime, setHasSpecificTime] = useState(false);
  const [specificStartTime, setSpecificStartTime] = useState('');
  const [specificEndTime, setSpecificEndTime] = useState('');
  
  // Состояния для возможного времени
  const [hasPossibleTime, setHasPossibleTime] = useState(false);
  const [possibleStartTime, setPossibleStartTime] = useState('');
  const [possibleEndTime, setPossibleEndTime] = useState('');
  
  // Состояния для зависимостей задач
  const [hasDependency, setHasDependency] = useState(false);
  const [dependencyTask, setDependencyTask] = useState('');
  const [dependencyType, setDependencyType] = useState<'before' | 'after'>('after');
  const [dependencyOperator, setDependencyOperator] = useState('>');
  const [dependencyDays, setDependencyDays] = useState('0');
  const [dependencyHours, setDependencyHours] = useState('0');
  const [dependencyMinutes, setDependencyMinutes] = useState('0');

  useEscapeKey(onClose, isOpen);

  const minutesToDuration = (totalMinutes: number) => {
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;
    return { days, hours, minutes };
  };

  const durationToMinutes = (days: number, hours: number, minutes: number) => {
    return days * 24 * 60 + hours * 60 + minutes;
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getDateByDayOfWeek = (dayOfWeek: number) => {
    const today = new Date();
    const currentDay = today.getDay(); // 0-6 (ВС-СБ)
    
    const jsDayOfWeek = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
    
    const diff = jsDayOfWeek - currentDay;
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + diff);
    
    return targetDate.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (isOpen) {
      if (task) {
        const duration = minutesToDuration(task.durationMinutes);
        
        setTitle(task.title || task.content);
        setDescription(task.description || '');
        setStartDate(task.startDate || '');
        setEndDate(task.endDate || '');
        setStartTime(task.startTime || '');
        setEndTime(task.endTime || '');
        setDurationDays(duration.days.toString());
        setDurationHours(duration.hours.toString());
        setDurationMinutes(duration.minutes.toString());
        setPriority(task.priority);
        
        // Сброс новых полей при редактировании существующей задачи
        setIsRepeating(false);
        setHasSpecificTime(false);
        setHasPossibleTime(false);
        setHasDependency(false);
      } else {
        setTitle('');
        setDescription('');
        
        if (initialDate) {
          const date = initialDate.date || getDateByDayOfWeek(initialDate.day);
          setStartDate(date);
          setEndDate(date);
          setStartTime(initialDate.time);
          setEndTime(initialDate.time);
        } else {
          setStartDate('');
          setEndDate('');
          setStartTime('');
          setEndTime('');
        }
        
        setDurationDays('0');
        setDurationHours('1');
        setDurationMinutes('0');
        setPriority('medium');
        
        // Сброс новых полей при создании новой задачи
        setIsRepeating(false);
        setHasSpecificTime(false);
        setHasPossibleTime(false);
        setHasDependency(false);
        setRepeatDays('0');
        setRepeatHours('0');
        setRepeatMinutes('0');
        setRepeatCount('1');
        setRepeatStartDate(getCurrentDate());
        setRepeatEndDate('');
        setRepeatStartTime('09:00');
        setRepeatEndTime('18:00');
        setSpecificStartTime('09:00');
        setSpecificEndTime('18:00');
        setPossibleStartTime('');
        setPossibleEndTime('');
        setDependencyTask('');
        setDependencyType('after');
        setDependencyOperator('>');
        setDependencyDays('0');
        setDependencyHours('0');
        setDependencyMinutes('0');
      }
    }
  }, [isOpen, task, initialDate]);

  const handleSave = () => {
    const totalMinutes = durationToMinutes(
      parseInt(durationDays) || 0,
      parseInt(durationHours) || 0,
      parseInt(durationMinutes) || 0
    );

    const taskData: Partial<Task> = {
      title: title,
      content: title, 
      description,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      durationMinutes: totalMinutes || 60,
      priority,
    };

    onSave(taskData);
    onClose();
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isViewMode = mode === 'view';
  const headerText = mode === 'create' ? 'Добавьте свою задачу' : 
                    mode === 'edit' ? 'Редактирование задачи' : 
                    'Просмотр задачи';

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
        zIndex: 1001,
      }}
    >
      <div 
        className="task-form-modal"
        style={{
          backgroundColor: currentTheme.colors.surface,
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          border: `1px solid ${currentTheme.colors.border}`,
        }}
      >
        <h2 style={{ 
          marginBottom: '25px', 
          textAlign: 'center',
          color: currentTheme.colors.text,
          fontSize: '24px',
          fontWeight: '600'
        }}>
          {headerText}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Название задачи */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: currentTheme.colors.text
            }}>
              Задача:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="введите название задачи"
              disabled={isViewMode}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${currentTheme.colors.border}`,
                borderRadius: '6px',
                fontSize: '16px',
                fontStyle: title ? 'normal' : 'italic',
                color: title ? currentTheme.colors.text : currentTheme.colors.textSecondary,
                backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                cursor: isViewMode ? 'not-allowed' : 'text'
              }}
            />
          </div>

          {/* Описание задачи */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: currentTheme.colors.text
            }}>
              Описание задачи:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите подробности вашей задачи..."
              disabled={isViewMode}
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: `1px solid ${currentTheme.colors.border}`,
                borderRadius: '6px',
                fontSize: '16px',
                fontStyle: description ? 'normal' : 'italic',
                color: description ? currentTheme.colors.text : currentTheme.colors.textSecondary,
                backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                cursor: isViewMode ? 'not-allowed' : 'text',
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
          </div>

          {/* Сроки */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px',
              fontWeight: '500',
              color: currentTheme.colors.text
            }}>
              Сроки:
            </label>
            <div className="dates-container">
              <div>
                <div style={{ fontSize: '14px', color: currentTheme.colors.textSecondary, marginBottom: '5px' }}>Начать с:</div>
                <div className="date-group">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={isViewMode}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: `1px solid ${currentTheme.colors.border}`,
                      borderRadius: '4px',
                      backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                      cursor: isViewMode ? 'not-allowed' : 'text',
                      color: currentTheme.colors.text
                    }}
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={isViewMode}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: `1px solid ${currentTheme.colors.border}`,
                      borderRadius: '4px',
                      backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                      cursor: isViewMode ? 'not-allowed' : 'text',
                      color: currentTheme.colors.text
                    }}
                  />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: currentTheme.colors.textSecondary, marginBottom: '5px' }}>Закончить до:</div>
                <div className="date-group">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isViewMode}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: `1px solid ${currentTheme.colors.border}`,
                      borderRadius: '4px',
                      backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                      cursor: isViewMode ? 'not-allowed' : 'text',
                      color: currentTheme.colors.text
                    }}
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={isViewMode}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: `1px solid ${currentTheme.colors.border}`,
                      borderRadius: '4px',
                      backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                      cursor: isViewMode ? 'not-allowed' : 'text',
                      color: currentTheme.colors.text
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Длительность */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px',
              fontWeight: '500',
              color: currentTheme.colors.text
            }}>
              Длительность:
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>Дни</div>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  disabled={isViewMode}
                  min="0"
                  max="365"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${currentTheme.colors.border}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                    cursor: isViewMode ? 'not-allowed' : 'text',
                    textAlign: 'center',
                    color: currentTheme.colors.text
                  }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>Часы</div>
                <input
                  type="number"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  disabled={isViewMode}
                  min="0"
                  max="23"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${currentTheme.colors.border}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                    cursor: isViewMode ? 'not-allowed' : 'text',
                    textAlign: 'center',
                    color: currentTheme.colors.text
                  }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>Минуты</div>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  disabled={isViewMode}
                  min="0"
                  max="59"
                  step="15"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: `1px solid ${currentTheme.colors.border}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                    cursor: isViewMode ? 'not-allowed' : 'text',
                    textAlign: 'center',
                    color: currentTheme.colors.text
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary, marginTop: '5px', textAlign: 'center' }}>
              Общая длительность: {durationToMinutes(
                parseInt(durationDays) || 0,
                parseInt(durationHours) || 0,
                parseInt(durationMinutes) || 0
              )} минут
            </div>
          </div>

          {/* Приоритет */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '12px',
              fontWeight: '500',
              color: currentTheme.colors.text
            }}>
              Приоритет:
            </label>
            <div style={{ display: 'flex', gap: '15px' }}>
              {(['low', 'medium', 'high'] as const).map((prio) => (
                <button
                  key={prio}
                  type="button"
                  onClick={() => !isViewMode && setPriority(prio)}
                  disabled={isViewMode}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: `2px solid ${priority === prio ? currentTheme.colors.primary : 'transparent'}`,
                    borderRadius: '6px',
                    backgroundColor: 
                      prio === 'low' ? currentTheme.colors.priorityLow :
                      prio === 'medium' ? currentTheme.colors.priorityMedium : 
                      currentTheme.colors.priorityHigh,
                    color: 
                      prio === 'low' ? currentTheme.colors.priorityLowText :
                      prio === 'medium' ? currentTheme.colors.priorityMediumText : 
                      currentTheme.colors.priorityHighText,
                    cursor: isViewMode ? 'default' : 'pointer',
                    fontWeight: priority === prio ? '600' : '400',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {prio === 'low' && 'Низкий'}
                  {prio === 'medium' && 'Средний'}
                  {prio === 'high' && 'Высокий'}
                </button>
              ))}
            </div>
          </div>

          {/* Задача повторяется? */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ 
                fontWeight: '500',
                color: currentTheme.colors.text
              }}>
                Задача повторяется?
              </label>
              <input
                type="checkbox"
                checked={isRepeating}
                onChange={(e) => !isViewMode && setIsRepeating(e.target.checked)}
                disabled={isViewMode}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: isViewMode ? 'not-allowed' : 'pointer'
                }}
              />
            </div>

            {isRepeating && (
              <div style={{ 
                padding: '15px', 
                backgroundColor: currentTheme.colors.background,
                borderRadius: '6px',
                border: `1px solid ${currentTheme.colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {/* Через какое время повторить задачу */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: currentTheme.colors.text
                  }}>
                    Через какое время повторить задачу:
                  </label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>Дни</div>
                      <input
                        type="number"
                        value={repeatDays}
                        onChange={(e) => setRepeatDays(e.target.value)}
                        disabled={isViewMode}
                        min="0"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: `1px solid ${currentTheme.colors.border}`,
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                          cursor: isViewMode ? 'not-allowed' : 'text',
                          textAlign: 'center',
                          color: currentTheme.colors.text
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>Часы</div>
                      <input
                        type="number"
                        value={repeatHours}
                        onChange={(e) => setRepeatHours(e.target.value)}
                        disabled={isViewMode}
                        min="0"
                        max="23"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: `1px solid ${currentTheme.colors.border}`,
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                          cursor: isViewMode ? 'not-allowed' : 'text',
                          textAlign: 'center',
                          color: currentTheme.colors.text
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>Минуты</div>
                      <input
                        type="number"
                        value={repeatMinutes}
                        onChange={(e) => setRepeatMinutes(e.target.value)}
                        disabled={isViewMode}
                        min="0"
                        max="59"
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: `1px solid ${currentTheme.colors.border}`,
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                          cursor: isViewMode ? 'not-allowed' : 'text',
                          textAlign: 'center',
                          color: currentTheme.colors.text
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Количество повторений */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: currentTheme.colors.text
                  }}>
                    Количество повторений:
                  </label>
                  <input
                    type="number"
                    value={repeatCount}
                    onChange={(e) => setRepeatCount(e.target.value)}
                    disabled={isViewMode}
                    min="1"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${currentTheme.colors.border}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                      cursor: isViewMode ? 'not-allowed' : 'text',
                      color: currentTheme.colors.text
                    }}
                  />
                </div>

                <div style={{ textAlign: 'center', color: currentTheme.colors.textSecondary, fontSize: '14px', fontWeight: '500' }}>
                  ИЛИ
                </div>

                {/* Период повторения */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: currentTheme.colors.text
                  }}>
                    Начало периода повторения задачи:
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="date"
                      value={repeatStartDate}
                      onChange={(e) => setRepeatStartDate(e.target.value)}
                      disabled={isViewMode}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: `1px solid ${currentTheme.colors.border}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                        cursor: isViewMode ? 'not-allowed' : 'text',
                        color: currentTheme.colors.text
                      }}
                    />
                    <input
                      type="time"
                      value={repeatStartTime}
                      onChange={(e) => setRepeatStartTime(e.target.value)}
                      disabled={isViewMode}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: `1px solid ${currentTheme.colors.border}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                        cursor: isViewMode ? 'not-allowed' : 'text',
                        color: currentTheme.colors.text
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: currentTheme.colors.text
                  }}>
                    Конец периода повторения задачи:
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="date"
                      value={repeatEndDate}
                      onChange={(e) => setRepeatEndDate(e.target.value)}
                      disabled={isViewMode}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: `1px solid ${currentTheme.colors.border}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                        cursor: isViewMode ? 'not-allowed' : 'text',
                        color: currentTheme.colors.text
                      }}
                    />
                    <input
                      type="time"
                      value={repeatEndTime}
                      onChange={(e) => setRepeatEndTime(e.target.value)}
                      disabled={isViewMode}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: `1px solid ${currentTheme.colors.border}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                        cursor: isViewMode ? 'not-allowed' : 'text',
                        color: currentTheme.colors.text
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* У задачи есть конкретное время начала? */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ 
                fontWeight: '500',
                color: currentTheme.colors.text
              }}>
                У задачи есть конкретное время начала?
              </label>
              <input
                type="checkbox"
                checked={hasSpecificTime}
                onChange={(e) => !isViewMode && setHasSpecificTime(e.target.checked)}
                disabled={isViewMode}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: isViewMode ? 'not-allowed' : 'pointer'
                }}
              />
            </div>

            {hasSpecificTime && (
              <div style={{ 
                padding: '15px', 
                backgroundColor: currentTheme.colors.background,
                borderRadius: '6px',
                border: `1px solid ${currentTheme.colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '5px',
                      fontSize: '14px',
                      color: currentTheme.colors.text
                    }}>
                      Время начала:
                    </label>
                    <input
                      type="time"
                      value={specificStartTime}
                      onChange={(e) => setSpecificStartTime(e.target.value)}
                      disabled={isViewMode}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: `1px solid ${currentTheme.colors.border}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                        cursor: isViewMode ? 'not-allowed' : 'text',
                        color: currentTheme.colors.text
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '5px',
                      fontSize: '14px',
                      color: currentTheme.colors.text
                    }}>
                      Время окончания:
                    </label>
                    <input
                      type="time"
                      value={specificEndTime}
                      onChange={(e) => setSpecificEndTime(e.target.value)}
                      disabled={isViewMode}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: `1px solid ${currentTheme.colors.border}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                        cursor: isViewMode ? 'not-allowed' : 'text',
                        color: currentTheme.colors.text
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Есть ли возможное время начала и конца задачи? */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ 
                fontWeight: '500',
                color: currentTheme.colors.text
              }}>
                Есть ли возможное время начала и конца задачи?
              </label>
              <input
                type="checkbox"
                checked={hasPossibleTime}
                onChange={(e) => !isViewMode && setHasPossibleTime(e.target.checked)}
                disabled={isViewMode}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: isViewMode ? 'not-allowed' : 'pointer'
                }}
              />
            </div>

            {hasPossibleTime && (
              <div style={{ 
                padding: '15px', 
                backgroundColor: currentTheme.colors.background,
                borderRadius: '6px',
                border: `1px solid ${currentTheme.colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="time"
                      value={possibleStartTime}
                      onChange={(e) => setPossibleStartTime(e.target.value)}
                      disabled={isViewMode}
                      placeholder="примерно начать с..."
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: `1px solid ${currentTheme.colors.border}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                        cursor: isViewMode ? 'not-allowed' : 'text',
                        fontStyle: possibleStartTime ? 'normal' : 'italic',
                        color: possibleStartTime ? currentTheme.colors.text : currentTheme.colors.textSecondary
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input
                      type="time"
                      value={possibleEndTime}
                      onChange={(e) => setPossibleEndTime(e.target.value)}
                      disabled={isViewMode}
                      placeholder="примерно закончить"
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: `1px solid ${currentTheme.colors.border}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                        cursor: isViewMode ? 'not-allowed' : 'text',
                        fontStyle: possibleEndTime ? 'normal' : 'italic',
                        color: possibleEndTime ? currentTheme.colors.text : currentTheme.colors.textSecondary
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Зависит ли задача от другой задачи? */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ 
                fontWeight: '500',
                color: currentTheme.colors.text
              }}>
                Зависит ли задача от другой задачи?
              </label>
              <input
                type="checkbox"
                checked={hasDependency}
                onChange={(e) => !isViewMode && setHasDependency(e.target.checked)}
                disabled={isViewMode}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: isViewMode ? 'not-allowed' : 'pointer'
                }}
              />
            </div>

            {hasDependency && (
              <div style={{ 
                padding: '15px', 
                backgroundColor: currentTheme.colors.background,
                borderRadius: '6px',
                border: `1px solid ${currentTheme.colors.border}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {/* Что за задача */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: currentTheme.colors.text
                  }}>
                    Что за задача:
                  </label>
                  <select
                    value={dependencyTask}
                    onChange={(e) => setDependencyTask(e.target.value)}
                    disabled={isViewMode}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: `1px solid ${currentTheme.colors.border}`,
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                      cursor: isViewMode ? 'not-allowed' : 'pointer',
                      color: currentTheme.colors.text
                    }}
                  >
                    <option value="">Выберите задачу</option>
                    {/* Здесь будут подгружаться задачи из списка */}
                    <option value="task1">Задача 1</option>
                    <option value="task2">Задача 2</option>
                    <option value="task3">Задача 3</option>
                  </select>
                </div>

                {/* До или после */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: currentTheme.colors.text
                  }}>
                    До или после:
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setDependencyType('before')}
                      disabled={isViewMode}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: `2px solid ${dependencyType === 'before' ? currentTheme.colors.primary : currentTheme.colors.border}`,
                        borderRadius: '4px',
                        backgroundColor: dependencyType === 'before' ? currentTheme.colors.background : currentTheme.colors.surface,
                        color: currentTheme.colors.text,
                        cursor: isViewMode ? 'not-allowed' : 'pointer',
                        fontWeight: dependencyType === 'before' ? '600' : '400'
                      }}
                    >
                      До
                    </button>
                    <button
                      type="button"
                      onClick={() => setDependencyType('after')}
                      disabled={isViewMode}
                      style={{
                        flex: 1,
                        padding: '8px',
                        border: `2px solid ${dependencyType === 'after' ? currentTheme.colors.primary : currentTheme.colors.border}`,
                        borderRadius: '4px',
                        backgroundColor: dependencyType === 'after' ? currentTheme.colors.background : currentTheme.colors.surface,
                        color: currentTheme.colors.text,
                        cursor: isViewMode ? 'not-allowed' : 'pointer',
                        fontWeight: dependencyType === 'after' ? '600' : '400'
                      }}
                    >
                      После
                    </button>
                  </div>
                </div>

                {/* Через какое время */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: currentTheme.colors.text
                  }}>
                    Через какое время:
                  </label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <select
                      value={dependencyOperator}
                      onChange={(e) => setDependencyOperator(e.target.value)}
                      disabled={isViewMode}
                      style={{
                        padding: '8px',
                        border: `1px solid ${currentTheme.colors.border}`,
                        borderRadius: '4px',
                        fontSize: '14px',
                        backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                        cursor: isViewMode ? 'not-allowed' : 'pointer',
                        color: currentTheme.colors.text
                      }}
                    >
                      <option value=">">{'>'}</option>
                      <option value="<">{'<'}</option>
                      <option value="=">{'='}</option>
                      <option value=">=">{'>='}</option>
                      <option value="<=">{'<='}</option>
                    </select>
                    
                    <div style={{ flex: 1, display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <input
                        type="number"
                        value={dependencyDays}
                        onChange={(e) => setDependencyDays(e.target.value)}
                        disabled={isViewMode}
                        min="0"
                        placeholder="0"
                        style={{
                          flex: 1,
                          padding: '8px',
                          border: `1px solid ${currentTheme.colors.border}`,
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                          cursor: isViewMode ? 'not-allowed' : 'text',
                          textAlign: 'center',
                          color: currentTheme.colors.text
                        }}
                      />
                      <span style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>дн</span>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <input
                        type="number"
                        value={dependencyHours}
                        onChange={(e) => setDependencyHours(e.target.value)}
                        disabled={isViewMode}
                        min="0"
                        max="23"
                        placeholder="0"
                        style={{
                          flex: 1,
                          padding: '8px',
                          border: `1px solid ${currentTheme.colors.border}`,
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                          cursor: isViewMode ? 'not-allowed' : 'text',
                          textAlign: 'center',
                          color: currentTheme.colors.text
                        }}
                      />
                      <span style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>час</span>
                    </div>
                    
                    <div style={{ flex: 1, display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <input
                        type="number"
                        value={dependencyMinutes}
                        onChange={(e) => setDependencyMinutes(e.target.value)}
                        disabled={isViewMode}
                        min="0"
                        max="59"
                        placeholder="0"
                        style={{
                          flex: 1,
                          padding: '8px',
                          border: `1px solid ${currentTheme.colors.border}`,
                          borderRadius: '4px',
                          fontSize: '14px',
                          backgroundColor: isViewMode ? currentTheme.colors.background : currentTheme.colors.surface,
                          cursor: isViewMode ? 'not-allowed' : 'text',
                          textAlign: 'center',
                          color: currentTheme.colors.text
                        }}
                      />
                      <span style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>мин</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Кнопки действий */}
          {!isViewMode && (
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button
                onClick={handleSave}
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
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.accent}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.success}
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
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.secondary}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.background}
              >
                Отмена
              </button>
            </div>
          )}
          
          {isViewMode && (
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button
                onClick={onEdit} 
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: currentTheme.colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.accent}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.primary}
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
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.secondary}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = currentTheme.colors.background}
              >
                Закрыть
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};