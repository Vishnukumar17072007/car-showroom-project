const User = require("../models/UserSchema");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadPhoto = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }

    const uploadFromBuffer = () => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "carfield/profiles" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
        });
    };

    const result = await uploadFromBuffer();

    user.image = result.secure_url;
    await user.save();

    res.status(200).json({
        message: "Profile photo updated successfully",
        image: result.secure_url,
    });
};

module.exports = { uploadPhoto };