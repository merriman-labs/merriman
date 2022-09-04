export type MediaFormatRaw = {
  filename: string;
  nb_streams: number;
  nb_programs: number;
  format_name: string; // csv strings
  format_long_name: string;
  start_time: string; // number
  duration: string; // number
  size: string; // number
  bit_rate: string; // number
  probe_score: number;
  tags: Record<string, string>;
};

export type FFProbeOutput = {
  format: MediaFormatRaw;
};

export type MediaFormat = {
  filename: string;
  nb_streams: number;
  nb_programs: number;
  format_name: Array<string>;
  format_long_name: string;
  start_time: number;
  duration: number;
  size: number;
  bit_rate: number;
  probe_score: number;
  tags: Record<string, string>;
};
