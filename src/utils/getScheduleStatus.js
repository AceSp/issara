function getScheduleStatus(schedule) {
  const now = new Date();
  
  // Days of the week in English and their Thai equivalents
  const daysEnglish = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const daysThai = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัสบดี", "วันศุกร์", "วันเสาร์"];
  
  const todayIndex = now.getDay();
  const currentDay = daysEnglish[todayIndex];
  
  // Current time in "HH:mm" format
  const currentTime = now.toTimeString().slice(0, 5);
  
  // Function to find the next open period
  function findNextOpening() {
    for (let offset = 0; offset < 7; offset++) {
      const dayIndex = (todayIndex + offset) % 7;
      const day = daysEnglish[dayIndex];
      const thaiDay = daysThai[dayIndex];
      const daySchedule = schedule[day] || [];
      
      for (const { opens } of daySchedule) {
        if (offset === 0 && opens > currentTime) {
          return { day: thaiDay, time: opens };
        } else if (offset > 0) {
          return { day: thaiDay, time: opens };
        }
      }
    }
    return null; // No openings found
  }
  
  // Check today's schedule
  const todaySchedule = schedule[currentDay] || [];
  for (const { opens, closes } of todaySchedule) {
    if (currentTime >= opens && currentTime <= closes) {
      return { 
        isOpen: true, 
        next: { day: daysThai[todayIndex], time: closes }
      };
    }
  }
  
  // If not open, find the next opening time
  const nextOpening = findNextOpening();
  if (nextOpening) {
    return {
      isOpen: false,
      next: nextOpening
    };
  }
  
  // If no schedule is found
  return { isOpen: false, next: null };
}

export default getScheduleStatus;