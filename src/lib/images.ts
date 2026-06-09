/** Curated Unsplash photography — nature, SA landscapes, human workspaces */

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  /** Cape Town — Table Mountain & city bowl */
  hero: u("photo-1580060839134-75a5ed3802e8", 1600),
  /** Drakensberg / mountain mist */
  mountains: u("photo-1506905925346-21bda4d32df4", 1400),
  /** Green forest canopy */
  forest: u("photo-1448375248136-0fce97623457", 1000),
  /** Fynbos / coastal hills */
  fynbos: u("photo-1470071459604-3b5ec3a8fe09", 1000),
  /** Ocean & cliffs */
  coast: u("photo-1505142468610-359e7d316be0", 1000),
  /** Workspace with plants & natural light */
  studio: u("photo-1497366216548-37526070297c", 1000),
  /** Team collaboration */
  team: u("photo-1522071820081-009f0129c71c", 800),
  /** Hands / craft */
  craft: u("photo-1454165804603-c3d57bc86b40", 800),
  /** Abstract green texture */
  leaves: u("photo-1518531937817-91bf19889b4c", 800),
  /** Golden hour grassland */
  grassland: u("photo-1500382017468-9049fed747ef", 1200),
} as const;

export const CAPABILITY_IMAGES = [
  { src: IMAGES.forest, alt: "Forest light through trees" },
  { src: IMAGES.fynbos, alt: "Misty green hills at dawn" },
  { src: IMAGES.studio, alt: "Bright studio with plants" },
  { src: IMAGES.craft, alt: "Planning at a wooden desk" },
] as const;

export const WORK_IMAGES = [
  { src: IMAGES.coast, alt: "South African coastline" },
  { src: IMAGES.grassland, alt: "Open grassland at sunset" },
  { src: IMAGES.leaves, alt: "Green leaf texture" },
  { src: IMAGES.mountains, alt: "Mountain range in mist" },
  { src: IMAGES.fynbos, alt: "Rolling green hills" },
  { src: IMAGES.forest, alt: "Forest path" },
] as const;

export const TEAM_IMAGES = [
  { src: u("photo-1573496359142-b8d87734a5a2", 600), alt: "Design lead portrait" },
  { src: u("photo-1507003211169-0a1dd7228f2d", 600), alt: "Engineer portrait" },
  { src: u("photo-1580482116065-967737195f0f", 600), alt: "Brand director portrait" },
] as const;
