import { Separator } from "@/components/ui/separator"
import { CountForm } from "@/pages/settings/count-form"
import SettingsLayout from "./layout"

export default function Settings() {
  return (
    <SettingsLayout>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium dark:text-white">Count</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <CountForm />
    </div>
    </SettingsLayout>
  )
}
