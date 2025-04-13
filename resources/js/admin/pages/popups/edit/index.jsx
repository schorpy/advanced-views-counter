
import CampaignsLayout from "./layout"
import { useState, useEffect } from "react";

import path from "path"
import { z } from "zod"
import { Spinner } from '@/components/ui/spinner';
import { AgentForm } from "../components/agent-form";
import FetchWrapper from '@/hooks/FetchWrapper';

export default function AgentEdit() {
  const [agentType, setAgentType] = useState('')
  const [agentData, setAgentData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const api = new FetchWrapper(chatizy.pluginApiUrl, chatizy.nonce);
  const hash = window.location.hash;
  const id = hash.split('/').pop();

  useEffect(() => {
    document.title = `Edit Agent | ${chatizy.pluginName}`;
    setAgentType('edit')
    
    const fetchAgent = async () => {
      try {
        setIsLoading(true);
        const data = await api.get(`/agent/get/${id}`);
        setAgentData(data.data);
      } catch (error) {
        console.error("Error fetching Agent:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchAgent();
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
            <AgentForm 
              initialData={agentData} 
              type={agentType}
            />
          )}
        </div>

      </div>
    </CampaignsLayout>
  )
}