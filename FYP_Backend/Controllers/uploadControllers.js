const fs = require("fs");
const User = require("../Models/UserModel")
const uploadImages = async (req, res) => {
  try {
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      urls.push(file.filename);
    }
    const images = urls.map((file) => {
      return file;
    });
    res.json(images);
  } catch (error) {
    return res.send({
      errors: [{
        "type": "field",
        "value": "error",
        "msg": error.message,
        "path": "",
        "location": ""
      }]
    });
  }
};
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.send({
        errors: [{
          "type": "field",
          "value": "error",
          "msg": "No File Uploaded",
          "path": "",
          "location": ""
        }]
      });
    }

    const { filename } = req.file;
    const image = filename;

    res.json({ status: 200, image });
  } catch (error) {
    return res.send({
      errors: [{
        "type": "field",
        "value": "error",
        "msg": error.message,
        "path": "",
        "location": ""
      }]
    });
  }
};
const uploaddocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.send({
        errors: [{
          "type": "field",
          "value": "error",
          "msg": "No File Uploaded",
          "path": "",
          "location": ""
        }]
      });
    }

    const { filename } = req.file;
    const file = filename;

    res.json({ file });
  } catch (error) {
    return res.send({
      errors: [{
        "type": "field",
        "value": "error",
        "msg": error.message,
        "path": "",
        "location": ""
      }]
    });
  }
};
const deleteImages = async (req, res) => {
  try {
    res.json({ message: "Deleted" });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  uploadImages,
  deleteImages,
  uploadImage,
  uploaddocument
};
