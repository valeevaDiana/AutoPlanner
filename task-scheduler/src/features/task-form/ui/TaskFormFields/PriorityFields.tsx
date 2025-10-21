import React from 'react';
import { useTheme } from '../../../../shared/lib/contexts';

interface PriorityFieldsProps {
  priority: 'low' | 'medium' | 'high';
  isViewMode: boolean;
  onPriorityChange: (priority: 'low' | 'medium' | 'high') => void;
}

export const PriorityFields: React.FC<PriorityFieldsProps> = ({
  priority,
  isViewMode,
  onPriorityChange,
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
        Приоритет:
      </label>
      <div style={{ display: 'flex', gap: '15px' }}>
        {(['low', 'medium', 'high'] as const).map((prio) => (
          <button
            key={prio}
            type="button"
            onClick={() => !isViewMode && onPriorityChange(prio)}
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
  );
};