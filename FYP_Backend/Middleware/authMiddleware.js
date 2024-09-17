const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    let token;

    // Check if the authorization header starts with 'Bearer'
    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]; // Extract the token from the header
        console.log(token)
        try {
            if (token) {
                // Verify the token and decode it
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                // Fetch the user from the database using the decoded user ID
                const user = await User.findById(decoded?.id);

                if (!user) {
                    return res.status(401).json({
                        status: 401,
                        msg: "Not Authorized, user not found"
                    });
                }
                console.log("correct User");

                req.user = user; // Attach the user to the request object
                return next(); // Proceed to the next middleware or route handler
            }
        } catch (error) {
            // Token verification failed or token expired
            console.log({ msg: "Not Authorized, token expired or invalid" })
            return res.status(401).json({
                status: 401,
                msg: "Not Authorized, token expired or invalid"
            });
        }
    } else {
        // No token provided in the authorization header
        return res.status(400).json({
            status: 400,
            msg: "No token provided in the authorization header"
        });
    }
};

module.exports = authMiddleware;

const isAdmin = async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.role !== "Admin") {
        return res.send({
            status: 400,
            "msg": "You are not an admin",
        });
    } else {
        next();
    }
};
module.exports = { authMiddleware, isAdmin };
