const jwt = require("jsonwebtoken");
const env = require("dotenv");
env.config();

const isLoggedIn = (req, res, next) => {
    const token = req.headers.authorization;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            
            if(err){
                return res.status(401).send({message: "Invalid token"});
            }
            else{
                req.user = decoded;
                next();
            }
        });
      }
      else{
        return res.status(401).send({message: "No token provided"});
      }
}

module.exports = {isLoggedIn};