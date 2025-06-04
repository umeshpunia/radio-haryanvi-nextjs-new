
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Donor, getDonors } from "@/services/donor-service";
import { DonorCard } from "@/components/donors/donor-card";
import { DonorForm } from "@/components/donors/donor-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircleIcon, SearchIcon, HeartHandshakeIcon, FilterXIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const bloodGroups = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Skeleton for the card, used in DonorsPageSkeleton and isLoading state
function CardSkeleton() {
  return (
    <div className="flex flex-col space-y-3 p-6 border rounded-lg bg-card shadow-md">
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-4 w-1/2" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-4 w-1/3 mt-2" />
    </div>
  );
}

// Skeleton for the entire DonorsPage, shown before client-side hydration
function DonorsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <Skeleton className="w-16 h-16 mx-auto mb-4 rounded-full" />
        <Skeleton className="h-10 w-3/4 md:w-1/2 mx-auto mb-2" />
        <Skeleton className="h-6 w-1/2 md:w-1/3 mx-auto" />
      </header>
      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1">
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full md:w-auto" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}


export default function DonorsPage() {
  const [isClient, setIsClient] = useState(false);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true); // isLoading now primarily for data fetching
  const [error, setError] = useState<string | null>(null);

  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>("All");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchAndSetDonors = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedDonors = await getDonors();
      console.log(fetchedDonors)
      setDonors(fetchedDonors);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load donors.");
      setDonors([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array as it doesn't depend on component state/props directly

  useEffect(() => {
    if (isClient) {
      fetchAndSetDonors();
    }
  }, [isClient, fetchAndSetDonors]);

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const bloodGroupMatch =
        bloodGroupFilter === "All" || donor.bloodGroup === bloodGroupFilter;
      const locationMatch =
        locationFilter === "" ||
        donor.address.toLowerCase().includes(locationFilter.toLowerCase()) ||
        donor.area.toLowerCase().includes(locationFilter.toLowerCase());
      return bloodGroupMatch && locationMatch && donor.active; // Only show active donors
    });
  }, [donors, bloodGroupFilter, locationFilter]);

  const handleClearFilters = () => {
    setBloodGroupFilter("All");
    setLocationFilter("");
  };
  
  if (!isClient) {
    return <DonorsPageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <HeartHandshakeIcon className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary mb-2">
          Blood Donors
        </h1>
        <p className="text-lg text-muted-foreground">
          Find a donor or register to save lives.
        </p>
      </header>

      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <h2 className="text-2xl font-semibold">Find a Donor</h2>
             <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircleIcon className="mr-2 h-5 w-5" /> Register as a Donor
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] md:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                    <DialogTitle>Become a Blood Donor</DialogTitle>
                    <DialogDescription>
                        Fill in your details below. Your contribution can save a life.
                    </DialogDescription>
                    </DialogHeader>
                    <DonorForm 
                        onSuccess={() => {
                            fetchAndSetDonors(); // Refresh list after adding
                            setIsFormOpen(false); // Close dialog
                        }}
                        setOpen={setIsFormOpen}
                    />
                </DialogContent>
            </Dialog>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label htmlFor="bloodGroupFilter" className="block text-sm font-medium text-muted-foreground mb-1">Blood Group</label>
            <Select
              value={bloodGroupFilter}
              onValueChange={setBloodGroupFilter}
            >
              <SelectTrigger id="bloodGroupFilter">
                <SelectValue placeholder="Filter by blood group" />
              </SelectTrigger>
              <SelectContent>
                {bloodGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group === "All" ? "All Blood Groups" : group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="locationFilter" className="block text-sm font-medium text-muted-foreground mb-1">Location (Address/Area)</label>
            <div className="relative">
                <Input
                    id="locationFilter"
                    type="text"
                    placeholder="Search by address or area..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pr-10"
                />
                <SearchIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
           <Button variant="outline" onClick={handleClearFilters} className="w-full md:w-auto">
            <FilterXIcon className="mr-2 h-4 w-4" /> Clear Filters
          </Button>
        </div>
      </div>

      {isLoading && ( // This isLoading is true after isClient is true, during data fetch
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <p className="text-center text-destructive py-10">{error}</p>
      )}

      {!isLoading && !error && filteredDonors.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No donors found matching your criteria.
          {donors.length === 0 && " Be the first to register!"}
        </p>
      )}

      {!isLoading && !error && filteredDonors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map((donor) => (
            <DonorCard key={donor.id} donor={donor} />
          ))}
        </div>
      )}
    </div>
  );
}

    