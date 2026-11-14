// Shared content types for ReliQ.
// Every user-facing text has an Arabic (ar) and English (en) version.

export type Lang = "ar" | "en";
export type Text = { ar: string; en: string };

export type PlanetId = "moon" | "mars";

export type Planet = {
  id: PlanetId;
  name: Text;
  tagline: Text;
  description: Text;
  /** CSS colors used for the planet sphere on the landing page */
  colors: [string, string, string];
  /** Mean radius, used for the map scale bar and distances */
  radiusKm: number;
  /** Map tile sources, tried in order. If all fail, a stylized background is shown. */
  /** NASA Trek map layers (first = default). */
  layers: MapLayer[];
};

export type MapLayer = {
  id: string;
  name: Text;
  /** Tile URL template, {z}/{y}/{x} as served by NASA Trek WMTS */
  url: string;
  maxNativeZoom: number;
  /** id in lib/nasa/sources.ts, shown as the layer's credit */
  sourceId: string;
  attribution: string;
};

/** Visual 3D blueprint — the rover model is generated in code from this. */
export type RoverModelKind = "lunokhod" | "lrv" | "yutu" | "sojourner" | "mer" | "msl";

/** Mesh groups that can be highlighted on the 3D model */
export type PartMesh =
  | "wheels"
  | "solar"
  | "mast"
  | "arm"
  | "antenna"
  | "rtg"
  | "lid"
  | "reflector"
  | "radar"
  | "battery"
  | "apxs";

export type RoverPart = {
  id: string;
  mesh: PartMesh;
  icon: string;
  name: Text;
  role: Text;
  funFact: Text;
};

export type MissionStep = {
  situation: Text;
  options: { text: Text; correct: boolean }[];
  explanation: Text;
};

export type Rover = {
  id: string;
  planet: PlanetId;
  name: Text;
  agency: Text;
  country: Text;
  flag: string;
  landingDate: string; // ISO date
  landingSite: Text;
  lat: number;
  lng: number;
  model: RoverModelKind;
  accent: string;
  summary: Text;
  story: Text;
  achievements: Text[];
  stats: { label: Text; value: Text }[];
  parts: [RoverPart, RoverPart, RoverPart];
  /** Mass in kg, used by the comparison chart (same value as in stats) */
  massKg: number;
  /** Search words for the NASA Image and Video Library */
  nasaImagesQuery: string;
  /** Live traverse from NASA (only Perseverance today) */
  liveTraverse?: "m20";
  mission: {
    title: Text;
    intro: Text;
    steps: MissionStep[];
  };
};
