// src/components/AllSubscribers.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/constants'; // Adjust import based on your setup
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Adjust imports based on your component library
import { Link } from 'react-router-dom';
import moment from 'moment'; // Import Moment.js

type Subscriber = {
  _id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  carType: string;
  planType: string;
  startDate: string;
  schedule: Array<{
    date: string;
    serviceType: string;
    timeSlot: string;
  }>;
  status: string;
};

const AllSubscribers: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const { data } = await axiosInstance.get('/subscription'); // Adjust the endpoint based on your API
        setSubscribers(data.responseObject); // Adjust based on your API response structure
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch subscribers');
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {subscribers.map((subscriber) => (
        <Link
          key={subscriber._id}
          to={`/dashboard/details-schedule/${subscriber._id}`}
          className="no-underline"
        >
          <Card className="w-full max-w-sm mx-auto cursor-pointer">
            <CardHeader>
              <CardTitle>{`${subscriber.user.firstName} ${subscriber.user.lastName}`}</CardTitle>
              <CardDescription>
                {`${subscriber.carType} - ${subscriber.planType}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong>Start Date:</strong> {moment(subscriber.startDate).format('MMMM Do YYYY')}</p>
              <p><strong>Status:</strong> {subscriber.status}</p>
              <div>
                <strong>Schedule:</strong>
                <ul>
                  {subscriber.schedule.map((item, index) => (
                    <li key={index}>
                      {moment(item.date).format('MMMM Do YYYY')} - {item.serviceType} ({item.timeSlot})
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default AllSubscribers;
