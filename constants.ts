
import { VariationStyle } from './types';

export interface ColorTheme {
  name: string;
  hex: string;
  bg: string;
}

export const THEME_COLORS: ColorTheme[] = [
  { name: "Cobalt Blue", hex: "#0047AB", bg: "#FDF5E6" },
  { name: "Emerald Green", hex: "#046307", bg: "#F0F9F0" },
  { name: "Deep Crimson", hex: "#9E1B1B", bg: "#FFF5F5" },
  { name: "Charcoal Black", hex: "#1A1A1A", bg: "#F5F5F5" },
  { name: "Amber Gold", hex: "#B45309", bg: "#FFFBEB" },
];

export const STYLE_VARIATIONS: VariationStyle[] = [
  { id: 1, name: "Monoline Drawing", prompt: "clean monoline drawing with constant line weight" },
  { id: 2, name: "Thick Outline Doodle", prompt: "bold thick outline hand-drawn doodle style" },
  { id: 3, name: "Solid Silhouette", prompt: "completely solid filled silhouette shape" },
  { id: 4, name: "Negative Space", prompt: "negative space cutout where the subject is the white space" },
  { id: 5, name: "Geometric Grid", prompt: "geometric construction based on a mathematical grid abstraction" },
  { id: 6, name: "8-Bit Pixel", prompt: "retro 8-bit pixel art style with visible blocks" },
  { id: 7, name: "Mosaic Blocks", prompt: "mosaic pattern made of square blocks of varying density" },
  { id: 8, name: "Halftone Dots", prompt: "classic comic book halftone dot pattern screen" },
  { id: 9, name: "Airbrush Grain", prompt: "soft airbrush spray with heavy grain and stippling" },
  { id: 10, name: "Pencil Sketch", prompt: "rough pencil sketch texture with graphite-like strokes" },
  { id: 11, name: "Crayon Texture", prompt: "waxy crayon texture with thick rough strokes" },
  { id: 12, name: "Pastel Texture", prompt: "soft powdery pastel texture with blended edges" },
  { id: 13, name: "Ink Bleed", prompt: "heavy ink bleed effect with wet edges soaking into paper" },
  { id: 14, name: "Paper Collage", prompt: "cut-paper collage style with sharp distinct layered edges" },
  { id: 15, name: "Linocut Print", prompt: "linocut relief print style with rough hand-carved textures" },
  { id: 16, name: "Rubber Stamp", prompt: "weathered rubber stamp imprint with uneven ink distribution" },
  { id: 17, name: "Blueprint", prompt: "technical diagram with blueprint architectural lines" },
  { id: 18, name: "Low-Poly", prompt: "low-poly wireframe 3D mesh representation" },
  { id: 19, name: "Dry Brush", prompt: "dry brush painting technique with visible bristle streaks" },
  { id: 20, name: "Hatching Fill", prompt: "parallel diagonal hatching line fill" },
  { id: 21, name: "Scribble Fill", prompt: "chaotic scribble and tangle line fill" },
  { id: 22, name: "Stripe Fill", prompt: "horizontal bold stripe fill pattern" },
  { id: 23, name: "Dither Noise", prompt: "ordered dithering noise pattern from retro displays" },
  { id: 24, name: "Riso Misregistration", prompt: "risograph print with two slightly offset layers" },
  { id: 25, name: "Charcoal Sketch", prompt: "dark smudged charcoal drawing style" },
  { id: 26, name: "Woodcut", prompt: "traditional woodcut engraving with vertical grain" },
  { id: 27, name: "Stencil Art", prompt: "street art stencil style with sharp bridges" },
  { id: 28, name: "Pointillism", prompt: "entirely composed of tiny distinct dots" },
  { id: 29, name: "Watercolor Wash", prompt: "translucent watercolor paint wash with blooming edges" },
  { id: 30, name: "Glitch Art", prompt: "digital glitch distortion with horizontal scanline shifts" },
  { id: 31, name: "ASCII Art", prompt: "text-based ASCII character representation" },
  { id: 32, name: "Origami Lines", prompt: "folded paper crease lines and geometric facets" },
  { id: 33, name: "Neon Glow", prompt: "glowing neon tube outline effect" },
  { id: 34, name: "Chalkboard", prompt: "rough chalk drawing on a textured slate background" },
  { id: 35, name: "Etching", prompt: "fine line copperplate engraving style" },
  { id: 36, name: "Marker Pen", prompt: "bold permanent marker sketch with felt tip texture" },
  { id: 37, name: "Finger Paint", prompt: "thick smeary finger paint strokes" },
  { id: 38, name: "Spray Graffiti", prompt: "spray paint graffiti with drips and overspray" },
  { id: 39, name: "Batik Texture", prompt: "wax-resist batik fabric pattern with crackle lines" },
  { id: 40, name: "Stitch Embroidery", prompt: "embroidered thread stitch pattern texture" },
  { id: 41, name: "Topographic", prompt: "topographic contour map lines" },
  { id: 42, name: "Celtic Knot", prompt: "intertwining celtic knotwork patterns" },
  { id: 43, name: "Art Deco", prompt: "1920s Art Deco geometric elegance" },
  { id: 44, name: "Bauhaus", prompt: "minimalist Bauhaus school abstract shapes" },
  { id: 45, name: "Swiss Graphic", prompt: "clean mid-century Swiss international typographic style" },
  { id: 46, name: "Pop Art", prompt: "bold pop art graphics with heavy ben-day dots" },
  { id: 47, name: "Brutalist", prompt: "raw concrete-like brutalist gritty texture" },
  { id: 48, name: "Cyber Wire", prompt: "futuristic cybernetic wireframe glowing grid" },
  { id: 49, name: "Bio-Organic", prompt: "fluid bio-organic curves and cellular patterns" },
  { id: 50, name: "Fractal", prompt: "recursive fractal geometry patterns" },
  { id: 51, name: "Spirograph", prompt: "intricate spirograph mathematical line loops" },
  { id: 52, name: "Calligraphic", prompt: "elegant brush calligraphy with varying pressure" },
  { id: 53, name: "Comic Inking", prompt: "classic 1950s comic book heavy ink shadows" },
  { id: 54, name: "Newsprint", prompt: "grainy low-resolution newspaper print texture" },
  { id: 55, name: "Sand Drawing", prompt: "grainy texture of drawing in wet sand" },
  { id: 56, name: "Cross-Hatch", prompt: "dense layered cross-hatching shade" },
];

export const getSystemPrompt = (colorName: string, colorHex: string, bgHex: string) => `
You are a master graphic designer creating a monochrome style matrix. 

MANDATORY RULES:
1. CHARACTER CONSISTENCY: Keep the EXACT identity, silhouette, pose, and face direction of the reference subject. Only change the rendering medium.
2. COLOR: Use ONLY ${colorName} (Hex ${colorHex}) ink on a warm paper background (Hex ${bgHex}). No black, no grays.
3. COMPOSITION: Center the subject. Maintain uniform scale across all variations.
4. RISO FEEL: Add subtle print texture and clean edges.`;
