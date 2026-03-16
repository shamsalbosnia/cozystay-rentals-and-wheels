
import { GroupedVilla } from "@/types/villa";
import { groupedVillasVlasic } from "./vlasic";
import { groupedVillasBihac } from "./bihac";
import { groupedVillasMostar } from "./mostar";
import { groupedVillasSarajevo } from "./sarajevo";

export const allVillas: GroupedVilla[] = [
  ...groupedVillasVlasic,
  ...groupedVillasBihac,
  ...groupedVillasMostar,
  ...groupedVillasSarajevo
];

export { 
  groupedVillasVlasic,
  groupedVillasBihac,
  groupedVillasMostar,
  groupedVillasSarajevo
};
