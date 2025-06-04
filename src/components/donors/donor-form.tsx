
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { addDonor, NewDonorData } from "@/services/donor-service";
import { useToast } from "@/hooks/use-toast";
import React from "react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Define calculateAge locally
function calculateAge(dobString: string): number {
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const donorFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  mobile: z.string().regex(/^\d{10}$/, { message: "Mobile number must be 10 digits." }),
  dob: z.date({ required_error: "Date of birth is required." })
    .refine((date) => {
      const age = calculateAge(format(date, "yyyy-MM-dd"));
      return age >= 18;
    }, { message: "Donor must be at least 18 years old." })
    .refine((date) => {
      const age = calculateAge(format(date, "yyyy-MM-dd"));
      return age < 30;
    }, { message: "Donor must be less than 30 years old." }),
  bloodGroup: z.string({ required_error: "Please select a blood group." }).refine(val => bloodGroups.includes(val), { message: "Invalid blood group" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }).max(100),
  area: z.string().min(3, { message: "Area must be at least 3 characters." }).max(50),
  description: z.string().max(200, { message: "Description can be up to 200 characters." }).optional(),
});

type DonorFormValues = z.infer<typeof donorFormSchema>;

interface DonorFormProps {
  onSuccess?: () => void;
  setOpen?: (open: boolean) => void; 
}

export function DonorForm({ onSuccess, setOpen }: DonorFormProps) {
  const { toast } = useToast();
  const form = useForm<DonorFormValues>({
    resolver: zodResolver(donorFormSchema),
    defaultValues: {
      name: "",
      mobile: "",
      bloodGroup: undefined,
      address: "",
      area: "",
      description: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Calculate date boundaries for the calendar
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day

  // Latest allowed DOB (to be 18 years old)
  const maxSelectableDOB = new Date(today);
  maxSelectableDOB.setFullYear(today.getFullYear() - 18);

  // Earliest allowed DOB (to be less than 30 years old)
  // This means the person is 29 at most.
  // If born exactly 30 years ago, they are 30. We need DOB to be after that.
  const earliestSelectableDOB = new Date(today);
  earliestSelectableDOB.setFullYear(today.getFullYear() - 30);
  earliestSelectableDOB.setDate(earliestSelectableDOB.getDate() + 1); // Day after 30th birthday in the past


  async function onSubmit(data: DonorFormValues) {
    setIsSubmitting(true);
    try {
      const newDonorData: NewDonorData = {
        ...data,
        dob: format(data.dob, "yyyy-MM-dd"),
      };
      await addDonor(newDonorData);
      toast({
        title: "Donor Registered",
        description: `${data.name} has been successfully registered as a donor.`,
      });
      form.reset();
      if (onSuccess) onSuccess();
      if (setOpen) setOpen(false);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not register donor. Please try again.",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" {...field} />
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
                <Input type="tel" placeholder="Enter 10-digit mobile number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of Birth</FormLabel>
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
                        format(field.value, "PPP")
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
                    defaultMonth={maxSelectableDOB} // Start view at latest possible DOB for 18 y.o.
                    disabled={(date) => 
                        date > maxSelectableDOB || date < earliestSelectableDOB
                    }
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={earliestSelectableDOB.getFullYear()}
                    toYear={maxSelectableDOB.getFullYear()}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age. Donor must be between 18 and 29 years old.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bloodGroup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Group</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter full address (e.g., House No, Street)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area / City</FormLabel>
              <FormControl>
                <Input placeholder="Enter area or city (e.g., Hisar, Delhi)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information or message (max 200 characters)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register as Donor"}
        </Button>
      </form>
    </Form>
  );
}
