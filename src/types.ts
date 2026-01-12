export interface QRCodeOptions {
  size: number;
  level: 'L' | 'M' | 'Q' | 'H';
  bgColor: string;
  fgColor: string;
  includeMargin: boolean;
  marginSize: number;
  imageSettings?: {
    src: string;
    height: number;
    width: number;
    excavate: boolean;
  };
}

export interface PresetStyle {
  name: string;
  bgColor: string;
  fgColor: string;
  icon: string;
  color: string;
}

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';