const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        const cookieToken = req.cookies?.token;
        const headerToken = req.headers?.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : null;

        const token = cookieToken || headerToken;

        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = verifyToken;