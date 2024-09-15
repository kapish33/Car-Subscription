import axiosInstance from "@utils/constants";
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@components/ui/popover";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { getServiceTypeColor, generateAdminEvents } from "./calendar/utils"; // Adjust the path as needed
import Loading from "./common/Loading";
import Error from "./common/Error";
import { Subscriber } from "./calendar/types";

const Subscriptions = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get("/subscription");
        const { responseObject } = data as { responseObject: Subscriber[] };

        // Calculate total events count
        const totalEvents = responseObject.flatMap(
          (subscriber) => subscriber.schedule
        ).length;
        setCount(totalEvents);

        setSubscribers(responseObject);
      } catch (err) {
        setError("Failed to fetch subscribers");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error error={error} />;
  }

  const events = generateAdminEvents(subscribers);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Total Subscriptions: {count}</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventContent={({ event }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start px-2 py-1 h-auto"
              >
                {event.title}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className="space-y-2">
                <p className="font-semibold">{event.title}</p>
                <p>{event.extendedProps.description}</p>
                <Badge
                  className={getServiceTypeColor(
                    event.extendedProps.serviceType
                  )}
                >
                  {event.extendedProps.serviceType}
                </Badge>
              </div>
            </PopoverContent>
          </Popover>
        )}
        height="auto"
      />
    </div>
  );
};

export default Subscriptions;
