import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Progress } from "@/components/ui/progress";
import { X } from "lucide-react";
import TravelDatesStep from "./wizard/TravelDatesStep";
import HotelSelectionStep from "./wizard/HotelSelectionStep";
import CarRentalStep from "./wizard/CarRentalStep";
import DriverSelectionStep from "./wizard/DriverSelectionStep";
import AdventuresStep from "./wizard/AdventuresStep";
import SummaryStep from "./wizard/SummaryStep";

interface CustomBundleWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CustomBundleData {
  userInfo: {
    fullName: string;
    email: string;
    phone: string;
    totalGuests: number;
    kids02: number;
    kids211: number;
  };
  travelDates: {
    arrival: Date | null;
    departure: Date | null;
  };
  airportTransfer: boolean;
  hotels: Array<{
    id: string;
    city: string;
    hotelName: string;
    checkIn: Date;
    checkOut: Date;
    roomType?: string;
    roomQuantities?: {
      single: number;
      double: number;
      triple: number;
    };
    totalPricePerNight?: number;
    guests?: number;
  }>;
  carRental: {
    selected: boolean;
    carId?: string;
    carName?: string;
  };
  driver: {
    requested: boolean;
  };
  adventures?: Array<{
    id: string;
    title: string;
    city: string;
    date: Date;
    price: number;
    duration: string;
  }>;
  defaultGuestCount: number;
}

const CustomBundleWizard = ({ isOpen, onClose }: CustomBundleWizardProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  const [bundleData, setBundleData] = useState<CustomBundleData>({
    userInfo: {
      fullName: "",
      email: "",
      phone: "",
      totalGuests: 2,
      kids02: 0,
      kids211: 0,
    },
    travelDates: {
      arrival: null,
      departure: null,
    },
    airportTransfer: false,
    hotels: [],
    carRental: {
      selected: false,
    },
    driver: {
      requested: false,
    },
    adventures: [],
    defaultGuestCount: 2,
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setBundleData({
      userInfo: {
        fullName: "",
        email: "",
        phone: "",
        totalGuests: 2,
        kids02: 0,
        kids211: 0,
      },
      travelDates: {
        arrival: null,
        departure: null,
      },
      airportTransfer: false,
      hotels: [],
      carRental: {
        selected: false,
      },
      driver: {
        requested: false,
      },
      adventures: [],
      defaultGuestCount: 2,
    });
    onClose();
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return t("bundle.wizard.step1.title");
      case 2:
        return t("bundle.wizard.step2.title");
      case 3:
        return t("bundle.wizard.step3.title");
      case 4:
        return t("bundle.wizard.step4.title");
      case 5:
        return "Adventures";
      case 6:
        return t("bundle.wizard.step5.title");
      default:
        return "";
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TravelDatesStep
            data={bundleData}
            onUpdate={setBundleData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <HotelSelectionStep
            data={bundleData}
            onUpdate={setBundleData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <CarRentalStep
            data={bundleData}
            onUpdate={setBundleData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <DriverSelectionStep
            data={bundleData}
            onUpdate={setBundleData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 5:
        return (
          <AdventuresStep
            data={bundleData}
            onUpdate={setBundleData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 6:
        return (
          <SummaryStep
            data={bundleData}
            onPrevious={handlePrevious}
            onClose={handleClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-center">
            {t("bundle.wizard.title")}
          </DialogTitle>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {t("bundle.wizard.step")} {currentStep} {t("bundle.wizard.of")} {totalSteps}
              </span>
              <span className="text-sm font-medium">{getStepTitle()}</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
          </div>
        </DialogHeader>
        
        <div className="mt-6">
          {renderCurrentStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomBundleWizard;
