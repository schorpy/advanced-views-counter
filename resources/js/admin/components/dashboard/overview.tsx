"use client"

import { useEffect, useState } from "react";
// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const fetchData = async () => {
  try {
    const params = new URLSearchParams();
    // params.append('action', 'clickervolt_get_stats');
    // params.append('clickervolt_nonce', '907893dbfa');
    params.append('segments[]', 'Hour of Day');
    params.append('dateStart', '2021-01-18');
    params.append('dateEnd', '2025-01-18');

    // Send the POST request
    const response = await fetch(wpclickizy.apiUrl + 'wp-clickizy/v1/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: params.toString(),
    });


    if (!response.ok) {
      throw new Error("Network response was not ok.");
    }
    const data = await response.json();
   
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const deleteAccount = async () => {
  try {
    const response = await fetch(
      wpclickizy.apiUrl + "wpclickizy/v1/accounts/delete",
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.log("Error while deleting account");
    throw error;
  }
};





const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jul",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Aug",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Sep",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Oct",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Nov",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Dec",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export function Overview() {
  const [accounts, setAccounts] = useState([]);
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        // const data = await fetchData();
        const result = await fetchData();

        // Sort and prepare data
        const sortedData = result.sort((a, b) => a.segment0.localeCompare(b.segment0));

        const formattedData = sortedData.map((item) => ({
          segment: item.segment0,
          clicks: item.clicks,
          uniqueClicks: item.clicksUnique,
          actions: item.actions,
        }));

        setChartData(formattedData);
    
        // setAccounts(data);
      } catch (error) {
        // Handle error
        console.error("Error:", error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <>
 
    <div>
      <h1>Sales Chart</h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="segment" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="clicks" fill="#f44336" name="Clicks" />
          <Bar dataKey="uniqueClicks" fill="#4caf50" name="Unique Clicks" />
          <Bar dataKey="actions" fill="#2196f3" name="Actions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
    <ResponsiveContainer width="100%" height={350}>
      
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
    </>
  )
}