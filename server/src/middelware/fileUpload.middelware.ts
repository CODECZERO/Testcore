import multer from "multer";
import path from "path";
import fs from "fs";

// A function to ensure that the folder exists
const ensureFolder = async (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      console.dir(filePath, "exists");
      return true;
    }
    await fs.promises.mkdir(filePath, { recursive: true });
    return true;
  } catch (error:any) {
    throw new Error(`Error creating directory: ${error.message}`);
  }
};

// Multer function to store file in local server
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    try {
      const folderExistPath = path.resolve(__dirname, './public');
      await ensureFolder(folderExistPath);
      console.log("Resolved image path:", folderExistPath); // Log the resolved path
      cb(null, folderExistPath);
    } catch (error:any) {
      cb(error,"");
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedFormats = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedFormats.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB of image size
});
