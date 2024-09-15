import { addDays, format } from "date-fns";
import { Subscriber } from "./types";
import { v4 as uuidv4 } from "uuid";

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



// Function to convert time slot to start and end times
const parseTimeSlot = (timeSlot: string, date: Date) => {
  const [startTime, endTime] = timeSlot.split("-");
  const [startHour, startMinute] = startTime.trim().split(" ");
  const [endHour, endMinute] = endTime.trim().split(" ");

  // Convert 12-hour time format to 24-hour format
  const formatTime = (hour: string, period: string) => {
    let hour24 = parseInt(hour, 10);
    if (period === "PM" && hour24 < 12) hour24 += 12;
    if (period === "AM" && hour24 === 12) hour24 = 0;
    return hour24;
  };

  const startHour24 = formatTime(startHour, startMinute);
  const endHour24 = formatTime(endHour, endMinute+1);

  // Create start and end DateTime
  const startDateTime = new Date(date);
  startDateTime.setHours(startHour24, 0);

  const endDateTime = new Date(date);
  endDateTime.setHours(endHour24, 0);

  return { start: startDateTime, end: endDateTime };
};

const getNext30DaysExcludingSaturdays = () => {
  const today = new Date();
  const days = [];
  let count = 0;

  while (count < 30) {
    if (today.getDay() !== 6) {
      // 6 is Saturday
      days.push(format(today, "yyyy-MM-dd"));
      count++;
    }
    today.setDate(today.getDate() + 1);
  }

  return days;
};

export const generateAdminEvents = (subscribers: Subscriber[]) => {
  const validDays = getNext30DaysExcludingSaturdays();
  const validDaysSet = new Set(validDays);

  return subscribers.flatMap((subscriber) =>
    subscriber.schedule.flatMap((schedule) => {
      const scheduleDate = new Date(schedule.date);
      const events = [];
      let currentDate = scheduleDate;

      // Loop through each day in the range for the given schedule
      while (currentDate <= addDays(scheduleDate, 28)) {
        const formattedDate = format(currentDate, "yyyy-MM-dd");

        if (validDaysSet.has(formattedDate)) {
          const dayOfWeek = currentDate.getDay();
          const isSaturday = dayOfWeek === 6; // Saturday

          if (!isSaturday) {
            // Parse time slot
            const { start, end } = parseTimeSlot(
              schedule.timeSlot,
              currentDate
            );

            // Add event for non-Saturdays
            events.push({
              id: uuidv4(),
              title: `${subscriber.user.firstName} ${subscriber.user.lastName} - ${schedule.serviceType}`,
              start: start.toISOString(),
              end: end.toISOString(),
              backgroundColor: getStatusColor(subscriber.status),
              borderColor: getStatusColor(subscriber.status),
              textColor: "#ffffff",
              extendedProps: {
                serviceType: schedule.serviceType,
                description: `${subscriber.user.firstName} ${subscriber.user.lastName} (${subscriber.carType}) - ${schedule.timeSlot}`,
              },
            });
          }
        }

        currentDate = addDays(currentDate, 1);
      }

      return events;
    })
  );
};

export const generateEvents = (startDate: string, subscriber: Subscriber) => {
  const events = [];
  let currentDate = new Date(startDate);
  const planType = subscriber.planType;
  // Calculate the end date to cover the next 28 days
  const endDate = addDays(new Date(startDate), 28);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const isSaturday = dayOfWeek === 6; // Saturday

    if (isSaturday) {
      events.push({
        id: uuidv4(),
        title: "Off",
        start: format(addDays(currentDate, 1), 'yyyy-MM-dd'),
        classNames: ["bg-gray-300", "text-gray-700"],
        allDay: true,
        extendedProps: {
          description: "No service on Saturdays",
        },
      });
    } else {
      const scheduleForDate = subscriber?.schedule;

      scheduleForDate && scheduleForDate.forEach((schedule) => {
        const { start, end } = parseTimeSlot(schedule.timeSlot, currentDate);

        if (planType === "Daily" || (planType === "Alternate" && (currentDate.getDate() % 2 === 0))) {
          events.push({
            id: uuidv4(),
            title: `${schedule.serviceType} Cleaning (${schedule.timeSlot})`,
            start: start.toISOString(),
            end: end.toISOString(),
            backgroundColor: getServiceTypeColor(schedule.serviceType),
            borderColor: getServiceTypeColor(schedule.serviceType),
            textColor: '#ffffff',
            extendedProps: {
              description: `Service: ${schedule.serviceType}, Time Slot: ${schedule.timeSlot}`,
            },
          });
        }
      });

      // For "Alternate" plan, add "Off" day after each service day
      if (planType === "Alternate") {
        currentDate = addDays(currentDate, 1);
        events.push({
          id: uuidv4(),
          title: "Off",
          start: format(addDays(currentDate, 1), 'yyyy-MM-dd'),
          classNames: ["bg-gray-300", "text-gray-700"],
          allDay: true,
          extendedProps: {
            description: "No service on Saturdays",
          },
        });
      }
    }

    // Move to the next day
    currentDate = addDays(currentDate, 1);
  }

  return events;
};