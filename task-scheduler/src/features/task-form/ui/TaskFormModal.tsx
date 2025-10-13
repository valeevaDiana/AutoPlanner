import React, { useState, useEffect } from 'react';
import type { Task } from '../../../entities/task/model/types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
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
  task,
  mode = 'create',
  initialDate
}) => {
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
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          width: '90%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <h2 style={{ 
          marginBottom: '25px', 
          textAlign: 'center',
          color: '#333',
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
              color: '#333'
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
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                fontStyle: title ? 'normal' : 'italic',
                color: title ? '#333' : '#999',
                backgroundColor: isViewMode ? '#f5f5f5' : 'white',
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
              color: '#333'
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
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px',
                fontStyle: description ? 'normal' : 'italic',
                color: description ? '#333' : '#999',
                backgroundColor: isViewMode ? '#f5f5f5' : 'white',
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
            color: '#333'
        }}>
            Сроки:
        </label>
        <div className="dates-container">
            <div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Начать с:</div>
            <div className="date-group">
                <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isViewMode}
                style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isViewMode ? '#f5f5f5' : 'white',
                    cursor: isViewMode ? 'not-allowed' : 'text',
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
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isViewMode ? '#f5f5f5' : 'white',
                    cursor: isViewMode ? 'not-allowed' : 'text',
                }}
                />
            </div>
            </div>
            <div>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>Закончить до:</div>
            <div className="date-group">
                <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isViewMode}
                style={{
                    flex: 1,
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isViewMode ? '#f5f5f5' : 'white',
                    cursor: isViewMode ? 'not-allowed' : 'text',
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
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: isViewMode ? '#f5f5f5' : 'white',
                    cursor: isViewMode ? 'not-allowed' : 'text',
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
              color: '#333'
            }}>
              Длительность:
            </label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Дни</div>
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
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: isViewMode ? '#f5f5f5' : 'white',
                    cursor: isViewMode ? 'not-allowed' : 'text',
                    textAlign: 'center'
                  }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Часы</div>
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
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: isViewMode ? '#f5f5f5' : 'white',
                    cursor: isViewMode ? 'not-allowed' : 'text',
                    textAlign: 'center'
                  }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ fontSize: '12px', color: '#666' }}>Минуты</div>
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
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: isViewMode ? '#f5f5f5' : 'white',
                    cursor: isViewMode ? 'not-allowed' : 'text',
                    textAlign: 'center'
                  }}
                />
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px', textAlign: 'center' }}>
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
              color: '#333'
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
                    border: `2px solid ${priority === prio ? '#333' : 'transparent'}`,
                    borderRadius: '6px',
                    backgroundColor: 
                      prio === 'low' ? '#e6ffe6' :
                      prio === 'medium' ? '#fffacd' : '#ffe6e6',
                    color: '#333',
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

          {/* Кнопки действий */}
          {!isViewMode && (
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#84c65e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#72b352'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#84c65e'}
              >
                {mode === 'create' ? 'Создать задачу' : 'Сохранить изменения'}
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              >
                Отмена
              </button>
            </div>
          )}
          
          {isViewMode && (
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#c68b5e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b37a4e'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#c68b5e'}
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