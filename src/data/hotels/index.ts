
import { GroupedHotel } from "@/types/hotel";
import { groupedHotelsSarajevo } from './sarajevo';
import { groupedHotelsMostar } from './mostar';
import { groupedHotelsKonjic } from './konjic';
import { groupedHotelsTravnik } from './travnik';
import { groupedHotelsJajce } from './jajce';
import { groupedHotelsBihac } from './bihac';
import { groupedHotelsBugojno } from "./bugojno";

// Export individual location groups
export { groupedHotelsSarajevo } from './sarajevo';
export { groupedHotelsMostar } from './mostar';
export { groupedHotelsKonjic } from './konjic';
export { groupedHotelsTravnik } from './travnik';
export { groupedHotelsJajce } from './jajce';
export { groupedHotelsBihac } from './bihac';
export { groupedHotelsBugojno } from './bugojno';

// Combine all hotels
export const allHotels: GroupedHotel[] = [
  ...groupedHotelsSarajevo,
  ...groupedHotelsMostar,
  ...groupedHotelsKonjic,
  ...groupedHotelsTravnik,
  ...groupedHotelsJajce,
  ...groupedHotelsBihac,
  ...groupedHotelsBugojno
];
