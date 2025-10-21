import React from 'react';
import { useTheme } from '../../../../shared/lib/contexts';

interface DurationFieldsProps {
  durationDays: string;
  durationHours: string;
  durationMinutes: string;
  isViewMode: boolean;
  onDurationDaysChange: (value: string) => void;
  onDurationHoursChange: (value: string) => void;
  onDurationMinutesChange: (value: string) => void;
  totalMinutes: number;
}

export const DurationFields: React.FC<DurationFieldsProps> = ({
  durationDays,
  durationHours,
  durationMinutes,
  isViewMode,
  onDurationDaysChange,
  onDurationHoursChange,
  onDurationMinutesChange,
  totalMinutes,
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
        Длительность:
      </label>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ fontSize: '12px', color: currentTheme.colors.textSecondary }}>Дни</div>
          <input
            type="number"
            value={durationDays}
            onChange={(e) => onDurationDaysChange(e.target.value)}
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
            onChange={(e) => onDurationHoursChange(e.target.value)}
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
            onChange={(e) => onDurationMinutesChange(e.target.value)}
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
        Общая длительность: {totalMinutes} минут
      </div>
    </div>
  );
};