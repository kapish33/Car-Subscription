"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Alert, AlertDescription } from "@components/ui/alert";
import { Link } from "react-router-dom";
import axiosInstance from "@utils/constants";
import { faker } from "@faker-js/faker";
import { toast } from "@hooks/use-toast";

// Define the schema for validation using Yup
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  age: yup
    .number()
    .required("Age is required")
    .positive("Age must be a positive number")
    .integer("Age must be an integer"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

interface SignupData {
  firstName: string;
  lastName: string;
  age: number;
  password: string;
  email: string;
}

export default function CreateUser() {
  const [showPassword, setShowPassword] = useState(false);
  // const navigate = useNavigate(); // Initialize useNavigate


  // Use React Hook Form with default values
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Method to set values programmatically
  } = useForm<SignupData>({
    resolver: yupResolver(schema),
    mode: "all",
  });

  useEffect(() => {
    // Set default values using faker
    setValue("firstName", faker.name.firstName());
    setValue("lastName", faker.name.lastName());
    setValue("age", faker.number.int({ min: 18, max: 99 }));
    setValue("email", faker.internet.email());
    setValue("password", faker.internet.password());
  }, [setValue]);

  const onSubmit = async (data: SignupData) => {
    try {
      const response = await axiosInstance.post("/users/create", data);
      if(response.data.success){
        toast({
          variant: "default",
          title: "Success",
          description: "User created successfully",
          duration: 1000,
        });
      }
      // navigate("/success"); 
      // Handle success, e.g., redirect or display a success message
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle error, e.g., display an error message to the user
    }
  };

  return (
    <section className="md:mt-16 mt-10 p-2">
      <Card className="w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Fake User Creator</CardTitle>
            <CardDescription>
              Create your fake account by filling in the information below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  {errors.firstName?.message ||
                    errors.lastName?.message ||
                    errors.age?.message ||
                    errors.email?.message ||
                    errors.password?.message}
                </AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...register("firstName")} required />
                {errors.firstName && (
                  <p className="text-red-600 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...register("lastName")} required />
                {errors.lastName && (
                  <p className="text-red-600 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" {...register("age")} required />
              {errors.age && (
                <p className="text-red-600 text-sm">{errors.age.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} required />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm">
                  {errors.password.message}
                </p>
              )}
              <CardDescription>
                <Link className={"underline"} to="/sign-in">
                  Already a member? Sign in here
                </Link>
              </CardDescription>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Sign Up
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
