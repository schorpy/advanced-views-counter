

import { Separator } from "@/components/ui/separator"


interface PopupsLayoutProps {
  children: React.ReactNode,
  breadcrumb: React.ReactNode
}

export default function PopupsLayout({ children,breadcrumb }: PopupsLayoutProps) {
  return (
    <> 
   
    {breadcrumb}
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