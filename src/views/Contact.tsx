
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/home/FooterSection";
import QRCodeSection from "@/components/QRCodeSection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { FormInput } from "@/components/ui/form-input";

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form with react-hook-form and zod validation
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });
  
  const handleSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send');
      toast.success("Message sent successfully!");
      form.reset();
    } catch {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container relative mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-5xl font-bold mb-8 bg-clip-text text-transparent 
          bg-gradient-to-r from-green-400 via-blue-500 to-yellow-400">
            {t("contact.title")}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-xl mb-6">{t("contact.intro")}</p>
              
              <div className="space-y-8 mt-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-start gap-4 p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50"
                >
                  <MapPin className="w-6 h-6 text-green-400" />
                  <div>
                    <h3 className="font-medium">{t("contact.office")}</h3>
                    <p className="text-muted-foreground">Milana Perloga 14a, 71000 Sarajevo</p>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-start gap-4 p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50"
                >
                  <Phone className="w-6 h-6 text-blue-500" />
                  <div>
                    <h3 className="font-medium">{t("contact.phone")}</h3>
                    <p className="text-muted-foreground">+387 65 339 886</p>
                  </div>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-start gap-4 p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50"
                >
                  <Mail className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">info@shamsalbosnia.com</p>
                  </div>
                </motion.div>
                
                {/* QR Code Section */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50"
                >
                  <QRCodeSection 
                    url={typeof window !== 'undefined' ? window.location.origin : ''}
                    title="Open on your phone"
                    className="text-foreground"
                  />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 p-8 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50">
                  <FormInput
                    form={form}
                    name="name"
                    label={t("contact.form.name")}
                    placeholder={t("contact.form.name")}
                    required
                  />
                  
                  <FormInput
                    form={form}
                    name="email"
                    label={t("contact.form.email")}
                    placeholder={t("contact.form.email")}
                    type="email"
                    required
                  />
                  
                  <FormInput
                    form={form}
                    name="subject"
                    label={t("contact.form.subject")}
                    placeholder={t("contact.form.subject")}
                    required
                  />
                  
                  <div>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="block mb-2 font-medium">
                            {t("contact.form.message")}
                            <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder={t("contact.form.message")}
                              rows={5}
                              className={`resize-none bg-background/50 backdrop-blur-sm ${
                                fieldState.error ? "border-destructive focus-visible:ring-destructive" : ""
                              }`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-400 via-blue-500 to-yellow-400 hover:from-green-500 hover:via-blue-600 hover:to-yellow-500"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("contact.form.sending")}
                      </>
                    ) : (
                      t("contact.form.submit")
                    )}
                  </Button>
                </form>
              </Form>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Contact;
