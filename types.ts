
export interface VariationStyle {
  id: number;
  name: string;
  prompt: string;
}

export interface GeneratedVariation {
  styleId: number;
  imageUrl: string;
  highResUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error' | 'upgrading';
  selected?: boolean;
  error?: string;
}

export interface GenerationState {
  isGenerating: boolean;
  currentIndex: number;
  variations: GeneratedVariation[];
}

export enum AppStep {
  INITIAL = 'INITIAL',
  UPLOAD = 'UPLOAD',
  GENERATING_PREVIEWS = 'GENERATING_PREVIEWS',
  REVIEW = 'REVIEW',
  GENERATING_HIGHRES = 'GENERATING_HIGHRES',
  COMPLETE = 'COMPLETE'
}
