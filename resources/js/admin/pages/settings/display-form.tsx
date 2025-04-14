"use client"
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

import { Checkbox } from "@/components/ui/checkbox"
import FetchWrapper from '@/hooks/FetchWrapper';
import { toast } from "sonner"
import { Spinner } from '@/components/ui/spinner';

// Update the schema
const displayFormSchema = z.object({
  views_label: z.string().optional(),
  display_style: z.array(z.string()).default([]).optional(),
  post_type: z.array(z.string()).optional(),
  page_type: z.array(z.string()).default([]).optional(),
  position: z.string().default("after"),
})

type DisplayFormValues = z.infer<typeof displayFormSchema>

// Update default values
const defaultValues: Partial<DisplayFormValues> = {
  views_label: "",
  display_style: [],
  post_type: [],
  page_type: [],
  position: "after",
}

export function DisplayForm() {
  const api = new FetchWrapper(avc_plugin.pluginApiUrl, avc_plugin.nonce);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
    mode: "onChange",
  })

  useEffect(() => {
    document.title = `Display Settings | ${avc_plugin.pluginName}`;
    
    api.get(`/settings/display`)
    .then(data => {
      const response = data.data;
      setSettings(response);
      setIsLoading(false);

      // Ambil semua nilai selected dari post_types
      // const selectedPostTypes = Object.entries(response.post_types || {})
      //   .filter(([_, item]: [string, any]) => item.selected)
      //   .map(([id]) => id);
      const selectedPostTypes = (response.post_types || [])
      .filter((item: any) => item.selected)
      .map((item: any) => item.id);
      // Ambil semua nilai selected dari page_types
      const selectedPageTypes = (response.page_types || [])
      .filter((item: any) => item.selected)
      .map((item: any) => item.id);

        const selectedDisplayStyles = (response.display_styles || [])
        .filter((item: any) => item.selected)
        .map((item: any) => item.id);

      // Reset nilai form
      form.reset({
        views_label: response.views_label,
        display_style: selectedDisplayStyles,
        post_type: selectedPostTypes,
        page_type: selectedPageTypes,
        position: response.position || "after",
      });
    })
      .catch(error => {
       
        toast.error('Error Fetching Data', {
          description: error
        });
      });
  }, []);

  // Remove unused useFieldArray
  // const { fields, append } = useFieldArray({
  //   name: "urls",
  //   control: form.control,
  // })
  const [isSubmitting, setIsSubmitting] = useState(false);
  function onSubmit(data: DisplayFormValues) {
    setIsSubmitting(true);
      api.put('/settings/display/update', JSON.stringify(data)) 
        .then(response => {
          toast.success('Settings updated successfully', {
            description: 'Your display settings have been saved.'
          });
          setIsSubmitting(false);
        })
        .catch(error => {
          console.error("Error updating settings:", error);
          toast.error('Failed to update settings', {
            description: 'Please try again later.'
          });
          setIsSubmitting(false);
        });
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner>Loading...</Spinner>
        </div>
      );
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="views_label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Views Label</FormLabel>
              <FormControl>
                <Input placeholder="Post Views:" {...field} />
              </FormControl>
              <FormDescription>
                Enter the label for the post views counter field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Display Style */}
        <FormField
          control={form.control}
          name="display_style"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Display Style</FormLabel>
                <FormDescription>
                  Choose how to display the post views counter
                </FormDescription>
              </div>
              <div className="flex flex-row flex-wrap gap-6">
              {settings?.display_styles?.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="display_style"
                    render={({ field }) => (
                      <FormItem
                        key={item.id}
                        className="flex items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
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
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Post Type */}
        <FormField
          control={form.control}
          name="post_type"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Post Type</FormLabel>
                <FormDescription>
                  Select post types for which the views count will be displayed.
                </FormDescription>
              </div>
              <div className="flex flex-row flex-wrap gap-6">
                {settings?.post_types.map((item) => (
                    <FormItem key={item.id} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(item.id)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, item.id]);
                            } else {
                              field.onChange(currentValue.filter((value) => value !== item.id));
                            }
                            
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                    </FormItem>
                  ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Page Type */}
        <FormField
          control={form.control}
          name="page_type"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Page Type</FormLabel>
                <FormDescription>
                  Select page types for which the views count will be displayed.
                </FormDescription>
              </div>
              <div className="flex flex-row flex-wrap gap-6">
              {!isLoading &&
  settings?.page_types?.map((item) => (
    <FormField
      key={item.id}
      control={form.control}
      name="page_type"
      render={({ field }) => (
        <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={(field.value || []).includes(item.id)}
              onCheckedChange={(checked) => {
                const currentValue = field.value || [];

                return checked
                  ? field.onChange([...currentValue, item.id])
                  : field.onChange(currentValue.filter((v) => v !== item.id));
              }}
            />
          </FormControl>
          <FormLabel className="text-sm font-normal">
            {item.label}
          </FormLabel>
        </FormItem>
      )}
    />
))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Widget Position</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="before">Before The Content</SelectItem>
                  <SelectItem value="after">After The Content</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select where would you like to display the post views counter. Use [post-views] shortcode for manual display.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
          <Button type="submit" className="font-semibold text-white" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4 text-white" />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
      </form>
    </Form>
  )
}
