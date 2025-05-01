import { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  CircleUser,
  Home,
  Menu,
  Package2,
  Settings2,


} from "lucide-react"
import { clsx } from "clsx";

const navigationMobile = [
  {
    name: "Dashboard",
    href: "dashboard",
    icon: Home,
    current: true,
  },
  { name: "Settings", href: "settings", icon: Settings2 },
];
export default function NavbarMobile(){
  let location = useLocation();
  const navigate = useNavigate();
  const pageTitle = location.pathname.split("/")[1];
  if (location.pathname === "/login") {
    showApplicationLayout = false;
  }
  useEffect(() => {
    if (pageTitle) {
      navigate(pageTitle);
    } else {
      navigate(navigationMobile[0].href);
    }
  }, []);
    return(
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
      <SheetContent side="left" className="flex flex-col w-[250px]">
        <nav className="grid gap-2 text-lg font-medium">
          <a
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Plugin Name</span>
          </a>
          {navigationMobile.map((item, index) => {
            return <NavLink
              to={item.href}
              key={index}
              className={
                clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary",
                  item.href === pageTitle
                    ? "text-primary bg-muted"
                    : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          })}


        </nav>

      </SheetContent>
    </Sheet>
    )
}