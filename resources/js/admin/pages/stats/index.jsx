import { Separator } from "@/components/ui/separator"

import ClicklogLayout from "./layout"
import { useState, useEffect } from "react";
// import { ReactTabulator } from 'react-tabulator'
import FetchWrapper from '@/hooks/FetchWrapper';
import ComboBox from './combo-box';
import { z } from "zod"

import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"

export default function Stats() {
  const [isLoading, setIsLoading] = useState(true)
  const hash = window.location.hash;
  const id = hash.split('/').pop();
   const [tableData, setTableData] = useState([]);
  
    
    
    useEffect(() => {
      document.title = 'Stats';
      
      const fetchData = async () => {
        const api = new FetchWrapper(chatizy.apiUrl + 'chatizy/v1', chatizy.nonce);
        try {
          // const params = {
          //   action: 'clickervolt_get_stats',
          //   segments: ['Link', 'Device Type'],
          //   linkIdFilter: 1,
          //   sourceIdFilter: '',
          //   dateStart: '2000-01-01',
          //   dateEnd: '2025-03-31'
          // };
          const params = {
            dateStart: '2000-01-01',
            dateEnd: '2025-03-31',
            segments: JSON.stringify(['Link', 'Device Type']),
            linkIdFilter: id,
            sourceIdFilter: ''
          };
          api.post(`/stats/${id}`, JSON.stringify(params))
          .then(data => {
            setTableData(data.set);
          })
          .catch(error => {
            console.error("Error fetching data:", error);
          });

        } catch (error) {
          console.error("Error:", error);
        }
      };
  
      fetchData();
    }, []);
    const segments = [
      { value: "link", label: "Link" },
      { value: "device", label: "Device Type" },
      { value: "country", label: "Country" },
    ];
    const segments1 = [
      
      { value: "device", label: "Device Type" },
      { value: "country", label: "Country" },
    ];
  return (
    <ClicklogLayout>
     
    <div className="space-y-6">
    
    <ComboBox
  data={segments}
  placeholder="Choose Segment 1"
  searchPlaceholder="Search segments..."
  onSelect={(value) => console.log('Segment:', value)}
/>
<ComboBox 
  data={segments1}
  placeholder="Choose Segment 2"
  searchPlaceholder="Search segments..."
  onSelect={(value) => console.log('Segment1:', value)}
/>
<ComboBox
  data={segments1}
  placeholder="Choose Segment 3"
  searchPlaceholder="Search segments..."
  onSelect={(value) => console.log('Segment1:', value)}
/>
<DataTable 
          data={tableData} 
          columns={columns} 
          isLoading={isLoading}
        />
        {/* <ReactTabulator className="rounded-md border mt-2 table-report table-report--tabulator tabulator"
          data={tableData}
          columns={columns}
          layout={"fitData"}
        /> */}

    </div>
    </ClicklogLayout>
  )
}