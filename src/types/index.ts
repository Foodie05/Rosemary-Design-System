export type SectionId =
  | "overview"
  | "philosophy"
  | "brand"
  | "foundations"
  | "components"
  | "patterns"
  | "dodont"
  | "platforms"
  | "accessibility"
  | "tokens"
  | "content"
  | "ai-guide"
  | "governance";

export interface NavItem {
  id: string;
  title: string;
  subtitle?: string;
  section: SectionId;
  badge?: string;
  children?: {
    id: string;
    title: string;
  }[];
}

export type DoDontCategory =
  | "Navigation"
  | "Actions"
  | "Forms & Inputs"
  | "Feedback & States"
  | "Layout & Content"
  | "Data & Visualization"
  | "Accessibility"
  | "Motion & Transitions"
  | "Platform Behavior"
  | "System Resilience";

export interface DoDontCase {
  id: string;
  number: number;
  category: DoDontCategory;
  tags: string[];
  title: string;
  summary: string;
  why: string;
  doText: string;
  dontText: string;
  impact: "High" | "Critical" | "Medium";
  applicablePlatforms: (
    "Web" | "Flutter" | "iOS" | "Android" | "macOS" | "Windows"
  )[];
  tokensInvolved?: string[];
  status?: "Stable" | "Beta" | "Draft";
  visualType?: "ui-mockup" | "flow" | "layout" | "component" | "code";
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface DesignToken {
  name: string;
  value: string;
  category:
    | "color"
    | "typography"
    | "spacing"
    | "radius"
    | "shadow"
    | "motion"
    | "elevation";
  subCategory: string;
  description: string;
  cssVariable: string;
  tailwindClass: string;
  flutterBinding: string;
  swiftBinding: string;
  composeBinding: string;
  darkValue?: string;
}

export type ComponentCategory =
  | "Actions"
  | "Inputs"
  | "Navigation"
  | "Data Display"
  | "Feedback"
  | "Overlays & Menus"
  | "Layout & Disclosure";

export interface ComponentSpec {
  id: string;
  name: string;
  nameZh: string;
  category: ComponentCategory;
  subcategory?: string;
  status: "Stable" | "Beta" | "Candidate";
  version: string;
  description: string;
  anatomy: string[];
  variants: string[];
  sizes: string[];
  states: string[];
  accessibilityNotes: string[];
  tokens: string[];
  doAndDonts?: {
    doText: string;
    dontText: string;
  };
  platforms: {
    web: string;
    flutter: string;
    apple: string;
    android: string;
    windows?: string;
  };
}

export interface PlatformMatrixRow {
  domain: string;
  web: string;
  flutter: string;
  apple: string;
  android: string;
  windows: string;
  rosemaryPrinciple: string;
}

export interface BrandExplorationOption {
  id: string;
  name: string;
  nameZh: string;
  ethos: string;
  paletteDescription: string;
  typographyStyle: string;
  geometryRhythm: string;
  pros: string[];
  cons: string[];
  selected?: boolean;
}
