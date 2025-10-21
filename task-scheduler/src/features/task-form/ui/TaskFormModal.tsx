import React, { useState, useEffect } from 'react';
import type { Task } from '../../../entities/task/model/types';
import { useEscapeKey } from '../../../shared/lib/hooks/useEscapeKey';
import { useTheme } from '../../../shared/lib/contexts';

import { BasicFields } from './TaskFormFields/BasicFields';
import { DateFields } from './TaskFormFields/DateFields';
import { DurationFields } from './TaskFormFields/DurationFields';
import { PriorityFields } from './TaskFormFields/PriorityFields';
import { RepeatingFields } from './TaskFormFields/RepeatingFields';
import { TimeConstraintsFields } from './TaskFormFields/TimeConstraintsFields';
import { DependencyFields } from './TaskFormFields/DependencyFields';
import { TaskFormActions } from './TaskFormActions';

import { 
  minutesToDuration, 
  durationToMinutes, 
  getCurrentDate, 
  getDateByDayOfWeek 
} from '../ui/TaskFormFields/TaskForm.utils';

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

  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatDays, setRepeatDays] = useState('0');
  const [repeatHours, setRepeatHours] = useState('0');
  const [repeatMinutes, setRepeatMinutes] = useState('0');
  const [repeatCount, setRepeatCount] = useState('1');
  const [repeatStartDate, setRepeatStartDate] = useState('');
  const [repeatStartTime, setRepeatStartTime] = useState('');
  const [repeatEndDate, setRepeatEndDate] = useState('');
  const [repeatEndTime, setRepeatEndTime] = useState('');

  const [hasSpecificTime, setHasSpecificTime] = useState(false);
  const [specificStartTime, setSpecificStartTime] = useState('');
  const [specificEndTime, setSpecificEndTime] = useState('');

  const [hasPossibleTime, setHasPossibleTime] = useState(false);
  const [possibleStartTime, setPossibleStartTime] = useState('');
  const [possibleEndTime, setPossibleEndTime] = useState('');

  const [hasDependency, setHasDependency] = useState(false);
  const [dependencyTask, setDependencyTask] = useState('');
  const [dependencyType, setDependencyType] = useState<'before' | 'after'>('after');
  const [dependencyOperator, setDependencyOperator] = useState('>');
  const [dependencyDays, setDependencyDays] = useState('0');
  const [dependencyHours, setDependencyHours] = useState('0');
  const [dependencyMinutes, setDependencyMinutes] = useState('0');

  useEscapeKey(onClose, isOpen);

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
  const totalDurationMinutes = durationToMinutes(
    parseInt(durationDays) || 0,
    parseInt(durationHours) || 0,
    parseInt(durationMinutes) || 0
  );

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
          {/* Основные поля */}
          <BasicFields
            title={title}
            description={description}
            isViewMode={isViewMode}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
          />

          {/* Сроки */}
          <DateFields
            startDate={startDate}
            endDate={endDate}
            startTime={startTime}
            endTime={endTime}
            isViewMode={isViewMode}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
          />

          {/* Длительность */}
          <DurationFields
            durationDays={durationDays}
            durationHours={durationHours}
            durationMinutes={durationMinutes}
            isViewMode={isViewMode}
            onDurationDaysChange={setDurationDays}
            onDurationHoursChange={setDurationHours}
            onDurationMinutesChange={setDurationMinutes}
            totalMinutes={totalDurationMinutes}
          />

          {/* Приоритет */}
          <PriorityFields
            priority={priority}
            isViewMode={isViewMode}
            onPriorityChange={setPriority}
          />

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
            <RepeatingFields
              isRepeating={isRepeating}
              repeatDays={repeatDays}
              repeatHours={repeatHours}
              repeatMinutes={repeatMinutes}
              repeatCount={repeatCount}
              repeatStartDate={repeatStartDate}
              repeatStartTime={repeatStartTime}
              repeatEndDate={repeatEndDate}
              repeatEndTime={repeatEndTime}
              isViewMode={isViewMode}
              onIsRepeatingChange={setIsRepeating}
              onRepeatDaysChange={setRepeatDays}
              onRepeatHoursChange={setRepeatHours}
              onRepeatMinutesChange={setRepeatMinutes}
              onRepeatCountChange={setRepeatCount}
              onRepeatStartDateChange={setRepeatStartDate}
              onRepeatStartTimeChange={setRepeatStartTime}
              onRepeatEndDateChange={setRepeatEndDate}
              onRepeatEndTimeChange={setRepeatEndTime}
            />
          </div>

          {/* Ограничения по времени */}
          <TimeConstraintsFields
            hasSpecificTime={hasSpecificTime}
            specificStartTime={specificStartTime}
            specificEndTime={specificEndTime}
            hasPossibleTime={hasPossibleTime}
            possibleStartTime={possibleStartTime}
            possibleEndTime={possibleEndTime}
            isViewMode={isViewMode}
            onHasSpecificTimeChange={setHasSpecificTime}
            onSpecificStartTimeChange={setSpecificStartTime}
            onSpecificEndTimeChange={setSpecificEndTime}
            onHasPossibleTimeChange={setHasPossibleTime}
            onPossibleStartTimeChange={setPossibleStartTime}
            onPossibleEndTimeChange={setPossibleEndTime}
          />

          {/* Зависимости задач */}
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
            <DependencyFields
              hasDependency={hasDependency}
              dependencyTask={dependencyTask}
              dependencyType={dependencyType}
              dependencyOperator={dependencyOperator}
              dependencyDays={dependencyDays}
              dependencyHours={dependencyHours}
              dependencyMinutes={dependencyMinutes}
              isViewMode={isViewMode}
              onHasDependencyChange={setHasDependency}
              onDependencyTaskChange={setDependencyTask}
              onDependencyTypeChange={setDependencyType}
              onDependencyOperatorChange={setDependencyOperator}
              onDependencyDaysChange={setDependencyDays}
              onDependencyHoursChange={setDependencyHours}
              onDependencyMinutesChange={setDependencyMinutes}
            />
          </div>

          {/* Кнопки действий */}
          <TaskFormActions
            mode={mode}
            isViewMode={isViewMode}
            onSave={handleSave}
            onClose={onClose}
            onEdit={onEdit}
          />
        </div>
      </div>
    </div>
  );
};