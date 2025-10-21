import React from 'react';
import { useTheme } from '../../../../shared/lib/contexts';

interface TimeConstraintsFieldsProps {
  hasSpecificTime: boolean;
  specificStartTime: string;
  specificEndTime: string;
  hasPossibleTime: boolean;
  possibleStartTime: string;
  possibleEndTime: string;
  isViewMode: boolean;
  onHasSpecificTimeChange: (checked: boolean) => void;
  onSpecificStartTimeChange: (value: string) => void;
  onSpecificEndTimeChange: (value: string) => void;
  onHasPossibleTimeChange: (checked: boolean) => void;
  onPossibleStartTimeChange: (value: string) => void;
  onPossibleEndTimeChange: (value: string) => void;
}

export const TimeConstraintsFields: React.FC<TimeConstraintsFieldsProps> = ({
  hasSpecificTime,
  specificStartTime,
  specificEndTime,
  hasPossibleTime,
  possibleStartTime,
  possibleEndTime,
  isViewMode,
  onHasSpecificTimeChange,
  onSpecificStartTimeChange,
  onSpecificEndTimeChange,
  onHasPossibleTimeChange,
  onPossibleStartTimeChange,
  onPossibleEndTimeChange,
}) => {
  const { currentTheme } = useTheme();

  return (
    <>
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
            onChange={(e) => !isViewMode && onHasSpecificTimeChange(e.target.checked)}
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
                  onChange={(e) => onSpecificStartTimeChange(e.target.value)}
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
                  onChange={(e) => onSpecificEndTimeChange(e.target.value)}
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
            onChange={(e) => !isViewMode && onHasPossibleTimeChange(e.target.checked)}
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
                  onChange={(e) => onPossibleStartTimeChange(e.target.value)}
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
                  onChange={(e) => onPossibleEndTimeChange(e.target.value)}
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
    </>
  );
};