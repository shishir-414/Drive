const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        console.error(" No token found in cookies");
        return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(" Decoded Token:", decoded);  //  Log the token payload

        // 🔍 Ensure the correct key is used (try userId or id)
        req.userId = decoded.id || decoded.userId;  
        console.log(" User ID Set:", req.userId);

        if (!req.userId) {
            console.error("Decoded token is missing userId or id");
            return res.status(401).json({ message: "User ID missing from token" });
        }

        next();
    } catch (err) {
        console.error(" JWT Verification Error:", err.message);
        return res.status(401).json({ message: 'Not authorized' });
    }
}

module.exports = auth;
