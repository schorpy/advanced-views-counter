
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

import { toast } from "sonner"

import FetchWrapper from '@/hooks/FetchWrapper';

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
  ctz_name: z.string().min(1, "Name is required"),
  ctz_status: z.string().min(1, "Please select a status"),
  ctz_phone: z.string().min(5, "Please enter a valid Number"),
  category: z.string().optional(),
  desc: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface AgentFormProps {
  initialData?: Partial<FormData>
  type: 'new' | 'edit' | 'copy'
}

export function AgentForm({ initialData, type }: AgentFormProps) {
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
      ctz_name: type !== 'new' ? initialData[0]?.name : '',
      ctz_status: type !== 'new' ? initialData[0]?.status : '0',
      ctz_phone: type !== 'new' ? initialData[0]?.phone : '',
      category: type !== 'new' ? initialData?.category : '',
      desc: type !== 'new' ? initialData?.settings?.description : ''
    }
  })

  // Keep only the main onSubmit function
  async function onSubmit(data: FormData) {
    try {
      const endpoint = type === 'edit' 
        ? `${chatizy.pluginApiUrl}/agent/update/${initialData[0]?.id}`
        : `${chatizy.pluginApiUrl}/agent/create`;

      const api = new FetchWrapper(chatizy.pluginApiUrl, chatizy.nonce);
      
      const response = await (type === 'edit' 
        ? api.put(`/agent/update/${initialData[0]?.id}`, JSON.stringify(data))
        : api.post('/agent/create', JSON.stringify(data)));

        if (response.status === 'success') {
          toast.success(response.message, {
            duration: 3000,
            onAutoClose: () => {
              window.location.href = '/wp-admin/admin.php?page=chatizy#/agents';
            }
          });
      } else {
        throw new Error(response.message || 'Something went wrong');
      }
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
          name="ctz_name"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="min-w-[150px]">Marketing Name :</FormLabel>
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
          name="ctz_status"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="min-w-[150px] text-left">Status :</FormLabel>
              <div className="flex-1">
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">Active</SelectItem>
                  <SelectItem value="1">In Active</SelectItem>
                </SelectContent>
              </Select>
              
              <FormMessage />
              </div>
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="ctz_phone"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="min-w-[150px]">Phone :</FormLabel>
              <div className="flex-1">
              <FormControl>
                {/* <Input placeholder="https://google.com" {...field} /> */}
                <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Input
              id="link"
              placeholder="0812345678"
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
          name="ctz_text"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="min-w-[150px]">Predefined Text :</FormLabel>
              <div className="flex-1">
              <FormControl>
                {/* <Input placeholder="https://google.com" {...field} /> */}
                <div className="flex items-center space-x-2">
          <div className="flex-1">
          <Textarea
                  placeholder=""
                  className="resize-none"
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
       
       
    </div>
    <div className="form2">
   
        
    </div>
      </div>
    
        
      <div className="flex justify-end">
          <Button type="submit">
            {type === 'edit' ? 'Update' : type === 'copy' ? 'Copy Campaign' : 'Add New Marketing'}
          </Button>
      </div>
      </form>
    
    </Form>
  )
}