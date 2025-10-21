import React from 'react';
import { useTheme } from '../../../../shared/lib/contexts';

interface DependencyFieldsProps {
  hasDependency: boolean;
  dependencyTask: string;
  dependencyType: 'before' | 'after';
  dependencyOperator: string;
  dependencyDays: string;
  dependencyHours: string;
  dependencyMinutes: string;
  isViewMode: boolean;
  onHasDependencyChange: (checked: boolean) => void;
  onDependencyTaskChange: (value: string) => void;
  onDependencyTypeChange: (type: 'before' | 'after') => void;
  onDependencyOperatorChange: (value: string) => void;
  onDependencyDaysChange: (value: string) => void;
  onDependencyHoursChange: (value: string) => void;
  onDependencyMinutesChange: (value: string) => void;
}

export const DependencyFields: React.FC<DependencyFieldsProps> = ({
  hasDependency,
  dependencyTask,
  dependencyType,
  dependencyOperator,
  dependencyDays,
  dependencyHours,
  dependencyMinutes,
  isViewMode,
  onHasDependencyChange,
  onDependencyTaskChange,
  onDependencyTypeChange,
  onDependencyOperatorChange,
  onDependencyDaysChange,
  onDependencyHoursChange,
  onDependencyMinutesChange,
}) => {
  const { currentTheme } = useTheme();

  if (!hasDependency) return null;

  return (
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
          onChange={(e) => onDependencyTaskChange(e.target.value)}
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
            onClick={() => onDependencyTypeChange('before')}
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
            onClick={() => onDependencyTypeChange('after')}
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
            onChange={(e) => onDependencyOperatorChange(e.target.value)}
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
              onChange={(e) => onDependencyDaysChange(e.target.value)}
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
              onChange={(e) => onDependencyHoursChange(e.target.value)}
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
              onChange={(e) => onDependencyMinutesChange(e.target.value)}
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
  );
};