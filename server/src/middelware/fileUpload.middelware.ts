import multer from "multer";
import path from "path";
import fs from "fs";


//a function to ensure that folder exist 
const ensureFolder = async (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      return true;
    }
    await fs.promises.mkdir(filePath, { recursive: true });
    return true;
  } catch (error) {
    return error;
  }
}
//multer fucntion to store file in local server
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderExistPath = path.resolve(path.dirname("../public/images"));
    ensureFolder(folderExistPath);
    cb(null, folderExistPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
})

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedFromat = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedFromat.includes(file.mimetype)) {
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, //10Mb of image size 
}); 
