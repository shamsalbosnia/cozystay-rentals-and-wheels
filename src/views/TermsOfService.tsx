
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/home/FooterSection";
import { useLanguage } from "@/contexts/LanguageContext";

const TermsOfService = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="mb-4">
            These Terms of Service ("Terms") govern your use of the Shams Al Bosnia website and services. By accessing or using our services, you agree to be bound by these Terms.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the Shams Al Bosnia website, mobile applications, or any other features, technologies, or functionalities offered by Shams Al Bosnia, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Service Description</h2>
          <p className="mb-4">
            Shams Al Bosnia provides rental services for apartments and vehicles in Bosnia and Herzegovina. Our services include facilitating bookings, providing information about rental properties and vehicles, and customer support related to these services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p className="mb-4">
            Some features of our services require registration. When you register, you agree to provide accurate, current, and complete information and to update this information to maintain its accuracy. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Booking and Cancellation</h2>
          <p className="mb-4">
            All bookings made through Shams Al Bosnia are subject to availability and acceptance by the property or vehicle owner. Cancellation policies vary by property and vehicle and will be specified at the time of booking.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="mb-4">
            Shams Al Bosnia will not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of our services.
          </p>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default TermsOfService;
