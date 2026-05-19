const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access denied. Token is required." });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
}

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json{( message: "User is not authenticated." )};
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "You do not have permission to perform this action." });
        }

        next();
    }
}


module.exports = { authenticateToken, authorizeRoles };