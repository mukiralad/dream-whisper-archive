
export interface Dream {
  id: string;
  audioBlob: Blob;
  audioUrl: string;
  title: string;
  createdAt: Date;
  duration: number; // in seconds
  waveform: number[]; // visualization data
}
