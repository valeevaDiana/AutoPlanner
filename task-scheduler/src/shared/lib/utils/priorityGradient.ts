export const getPriorityColor = (priority: number, lowColor: string, highColor: string): string => {
  const normalizedPriority = Math.max(1, Math.min(10, priority));
  
  const progress = (normalizedPriority - 1) / 9;
  
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  };
  
  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };
  
  const startRgb = hexToRgb(lowColor);
  const endRgb = hexToRgb(highColor);
  
  const r = startRgb[0] + (endRgb[0] - startRgb[0]) * progress;
  const g = startRgb[1] + (endRgb[1] - startRgb[1]) * progress;
  const b = startRgb[2] + (endRgb[2] - startRgb[2]) * progress;
  
  return rgbToHex(r, g, b);
};

export const getContrastColor = (backgroundColor: string): string => {
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
};