
import { Donor } from "@/services/donor-service";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPinIcon, UserIcon, PhoneIcon, CalendarDaysIcon, HeartPulseIcon } from "lucide-react";

interface DonorCardProps {
  donor: Donor;
}

export function DonorCard({ donor }: DonorCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="font-headline text-2xl">{donor.name}</CardTitle>
            {donor.active && <Badge variant="default">Active</Badge>}
        </div>
        <CardDescription className="flex items-center">
            <HeartPulseIcon className="h-4 w-4 mr-2 text-red-500" />
            B.Group: <span className="font-semibold ml-1">{donor.b_group}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 flex-grow">
        <div className="flex items-center text-sm text-muted-foreground">
          <UserIcon className="h-4 w-4 mr-2" />
          Age: {donor.age} years
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPinIcon className="h-4 w-4 mr-2" />
          Location: {donor.area}, {donor.address}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <PhoneIcon className="h-4 w-4 mr-2" />
          Mobile: {donor.mobile}
        </div>
        {donor.description && (
          <p className="text-sm text-muted-foreground pt-2 border-t mt-2">
            <span className="font-medium text-foreground">Note:</span> {donor.description}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground flex items-center">
          <CalendarDaysIcon className="h-3 w-3 mr-1" />
          Registered on: {donor.timestamp ? new Date(donor.timestamp).toLocaleDateString() : 'N/A'}
        </div>
      </CardFooter>
    </Card>
  );
}
