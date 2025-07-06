import multer from "multer";

// Using multer's default disk storage
const upload = multer({ storage: multer.diskStorage({}) });

export default upload;
