
import { useState, useEffect } from "react";
import PopupsLayout from "./layout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import FetchWrapper from '@/hooks/FetchWrapper';


export default function Popups() {

  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true)
  const api = new FetchWrapper(avc_plugin.pluginApiUrl, avc_plugin.nonce);

  useEffect(() => {
    document.title = `Popups | ${avc_plugin.pluginName}`;
    
    api.get(`/popups`) 
      .then(data => {
        setTableData(data.data);
        setIsLoading(false);
        console.log(data.data)
    })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);


  const breadcrumb = (
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
                <BreadcrumbPage>Popups</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

      <Button asChild className="text-white font-semibold">
        <Link to="/post-new.php?post_type=avc_plugin">+ Add New Popup</Link>
      </Button>

      </div>
  );

  return (
   
    <PopupsLayout breadcrumb={breadcrumb}>
      
      <div className="space-y-6">
        <div className="">
        <DataTable 
          data={tableData} 
          columns={columns} 
          isLoading={isLoading}
        />
        </div>
      </div>
    </PopupsLayout>
  )
}