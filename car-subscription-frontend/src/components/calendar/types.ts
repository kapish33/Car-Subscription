export type Subscriber = {
    _id: string
    user: {
      firstName: string
      lastName: string
      email: string
    }
    carType: string
    planType: 'Daily' | 'Alternate'
    startDate: string
    schedule: Array<{
      date: string
      serviceType: string
      timeSlot: string
    }>
    status: 'Active' | 'Paused' | 'Cancelled'
  }