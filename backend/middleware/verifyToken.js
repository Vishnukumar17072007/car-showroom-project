const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try{
        console.log("Cookies received:", req.cookies);
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    }
    catch(err){
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = verifyToken;