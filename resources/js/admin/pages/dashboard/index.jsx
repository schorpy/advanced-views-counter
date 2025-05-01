import { useState, useEffect } from "react";

import DashboardLayout from "../layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OverviewChart } from "@//components/dashboard/overview-chart"
import { OverviewReferer } from "@//components/dashboard/overview-referer"
import { OverviewPost } from "@//components/dashboard/overview-post"

import {Spinner} from "@/components/ui/spinner"

export default function DashboardPage() {
  const [date, setDate] = useState(() => {
    const today = new Date();
    const last7Days = new Date(today);
    last7Days.setDate(today.getDate() - 7);
    
    return {
      dateFrom: last7Days.toISOString().slice(0, 10),
      dateTo: today.toISOString().slice(0, 10),
    };
  });
 
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.title = `Dashboard | ${advico_plugin.pluginName}`;
    setLoading(false);
  
  }, []); //just for loading
  
  return (
    <>
   <DashboardLayout>
     
   <div className="space-y-6">
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
                     Posts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                  {loading ? (
                      <div className="h-[400px] flex items-center justify-center">
                       <Spinner>Loading...</Spinner>
                      </div>
                    ) : (
                    
                    <OverviewPost
                    key={`${date.dateFrom}-${date.dateTo}`}
                    dateFrom={date.dateFrom}
                    dateTo={date.dateTo} />
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
           
        </div>
        </DashboardLayout>
    </>
  );
}
