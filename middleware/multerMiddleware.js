import multer from "multer";

const countryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './temp')
    },
    filename: function(req, file, cb) {
        cb(null, new Date() + file.originalname)
    }
})

export const upload = multer({ storage: countryStorage, limits: {fileSize: 5 * 1024 * 1024} })