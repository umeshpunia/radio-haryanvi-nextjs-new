
import type { SongRequest } from '@/services/request-service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { CalendarDaysIcon, ClockIcon, Music2Icon, MapPinIcon } from 'lucide-react';

interface RequestDisplayCardProps {
  request: SongRequest;
}

function toDateSafe(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value === 'object' && typeof value.seconds === 'number' && typeof value.nanoseconds === 'number') {
    try { return new Timestamp(value.seconds, value.nanoseconds).toDate(); }
    catch (e) { console.warn("Could not convert plain object to Timestamp:", value, e); return null; }
  }
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return d;
  }
  console.warn("Could not convert value to Date:", value);
  return null;
}

export function RequestDisplayCard({ request }: RequestDisplayCardProps) {
  const submissionDate = toDateSafe(request.farmaishOn);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
            <CardTitle className="flex items-center text-lg font-semibold text-primary mb-1">
              <Music2Icon className="mr-2 h-5 w-5 flex-shrink-0" />
              <span className="truncate" title={request.farmaish}>{request.farmaish}</span>
            </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Requested by: <span className="font-medium">{request.fullName}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm pt-0 pb-4">
        {/* Mobile number display removed */}
        <div className="flex items-center text-muted-foreground">
          <MapPinIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          Address: <span className="text-foreground ml-1 truncate">{request.address}</span>
        </div>
        {/* Display the 'time' field (user's preferred time/program, or "Will Be Update") */}
        {request.time && (
          <div className="flex items-center text-muted-foreground">
            <ClockIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            Preferred Slot: <span className="text-foreground ml-1 truncate">{request.time}</span>
          </div>
        )}
      </CardContent>
      {submissionDate ? (
        <CardFooter className="text-xs text-muted-foreground pt-2 pb-3 border-t flex items-center">
          <CalendarDaysIcon className="mr-1.5 h-3.5 w-3.5 flex-shrink-0" />
          Submitted: {formatDistanceToNowStrict(submissionDate, { addSuffix: true })} ({format(submissionDate, 'PPP')})
        </CardFooter>
      ) : (
        <CardFooter className="text-xs text-muted-foreground pt-2 pb-3 border-t">
          Submission Date: Unknown
        </CardFooter>
      )}
    </Card>
  );
}
