
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { sendBookingEmail } from "@/utils/emailSender";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomBundleData } from "../CustomBundleWizard";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  persons: z.string().min(1, {
    message: "Number of persons is required",
  }),
  startDate: z.date(),
  endDate: z.date(),
  terms: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions.",
  }),
  comment: z.string().optional(),
});

interface SummaryStepProps {
  data: CustomBundleData;
  onPrevious: () => void;
  onClose: () => void;
}

type FormData = z.infer<typeof formSchema>;

const SummaryStep: React.FC<SummaryStepProps> = ({ data, onPrevious, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      persons: data.userInfo.totalGuests.toString(),
      startDate: data.travelDates.arrival || new Date(),
      endDate: data.travelDates.departure || new Date(),
      terms: false,
      comment: "",
    },
  });

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || "",
        persons: formData.persons,
        startDate: formData.startDate?.toLocaleDateString(),
        endDate: formData.endDate?.toLocaleDateString(),
        bookingType: "bundle",
        itemName: "Custom Travel Bundle",
      };
      
      console.log("Sending booking email with data:", bookingData);
      
      const emailSent = await sendBookingEmail(bookingData);

      // Save to DB regardless of email result
      try {
        await fetch('/api/custom-bundle-requests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_name: `${formData.firstName} ${formData.lastName}`,
            customer_email: formData.email,
            customer_phone: formData.phone || null,
            start_date: formData.startDate?.toISOString().split('T')[0],
            end_date: formData.endDate?.toISOString().split('T')[0],
            persons: parseInt(formData.persons) || 1,
            wizard_data: data,
          }),
        });
      } catch {
        // DB save failure is non-blocking
      }

      if (emailSent) {
        toast({
          title: "Bundle booking request sent successfully!",
          description: "We will contact you soon to finalize your custom bundle.",
          type: "success",
        });
        onClose();
      } else {
        toast({
          title: "Request saved!",
          description: "We received your request and will contact you shortly.",
          type: "success",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{t("wizard.summary")}</h2>
      <div className="mb-4">
        <p>
          {t("wizard.checkDetails")}
        </p>
        <ul className="list-disc pl-5">
          <li>
            {t("wizard.startDate")}: {data.travelDates.arrival?.toLocaleDateString()}
          </li>
          <li>
            {t("wizard.endDate")}: {data.travelDates.departure?.toLocaleDateString()}
          </li>
          <li>
            {t("wizard.persons")}: {data.userInfo.totalGuests}
          </li>
        </ul>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.firstName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("form.firstName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.lastName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("form.lastName")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.email")}</FormLabel>
                <FormControl>
                  <Input placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.phone")}</FormLabel>
                <FormControl>
                  <Input placeholder="+38761111222" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.comment")}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("form.additionalNotes")}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {t("form.acceptTerms")}{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-500"
                    >
                      {t("form.termsAndConditions")}
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="flex justify-between">
            <Button variant="secondary" onClick={onPrevious}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("common.loading") : t("common.submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SummaryStep;
