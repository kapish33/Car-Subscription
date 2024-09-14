import { useEffect, useState } from 'react'
import axiosInstance from '@/utils/constants'
import { useParams } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { format } from 'date-fns'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Calendar, Car, Package, User, ChevronDown, ChevronUp } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { generateEvents, getServiceTypeColor, getStatusColor } from '@/components/calendar/utils'
import { Subscriber } from '@/components/calendar/types'

export default function SubscriberById() {
  const { id } = useParams<{ id: string }>()
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInfoExpanded, setIsInfoExpanded] = useState(false)

  useEffect(() => {
    const fetchSubscriber = async () => {
      try {
        const { data } = await axiosInstance.get(`/subscription/${id}`)
        setSubscriber(data.responseObject)
        console.log("data.responseObject", data.responseObject)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch subscriber')
        setLoading(false)
      }
    }

    if (id) {
      fetchSubscriber()
    }
  }, [id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-4 w-[300px]" />
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error || !subscriber) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || 'Subscriber not found'}
        </AlertDescription>
      </Alert>
    )
  }

  const events = generateEvents(subscriber.startDate, subscriber)

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <span className="mb-2 sm:mb-0">{subscriber.user.firstName} {subscriber.user.lastName}'s Schedule</span>
            <Badge className={getStatusColor(subscriber.status)}>{subscriber.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="sm:hidden">
            <Button
              variant="outline"
              className="w-full mb-4"
              onClick={() => setIsInfoExpanded(!isInfoExpanded)}
            >
              {isInfoExpanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" /> Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" /> Show Details
                </>
              )}
            </Button>
          </div>
          <div className={`grid grid-cols-1 gap-4 ${isInfoExpanded ? '' : 'hidden sm:grid sm:grid-cols-2'}`}>
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span className="text-sm">{subscriber.user.email}</span>
            </div>
            <div className="flex items-center">
              <Car className="mr-2 h-4 w-4" />
              <span className="text-sm">{subscriber.carType}</span>
            </div>
            <div className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              <span className="text-sm">{subscriber.planType} Plan</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="text-sm">Started on {format(new Date(subscriber.startDate), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Cleaning Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev next today',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              events={events}
              eventContent={({ event }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start px-2 py-1 h-auto text-xs sm:text-sm">
                      {event.title}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 sm:w-80">
                    <div className="space-y-2">
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm">{event.extendedProps.description}</p>
                      <Badge className={getServiceTypeColor(event.extendedProps.serviceType)}>
                        {event.extendedProps.serviceType}
                      </Badge>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              height="auto"
              contentHeight="auto"
              aspectRatio={1.35}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}