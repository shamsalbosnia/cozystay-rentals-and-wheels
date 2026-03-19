
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Check, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sendBookingEmail } from "@/utils/emailSender";
import { useLanguage } from "@/contexts/LanguageContext";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "apartment" | "car" | "villa" | "hotel" | "bundle";
  itemName?: string;
  carId?: number;
  bundleId?: number;
  hotelId?: number;
  villaId?: number;
  apartmentId?: number;
}

interface BookedRange {
  start_date: string;
  end_date: string;
  status: string;
}

// Define form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(1, { message: "Full name is required" }),
  lastName: z.string().optional(),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  persons: z.string(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date({ required_error: "End date is required" }),
});

type BookingFormValues = z.infer<typeof formSchema>;

const BookingModal = ({ isOpen, onClose, type, itemName, carId, bundleId, hotelId, villaId, apartmentId }: BookingModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const { t } = useLanguage();

  React.useEffect(() => {
    if (isOpen && type === 'car' && carId) {
      fetch(`/api/cars/${carId}/reservations`)
        .then(r => r.json())
        .then(data => setBookedRanges(Array.isArray(data) ? data : []))
        .catch(() => setBookedRanges([]));
    }
  }, [isOpen, carId, type]);

  const isDateBooked = (date: Date) => {
    return bookedRanges.some(r => {
      const start = new Date(r.start_date);
      const end = new Date(r.end_date);
      return date >= start && date < end;
    });
  };

  // Initialize the form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      persons: "1",
    },
  });

  // Auto-clear endDate if it becomes invalid after startDate changes
  const watchedStartDate = form.watch('startDate');
  React.useEffect(() => {
    const endDate = form.getValues('endDate');
    if (endDate && watchedStartDate && endDate <= watchedStartDate) {
      form.setValue('endDate', undefined as unknown as Date);
    }
  }, [watchedStartDate]);

  const resetFormAndClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (type === 'car' && carId) {
        const startStr = data.startDate.toISOString().split('T')[0];
        const endStr = data.endDate.toISOString().split('T')[0];

        const res = await fetch(`/api/cars/${carId}/reservations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: data.firstName + (data.lastName ? ` ${data.lastName}` : ''),
            customer_email: data.email,
            customer_phone: data.phone,
            start_date: startStr,
            end_date: endStr,
          }),
        });

        if (res.status === 409) {
          toast.error("Dates unavailable", { description: "This car is already booked for those dates. Please choose different dates." });
          return;
        }
        if (!res.ok) throw new Error('Failed to submit');

        toast.success("Reservation request sent!", {
          description: `Your request for ${itemName || 'this car'} (${startStr} to ${endStr}) has been submitted. We'll confirm shortly.`,
        });
        resetFormAndClose();
        return;
      }

      if (type === 'hotel' || type === 'villa' || type === 'apartment') {
        const itemId = hotelId || villaId || apartmentId;
        const startStr = data.startDate.toISOString().split('T')[0];
        const endStr = data.endDate.toISOString().split('T')[0];

        const res = await fetch(`/api/${type}s/${itemId}/reservations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: data.firstName + (data.lastName ? ` ${data.lastName}` : ''),
            customer_email: data.email,
            customer_phone: data.phone,
            start_date: startStr,
            end_date: endStr,
            persons: parseInt(data.persons),
            item_name: itemName,
          }),
        });

        if (!res.ok) throw new Error('Failed to submit');

        toast.success("Reservation request sent!", {
          description: `Your request for ${itemName || type} has been submitted. We'll confirm within 24 hours.`,
        });
        resetFormAndClose();
        return;
      }

      if (type === 'bundle') {
        const startStr = data.startDate.toISOString().split('T')[0];
        const endStr = data.endDate.toISOString().split('T')[0];

        const res = await fetch(`/api/bundles/${bundleId ?? 0}/reservations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: data.firstName + (data.lastName ? ` ${data.lastName}` : ''),
            customer_email: data.email,
            customer_phone: data.phone,
            start_date: startStr,
            end_date: endStr,
            persons: parseInt(data.persons),
            bundle_title: itemName,
          }),
        });

        if (!res.ok) throw new Error('Failed to submit');

        toast.success("Bundle booking request sent!", {
          description: `Your request for ${itemName || 'this bundle'} has been submitted. We'll confirm shortly.`,
        });
        resetFormAndClose();
        return;
      }

      const bookingData = {
        firstName: data.firstName,
        lastName: data.lastName || "",
        email: data.email,
        phone: data.phone,
        persons: data.persons,
        startDate: data.startDate?.toLocaleDateString(),
        endDate: data.endDate?.toLocaleDateString(),
        bookingType: type,
        itemName: itemName || `${type.charAt(0).toUpperCase() + type.slice(1)} Booking`,
      };
      
      const emailSent = await sendBookingEmail(bookingData);
      
      if (emailSent) {
        toast.success("Booking request sent successfully!", {
          description: `Your ${type} reservation request for ${itemName || type} has been sent. The owner will contact you soon.`,
        });
        resetFormAndClose();
      } else {
        toast.error("Failed to submit booking request", {
          description: "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast.error("Failed to submit booking request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetFormAndClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === "apartment" ? t("booking.modal.title.apartment") :
             type === "villa" ? t("booking.modal.title.villa") :
             type === "hotel" ? "Book Hotel" :
             type === "bundle" ? "Book Bundle" :
             t("booking.modal.title.car")}
            {itemName && (
              <span className="block text-sm font-normal text-muted-foreground mt-1">
                {itemName}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {t("booking.fullName")}
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder={t("booking.fullNamePlaceholder")}
                      className={cn(
                        fieldState.error && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {t("booking.email")}
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      {...field}
                      placeholder={t("booking.emailPlaceholder")}
                      className={cn(
                        fieldState.error && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {t("booking.phone")}
                    <span className="text-destructive ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="tel"
                      {...field}
                      placeholder={t("booking.phonePlaceholder")}
                      className={cn(
                        fieldState.error && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="persons"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("booking.modal.numberOfPersons")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("booking.modal.numberOfPersons")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 {t("booking.modal.person")}</SelectItem>
                      <SelectItem value="2">2 {t("booking.modal.persons")}</SelectItem>
                      <SelectItem value="3">3 {t("booking.modal.persons")}</SelectItem>
                      <SelectItem value="4">4 {t("booking.modal.persons")}</SelectItem>
                      <SelectItem value="5">5+ {t("booking.modal.persons")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      {type === "apartment" ? t("booking.modal.checkInDate") : type === "bundle" ? "Start Date" : t("booking.modal.pickupDate")}
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                              fieldState.error && "border-destructive"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "PPP") : t("booking.modal.selectDate")}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0)) || (type === 'car' ? isDateBooked(date) : false)}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field, fieldState }) => {
                  const startDate = form.watch('startDate');
                  return (
                    <FormItem>
                      <FormLabel>
                        {type === "apartment" ? t("booking.modal.checkOutDate") : type === "bundle" ? "End Date" : t("booking.modal.returnDate")}
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                                fieldState.error && "border-destructive"
                              )}
                            >
                               <CalendarIcon className="mr-2 h-4 w-4" />
                               {field.value ? format(field.value, "PPP") : t("booking.modal.selectDate")}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => 
                              date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                              (startDate ? date <= startDate : false) ||
                              (type === 'car' ? isDateBooked(date) : false)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={resetFormAndClose} disabled={isSubmitting}>
                {t("booking.modal.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("booking.modal.processing")}
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    {t("booking.confirmBooking")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
