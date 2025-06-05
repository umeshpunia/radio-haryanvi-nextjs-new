
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
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addSongRequest, NewRequestData } from "@/services/request-service";
import React from "react";

// Form schema for user input
const requestFormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(100),
  mobile: z.string().regex(/^\+?[1-9]\d{7,14}$/, { message: "Please enter a valid phone number (e.g., 9876543210 or +919876543210)." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }).max(200),
  farmaish: z.string().min(5, { message: "Song request must be at least 5 characters." }).max(500),
  // preferredTimeInput field is removed
});

type RequestFormValues = z.infer<typeof requestFormSchema>;

interface RequestFormProps {
  onSuccess?: () => void; 
  setOpen?: (open: boolean) => void; 
}

export function RequestForm({ onSuccess, setOpen }: RequestFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      fullName: "",
      mobile: "",
      address: "",
      farmaish: "",
    },
  });

  async function onSubmit(data: RequestFormValues) {
    setIsSubmitting(true);
    try {
      // NewRequestData no longer takes 'time' from the form
      const requestData: NewRequestData = {
        fullName: data.fullName,
        mobile: data.mobile,
        address: data.address,
        farmaish: data.farmaish,
      };
      await addSongRequest(requestData);
      toast({
        title: "Request Submitted!",
        description: "Your song request has been sent successfully. We'll try our best to play it!",
      });
      form.reset();
      if (onSuccess) onSuccess(); 
      if (setOpen) setOpen(false); 
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        {/* FormField for preferredTimeInput (Preferred Time / Program) is removed */}
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
