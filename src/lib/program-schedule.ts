
export interface ProgramSlot {
  name: string;
  startHourIST: number; // 0-23
  startMinuteIST: number; // 0-59
  endHourIST: number; // 0-23
  endMinuteIST: number; // 0-59
  displayTime: string; // For the programs page, e.g., "06:00 AM - 07:59 AM"
}

export const programSchedule: ProgramSlot[] = [
  { name: "Rangies/Songs", startHourIST: 0, startMinuteIST: 0, endHourIST: 5, endMinuteIST: 59, displayTime: "12:00 AM - 05:59 AM" },
  { name: "Bhajans", startHourIST: 6, startMinuteIST: 0, endHourIST: 7, endMinuteIST: 59, displayTime: "06:00 AM - 07:59 AM" },
  { name: "Old songs/ Folk Songs", startHourIST: 8, startMinuteIST: 0, endHourIST: 9, endMinuteIST: 59, displayTime: "08:00 AM - 09:59 AM" },
  { name: "Ragnies", startHourIST: 10, startMinuteIST: 0, endHourIST: 11, endMinuteIST: 59, displayTime: "10:00 AM - 11:59 AM" },
  { name: "Songs", startHourIST: 12, startMinuteIST: 0, endHourIST: 13, endMinuteIST: 59, displayTime: "12:00 PM - 01:59 PM" },
  { name: "Rangkaat/Upratali Ragnies", startHourIST: 14, startMinuteIST: 0, endHourIST: 15, endMinuteIST: 59, displayTime: "02:00 PM - 03:59 PM" },
  { name: "New Songs", startHourIST: 16, startMinuteIST: 0, endHourIST: 17, endMinuteIST: 59, displayTime: "04:00 PM - 05:59 PM" },
  { name: "Bhajans", startHourIST: 18, startMinuteIST: 0, endHourIST: 19, endMinuteIST: 59, displayTime: "06:00 PM - 07:59 PM" },
  { name: "Farmaish", startHourIST: 20, startMinuteIST: 0, endHourIST: 21, endMinuteIST: 59, displayTime: "08:00 PM - 09:59 PM" },
  { name: "Kissa/Saang", startHourIST: 22, startMinuteIST: 0, endHourIST: 23, endMinuteIST: 59, displayTime: "10:00 PM - 11:59 PM" },
];

export function getCurrentProgram(schedule: ProgramSlot[], istHour: number, istMinute: number): ProgramSlot | null {
  for (const slot of schedule) {
    const slotStartTimeInMinutes = slot.startHourIST * 60 + slot.startMinuteIST;
    const slotEndTimeInMinutes = slot.endHourIST * 60 + slot.endMinuteIST;
    const currentTimeInMinutes = istHour * 60 + istMinute;

    if (slotStartTimeInMinutes <= currentTimeInMinutes && currentTimeInMinutes <= slotEndTimeInMinutes) {
      return slot;
    }
  }
  // Fallback if somehow current time is not in any slot (should not happen with a full schedule)
  // Or handle specific case for schedule like 00:00 - 05:59
  const midnightSlot = schedule.find(s => s.startHourIST === 0 && s.endHourIST === 5); // Example of specific handling for midnight
  if (midnightSlot && istHour >= 0 && istHour <= 5) {
    return midnightSlot;
  }
  return null; // Or a default program name
}
