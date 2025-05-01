import { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
  import {
    Home,
    Megaphone,
    Users,
    LineChart,
    TrendingUp,
    Settings2,
    FileText,
    Mail
  } from "lucide-react";
  import { clsx } from "clsx";
  const navigation = [
    { name: "Dashboard", href: "dashboard", icon: Home }, // Overview
    { name: "Settings", href: "settings", icon: Settings2 }, // Gear icon with variation
                        // For documentation
  ];
  export default function Navbar() {
    let location = useLocation();
    const navigate = useNavigate();
    const pageTitle = location.pathname.split("/")[1];
   
    useEffect(() => {
      if (pageTitle) {
        navigate(pageTitle);
      } else {
        navigate(navigation[0].href);
      }
    }, []);
  
    return (
      <div className="w-full flex items-center h-full justify-between">
        <a href="#/dashboard" className="flex items-center gap-2 font-semibold">
                {/* <Logo /> */}
                {advico_plugin.logo && (
                      <img
                          src={`${advico_plugin.logo}/icons/icon-128x128.png`}
                          width={32}
                          height={32}
                          alt="Advanced Views Counter Logo"
                          loading="lazy"
                          decoding="async"
                      />
                  )}
                <span className="text-xl font-semibold">Advanced Views Counter</span>
              </a>
  
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList>
            {navigation.map((item, index) => (
              <NavigationMenuItem key={index}>
                {item.icon ? (
                  <NavLink
                    to={item.href}
                    className={
                      clsx(
                        "flex items-center gap-3 rounded-lg px-3 py-2  transition-all hover:text-primary",
                        item.href === pageTitle
                          ? "text-primary bg-muted border border-primary"
                          : "text-muted-foreground"
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </NavLink>
                ) : (
                  <a
                    href={`#/${item.href}`}
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none"
                  >
                    <NavigationMenuLink>{item.name}</NavigationMenuLink>
                  </a>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    );
  }