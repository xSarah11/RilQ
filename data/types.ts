// Shared content types for ReliQ.
// Every user-facing text has an Arabic (ar) and English (en) version.

export type Lang = "ar" | "en";
export type Text = { ar: string; en: string };

export type PlanetId = "moon" | "mars";

/** A link to an official source (NASA / agency page or dataset). */
export type SourceLink = { label: string; url: string };

/** One NASA Trek WMTS map layer (equirectangular, EPSG:4326 tile grid). */
export type MapLayer = {
  id: string;
  name: Text;
  /** Instrument / mission that produced the mosaic */
  instrument: Text;
  /** Tile URL template ({z}/{y}/{x}). */
  url: string;
  maxNativeZoom: number;
  /** Official dataset page */
  source: SourceLink;
};

export type Planet = {
  id: PlanetId;
  name: Text;
  tagline: Text;
  description: Text;
  /** CSS colors used for the planet sphere on the landing page */
  colors: [string, string, string];
  /** NASA Trek map layers. The first one is the default; others appear in the layer switcher.
   *  If a layer fails to load, the map falls back to the next one, then to a stylized background. */
  layers: MapLayer[];
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
  /** Mission status. "unknown" = no recent official update we could verify. */
  status: "active" | "ended" | "unknown";
  /** Last day of operations (ISO). null for active / unknown missions. */
  endDate: string | null;
  /** Numeric facts used by the interactive charts (Data Lab). null = not reliably known / still changing. */
  numbers: {
    massKg: number;
    wheels: number;
    /** Total distance driven (km) for finished missions. null for ongoing missions (changes daily). */
    distanceKm: number | null;
  };
  /** Search terms for the NASA Image and Video Library (images-api.nasa.gov). */
  nasaImageQuery: string;
  /** Official sources for the facts on this page. */
  sources: SourceLink[];
  parts: [RoverPart, RoverPart, RoverPart];
  mission: {
    title: Text;
    intro: Text;
    steps: MissionStep[];
  };
};
