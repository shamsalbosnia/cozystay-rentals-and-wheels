
import { GroupedApartment } from "@/types/apartment";
import { groupedApartmentsSarajevo } from "./sarajevo";
import { groupedApartmentsMostar } from "./mostar";
import { groupedApartmentsJajce } from "./jajce";
import { groupedApartmentsBihac } from "./bihac";
import { groupedApartmentsDonjivakuf } from "./donjivakuf";

export const allApartments: GroupedApartment[] = [
  ...groupedApartmentsSarajevo,
  ...groupedApartmentsMostar,
  ...groupedApartmentsJajce,
  ...groupedApartmentsBihac,
  ...groupedApartmentsDonjivakuf
];

export { 
  groupedApartmentsSarajevo,
  groupedApartmentsMostar,
  groupedApartmentsJajce,
  groupedApartmentsBihac,
  groupedApartmentsDonjivakuf
};
