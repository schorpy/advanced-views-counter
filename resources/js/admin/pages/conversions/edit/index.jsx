// import { Separator } from "@/components/ui/separator"

import CampaignsLayout from "./layout"
import { useState, useEffect } from "react";

import path from "path"
import { z } from "zod"
import { Spinner } from '@/components/ui/spinner';
import { CampaignForm } from "../components/campaign-form";
import FetchWrapper from '@/hooks/FetchWrapper';

export default function CampaignEdit() {
  const [campaignType, setCampaignType] = useState('')
  const [campaignData, setCampaignData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const api = new FetchWrapper(wpclickizy.apiUrl + 'wp-clickizy/v1', wpclickizy.nonce);
  const hash = window.location.hash;
  const id = hash.split('/').pop();

  useEffect(() => {
    document.title = 'Edit Campaigns';
    setCampaignType('edit')
    
    const fetchCampaign = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(`/campaign/get/${id}`);
        setCampaignData(data);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);



  return (
    <CampaignsLayout>
      <div className="space-y-6">
        <div className="shadow rounded-sm">
          {isLoading ? (
            <div className="min-h-screen items-center">
              <Spinner>Loading...</Spinner>
            </div>
          ) : (
            <CampaignForm 
              initialData={campaignData} 
              type={campaignType}
            />
          )}
        </div>

      </div>
    </CampaignsLayout>
  )
}