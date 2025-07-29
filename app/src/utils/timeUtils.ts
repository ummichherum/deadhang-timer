/**
 * Format time in seconds to MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "02:30")
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(Math.abs(seconds) / 60);
  const remainingSeconds = Math.abs(seconds) % 60;
  
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = Math.floor(remainingSeconds).toString().padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
};

/**
 * Format time with milliseconds for precise display
 * @param seconds - Time in seconds (can include decimals)
 * @returns Formatted time string with tenths (e.g., "02:30.5")
 */
export const formatTimeWithTenths = (seconds: number): string => {
  const minutes = Math.floor(Math.abs(seconds) / 60);
  const remainingSeconds = Math.abs(seconds) % 60;
  const tenths = Math.floor((remainingSeconds % 1) * 10);
  
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = Math.floor(remainingSeconds).toString().padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}.${tenths}`;
};

/**
 * Convert MM:SS string to seconds
 * @param timeString - Time string in MM:SS format
 * @returns Time in seconds
 */
export const parseTimeString = (timeString: string): number => {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
};

/**
 * Format duration for human readable display
 * @param seconds - Duration in seconds
 * @returns Human readable duration (e.g., "2 Min 30 Sek")
 */
export const formatDuration = (seconds: number): string => {
  const absSeconds = Math.abs(seconds);
  const minutes = Math.floor(absSeconds / 60);
  const remainingSeconds = Math.floor(absSeconds % 60);
  
  if (minutes === 0) {
    return `${remainingSeconds} Sek`;
  }
  
  if (remainingSeconds === 0) {
    return `${minutes} Min`;
  }
  
  return `${minutes} Min ${remainingSeconds} Sek`;
};

/**
 * Calculate percentage progress between two time points
 * @param current - Current time
 * @param total - Total duration
 * @returns Percentage (0-100)
 */
export const calculateTimeProgress = (current: number, total: number): number => {
  if (total <= 0) return 0;
  return Math.max(0, Math.min(100, ((total - current) / total) * 100));
}; 