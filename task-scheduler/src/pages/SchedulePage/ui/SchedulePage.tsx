import React from 'react';
import { ScheduleCalendar } from './ScheduleCalendar';

export const SchedulePage: React.FC = () => {
  const handleToggleView = () => {
    alert("Переключение режима: неделя → день → месяц");
  };
  
  return (
    <div className="page-container">
      <div className="header-fixed">
        <div className="header-title-wrapper"> 
          <div className="header-title">Твой план на</div>
          <button className="week-selector" onClick={handleToggleView}>неделю</button>
        </div>
        <div className="notification-icon">🔔</div> 
      </div>

      <div className="content-wrapper">
        <ScheduleCalendar />
      </div>

      <div className="footer-fixed">
        <button className="add-button">Добавить задачу</button>
      </div>
    </div>
  );
};