import multer from "multer";
//multer fucntion to store file in local server
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedFromat = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedFromat.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, //10Mb of image size 
});
