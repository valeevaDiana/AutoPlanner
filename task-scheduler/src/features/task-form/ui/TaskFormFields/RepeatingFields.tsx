import React from 'react';
import { useTheme } from '../../../../shared/lib/contexts';

interface RepeatingFieldsProps {
  isRepeating: boolean;
  repeatDays: string;
  repeatHours: string;
  repeatMinutes: string;
  repeatCount: string;
  repeatStartDate: string;
  repeatStartTime: string;
  repeatEndDate: string;
  repeatEndTime: string;
  isViewMode: boolean;
  onIsRepeatingChange: (checked: boolean) => void;
  onRepeatDaysChange: (value: string) => void;
  onRepeatHoursChange: (value: string) => void;
  onRepeatMinutesChange: (value: string) => void;
  onRepeatCountChange: (value: string) => void;
  onRepeatStartDateChange: (value: string) => void;
  onRepeatStartTimeChange: (value: string) => void;
  onRepeatEndDateChange: (value: string) => void;
  onRepeatEndTimeChange: (value: string) => void;
}

export const RepeatingFields: React.FC<RepeatingFieldsProps> = ({
  isRepeating,
  repeatDays,
  repeatHours,
  repeatMinutes,
  repeatCount,
  repeatStartDate,
  repeatStartTime,
  repeatEndDate,
  repeatEndTime,
  isViewMode,
  onIsRepeatingChange,
  onRepeatDaysChange,
  onRepeatHoursChange,
  onRepeatMinutesChange,
  onRepeatCountChange,
  onRepeatStartDateChange,
  onRepeatStartTimeChange,
  onRepeatEndDateChange,
  onRepeatEndTimeChange,
}) => {
  const { currentTheme } = useTheme();

  if (!isRepeating) return null;

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
              onChange={(e) => onRepeatDaysChange(e.target.value)}
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
              onChange={(e) => onRepeatHoursChange(e.target.value)}
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
              onChange={(e) => onRepeatMinutesChange(e.target.value)}
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
          onChange={(e) => onRepeatCountChange(e.target.value)}
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
            onChange={(e) => onRepeatStartDateChange(e.target.value)}
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
            onChange={(e) => onRepeatStartTimeChange(e.target.value)}
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
            onChange={(e) => onRepeatEndDateChange(e.target.value)}
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
            onChange={(e) => onRepeatEndTimeChange(e.target.value)}
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
  );
};