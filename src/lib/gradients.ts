/** Sky gradients used wherever an image would go. They stay the same in light and dark mode, like a photo would. */
export const gradientGroups = [
  {
    title: "Morning",
    gradients: [
      { id: "first-light", name: "First Light", top: "#A9C8E8", bottom: "#FBDCC8" },
      { id: "dawn-rose", name: "Dawn Rose", top: "#B7B4DC", bottom: "#F9CFCB" },
      { id: "soft-haze", name: "Soft Haze", top: "#D5DEE8", bottom: "#F7E8D8" },
      { id: "golden-hour", name: "Golden Hour", top: "#BFD9E6", bottom: "#FDE3A8" },
      { id: "mist", name: "Mist", top: "#C9D8DE", bottom: "#EEF1EA" },
    ],
  },
  {
    title: "Day",
    gradients: [
      { id: "clear-sky", name: "Clear Sky", top: "#5BA4EC", bottom: "#CFE7F8" },
      { id: "high-noon", name: "High Noon", top: "#2F86E0", bottom: "#9AD0F5" },
      { id: "summer", name: "Summer", top: "#49B4EA", bottom: "#E6F6FB" },
      { id: "thin-cloud", name: "Thin Cloud", top: "#9CC4E8", bottom: "#F1F5F8" },
      { id: "coastal", name: "Coastal", top: "#4FA3C7", bottom: "#D4EFE6" },
    ],
  },
  {
    title: "Sunset",
    gradients: [
      { id: "dusk", name: "Dusk", top: "#6C63A8", bottom: "#F8A878" },
      { id: "ember", name: "Ember", top: "#B4506A", bottom: "#F9B26C" },
      { id: "coral", name: "Coral", top: "#E8748A", bottom: "#FCC98F" },
      { id: "afterglow", name: "Afterglow", top: "#3E4A89", bottom: "#EE8D83" },
      { id: "last-light", name: "Last Light", top: "#8D5FA6", bottom: "#F6C1A0" },
    ],
  },
  {
    title: "Night",
    gradients: [
      { id: "midnight", name: "Midnight", top: "#0B1026", bottom: "#2C3A68" },
      { id: "deep-blue", name: "Deep Blue", top: "#050A1C", bottom: "#14305C" },
      { id: "blue-hour", name: "Blue Hour", top: "#1C2A5A", bottom: "#5A6CA8" },
      { id: "aubergine", name: "Aubergine", top: "#120C2C", bottom: "#45305F" },
      { id: "moonlit", name: "Moonlit", top: "#10181F", bottom: "#3A4C5C" },
    ],
  },
] as const;

export const gradients = gradientGroups.flatMap<(typeof gradientGroups)[number]["gradients"][number]>((group) => group.gradients);

export type GradientId = (typeof gradients)[number]["id"];

export function gradientCss(id: GradientId) {
  const { top, bottom } = gradients.find((gradient) => gradient.id === id)!;
  return `linear-gradient(to bottom in oklab, ${top}, ${bottom})`;
}
