// src/components/SubscriberById.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/constants'; // Adjust import based on your setup
import { useParams } from 'react-router-dom';

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

const SubscriberById: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [subscriber, setSubscriber] = useState<Subscriber | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriber = async () => {
      try {
        const { data } = await axiosInstance.get(`/subscription/${id}`); // Adjust the endpoint based on your API
        setSubscriber(data.responseObject); // Adjust based on your API response structure
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch subscriber');
        setLoading(false);
      }
    };

    if (id) {
      fetchSubscriber();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!subscriber) return <p>Subscriber not found</p>;

  return (
    <section>
      {/* Here we need to show data of subscriber */}
    </section>
  );
};

export default SubscriberById;
