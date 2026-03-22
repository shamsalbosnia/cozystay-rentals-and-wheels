
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/home/FooterSection";
import { useLanguage } from "@/contexts/LanguageContext";

const CookiePolicy = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">
            This Cookie Policy explains how Shams Al Bosnia uses cookies and similar technologies on our website.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies</h2>
          <p className="mb-4">
            Cookies are small text files that are stored on your browser or device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Cookies</h2>
          <p className="mb-4">
            We use cookies for several purposes, including:
          </p>
          <ul className="list-disc ml-8 mb-4">
            <li>Essential cookies: These are necessary for the website to function properly.</li>
            <li>Analytical/performance cookies: These allow us to recognize and count the number of visitors and to see how visitors move around our website.</li>
            <li>Functionality cookies: These are used to recognize you when you return to our website.</li>
            <li>Targeting cookies: These record your visit to our website, the pages you have visited, and the links you have followed.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Third-Party Cookies</h2>
          <p className="mb-4">
            Some cookies are placed by third parties on our website. These third parties may include analytics providers, advertising networks, and social media platforms. These third parties may use cookies, alone or in conjunction with web beacons or other tracking technologies, to collect information about you when you use our website.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Managing Cookies</h2>
          <p className="mb-4">
            Most web browsers allow you to manage your cookie preferences. You can set your browser to refuse cookies or to alert you when cookies are being sent. However, if you disable cookies, some features of our website may not function properly.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Changes to This Cookie Policy</h2>
          <p className="mb-4">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The updated version will be indicated by an updated "Last Updated" date.
          </p>
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default CookiePolicy;
