
import type { SongRequest } from '@/services/request-service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp
import { CalendarDaysIcon, ClockIcon, Music2Icon, UserIcon, PhoneIcon, MapPinIcon, CheckCircle2, XCircle, Loader2Icon, History } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RequestDisplayCardProps {
  request: SongRequest;
}

// Helper function to safely convert various timestamp formats to a Date object
function toDateSafe(value: any): Date | null {
  if (!value) return null;

  if (value instanceof Timestamp) {
    return value.toDate();
  }
  // Handle cases where Timestamp might be a plain object (e.g., { seconds: ..., nanoseconds: ... })
  if (typeof value === 'object' && typeof value.seconds === 'number' && typeof value.nanoseconds === 'number') {
    try {
      return new Timestamp(value.seconds, value.nanoseconds).toDate();
    } catch (e) {
      console.warn("Could not convert plain object to Timestamp:", value, e);
      return null;
    }
  }
  // Handle JS Date object
  if (value instanceof Date) {
    return value;
  }
  // Handle string or number (milliseconds)
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d;
    }
  }
  console.warn("Could not convert value to Date:", value);
  return null;
}


export function RequestDisplayCard({ request }: RequestDisplayCardProps) {
  const submittedAtDate = toDateSafe(request.submittedAt);
  const farmaishOnDate = toDateSafe(request.farmaishOn);

  const getStatusBadge = (status?: SongRequest['status']) => { // status is optional
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600"><History className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600"><CheckCircle2 className="mr-1 h-3 w-3" />Approved</Badge>;
      case 'played':
        return <Badge variant="outline" className="text-blue-600 border-blue-600"><Music2Icon className="mr-1 h-3 w-3" />Played</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown Status</Badge>; // Fallback for undefined or unknown status
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <CardTitle className="flex items-center text-lg font-semibold text-primary mb-1">
              <Music2Icon className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="truncate" title={request.farmaish}>{request.farmaish}</span>
            </CardTitle>
            {getStatusBadge(request.status)}
        </div>
        <CardDescription className="text-xs">
          Requested by: <span className="font-medium">{request.fullName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm pt-0 pb-4">
        <div className="flex items-center text-muted-foreground">
          <PhoneIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          Mobile: <span className="text-foreground ml-1 truncate">{request.mobile}</span>
        </div>
        <div className="flex items-center text-muted-foreground">
          <MapPinIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          Address: <span className="text-foreground ml-1 truncate">{request.address}</span>
        </div>
        {farmaishOnDate && (
          <div className="flex items-center text-muted-foreground">
            <CalendarDaysIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            Preferred Date: <span className="text-foreground ml-1">{format(farmaishOnDate, 'PPP')}</span>
          </div>
        )}
        {request.preferredTime && ( // This will now also consider the 'time' field from old docs
          <div className="flex items-center text-muted-foreground">
            <ClockIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            Preferred Time: <span className="text-foreground ml-1 truncate">{request.preferredTime}</span>
          </div>
        )}
      </CardContent>
      {submittedAtDate ? (
        <CardFooter className="text-xs text-muted-foreground pt-2 pb-3 border-t">
          Submitted: {formatDistanceToNowStrict(submittedAtDate, { addSuffix: true })}
        </CardFooter>
      ) : (
        <CardFooter className="text-xs text-muted-foreground pt-2 pb-3 border-t">
          Submitted: Unknown
        </CardFooter>
      )}
    </Card>
  );
}

