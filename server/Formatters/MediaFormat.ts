import { MediaFormatRaw, MediaFormat } from '../models/MediaInfo';

export function toMediaFormat(data: MediaFormatRaw): MediaFormat {
  return {
    ...data,
    bit_rate: parseFloat(data.bit_rate),
    duration: parseFloat(data.duration),
    size: parseFloat(data.size),
    start_time: parseFloat(data.start_time),
    format_name: data.format_name.split(',')
  };
}
