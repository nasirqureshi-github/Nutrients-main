

const express = require("express");
const { uploadImages, deleteImages, uploadImage,uploaddocument } = require("../Controllers/uploadControllers");
const { isAdmin, authMiddleware } = require("../Middleware/authMiddleware");
const { uploadPhoto, uploadimg, ImgResize, upload_document } = require("../Middleware/uploadImage");
const router = express.Router();

router.post(
    "/",
    // authMiddleware,
    uploadimg.single("image"),
    uploadImage
);
router.post(
    "/images",
    authMiddleware,
    uploadPhoto.array("images", 10),
    ImgResize,
    uploadImages
);
router.post(
    "/pdf",
    authMiddleware,
    upload_document.single("file"),
    uploaddocument
);

// router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

module.exports = router;
