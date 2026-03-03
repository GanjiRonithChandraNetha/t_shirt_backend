import jwt from 'jsonwebtoken';


export const SECRET = process.env.JWT_SECRET;

export const jwtChecker = async(req,res,next)=>{
    try {
        const authHeader = req.headers['Autherization'];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, SECRET);
        const { user_id, email, section_id, role, exp } = decoded;
        req.user = { user_id, email, section_id, role };
        const remainingSeconds = (exp - Math.floor(Date.now() / 1000))/60*60;
        // If less than 60 seconds left
        if (remainingSeconds < 1) {
            req.newToken = jwt.sign(req.user, SECRET, { expiresIn: "1d" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}