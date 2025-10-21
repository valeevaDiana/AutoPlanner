import React from 'react';
import { useTheme } from '../../../shared/lib/contexts';
import { useWeekNavigation } from '../../../shared/lib/hooks/useWeekNavigation';

interface CalendarNavigationProps {
  onToggleView?: () => void;
}

export const CalendarNavigation: React.FC<CalendarNavigationProps> = ({ 
  onToggleView 
}) => {
  const { currentTheme } = useTheme();
  const {
    weekDates,
    nextWeek,
    prevWeek,
    goToToday,
    formatDate
  } = useWeekNavigation();

  const weekRange = `${formatDate(weekDates[0])} - ${formatDate(weekDates[6])}`;

  return (
    <div className="calendar-navigation" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '20px',
      padding: '0 10px'
    }}>
      <button
        onClick={prevWeek}
        style={{
          padding: '8px 16px',
          backgroundColor: currentTheme.colors.primary,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: '600'
        }}
      >
        ←
      </button>

      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          color: currentTheme.colors.text,
          marginBottom: '5px'
        }}>
          {weekRange}
        </div>
        <button
          onClick={goToToday}
          style={{
            padding: '4px 12px',
            backgroundColor: 'transparent',
            color: currentTheme.colors.primary,
            border: `1px solid ${currentTheme.colors.primary}`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Сегодня
        </button>
      </div>

      <button
        onClick={nextWeek}
        style={{
          padding: '8px 16px',
          backgroundColor: currentTheme.colors.primary,
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '20px',
          fontWeight: '600'
        }}
      >
        →
      </button>
    </div>
  );
};