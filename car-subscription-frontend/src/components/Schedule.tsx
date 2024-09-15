"use client";

import { useEffect, useState } from "react";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Label } from "@components/ui/label";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Calendar } from "@components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { CalendarIcon, PlusIcon, TrashIcon } from "lucide-react";
import { format } from "date-fns";
import axiosInstance from "@utils/constants";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@hooks/use-toast";

// Validation schema using Yup
const validationSchema = yup.object().shape({
  user: yup.string().required("User is required"),
  carType: yup.string().required("Car type is required"),
  planType: yup.string().required("Plan type is required"),
  startDate: yup.date().required("Start date is required"),
  schedule: yup
    .array()
    .of(
      yup.object().shape({
        date: yup.date().required("Service date is required"),
        serviceType: yup.string().required("Service type is required"),
        timeSlot: yup.string().required("Time slot is required"),
      })
    )
    .min(1, "At least one schedule item is required"),
  status: yup.string().required("Status is required"),
});

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  userType: string;
};

type FormData = {
  user: string;
  carType: string;
  planType: string;
  startDate: Date;
  schedule: Array<{
    date: Date | undefined;
    serviceType: string;
    timeSlot: string; // Add timeSlot to the FormData type
  }>;
  status: string;
};

const fetchUser = async (
  callBack: React.Dispatch<React.SetStateAction<User[]>>
) => {
  const {
    data: { responseObject },
  } = await axiosInstance.get("/users");
  callBack(responseObject as User[]);
};

export default function Scheduler() {
  const [users, setUsers] = useState<Array<User>>([]);
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      schedule: [{ date: undefined, serviceType: "", timeSlot: "" }], // Default schedule array
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule", // This binds the schedule array to the form
  });

  useEffect(() => {
    fetchUser(setUsers);
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axiosInstance.post("/subscription/create", data);
      if (response.data.success) {
        toast({
          variant: "default",
          title: "Success",
          description: "Subscription created successfully",
          duration: 1000,
        });
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Car Service Subscription</CardTitle>
        <CardDescription>
          Enter the details to create a car service subscription.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Controller
              name="user"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.firstName} {user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.user && <p className="text-red-500">User is required</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="carType">Car Type</Label>
            <Controller
              name="carType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
                  <SelectTrigger id="carType">
                    <SelectValue placeholder="Select car type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hatchback">Hatchback</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="CSUV">CSUV</SelectItem>
                    <SelectItem value="SUV">SUV</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.carType && (
              <p className="text-red-500">Car type is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Plan Type</Label>
            <Controller
              name="planType"
              control={control}
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Daily" id="Daily" />
                    <Label htmlFor="Daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Alternate" id="Alternate" />
                    <Label htmlFor="Alternate">Alternate</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.planType && (
              <p className="text-red-500">Plan type is required</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !field.value && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.startDate && (
              <p className="text-red-500">Start date is required</p>
            )}
          </div>

          {/* Schedule items */}
          <div className="space-y-2">
            <Label>Schedule</Label>
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Controller
                  name={`schedule.${index}.date`}
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !field.value && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                <Controller
                  name={`schedule.${index}.serviceType`}
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Service Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Interior">Interior</SelectItem>
                        <SelectItem value="Exterior">Exterior</SelectItem>
                        <SelectItem value="Complete">Complete</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Controller
                  name={`schedule.${index}.timeSlot`}
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Time Slot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6-8 AM">6-8 AM</SelectItem>
                        <SelectItem value="8-10 AM">8-10 AM</SelectItem>
                        <SelectItem value="10-12 AM">10-12 AM</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {errors.schedule && (
              <p className="text-red-500">Schedule is required</p>
            )}
            <Button
              className="ml-2"
              variant="outline"
              onClick={() => append({ date: undefined, serviceType: "", timeSlot: "" })}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add schedule
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Paused">Paused</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="text-red-500">Status is required</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Submit</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
