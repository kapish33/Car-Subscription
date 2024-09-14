import { useEffect, useState } from 'react'
import axiosInstance from '@/utils/constants'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pagination } from '@/components/ui/pagination'
import { Link } from 'react-router-dom'
import { Search, Calendar, Car, Package } from 'lucide-react'
import moment from 'moment'
import Error from '@/components/common/Error'
import Loading from '@/components/common/Loading'

type Subscriber = {
  _id: string
  user: {
    firstName: string
    lastName: string
    email: string
  }
  carType: string
  planType: string
  startDate: string
  schedule: Array<{
    date: string
    serviceType: string
    timeSlot: string
  }>
  status: string
}

const ITEMS_PER_PAGE = 8

export default function AllSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const { data } = await axiosInstance.get('/subscription')
        setSubscribers(data.responseObject)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch subscribers')
        setLoading(false)
      }
    }

    fetchSubscribers()
  }, [])

  const filteredSubscribers = subscribers.filter((subscriber) =>
    `${subscriber.user.firstName} ${subscriber.user.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const paginatedSubscribers = filteredSubscribers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(filteredSubscribers.length / ITEMS_PER_PAGE)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500'
      case 'paused':
        return 'bg-yellow-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error error={error} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Subscribers</h1>
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedSubscribers.map((subscriber) => (
          <Card key={subscriber._id} className="w-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{`${subscriber.user.firstName} ${subscriber.user.lastName}`}</span>
                <Badge className={`${getStatusColor(subscriber.status)} text-white`}>
                  {subscriber.status}
                </Badge>
              </CardTitle>
              <CardDescription>{subscriber.user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Car className="mr-2 h-4 w-4" />
                  <span>{subscriber.carType}</span>
                </div>
                <div className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  <span>{subscriber.planType}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>{moment(subscriber.startDate).format('MMMM Do YYYY')}</span>
                </div>
              </div>
              <div className="mt-4">
                <strong>Next Service:</strong>
                {subscriber.schedule[0] && (
                  <div className="bg-gray-100 p-2 rounded mt-2">
                    <p>{moment(subscriber.schedule[0].date).format('MMMM Do YYYY')}</p>
                    <p>{subscriber.schedule[0].serviceType} - {subscriber.schedule[0].timeSlot}</p>
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild>
                  <Link to={`/dashboard/details-schedule/${subscriber._id}`}>
                    View
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to={`/dashboard/edit-subscriber/${subscriber._id}`}>
                    Edit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}