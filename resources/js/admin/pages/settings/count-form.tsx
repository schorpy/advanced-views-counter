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
const countFormSchema = z.object({
  post_type: z.array(z.string()).optional(),
  visitor_type: z.array(z.string()).optional(),
  interval_count: z.string().optional(),
  interval_unit: z.string().optional(),
})


type CountFormValues = z.infer<typeof countFormSchema>

// This can come from your database or API.
const defaultValues: Partial<CountFormValues> = {
  post_type: [],
  visitor_type: [],
  interval_count: "",
  interval_unit: "",
}

export function CountForm() {

  const api = new FetchWrapper(advico_plugin.pluginApiUrl, advico_plugin.nonce);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<CountFormValues>({
    resolver: zodResolver(countFormSchema),
    defaultValues,
    mode: "onChange",
  })

  useEffect(() => {
    document.title = `Count Settings | ${advico_plugin.pluginName}`;
    
    api.get(`/settings/counts`) 
      .then(data => {
        const response = data.data;
        setSettings(response);
        setIsLoading(false);
         // Ambil semua nilai selected dari post_types
      const selectedPostTypes = (response.post_types || [])
      .filter((item: any) => item.selected)
      .map((item: any) => item.id);

    // Ambil semua nilai selected dari visitor_types
    const selectedVisitorTypes = (response.exclude_visitors || [])
    .filter((item: any) => item.selected)
      .map((item: any) => item.id);

        form.reset({
          post_type: selectedPostTypes,
          visitor_type: selectedVisitorTypes,
          interval_count: response.interval_count,
          interval_unit: response.interval_unit
        });
    })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  

  const { fields, append } = useFieldArray({
    name: "urls",
    control: form.control,
  })
  const [isSubmitting, setIsSubmitting] = useState(false);
  function onSubmit(data: CountFormValues) {
    setIsSubmitting(true);
    api.put('/settings/counts/update', JSON.stringify(data)) 
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
                {settings?.post_types?.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="post_type"
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
        {/* Exclude Visitors */}
        <FormField
          control={form.control}
          name="visitor_type"
          render={({ field }) => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Exclude Visitors</FormLabel>
                <FormDescription>
                Use it exclude specific user groups from post views count.
                </FormDescription>
              </div>
              <div className="flex flex-row flex-wrap gap-6">
                {settings?.exclude_visitors?.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="visitor_type"
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

<div className="space-y-2">
  <FormLabel>Count Interval</FormLabel>
  <div className="flex items-center gap-2">
    <FormField
      control={form.control}
      name="interval_count"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input
              type="number"
  className="h-10 px-3 py-2 !border !border-input !bg-background text-sm !rounded-md dark:text-white max-w-[80px]"
              placeholder="Enter number"
              {...field}
            />
          </FormControl>
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="interval_unit"
      render={({ field }) => (
        <FormItem className="w-1/2">
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minutes">Minutes</SelectItem>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="years">Years</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  </div>
  <FormDescription>
    Enter the time between user visits. Use 0 to count every page view.
  </FormDescription>
</div>

        
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

