import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomBundleData } from "../CustomBundleWizard";
import { Car } from "lucide-react";

interface CarRentalStepProps {
  data: CustomBundleData;
  onUpdate: (data: CustomBundleData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

// Mock car data - replace with real data from your car data source
const availableCars = [
  {
    id: "1",
    name: "Economy Car",
    description: "Perfect for city driving",
    pricePerDay: 25,
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000"
  },
  {
    id: "2", 
    name: "Compact SUV",
    description: "Great for mountain roads",
    pricePerDay: 35,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1000"
  },
  {
    id: "3",
    name: "Luxury Sedan",
    description: "Premium comfort and style",
    pricePerDay: 50,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1000"
  },
  {
    id: "4",
    name: "Combi / Van",
    description: "Spacious van for up to 7 passengers",
    pricePerDay: 45,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000"
  }
];

const CarRentalStep = ({ data, onUpdate, onNext, onPrevious }: CarRentalStepProps) => {
  const { t } = useLanguage();
  const [wantsCar, setWantsCar] = useState(data.carRental.selected ? "yes" : "no");
  const [selectedCarId, setSelectedCarId] = useState(data.carRental.carId || "");

  const handleCarWantChange = (value: string) => {
    setWantsCar(value);
    if (value === "no") {
      onUpdate({
        ...data,
        carRental: {
          selected: false,
        },
      });
      setSelectedCarId("");
      // Skip to summary step if no car is needed
      setTimeout(() => onNext(), 100);
    } else {
      onUpdate({
        ...data,
        carRental: {
          selected: true,
        },
      });
    }
  };

  const handleCarSelection = (carId: string) => {
    setSelectedCarId(carId);
    const selectedCar = availableCars.find(car => car.id === carId);
    if (selectedCar) {
      onUpdate({
        ...data,
        carRental: {
          selected: true,
          carId: carId,
          carName: selectedCar.name,
        },
      });
    }
  };

  const canProceed = wantsCar === "no" || (wantsCar === "yes" && selectedCarId);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {t("bundle.wizard.step3.subtitle")}
        </h3>
        <p className="text-muted-foreground">
          {t("bundle.wizard.step3.description")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("bundle.wizard.step3.wantCar")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={wantsCar} onValueChange={handleCarWantChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes">{t("bundle.wizard.step3.yes")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no">{t("bundle.wizard.step3.no")}</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {wantsCar === "yes" && (
        <div className="space-y-4">
          <Label className="text-base font-medium">
            {t("bundle.wizard.step3.selectCar")}
          </Label>
          <div className="grid gap-4">
            {availableCars.map((car) => (
              <Card 
                key={car.id} 
                className={`cursor-pointer transition-all ${
                  selectedCarId === car.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => handleCarSelection(car.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center">
                      <Car className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{car.name}</h4>
                      <p className="text-sm text-muted-foreground">{car.description}</p>
                      <p className="text-sm font-medium text-primary">
                        {car.pricePerDay} BAM/{t("bundle.wizard.step3.perDay")}
                      </p>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                      {selectedCarId === car.id && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          {t("bundle.wizard.previous")}
        </Button>
        <Button onClick={onNext} disabled={!canProceed}>
          {t("bundle.wizard.next")}
        </Button>
      </div>
    </div>
  );
};

export default CarRentalStep;