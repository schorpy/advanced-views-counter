import { Separator } from "@/components/ui/separator"
import { DisplayForm } from "@/pages/settings/display-form"
import SettingsLayout from "./layout"

export default function SettingsDisplay() {
  return (
    <SettingsLayout>
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium dark:text-white">Display Settings</h3>
        {/* <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p> */}
      </div>
      <Separator />
      <DisplayForm />
    </div>
    </SettingsLayout>
  )
}
