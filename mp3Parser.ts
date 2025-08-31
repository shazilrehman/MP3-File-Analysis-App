/**
 *  bitrates (kbps)
 * Index 0 and 15 are reserved, so they are 0
 */
const BITRATES = [
  0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0,
];

const SAMPLE_RATES = [44100, 48000, 32000, 0];

/**
 * Skip ID3 metadata if present (common in MP3 files).
 * Returns the offset where the first audio frame should begin.
 */
function skipID3Tag(buffer: Buffer): number {
  if (buffer.slice(0, 3).toString() === "ID3") {
    const sizeBytes = buffer.slice(6, 10);
    const tagSize =
      ((sizeBytes[0] & 0x7f) << 21) |
      ((sizeBytes[1] & 0x7f) << 14) |
      ((sizeBytes[2] & 0x7f) << 7) |
      (sizeBytes[3] & 0x7f);
    return 10 + tagSize;
  }
  return 0;
}

/**
 * Compute frame length from MP3 header
 */
export function getFrameLength(buffer: Buffer, offset: number): number {
  if (offset + 4 > buffer.length) return -1;

  const b1 = buffer[offset + 1];
  const b2 = buffer[offset + 2];
  const b3 = buffer[offset + 3];

  const bitrateIndex = (b2 & 0xf0) >> 4;
  const sampleRateIndex = (b2 & 0x0c) >> 2;
  const paddingBit = (b2 & 0x02) >> 1;

  const bitrate = BITRATES[bitrateIndex] * 1000;
  const sampleRate = SAMPLE_RATES[sampleRateIndex];

  if (bitrate === 0 || sampleRate === 0) return -1;

  return Math.floor((144 * bitrate) / sampleRate + paddingBit);
}

/**
 * Count MP3 frames
 */
export function countMp3Frames(buffer: Buffer): number {
  let offset = skipID3Tag(buffer);
  let frameCount = 0;

  while (offset < buffer.length - 4) {
    if (buffer[offset] === 0xff && (buffer[offset + 1] & 0xe0) === 0xe0) {
      frameCount++;
      const frameLength = getFrameLength(buffer, offset);
      if (frameLength <= 0) {
        offset++;
      } else {
        offset += frameLength;
      }
      if (offset + frameLength > buffer.length) {
        frameCount++;
        break;
      }
    } else {
      offset++;
    }
  }

  return frameCount;
}
