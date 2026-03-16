import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomBundleData } from "../CustomBundleWizard";
import { UserCheck, Users, Car } from "lucide-react";

interface DriverSelectionStepProps {
  data: CustomBundleData;
  onUpdate: (data: CustomBundleData) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DriverSelectionStep = ({ data, onUpdate, onNext, onPrevious }: DriverSelectionStepProps) => {
  const { t } = useLanguage();
  const [wantsDriver, setWantsDriver] = useState(data.driver.requested ? "yes" : "no");

  const handleDriverChange = (value: string) => {
    setWantsDriver(value);
    onUpdate({
      ...data,
      driver: {
        requested: value === "yes",
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {t("bundle.wizard.step4.subtitle")}
        </h3>
        <p className="text-muted-foreground">
          {t("bundle.wizard.step4.description")}
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Car className="h-8 w-8 text-primary" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t("bundle.wizard.step4.wantDriver")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup value={wantsDriver} onValueChange={handleDriverChange}>
            <Card className={`cursor-pointer transition-all ${wantsDriver === "yes" ? "ring-2 ring-primary" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="yes" id="yes" />
                  <div className="flex items-center space-x-3 flex-1">
                    <UserCheck className="h-6 w-6 text-primary" />
                    <div>
                      <Label htmlFor="yes" className="text-base font-medium cursor-pointer">
                        {t("bundle.wizard.step4.yesDriver")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("bundle.wizard.step4.yesDriverDesc")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`cursor-pointer transition-all ${wantsDriver === "no" ? "ring-2 ring-primary" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <RadioGroupItem value="no" id="no" />
                  <div className="flex items-center space-x-3 flex-1">
                    <Users className="h-6 w-6 text-primary" />
                    <div>
                      <Label htmlFor="no" className="text-base font-medium cursor-pointer">
                        {t("bundle.wizard.step4.noDriver")}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t("bundle.wizard.step4.noDriverDesc")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          {t("bundle.wizard.previous")}
        </Button>
        <Button onClick={onNext}>
          {t("bundle.wizard.next")}
        </Button>
      </div>
    </div>
  );
};

export default DriverSelectionStep;