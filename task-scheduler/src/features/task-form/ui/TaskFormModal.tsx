import React, { useState, useEffect } from 'react';
import type { Task } from '../../../entities/task/model/types';
import { useEscapeKey } from '../../../shared/lib/hooks/useEscapeKey';
import { useTheme } from '../../../shared/lib/contexts';
import { getPriorityColor } from '../../../shared/lib/utils/priorityGradient';

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
  isSaving?: boolean;
  availableTasks?: Task[];
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onEdit, 
  task,
  mode = 'create',
  initialDate,
  isSaving = false,
  availableTasks = [],
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
  const [priority, setPriority] = useState<number>(5);
  // const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Новые состояния для повторяющихся задач
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatDays, setRepeatDays] = useState('0');
  const [repeatHours, setRepeatHours] = useState('0');
  const [repeatMinutes, setRepeatMinutes] = useState('0');
  const [repeatCount, setRepeatCount] = useState('0');
  const [repeatStartDate, setRepeatStartDate] = useState('');
  const [repeatStartTime, setRepeatStartTime] = useState('');
  const [repeatEndDate, setRepeatEndDate] = useState('');
  const [repeatEndTime, setRepeatEndTime] = useState('');

  const [repeatType, setRepeatType] = useState<'count' | 'period'>('count'); // 'count' или 'period'
  
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
    const currentDay = today.getDay(); 
    
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
        
        setTitle(task.title || '');
        setDescription(task.description || '');
        setStartDate(task.startDate || '');
        setEndDate(task.endDate || '');
        setStartTime(task.startTime || '');
        setEndTime(task.endTime || '');
        setDurationDays(duration.days.toString());
        setDurationHours(duration.hours.toString());
        setDurationMinutes(duration.minutes.toString());
        setPriority(task.priority);
        
        setIsRepeating(Boolean(task.isRepeating));
        setHasSpecificTime(Boolean(task.startDate && task.startTime));
        setHasPossibleTime(Boolean(task.ruleOneTask));
        setHasDependency(Boolean(task.ruleTwoTask));

        
        if (task.isRepeating && task.endDateTimeRepit) {
          setRepeatType('period');
        } else {
          setRepeatType('count');
        }
          
        if (task.isRepeating) {
          setIsRepeating(true);
          setRepeatCount(String(task.repeatCount || '0'));
        }

        if (task.ruleOneTask)
        {
          setHasPossibleTime(true);
        }
        
        if (task.ruleTwoTask) {
          setDependencyTask(String(task.secondTaskId || ''));
          setDependencyType(task.timePositionRegardingTaskId === 0 ? 'before' : 'after');
          
          if (task.relationRangeId === 0) {
            setDependencyOperator('>');
          } else if (task.relationRangeId === 1) {
            setDependencyOperator('=');
          } else if (task.relationRangeId === 2) {
            setDependencyOperator('<');
          }
          
          if (task.dateTimeRange) {
            const [days, hours, minutes] = task.dateTimeRange.split(':');
            setDependencyDays(days || '0');
            setDependencyHours(hours || '0');
            setDependencyMinutes(minutes || '0');
            
          }
          setHasDependency(true);
        }
        
      } else {
        setTitle('');
        setDescription('');
        
        if (initialDate) {
          const date = initialDate.date || getDateByDayOfWeek(initialDate.day);
          setStartDate(date);
          setEndDate(date);
          setStartTime(initialDate.time);
          setEndTime(initialDate.time);

          setRepeatStartDate(date);
          setRepeatStartTime(initialDate.time);
        } else {
          setStartDate('');
          setEndDate('');
          setStartTime('');
          setEndTime('');

          setRepeatStartDate(getCurrentDate());
          setRepeatStartTime('09:00');
        }
        
        setDurationDays('0');
        setDurationHours('1');
        setDurationMinutes('0');
        setPriority(5);
        
        // сброс новых полей при создании новой задачи
        
        setHasSpecificTime(false);
        setHasPossibleTime(false);
        setHasDependency(false);
        setRepeatDays('0');
        setRepeatHours('0');
        setRepeatMinutes('0');
        setRepeatCount('0');
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

        setRepeatType('count');
      }
    }
  }, [isOpen, task, initialDate]);

  // useEffect(() => {
  //   if (hasDependency) {
  //     setHasSpecificTime(false);
  //     setHasPossibleTime(false);
  //   }
  // }, [hasDependency]);

  // useEffect(() => {
  //   if (hasSpecificTime || hasPossibleTime) {
  //     setHasDependency(false);
  //   }
  // }, [hasSpecificTime, hasPossibleTime]);

  const handleSave = () => {

    console.log('Description before save:', {
    original: description,
    trimmed: description?.trim(),
    willSend: description?.trim() === '' ? ' ' : description
  });


    const totalMinutes = durationToMinutes(
      parseInt(durationDays) || 0,
      parseInt(durationHours) || 0,
      parseInt(durationMinutes) || 0
    );
    let startDateForSave: string | undefined = startDate; 
    let startTimeForSave: string | undefined = startTime;

    // АВТОМАТИЧЕСКИ ВЫЧИСЛЯЕМ КОНЕЧНУЮ ДАТУ И ВРЕМЯ
    let calculatedEndDate: string | undefined = endDate;
    let calculatedEndTime: string | undefined = endTime;

    if (startDate && startTime) {
      const startDateTime = new Date(`${startDate}T${startTime}:00.000Z`);
      const endDateTime = new Date(startDateTime.getTime() + totalMinutes * 60 * 1000);

      // Форматируем конечную дату
            // Форматируем конечную дату (UTC)
      const endYear = endDateTime.getUTCFullYear();
      const endMonth = String(endDateTime.getUTCMonth() + 1).padStart(2, '0');
      const endDay = String(endDateTime.getUTCDate()).padStart(2, '0');
      calculatedEndDate = `${endYear}-${endMonth}-${endDay}`;

      // Форматируем конечное время (UTC)
      const endHours = String(endDateTime.getUTCHours()).padStart(2, '0');
      const endMinutes = String(endDateTime.getUTCMinutes()).padStart(2, '0');
      calculatedEndTime = `${endHours}:${endMinutes}:00.000Z`;
    }

    // ПРАВИЛЬНЫЙ РАСЧЕТ ДЛЯ ПОВТОРЯЮЩИХСЯ ЗАДАЧ
    let calculatedStartDateTimeRepit: string | undefined = undefined;
    let calculatedEndDateTimeRepit: string | undefined = undefined;
    let repeatTotalMinutes: number | undefined = undefined;
    
    if (isRepeating && repeatStartDate  && repeatStartTime) {
      // startDateTimeRepit = startDate + startTime (начало первой задачи)
      calculatedStartDateTimeRepit = `${repeatStartDate}T${repeatStartTime}:00.000Z`;

      // Расчет endDateTimeRepit: конец последней задачи в серии повторений
      repeatTotalMinutes = durationToMinutes(
        parseInt(repeatDays) || 0,
        parseInt(repeatHours) || 0,
        parseInt(repeatMinutes) || 0
      );

      if (repeatType === 'period' && repeatEndDate && repeatEndTime) {
        calculatedEndDateTimeRepit = `${repeatEndDate}T${repeatEndTime}:00.000Z`;
      } else if (repeatType === 'count') {
        const repeatCountValue = repeatType === 'count' ? parseInt(repeatCount) || 0 : 0;

        if (repeatTotalMinutes > 0) {
          // ПРАВИЛЬНЫЙ РАСЧЕТ: 
          // Каждая задача длится totalMinutes, между задачами интервал repeatTotalMinutes
          // Общее время = (длительность задачи + интервал) × (количество повторов - 1) + длительность последней задачи
          const totalDurationForAllRepetitions = 
            (totalMinutes + repeatTotalMinutes) * (repeatCountValue - 1) + totalMinutes;
          
          const startDateTime = new Date(calculatedStartDateTimeRepit);
          const endRepetitionDateTime = new Date(
            startDateTime.getTime() + totalDurationForAllRepetitions * 60 * 1000
          );
          
          const endRepYear = endRepetitionDateTime.getFullYear();
          const endRepMonth = String(endRepetitionDateTime.getMonth() + 1).padStart(2, '0');
          const endRepDay = String(endRepetitionDateTime.getDate()).padStart(2, '0');
          const endRepHours = String(endRepetitionDateTime.getHours()).padStart(2, '0');
          const endRepMinutes = String(endRepetitionDateTime.getMinutes()).padStart(2, '0');
          
          calculatedEndDateTimeRepit = `${endRepYear}-${endRepMonth}-${endRepDay}T${endRepHours}:${endRepMinutes}:00.000Z`;
        } else if (repeatStartDate && repeatStartTime && repeatEndDate && repeatEndTime) {
          // Альтернативный вариант: используем явно указанный период повторения
          calculatedStartDateTimeRepit = `${repeatStartDate}T${repeatStartTime}:00.000Z`;
          calculatedEndDateTimeRepit = `${repeatEndDate}T${repeatEndTime}:00.000Z`;
        }
      }
    }

    // ОБРАБОТКА ДЛЯ RULE ONE TASK (конкретное время)
    let calculatedStartDateTimeRuleOneTask: string | undefined = undefined;
    let calculatedEndDateTimeRuleOneTask: string | undefined = undefined;
    let ruleOneTaskValue: boolean = false;

    if (hasPossibleTime) {
      ruleOneTaskValue = true;
      calculatedStartDateTimeRuleOneTask = `${startDate}T${possibleStartTime}:00.000Z`;
      calculatedEndDateTimeRuleOneTask = `${startDate}T${possibleEndTime}:00.000Z`;
      startDateForSave = undefined;
      startTimeForSave = undefined;
      calculatedEndDate = undefined;
      calculatedEndTime = undefined;
    }

    let timePosition: number | undefined = undefined;
    let secondTaskIdFrom: number | undefined = undefined; 
    let relationRangeIdFrom: number | undefined = undefined;
    let dateTimeRangeFrom: string | undefined = undefined;
    if (hasDependency)
    {
      timePosition = dependencyType == "before" ? 0 : 1;
      if (dependencyOperator == ">")
      {
        relationRangeIdFrom = 0;
      }
      else if (dependencyOperator == "=")
      {
        relationRangeIdFrom = 1;
      }
      else if (dependencyOperator == "<")
      {
        relationRangeIdFrom = 2;
      }
      dateTimeRangeFrom = `${dependencyDays.padStart(2, '0')}:${dependencyHours.padStart(2, '0')}:${dependencyMinutes.padStart(2, '0')}:00`;
      const selectedTask = availableTasks.find(t => t.id === dependencyTask);
      secondTaskIdFrom = selectedTask ? parseInt(selectedTask.id) : undefined;
      startDateForSave = undefined;
      startTimeForSave = undefined;
      calculatedEndDate = undefined;
      calculatedEndTime = undefined;
    }

    const taskData: Partial<Task> = {
      id: task?.id,
      title: title,
      description: description?.trim() === '' ? ' ' : description,
      startDate: startDateForSave || undefined,
      endDate: calculatedEndDate || undefined,
      startTime: startTimeForSave || undefined,
      endTime: calculatedEndTime || undefined,
      durationMinutes: totalMinutes || 0,
      priority,
      // повтор
      isRepeating: isRepeating || undefined,
      repeatCount: isRepeating ? parseInt(repeatCount) || 0 : undefined,
      startDateTimeRepit: calculatedStartDateTimeRepit,
      endDateTimeRepit: calculatedEndDateTimeRepit,
      repeateDurationMinute: repeatTotalMinutes,
      // rule one task
      ruleOneTask: ruleOneTaskValue,
      startDateTimeRuleOneTask: calculatedStartDateTimeRuleOneTask,
      endDateTimeRuleOneTask: calculatedEndDateTimeRuleOneTask,
      // rule two task
      ruleTwoTask: hasDependency,
      timePositionRegardingTaskId: timePosition,
      secondTaskId: secondTaskIdFrom,
      relationRangeId: relationRangeIdFrom,
      dateTimeRange: dateTimeRangeFrom,
    };

    console.log('Final taskData:', taskData);


    onSave(taskData);
    onClose();
  };

  const handleCheckboxChange = (type: 'repeat' | 'specific' | 'possible' | 'dependency', checked: boolean) => {
    if (isViewMode) return;

    if (checked) {

      setIsRepeating(type === 'repeat');
      setHasSpecificTime(type === 'specific');
      setHasPossibleTime(type === 'possible');
      setHasDependency(type === 'dependency');
    } else {

      if (type === 'repeat') setIsRepeating(false);
      else if (type === 'specific') setHasSpecificTime(false);
      else if (type === 'possible') setHasPossibleTime(false);
      else if (type === 'dependency') setHasDependency(false);
    }
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

          {/* Сроки
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
          </div> */}

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
                  type="text"
                  value={durationDays}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    setDurationDays(onlyNums);
                  }}

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
                  type="text"
                  value={durationHours}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    setDurationHours(onlyNums);
                  }}

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
                  type="text"
                  value={durationMinutes}
                  onChange={(e) => {
                    const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                    setDurationMinutes(onlyNums);
                  }}

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
              Приоритет: {priority}
            </label>

            <div style={{ 
              padding: '20px 15px',
              backgroundColor: currentTheme.colors.background,
              borderRadius: '8px',
              marginBottom: '10px'
            }}>
              <input
                type="range"
                min="1"
                max="10"
                value={priority}
                onChange={(e) => !isViewMode && setPriority(parseInt(e.target.value))}
                disabled={isViewMode}
                style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  background: `linear-gradient(to right, ${currentTheme.colors.priorityLow}, ${currentTheme.colors.priorityHigh})`,
                  outline: 'none',
                  cursor: isViewMode ? 'not-allowed' : 'pointer',
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '8px',
                fontSize: '12px',
                color: currentTheme.colors.textSecondary
              }}>
                <span>1 (Низкий)</span>
                <span>10 (Высокий)</span>
              </div>
            </div>
            
            {/* Визуализация текущего приоритета */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              marginTop: '10px'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: getPriorityColor(priority, currentTheme.colors.priorityLow, currentTheme.colors.priorityHigh),
                border: `2px solid ${currentTheme.colors.border}`
              }} />
              <span style={{
                fontSize: '14px',
                color: currentTheme.colors.text,
                fontWeight: '500'
              }}>
                Текущий приоритет: {priority}
              </span>
            </div>
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
                //onChange={(e) => !isViewMode && setIsRepeating(e.target.checked)}
                onChange={(e) => handleCheckboxChange('repeat', e.target.checked)}
                disabled={isViewMode || (hasSpecificTime || hasPossibleTime || hasDependency) && !isRepeating}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: isViewMode ? 'not-allowed' : 'pointer',
                  flexShrink: 0 
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
                
                {/* Время начала первой задачи */}
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: currentTheme.colors.text,
                    fontWeight: '500'
                  }}>
                    Время начала первой задачи:
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

                {/* Интервал между задачами (ОБЯЗАТЕЛЬНО) */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: currentTheme.colors.text,
                    fontWeight: '500'
                  }}>
                    Интервал между задачами *:
                  </label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>Дни</div>
                      <input
                        type="text"
                        value={repeatDays}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                          setRepeatDays(onlyNums);
                        }}

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
                        type="text"
                        value={repeatHours}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                          setRepeatHours(onlyNums);
                        }}
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
                        type="text"
                        value={repeatMinutes}
                        onChange={(e) => {
                          const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                          setRepeatMinutes(onlyNums);
                        }}
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

                {/* Выбор типа повторения */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: currentTheme.colors.text,
                    fontWeight: '500'
                  }}>
                    Тип повторения:
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setRepeatType('count')}
                      disabled={isViewMode}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: `2px solid ${repeatType === 'count' ? currentTheme.colors.primary : currentTheme.colors.border}`,
                        borderRadius: '4px',
                        backgroundColor: repeatType === 'count' ? currentTheme.colors.background : currentTheme.colors.surface,
                        color: currentTheme.colors.text,
                        cursor: isViewMode ? 'not-allowed' : 'pointer',
                        fontWeight: repeatType === 'count' ? '600' : '400'
                      }}
                    >
                      По количеству
                    </button>
                    <button
                      type="button"
                      onClick={() => setRepeatType('period')}
                      disabled={isViewMode}
                      style={{
                        flex: 1,
                        padding: '10px',
                        border: `2px solid ${repeatType === 'period' ? currentTheme.colors.primary : currentTheme.colors.border}`,
                        borderRadius: '4px',
                        backgroundColor: repeatType === 'period' ? currentTheme.colors.background : currentTheme.colors.surface,
                        color: currentTheme.colors.text,
                        cursor: isViewMode ? 'not-allowed' : 'pointer',
                        fontWeight: repeatType === 'period' ? '600' : '400'
                      }}
                    >
                      По периоду
                    </button>
                  </div>
                </div>

                {/* Количество повторений (если выбран тип "count") */}
                {repeatType === 'count' && (
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
                      type="text"
                      value={repeatCount}
                      onChange={(e) => {
                        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                        setRepeatCount(onlyNums);
                      }}
                      disabled={isViewMode}
                      min="0"
                      placeholder="0"
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
                )}

                {/* Период повторения (если выбран тип "period") */}
                {repeatType === 'period' && (
                  <>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px',
                        fontSize: '14px',
                        color: currentTheme.colors.text
                      }}>
                        Начало периода повторения:
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
                        Конец периода повторения:
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
                  </>
                )}
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
                //onChange={(e) => !isViewMode && setHasSpecificTime(e.target.checked)}
                onChange={(e) => handleCheckboxChange('specific', e.target.checked)}
                disabled={isViewMode || (isRepeating || hasPossibleTime || hasDependency) && !hasSpecificTime}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: isViewMode ? 'not-allowed' : 'pointer',
                  flexShrink: 0 
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
                {/* <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
                      type="datetime-local"
                      value={specificStartTime}
                      onChange={(e) => setStartDate(e.target.value)}
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
                      type="datetime-local"
                      value={specificEndTime}
                      onChange={(e) => setEndDate(e.target.value)}
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
                </div> */}
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
              {/* <div>
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
              </div> */}
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
                //onChange={(e) => !isViewMode && setHasPossibleTime(e.target.checked)}
                onChange={(e) => handleCheckboxChange('possible', e.target.checked)}
                disabled={isViewMode || (isRepeating || hasSpecificTime || hasDependency) && !hasPossibleTime} 
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: isViewMode ? 'not-allowed' : 'pointer',
                  flexShrink: 0
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
                //onChange={(e) => !isViewMode && setHasDependency(e.target.checked)}
                onChange={(e) => handleCheckboxChange('dependency', e.target.checked)}
                disabled={isViewMode || (isRepeating || hasSpecificTime || hasPossibleTime) && !hasDependency}
                style={{
                  width: '18px',
                  height: '18px',
                  cursor: isViewMode ? 'not-allowed' : 'pointer',
                  flexShrink: 0
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
                  {/* <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: currentTheme.colors.text
                  }}>
                    Что за задача:
                  </label> */}
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
                    {/* Динамически подгружаем задачи из availableTasks */}
                    {availableTasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* До или после */}
                <div>
                  {/* <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontSize: '14px',
                    color: currentTheme.colors.text
                  }}>
                    До или после:
                  </label> */}
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
                  <div className="dependency-fields-container">
                    {/* Выпадающий список */}
                    <div className="dependency-operator">
                      <select
                        value={dependencyOperator}
                        onChange={(e) => setDependencyOperator(e.target.value)}
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
                        <option value=">">больше чем через</option>
                        <option value="<">меньше чем через</option>
                        <option value="=">ровно через</option>
                      </select>
                    </div>

                    <div className="dependency-inputs-container">
                      {/* Дни */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={dependencyDays}
                          onChange={(e) => {
                            const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                            setDependencyDays(onlyNums);
                          }}

                          disabled={isViewMode}
                          min="0"
                          placeholder="0"
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
                        <span style={{ fontSize: '12px', color: currentTheme.colors.textSecondary, minWidth: '25px' }}>дн</span>
                      </div>
                      
                      {/* Часы */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={dependencyHours}
                          onChange={(e) => {
                            const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                            setDependencyHours(onlyNums);
                          }}

                          disabled={isViewMode}
                          min="0"
                          max="23"
                          placeholder="0"
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
                        <span style={{ fontSize: '12px', color: currentTheme.colors.textSecondary, minWidth: '25px' }}>час</span>
                      </div>
                      
                      {/* Минуты */}
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={dependencyMinutes}
                          onChange={(e) => {
                            const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                            setDependencyMinutes(onlyNums);
                          }}

                          disabled={isViewMode}
                          min="0"
                          max="59"
                          placeholder="0"
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
                        <span style={{ fontSize: '12px', color: currentTheme.colors.textSecondary, minWidth: '25px' }}>мин</span>
                      </div>
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
                disabled={isSaving}
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
                disabled={isSaving} 
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
          )}
          
          {isViewMode && (
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
          )}
        </div>
      </div>
  );
};