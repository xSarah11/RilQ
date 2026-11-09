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
  /** Map tile sources, tried in order. If all fail, a stylized background is shown. */
  tiles: string[];
  maxNativeZoom: number;
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
  mission: {
    title: Text;
    intro: Text;
    steps: MissionStep[];
  };
};
