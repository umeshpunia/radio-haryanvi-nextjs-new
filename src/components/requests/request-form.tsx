
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { addSongRequest, NewRequestData } from "@/services/request-service";
import React from "react";

const requestFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(100),
  mobile: z.string().regex(/^\+?[1-9]\d{7,14}$/, { message: "Please enter a valid phone number (e.g., 9876543210 or +919876543210)." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }).max(200),
  farmaish: z.string().min(5, { message: "Song request must be at least 5 characters." }).max(500),
  farmaishOn: z.date().optional().nullable(),
  preferredTime: z.string().max(50, { message: "Preferred time must not exceed 50 characters." }).optional(),
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

export function RequestForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      fullName: "",
      mobile: "",
      address: "",
      farmaish: "",
      farmaishOn: null,
      preferredTime: "",
    },
  });

  async function onSubmit(data: RequestFormValues) {
    setIsSubmitting(true);
    try {
      const requestData: NewRequestData = {
        fullName: data.fullName,
        mobile: data.mobile,
        address: data.address,
        farmaish: data.farmaish,
        farmaishOn: data.farmaishOn,
        preferredTime: data.preferredTime || undefined,
      };
      await addSongRequest(requestData);
      toast({
        title: "Request Submitted!",
        description: "Your song request has been sent successfully. We'll try our best to play it!",
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Could not send your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 sm:p-8 rounded-lg shadow-lg">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="Your contact number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (City/Village)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Hisar, Haryana" {...field} />
              </FormControl>
              <FormDescription>
                Please provide your city or village name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="farmaish"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Song Request (Farmaish)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the name of the song or Ragni you'd like to request..."
                  className="min-h-[100px] resize-y"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="farmaishOn"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Preferred Date (Optional)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP") // e.g., June 1, 2023
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0)) } // Disable past dates
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select a date when you'd like your song to be played.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preferredTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Time / Program (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Evening Show, 8 PM - 10 PM" {...field} />
              </FormControl>
              <FormDescription>
                Let us know if you have a preferred time or program.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting Request...
            </>
          ) : (
            "Submit Song Request"
          )}
        </Button>
      </form>
    </Form>
  );
}
