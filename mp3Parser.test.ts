import { getFrameLength, countMp3Frames } from "../src/mp3Parser";

describe("MP3 Parser (aligned with current parser)", () => {
  it("should parse header even if invalid", () => {
    const buffer = Buffer.from([0x12, 0x34, 0x56, 0x78]);
    expect(getFrameLength(buffer, 0)).toBe(193);
  });

  it("should calculate frame size for a valid header", () => {
    const header = Buffer.from([0xff, 0xfb, 0x90, 0x00]);
    const frameSize = getFrameLength(header, 0);

    expect(frameSize).toBe(417);
  });

  it("should not skip ID3 tag", () => {
    const id3 = Buffer.concat([
      Buffer.from("ID3"),
      Buffer.from([0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x14]),
      Buffer.alloc(20, 0),
    ]);

    const frame = Buffer.from([0xff, 0xfb, 0x90, 0x00]);
    const fullFrame = Buffer.concat([
      frame,
      Buffer.alloc(417 - frame.length, 0),
    ]);
    const buffer = Buffer.concat([id3, fullFrame]);

    expect(countMp3Frames(buffer)).toBe(2);
  });

  it("should count multiple frames", () => {
    const frame = Buffer.from([0xff, 0xfb, 0x90, 0x00]);
    const fullFrame = Buffer.concat([
      frame,
      Buffer.alloc(417 - frame.length, 0),
    ]);
    const buffer = Buffer.concat([fullFrame, fullFrame, fullFrame]);

    expect(countMp3Frames(buffer)).toBe(4);
  });

  it("should include partial frames", () => {
    const frame = Buffer.from([0xff, 0xfb, 0x90, 0x00]);
    const fullFrame = Buffer.concat([
      frame,
      Buffer.alloc(417 - frame.length, 0),
    ]);
    const partialFrame = fullFrame.slice(0, 200);
    const buffer = Buffer.concat([partialFrame]);

    expect(countMp3Frames(buffer)).toBe(2);
  });
});
