import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import { CircleUser, Menu, Package2 } from "lucide-react";

import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
// import { Input } from "@components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet";
import useScrollVisibility from "@hooks/useScrollVisibility";
import { cn } from "@lib/utils";
import axiosInstance from "@utils/constants";

export default function Dashboard() {
  const isVisible = useScrollVisibility();
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      // Attempt to clear cookies by making a GET request to the server
      await axiosInstance.get("/users/clear/cookies/all");
      // Navigate to the home page after successfully clearing cookies
      navigate("/");
    } catch (error) {
      // Handle any errors that occur during the request
      console.error("Failed to clear cookies:", error);
      // Optionally show an error message to the user
      alert("Failed to clear cookies. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header
        className={cn(
          "sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6",
          {
            "transform translate-y-0": isVisible,
            "transform -translate-y-full": !isVisible,
          }
        )}
      >
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <NavLink
            to="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Kapish</span>
          </NavLink>
          <NavLink
            to="/dashboard/subscriptions"
            className={({ isActive }) =>
              isActive
                ? "text-foreground transition-colors hover:text-foreground"
                : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Subscriptions
          </NavLink>
          <NavLink
            to="/dashboard/schedule"
            className={({ isActive }) =>
              isActive
                ? "text-foreground transition-colors hover:text-foreground"
                : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            Schedule
          </NavLink>
          <NavLink
            to="/dashboard/create-user"
            className={({ isActive }) =>
              isActive
                ? "text-foreground transition-colors hover:text-foreground"
                : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            User
          </NavLink>
          <NavLink
            to="/dashboard/all-schedule"
            className={({ isActive }) =>
              isActive
                ? "text-foreground transition-colors hover:text-foreground"
                : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            AllSubscribers
          </NavLink>
          {/* <NavLink
            to="/dashboard/details-schedule/:id"
            className={({ isActive }) =>
              isActive ? "text-foreground transition-colors hover:text-foreground" : "text-muted-foreground transition-colors hover:text-foreground"
            }
          >
            ScheduleID
          </NavLink> */}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                to="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Kapish</span>
              </Link>
              <NavLink
                to="/dashboard/subscriptions"
                className={({ isActive }) =>
                  isActive
                    ? "hover:text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                Subscriptions
              </NavLink>
              <NavLink
                to="/dashboard/schedule"
                className={({ isActive }) =>
                  isActive
                    ? "hover:text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                Schedule
              </NavLink>
              <NavLink
                to="/dashboard/create-user"
                className={({ isActive }) =>
                  isActive
                    ? "hover:text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                User
              </NavLink>
              <NavLink
                to="/dashboard/all-schedule"
                className={({ isActive }) =>
                  isActive
                    ? "hover:text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }
              >
                AllSubscribers
              </NavLink>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              /> */}
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
              {/* <DropdownMenuSeparator /> */}
              {/* <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={handleClick}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 ">
        <Outlet />
      </main>
    </div>
  );
}
