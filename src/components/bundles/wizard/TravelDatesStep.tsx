import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { CustomBundleData } from "../CustomBundleWizard";
import { cn } from "@/lib/utils";
import { User, Mail, Phone, Users, Baby, UserCheck } from "lucide-react";

interface TravelDatesStepProps {
  data: CustomBundleData;
  onUpdate: (data: CustomBundleData) => void;
  onNext: () => void;
}

const TravelDatesStep = ({ data, onUpdate, onNext }: TravelDatesStepProps) => {
  const { t } = useLanguage();

  const handleUserInfoChange = (field: keyof typeof data.userInfo, value: string | number) => {
    onUpdate({
      ...data,
      userInfo: {
        ...data.userInfo,
        [field]: value,
      },
    });
  };

  const handleArrivalDateChange = (date: Date | undefined) => {
    onUpdate({
      ...data,
      travelDates: {
        ...data.travelDates,
        arrival: date || null,
      },
    });
  };

  const handleDepartureDateChange = (date: Date | undefined) => {
    onUpdate({
      ...data,
      travelDates: {
        ...data.travelDates,
        departure: date || null,
      },
    });
  };

  const handleAirportTransferChange = (checked: boolean) => {
    onUpdate({
      ...data,
      airportTransfer: checked,
    });
  };

  const canProceed = data.travelDates.arrival && 
                    data.travelDates.departure && 
                    data.userInfo.fullName && 
                    data.userInfo.email && 
                    data.userInfo.phone;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">
          {t("bundle.wizard.step1.subtitle")}
        </h3>
        <p className="text-muted-foreground">
          {t("bundle.wizard.step1.description")}
        </p>
      </div>

      {/* User Information Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4" />
            {t("bundle.wizard.step1.contactInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">
                <User className="h-4 w-4 inline mr-1" />
                {t("bundle.wizard.step1.fullName")} *
              </Label>
              <Input
                type="text"
                value={data.userInfo.fullName}
                onChange={(e) => handleUserInfoChange('fullName', e.target.value)}
                placeholder={t("bundle.wizard.step1.fullNamePlaceholder")}
                required
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                <Mail className="h-4 w-4 inline mr-1" />
                {t("bundle.wizard.step1.email")} *
              </Label>
              <Input
                type="email"
                value={data.userInfo.email}
                onChange={(e) => handleUserInfoChange('email', e.target.value)}
                placeholder={t("bundle.wizard.step1.emailPlaceholder")}
                required
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium">
              <Phone className="h-4 w-4 inline mr-1" />
              {t("bundle.wizard.step1.phone")} *
            </Label>
            <Input
              type="tel"
              value={data.userInfo.phone}
              onChange={(e) => handleUserInfoChange('phone', e.target.value)}
              placeholder={t("bundle.wizard.step1.phonePlaceholder")}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">
                <Users className="h-4 w-4 inline mr-1" />
                {t("bundle.wizard.step1.adults")}
              </Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={data.userInfo.totalGuests || ""}
                onChange={(e) => handleUserInfoChange('totalGuests', parseInt(e.target.value) || 1)}
                placeholder={t("bundle.wizard.step1.adultsPlaceholder")}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                <Baby className="h-4 w-4 inline mr-1" />
                {t("bundle.wizard.step1.kids02")}
              </Label>
              <Input
                type="number"
                min="0"
                max="5"
                value={data.userInfo.kids02 || ""}
                onChange={(e) => handleUserInfoChange('kids02', parseInt(e.target.value) || 0)}
                placeholder={t("bundle.wizard.step1.kidsPlaceholder")}
              />
            </div>
            <div>
              <Label className="text-sm font-medium">
                <UserCheck className="h-4 w-4 inline mr-1" />
                {t("bundle.wizard.step1.kids211")}
              </Label>
              <Input
                type="number"
                min="0"
                max="5"
                value={data.userInfo.kids211 || ""}
                onChange={(e) => handleUserInfoChange('kids211', parseInt(e.target.value) || 0)}
                placeholder={t("bundle.wizard.step1.kidsPlaceholder")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Travel Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-base font-medium">
                {t("bundle.wizard.step1.arrivalDate")}
              </Label>
              <Calendar
                mode="single"
                selected={data.travelDates.arrival || undefined}
                onSelect={handleArrivalDateChange}
                disabled={(date) => date < new Date()}
                className={cn("rounded-md border pointer-events-auto")}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">
                {t("bundle.wizard.step1.departureDate")}
              </Label>
              <Calendar
                mode="single"
                selected={data.travelDates.departure || undefined}
                onSelect={handleDepartureDateChange}
                disabled={(date) => date < new Date() || !!(data.travelDates.arrival && date <= data.travelDates.arrival)}
                className={cn("rounded-md border pointer-events-auto")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="border rounded-lg p-4 bg-accent/10">
        <div className="flex items-center space-x-3">
          <Switch
            id="airport-transfer"
            checked={data.airportTransfer}
            onCheckedChange={handleAirportTransferChange}
          />
          <Label htmlFor="airport-transfer" className="text-base font-medium">
            {t("bundle.wizard.step1.airportTransfer")}
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mt-2 ml-7">
          {t("bundle.wizard.step1.airportTransferDesc")}
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          size="lg"
        >
          {t("bundle.wizard.next")}
        </Button>
      </div>
    </div>
  );
};

export default TravelDatesStep;