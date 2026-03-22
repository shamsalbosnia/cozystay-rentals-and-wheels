
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/home/FooterSection";
import { useLanguage } from "@/contexts/LanguageContext";

const PrivacyPolicy = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">
            At Shams Al Bosnia, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website and services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information that you provide directly to us, such as when you create an account, make a booking, contact customer support, or participate in surveys or promotions. This information may include your name, email address, phone number, mailing address, payment information, and any other information you choose to provide.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services, to process your transactions, to send you technical notices and support messages, to communicate with you about products, services, offers, and events, and for other purposes with your consent.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
          <p className="mb-4">
            We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, and customer service. We may also share information if required by law or if we believe it is necessary to protect our rights, property, or safety.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p className="mb-4">
            We take reasonable measures to help protect your personal information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Choices</h2>
          <p className="mb-4">
            You may update, correct, or delete your account information at any time by logging into your account or contacting us. You may also opt out of receiving promotional emails from us by following the instructions in those emails.
          </p>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default PrivacyPolicy;
