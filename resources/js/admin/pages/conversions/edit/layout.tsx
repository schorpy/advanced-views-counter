import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"

import { Separator } from "@/components/ui/separator"
import { Link, useParams } from "react-router-dom"


const sidebarNavItems = [
  {
    title: "Profile",
    href: "#/Campaigns",
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

interface CampaignsLayoutProps {
  children: React.ReactNode
}

export default function CampaignsLayout({ children }: CampaignsLayoutProps) {
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
                <BreadcrumbPage>Campaigns</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
<BreadcrumbPage>Edit {useParams().id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          </div>
      <div className="space-y-6 p-10 pb-16 md:block dark:bg-gray-900">
        {/* <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight dark:text-white">Campaigns</h2>
          <p className="text-muted-foreground">
            Manage your account Campaigns and set e-mail preferences.
          </p>
        </div> */}
        {/* <Separator className="my-6" /> */}
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  )
}