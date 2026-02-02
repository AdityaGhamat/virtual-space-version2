export const SKINS = [
  { id: "player", name: "Red", color: "bg-red-500" },
  { id: "player2", name: "Blue", color: "bg-blue-500" },
];

export const generateMissionName = () => {
  const prefixes = ["Mission", "Outpost", "Station", "Base", "Sector"];
  const suffixes = ["Alpha", "Beta", "Gamma", "Delta", "Omega", "Prime"];
  const number = Math.floor(Math.random() * 999);

  const p = prefixes[Math.floor(Math.random() * prefixes.length)];
  const s = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `${p}-${s}-${number}`;
};
