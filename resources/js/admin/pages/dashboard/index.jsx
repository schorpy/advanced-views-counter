import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DateRangePicker } from "@/components/dashboard/date-range-picker"
// import { MainNav } from "@/components/dashboard/main-nav"
import { OverviewChart } from "@//components/dashboard/overview-chart"
import { OverviewReferer } from "@//components/dashboard/overview-referer"
// import { OverviewAgent } from "@//components/dashboard/overview-agent"

import {Spinner} from "@/components/ui/spinner"

export default function DashboardPage() {
  // const [date, setDate] = useState(() => {
  //   const today = new Date();
  //   const last7Days = new Date(today);
  //   last7Days.setDate(today.getDate() - 7);
    
  //   return {
  //     dateFrom: last7Days.toISOString().slice(0, 10),
  //     dateTo: today.toISOString().slice(0, 10),
  //   };
  // });
  const [date, setDate] = useState({
    dateFrom: "2024-01-01",
    dateTo: "2024-12-31",
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    document.title = `Dashboard | ${avc_plugin.pluginName}`;
    setLoading(false);
    // if (isFree) {
    //   setShowModal(true)
    // }
  }, [date.dateFrom, date.dateTo]); //just for loading
  
  return (
    <>
   
      <div className="hidden dark:bg-gray-900 flex-col md:flex">
        {/* <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div> */}
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl dark:text-white font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <DateRangePicker
              onUpdate={(values) => {
                const from = values?.range.from;
                const to = values?.range.to;

                const formattedFrom = from ? from.toISOString().slice(0, 10) : null;
                const formattedTo = to ? to.toISOString().slice(0, 10) : null;

                // console.log("Formatted:", { formattedFrom, formattedTo });
                setLoading(true);
                  setDate({
                    dateFrom: formattedFrom,
                    dateTo: formattedTo,
                  });
                }}
                initialDateFrom={date.dateFrom}
                initialDateTo={date.dateTo}
                align="start"
                locale="en-GB"
                showCompare={false}
              />
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            {/* <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList> */}
            <TabsContent value="overview" className="space-y-4">
              <div className="">
              <Card className="">
                  <CardHeader>
                    <CardTitle>
                      Overview
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                  {loading ? (
                      <div className="h-[400px] flex items-center justify-center">
                       <Spinner>Loading...</Spinner>
                      </div>
                    ) : (
                    <OverviewChart 
                      key={`${date.dateFrom}-${date.dateTo}`}
                      dateFrom={date.dateFrom} 
                      dateTo={date.dateTo} 
                    />
                  )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="col-span">
                  <CardHeader>
                  <CardTitle className="text-2xl dark:text-white">
                     Agents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                  {loading ? (
                      <div className="h-[400px] flex items-center justify-center">
                       <Spinner>Loading...</Spinner>
                      </div>
                    ) : (
                      <></>
                    // <OverviewAgent
                    // key={`${date.dateFrom}-${date.dateTo}`}
                    // dateFrom={date.dateFrom}
                    // dateTo={date.dateTo} />
                  )}
                  </CardContent>
                </Card>
                <Card className="col-span">
                  <CardHeader>
                    <CardTitle className="text-2xl dark:text-white">
                      Referers
                      </CardTitle>
                    {/* <CardDescription>
                      You made .
                    </CardDescription> */}
                  </CardHeader>
                  <CardContent>
                  {loading ? (
                      <div className="h-[400px] flex items-center justify-center">
                       <Spinner>Loading...</Spinner>
                      </div>
                    ) : (
                  <OverviewReferer
                  key={`${date.dateFrom}-${date.dateTo}`}
                  dateFrom={date.dateFrom}
                  dateTo={date.dateTo} />
                  )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
