// import { Separator } from "@/components/ui/separator"

import ConversionsLayout from "./layout"
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import path from "path"
import { z } from "zod"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { taskSchema } from "./data/schema"
import { Spinner } from '@/components/ui/spinner';
import FetchWrapper from '@/hooks/FetchWrapper';
// Simulate a database read for tasks.
async function getTasks() {
  // const data = await fs.readFile(
  //   path.join(process.cwd(), "../data/tasks.json")
  // )

 

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default function Conversions() {
  // const tasks = await getTasks()
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFree = popzy?.is_free === "1" || popzy?.is_free === 1 || popzy?.is_free === true;
  const api = new FetchWrapper(popzy.pluginApiUrl, popzy.nonce);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    document.title = `Conversions | ${popzy.pluginName}`;
    if (isFree) {
      setShowModal(true)
    }
    api.get(`/conversions`) 
      .then(data => {
        setTableData(data);
        setIsLoading(false);
    })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
   
    <ConversionsLayout>
      
       {isFree && (
        <>
        <div className="p-4 mb-8 text-yellow-800 border border-yellow-400 rounded-lg bg-yellow-100 dark:bg-yellow-100 dark:text-yellow-700 dark:border-yellow-400" role="alert">
          <div className="flex items-center">
            <svg className="shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span className="sr-only">Info</span>
            <h3 className="text-lg font-semibold text-yellow-700">You are using the Free version</h3>
          </div>
          <div className="mt-2 mb-4 text-sm">
          Upgrade to unlock this awesome premium feature.
          </div>
          <div className="flex">
            <button type="button" 
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
              {/* <svg className="me-2 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
              </svg> */}
              Upgrade Now
            </button>
            {/* <button type="button" className="text-yellow-800 bg-transparent border border-yellow-800 hover:bg-yellow-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-yellow-300 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-gray-800 dark:focus:ring-yellow-800" data-dismiss-target="#alert-additional-content-4" aria-label="Close">
              Dismiss
            </button> */}
          </div>
        </div>
        </>
    )}
      <div className="space-y-6">
        <div className="shadow rounded-sm">
        <DataTable 
          data={tableData} 
          columns={columns} 
          isLoading={isLoading}
        />
        </div>
      </div>
    </ConversionsLayout>
  )
}