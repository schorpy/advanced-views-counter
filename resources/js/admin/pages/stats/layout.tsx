import { useEffect, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { DateRangePicker } from "@/components/dashboard/date-range-picker"
const sidebarNavItems = [
  {
    title: "Profile",
    href: "#/Clicklog",
  },
  {
    title: "Account",
    href: "#/account",
  },
  {
    title: "Appearance",
    href: "#/appearance",
  },
  {
    title: "Notifications",
    href: "#/notifications",
  },
  {
    title: "Display",
    href: "#/display",
  },
]

interface ClicklogLayoutProps {
  children: React.ReactNode
}

export default function ClicklogLayout({ children }: ClicklogLayoutProps) {
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
    <div className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-10">
       <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Stats</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <DateRangePicker
  onUpdate={(values) => console.log(values)}
  initialDateFrom="2023-01-01"
  initialDateTo="2023-12-31"
  align="start"
  locale="en-GB"
  showCompare={false}
/>
          </div>
      <div className="h-[calc(100vh-170px)] space-y-6 p-10 pb-16 md:block dark:bg-gray-900 overflow-x-scroll flex-1" style={{ width: menuWidth }}>
     
        {/* <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">Clicklog</h2>
          <p className="text-muted-foreground">
            Manage your account Clicklog and set e-mail preferences.
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
    </>
  )
}