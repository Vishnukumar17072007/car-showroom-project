const verifyRole = (...roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if(!roles.includes(userRole)){
            return res.status(403).json({message: "Access Denied! You are an unauthorised person."})
        }
        next();
    };
}

module.exports = verifyRole;