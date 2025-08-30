# MP3-File-Analysis-App
A lightweight TypeScript/Node.js utility to parse MP3 headers, skip ID3 tags, and count MP3 frames accurately.

# MP3 Frame Counter

A lightweight TypeScript/Node.js utility to **parse MP3 frame headers** and **count the number of MP3 frames** in a buffer or file.  
Useful for audio analysis, validation, or estimating playback duration without a full decoder.

---

##  Features
- Detects MP3 sync word and validates frame headers.
- Skips **ID3v2 tags** at the start of files.
- Calculates exact **frame length** using bitrate, sample rate, and padding.
- Prevents **double-counting partial frames** at the end of buffers.
- Works with both **synthetic test data** and real `.mp3` files.

---

## Package Installation

Clone the repo and install dependencies:

cd mp3-frame-counter
npm install
npm start


## API Usage

The app starts an Express server on port 3000 with one endpoint:

POST /file-upload

Upload an MP3 file using multipart/form-data

Example (using curl):
curl -F "file=@C:/Users/DELL/Downloads/Kalimba.mp3" http://localhost:3000/file-upload


Response:
{
  "frameCount": 13325
}

### Running Tests

This project uses Jest for unit testing.

Run all tests:

npm test



mp3-frame-counter/
├── src/
│   ├── mp3Parser.ts       # Core MP3 frame parsing logic
│   └── index.ts           # Express server entrypoint
├── tests/
│   └── mp3Parser.test.ts  # Unit tests for parser
├── package.json
├── tsconfig.json
└── README.md
