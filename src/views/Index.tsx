
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import CarRentalSection from "@/components/home/CarRentalSection";
import FooterSection from "@/components/home/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <TrustBar />
        <CarRentalSection />
        <FooterSection />
      </div>
    </div>
  );
};

export default Index;
