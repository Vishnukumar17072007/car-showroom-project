const User = require('../models/UserSchema');
const getProfile = async(req,res)=>{
    const user = await User.findById(req.user.userId).select('-password');

    if(!user){
        const error=
        new Error("User not found");
        error.status=404;
        throw error;
    }

    res.status(200).json(user);
};

module.exports={ getProfile };