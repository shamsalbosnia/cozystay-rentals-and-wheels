
import { apartmentTranslations } from './apartment.translations';
import { carTranslations } from './car.translations';
import { bookingTranslations } from './booking.translations';
import { navTranslations } from './nav.translations';
import { formTranslations } from './form.translations';
import { attractionsTranslations } from './attractions.translations';
import { aboutTranslations } from './about.translations';
import { contactTranslations } from './contact.translations';
import { commonTranslations } from './common.translations';
import { realEstateTranslations } from './realestate.translations';
import { homeTranslations } from './home.translations';
import { bundleTranslations } from './bundle.translations';
import { footerTranslations } from './footer.translations';
import { modalTranslations } from './modal.translations';
import { cardTranslations } from './card.translations';
import { roomTypesTranslations } from './roomTypes.translations';
import { citiesTranslations } from './cities.translations';
import { featuresTranslations } from './features.translations';
import { wizardBundleModalTranslations } from './wizard.bundles.modal';
import { apartmentsTranslations } from './apartments.translations';
import { villasTranslations } from './villas.translations';

export const translations = {
  ...apartmentTranslations,
  ...apartmentsTranslations,
  ...villasTranslations,
  ...carTranslations,
  ...bookingTranslations,
  ...navTranslations,
  ...formTranslations,
  ...attractionsTranslations,
  ...aboutTranslations,
  ...contactTranslations,
  ...commonTranslations,
  ...realEstateTranslations,
  ...homeTranslations,
  ...bundleTranslations,
  ...footerTranslations,
  ...modalTranslations,
  ...cardTranslations,
  ...roomTypesTranslations,
  ...citiesTranslations,
  ...featuresTranslations,
  ...wizardBundleModalTranslations
};

export type TranslationsType = typeof translations;
