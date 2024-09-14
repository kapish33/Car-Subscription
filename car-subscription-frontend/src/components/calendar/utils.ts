import { addDays } from "date-fns";
import { Subscriber } from "./types";

export const getServiceTypeColor = (serviceType: string) => {
  switch (serviceType) {
    case "Interior":
      return "bg-blue-500"; // Customize color for Interior
    case "Exterior":
      return "bg-green-500"; // Customize color for Exterior
    case "Complete":
      return "bg-purple-500"; // Customize color for Complete
    default:
      return "bg-gray-500"; // Default color
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-500";
    case "Paused":
      return "bg-yellow-500";
    case "Cancelled":
      return "bg-red-500";
    default:
      return "bg-blue-500";
  }
};


export const generateEvents = (startDate: string,subscriber: Subscriber) => {
    const events = []
    let currentDate = new Date(startDate)

    // Calculate the end date to cover the next 28 days
    const endDate = addDays(new Date(startDate), 28)

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()
      const isSaturday = dayOfWeek === 6 // Saturday

      if (isSaturday) {
        // Add event for Saturday as "Off"
        events.push({
          title: 'Off',
          start: addDays(currentDate, 1).toISOString().split('T')[0],
          classNames: ['bg-gray-300', 'text-gray-700'],
          allDay: true,
          extendedProps: {
            description: 'No service on Saturdays'
          }
        })
      } else {
        // Add events based on schedule for non-Saturdays
        const scheduleForDate = subscriber?.schedule

        scheduleForDate && scheduleForDate.forEach((schedule) => {
          events.push({
            title: `${schedule.serviceType} Cleaning (${schedule.timeSlot})`,
            start: addDays(currentDate, 1).toISOString().split('T')[0],
            classNames: [getServiceTypeColor(schedule.serviceType), 'text-white'],
            allDay: true,
            extendedProps: {
              description: `Service: ${schedule.serviceType}, Time Slot: ${schedule.timeSlot}`,
            }
          })
        })
      }

      currentDate = addDays(currentDate, 1)
    }

    return events
  }