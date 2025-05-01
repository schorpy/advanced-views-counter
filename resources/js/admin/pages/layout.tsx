

import { useEffect, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Toaster } from "@/components/ui/sonner"


type Crumb = {
  name: string;
  href?: string;
  icon?: React.ElementType; // Contoh: Home, Users, etc
};
interface DashboardLayoutProps {
  breadcrumb?: Crumb[];
  toolbarRight?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardLayout({
  breadcrumb = [],
  toolbarRight,
  children,
}: DashboardLayoutProps) {
  const [menuWidth, setMenuWidth] = useState("98vw")

  useEffect(() => {
    const handleResize = () => {
      const adminMenu = document.getElementById('adminmenuwrap')
      if (adminMenu) {
        const width = `calc(100vw - ${adminMenu.offsetWidth + 20}px)`
        setMenuWidth(width)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    // Listen for WordPress menu toggle
    const observer = new MutationObserver(handleResize)
    const adminMenu = document.getElementById('adminmenuwrap')
    if (adminMenu) {
      observer.observe(adminMenu, { attributes: true, subtree: true })
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [])

  return (
    <> 
    
    {breadcrumb.length > 0 && (
        <div className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-10">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumb.map((item, index) => {
                const Icon = item.icon;

                const isLast = index === breadcrumb.length - 1;
                const showSeparator = !isLast;

                return (
                  <div key={index} className="flex items-center gap-1">
                    <BreadcrumbItem className={index === 0 ? "hidden md:flex items-center gap-1" : ""}>
                      {item.href ? (
                        <BreadcrumbLink href={item.href}>
                          {Icon && <Icon className="w-4 h-4 mr-1" />}
                          {item.name}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="flex items-center gap-1">
                          {Icon && <Icon className="w-4 h-4 mr-1" />}
                          {item.name}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {showSeparator && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </div>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          {toolbarRight}
        </div>
      )}
      <div className="space-y-6 md:p-10 pb-16 md:block dark:bg-gray-900 overflow-x-scroll flex-1" style={{ width: menuWidth }}>
        {/* <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">Leads</h2>
          <p className="text-muted-foreground">
            Manage your account Leads and set e-mail preferences.
          </p>
        </div> */}
        {/* <Separator className="my-6" /> */}
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="flex-1">
            <div className="relative w-full">
              <div>{children}</div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}