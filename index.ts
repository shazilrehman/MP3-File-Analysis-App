import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import { countMp3Frames } from "./src/mp3Parser";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post(
  "/file-upload",
  upload.single("file"),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileBuffer = fs.readFileSync(req.file.path);
      const frameCount = countMp3Frames(fileBuffer);

      fs.unlinkSync(req.file.path);

      res.json({ frameCount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to process MP3 file" });
    }
  }
);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
