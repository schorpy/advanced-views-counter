import { Separator } from "@/components/ui/separator"
import { CountForm } from "@/pages/settings/count-form"
import SettingsLayout from "./layout"

export default function Settings() {
  return (
    <SettingsLayout>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium dark:text-white">Count Settings</h3>
       
      </div>
      <Separator />
      <CountForm />
    </div>
    </SettingsLayout>
  )
}
