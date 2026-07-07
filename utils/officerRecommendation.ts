export function recommendOfficer(category: string) {
  switch (category) {
    case "Garbage":
      return "sanitation_officer";

    case "Pothole":
      return "road_officer";

    case "Streetlight":
      return "electric_officer";

    default:
      return "";
  }
}