
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyFeaturesProps {
  features: string[];
}

const PropertyFeatures = ({ features }: PropertyFeaturesProps) => {
  const { t } = useLanguage();

  if (features.length === 0) return null;

  // Function to generate feature translation key
  const getFeatureTranslationKey = (feature: string) => {
    return `card.features.${feature.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}`;
  };

  // Function to get translated feature with fallback
  const getTranslatedFeature = (feature: string) => {
    const translationKey = getFeatureTranslationKey(feature);
    const translatedValue = t(translationKey);
    
    // If translation key is returned as-is, it means translation doesn't exist
    // Return the original feature name as fallback
    if (translatedValue === translationKey) {
      return feature;
    }
    
    return translatedValue;
  };

  return (
    <>
      <h4 className="text-sm font-medium mb-2">{t("card.features")}</h4>
      <ul className="grid grid-cols-1 gap-1 text-sm text-muted-foreground">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 text-primary p-0.5">
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {getTranslatedFeature(feature)}
          </li>
        ))}
      </ul>
    </>
  );
};

export default PropertyFeatures;
