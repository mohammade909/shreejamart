import { parseISO, differenceInDays, format } from 'date-fns';

export function formatDateTime(dateTime) {
  try {
    // Check if dateTime is null or undefined
    if (!dateTime) {
      return '';
    }

    // If dateTime is already a Date object, don't parse it
    const givenDate = dateTime instanceof Date ? dateTime : parseISO(dateTime);
    
    // Validate if the date is valid
    if (isNaN(givenDate.getTime())) {
      return '';
    }

    const now = new Date();

    // Calculate the difference in days
    const differenceInDay = differenceInDays(now, givenDate);

    // Format the time part
    const time = format(givenDate, 'hh:mm a'); // e.g., "11:03 AM"

    if (differenceInDay === 0) {
      return `Today at ${time}`;
    } else if (differenceInDay === 1) {
      return `Yesterday at ${time}`;
    } else {
      return `${differenceInDay} days ago at ${time}`;
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}