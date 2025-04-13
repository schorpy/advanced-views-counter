
import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { Copy } from "lucide-react"
import { cn,copyToClipboard } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Update from "src/202/pages/update/Update copy"


const handleCopyToClipboard = (linkString: string) => {
  copyToClipboard(linkString, "Link copied to clipboard!");
};

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  
] as const

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  bio: "I own a computer.",
  urls: [
    { value: "https://shadcn.com" },
    { value: "http://twitter.com/shadcn" },
  ],
}
const categoryItems = [
  {
    id: "nofollow",
    label: "Nofollow",
  },
  {
    id: "sponsored",
    label: "Sponsored",
  },
  {
    id: "param",
    label: "Parameter Forwarding",
  },
  {
    id: "tracking",
    label: "Tracking",
  },
] as const
 
const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

const formSchema = z.object({
  campaign_name: z.string().min(1, "Campaign name is required"),
  redirect_type: z.string().min(1, "Please select a redirect type"),
  shortlink: z.string(),
  target: z.string().url("Please enter a valid URL"),
  category: z.string().optional(),
  desc: z.string().optional(),
  items: z.array(z.string()).min(1, "Select at least one option")
})

type FormData = z.infer<typeof formSchema>

interface CampaignFormProps {
  initialData?: Partial<FormData>
  type: 'new' | 'edit' | 'copy'
}

export function CampaignForm({ initialData, type }: CampaignFormProps) {
const [inputPadding, setInputPadding] = React.useState(0);
  
  // Add useEffect to calculate padding
  React.useEffect(() => {
    const baseUrl = window.location.origin + '/go/';
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.innerText = baseUrl;
    document.body.appendChild(tempSpan);
    const width = tempSpan.offsetWidth;
    document.body.removeChild(tempSpan);
    setInputPadding(width + 24); // Add some extra padding
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaign_name: type !== 'new' ? initialData?.slug : '',
      shortlink: type === 'new' ? `${Math.random().toString(36).substring(2, 8)}` : initialData?.trackingUrl,
      redirect_type: type !== 'new' ? initialData?.settings?.redirectMode : '301',
      target: type !== 'new' ? initialData?.settings?.defaultUrls[0] : '',
      category: type !== 'new' ? initialData?.category : '',
      desc: type !== 'new' ? initialData?.settings?.description : '',
      items: type !== 'new' ? initialData?.items : ['tracking']
    }
  })
console.log(initialData)
  // Keep only the main onSubmit function
  async function onSubmit(data: FormData) {
    try {
      const endpoint = type === 'edit' 
        ? `${wpclickizy.apiUrl}wp-clickizy/v1/campaign/update/${initialData?.id}`
        : `${wpclickizy.apiUrl}wp-clickizy/v1/campaign/create`

      const response = await fetch(endpoint, {
        method: type === 'edit' ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(
          `Failed to ${type === 'edit' ? 'update' : 'create'} campaign (HTTP ${response.status})`
        )
      }

      toast.success(`Campaign ${type === 'edit' ? 'updated' : 'created'} successfully`, {
        description: "Your changes have been saved",
      })
    } catch (error) {
      
      toast.error("Error", {
        style: {
          background: 'red',
        },
        description: error.message,
      })
    }
  }

  const { fields, append } = useFieldArray({
    name: "urls",
    control: form.control,
  })

  

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex w-full gap-4">
     <div className="form1 w-[75%]">
     <FormField
          control={form.control}
          name="campaign_name"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="min-w-[150px] text-right">Campaign Name / Title :</FormLabel>
              <div className="flex-1">
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="redirect_type"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="min-w-[150px] text-left">Redirect Type :</FormLabel>
              <div className="flex-1">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Redirect Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="301">301 (Permanent)</SelectItem>
                  <SelectItem value="302">302 (Temporary)</SelectItem>
                  <SelectItem value="307">307 (Temporary)</SelectItem>
                </SelectContent>
              </Select>
              
              <FormMessage />
              </div>
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="min-w-[150px]">Target URL :</FormLabel>
              <div className="flex-1">
              <FormControl>
                {/* <Input placeholder="https://google.com" {...field} /> */}
                <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Input
              id="link"
              placeholder="https://example.com"
              {...field}
            />
          </div>
          
        </div>
              </FormControl>
             
              <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shortlink"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="min-w-[150px]">Shortened URL :</FormLabel>
              <div className="flex-1">
              <FormControl>
                {/* <Input placeholder="https://google.com" {...field} /> */}
                <div className="flex items-center space-x-2">
            
          <div className="grid flex-1 gap-2">
          <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
                  {window.location.origin}/go/
                </div>
                <Input
                  id="shortlink"
                  style={{ paddingLeft: `${inputPadding}px` }}
                  placeholder="custom-slug"
                  {...field}
                />
              </div>
          </div>
         
          <Button 
            type="button" 
            size="sm" 
            className="rounded-sm px-3"
            onClick={() =>
              handleCopyToClipboard(
                `${window.location.origin}/go/${field.value.split('/').pop()}`
              )
            }
          
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
              </FormControl>
             
              <FormMessage />
              </div>
            </FormItem>
          )}
        />
         {/* <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
            <FormLabel className="min-w-[150px]">Category :</FormLabel>
            <div className="flex-1">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : "Select language"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search framework..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue("language", language.value)
                            }}
                          >
                            {language.label}
                            <Check
                              className={cn(
                                "ml-auto",
                                language.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
             
              <FormMessage />
              </div>
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="desc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description :</FormLabel>
              <FormControl>
                <Textarea
                  placeholder=""
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && "sr-only")}>
                    URLs
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && "sr-only")}>
                    Add links to your website, blog, or social media profiles.
                  </FormDescription>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ value: "" })}
          >
            Add URL
          </Button>
        </div> */}
    </div>
    <div className="form2">
    <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Link Options</FormLabel>
                {/* <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription> */}
              </div>
              {categoryItems.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || []; // Add fallback for undefined
                              return checked
                                ? field.onChange([...currentValue, item.id])
                                : field.onChange(
                                    currentValue.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
    </div>
      </div>
    
        
      <div className="flex justify-end">
          <Button type="submit">
            {type === 'edit' ? 'Update Campaign' : type === 'copy' ? 'Copy Campaign' : 'Create Campaign'}
          </Button>
      </div>
      </form>
    
    </Form>
  )
}