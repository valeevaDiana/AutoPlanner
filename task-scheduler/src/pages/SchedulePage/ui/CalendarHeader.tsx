import React from 'react';
import { useTheme } from '../../../shared/lib/contexts';
import { useWeekNavigation } from '../../../shared/lib/hooks/useWeekNavigation';
import { DAYS } from './Calendar.hooks';

export const CalendarHeader: React.FC = () => {
  const { currentTheme } = useTheme();
  const { weekDates, formatDate } = useWeekNavigation();

  return (
    <div className="calendar-header" style={{
      display: 'grid',
      gridTemplateColumns: '100px repeat(7, 1fr)',
      gap: '1px',
      backgroundColor: currentTheme.colors.border,
      border: `1px solid ${currentTheme.colors.border}`,
      borderBottom: 'none'
    }}>
      <div style={{
        padding: '10px',
        backgroundColor: currentTheme.colors.calendarHeader,
        fontWeight: '600',
        color: currentTheme.colors.text
      }}>
        Время
      </div>
      
      {weekDates.map((date, index) => (
        <div 
          key={index} 
          style={{
            padding: '10px',
            backgroundColor: currentTheme.colors.calendarHeader,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60px'
          }}
        >
          <div style={{ 
            fontWeight: '600',
            color: currentTheme.colors.text
          }}>
            {DAYS[index]}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: currentTheme.colors.textSecondary, 
            marginTop: '2px' 
          }}>
            {formatDate(date)}
          </div>
        </div>
      ))}
    </div>
  );
};