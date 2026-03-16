
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { sendEmail } from '@/utils/emailSender';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

// Define form schema with Zod
const formSchema = z.object({
  bookingType: z.enum(['apartment', 'car']),
  email: z.string().email({ message: "Valid email is required" }),
  checkInDate: z.date({ required_error: "Check-in date is required" }),
  checkOutDate: z.date({ required_error: "Check-out date is required" }),
  location: z.string().optional(),
  guests: z.string().optional(),
  carType: z.string().optional(),
  pickupLocation: z.string().optional(),
});

type BookingFormValues = z.infer<typeof formSchema>;

const BookingForm = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingType: 'apartment',
      email: '',
      location: 'sarajevo',
      guests: '2',
      carType: 'sedan',
      pickupLocation: 'sarajevo-airport',
    },
  });
  
  const bookingType = form.watch('bookingType');
  
  const handleSubmit = async (data: BookingFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format dates for email body
      const formattedStartDate = data.checkInDate ? format(data.checkInDate, "PPP") : "";
      const formattedEndDate = data.checkOutDate ? format(data.checkOutDate, "PPP") : "";
      
      // Create email subject and body
      const subject = `New ${data.bookingType === 'apartment' ? 'Apartment' : 'Car'} Booking Request`;
      
      let emailBody = `
        New ${data.bookingType === 'apartment' ? 'Apartment' : 'Car'} Booking Request:
        
        Email: ${data.email}
        ${data.bookingType === 'apartment' ? 'Check-in' : 'Pickup'} Date: ${formattedStartDate}
        ${data.bookingType === 'apartment' ? 'Checkout' : 'Return'} Date: ${formattedEndDate}
      `;
      
      // Add specific details based on booking type
      if (data.bookingType === 'apartment') {
        emailBody += `
        Location: ${data.location}
        Number of Guests: ${data.guests}
        `;
      } else {
        emailBody += `
        Pickup Location: ${data.pickupLocation}
        Car Type: ${data.carType}
        `;
      }
      
      // Send email
      const emailSent = await sendEmail({
        to: 'vekazmef@gmail.com', 
        subject,
        body: emailBody
      });
      
      if (emailSent) {
        toast.success("Request submitted successfully!", {
          description: "We'll check availability and get back to you soon.",
        });
        // Reset form after successful submission
        form.reset();
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={bookingType === 'apartment' ? 'default' : 'outline'}
            className="rounded-full"
            onClick={() => form.setValue('bookingType', 'apartment')}
          >
            Apartments
          </Button>
          <Button
            type="button"
            variant={bookingType === 'car' ? 'default' : 'outline'}
            className="rounded-full"
            onClick={() => form.setValue('bookingType', 'car')}
          >
            Cars
          </Button>
        </div>
        
        <div className="space-y-4">
          {bookingType === 'apartment' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sarajevo">Sarajevo</SelectItem>
                          <SelectItem value="mostar">Mostar</SelectItem>
                          <SelectItem value="banja-luka">Banja Luka</SelectItem>
                          <SelectItem value="tuzla">Tuzla</SelectItem>
                          <SelectItem value="neum">Neum</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Guests</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Guests" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 Person</SelectItem>
                          <SelectItem value="2">2 Persons</SelectItem>
                          <SelectItem value="3">3 Persons</SelectItem>
                          <SelectItem value="4">4+ Persons</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pickupLocation"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Pickup Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pickup Location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sarajevo-airport">Sarajevo Airport</SelectItem>
                          <SelectItem value="sarajevo-center">Sarajevo City Center</SelectItem>
                          <SelectItem value="mostar">Mostar</SelectItem>
                          <SelectItem value="banja-luka">Banja Luka</SelectItem>
                          <SelectItem value="tuzla-airport">Tuzla Airport</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="carType"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Car Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Car Type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="economy">Economy</SelectItem>
                          <SelectItem value="sedan">Sedan</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="checkInDate"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-2">
                  <FormLabel>
                    {bookingType === 'apartment' ? 'Check In' : 'Pickup Date'}
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
                          {field.value ? format(field.value, "PPP") : "Select Date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="checkOutDate"
              render={({ field, fieldState }) => {
                const checkInDate = form.watch('checkInDate');
                return (
                  <FormItem className="space-y-2">
                    <FormLabel>
                      {bookingType === 'apartment' ? 'Checkout' : 'Return Date'}
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
                            {field.value ? format(field.value, "PPP") : "Select Date"}
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
                            (checkInDate ? date <= checkInDate : false)
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
          
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel>
                  Email
                  <span className="text-destructive ml-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="your@email.com"
                    {...field}
                    className={cn(
                      fieldState.error && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Check'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;
