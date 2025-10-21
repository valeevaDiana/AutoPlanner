import React from 'react';
import { useTheme } from '../../../../shared/lib/contexts';

interface DateFieldsProps {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isViewMode: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export const DateFields: React.FC<DateFieldsProps> = ({
  startDate,
  endDate,
  startTime,
  endTime,
  isViewMode,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
}) => {
  const { currentTheme } = useTheme();

  return (
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
          <div style={{ fontSize: '14px', color: currentTheme.colors.textSecondary, marginBottom: '5px' }}>
            Начать с:
          </div>
          <div className="date-group" style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
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
              onChange={(e) => onStartTimeChange(e.target.value)}
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
          <div style={{ fontSize: '14px', color: currentTheme.colors.textSecondary, marginBottom: '5px' }}>
            Закончить до:
          </div>
          <div className="date-group" style={{ display: 'flex', gap: '10px' }}>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
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
              onChange={(e) => onEndTimeChange(e.target.value)}
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
  );
};