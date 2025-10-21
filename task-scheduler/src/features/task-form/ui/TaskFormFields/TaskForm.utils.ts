export const minutesToDuration = (totalMinutes: number) => {
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
};

export const durationToMinutes = (days: number, hours: number, minutes: number) => {
  return days * 24 * 60 + hours * 60 + minutes;
};

export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

export const getDateByDayOfWeek = (dayOfWeek: number) => {
  const today = new Date();
  const currentDay = today.getDay(); // 0-6 (ВС-СБ)
  
  const jsDayOfWeek = dayOfWeek === 6 ? 0 : dayOfWeek + 1;
  
  const diff = jsDayOfWeek - currentDay;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);
  
  return targetDate.toISOString().split('T')[0];
};