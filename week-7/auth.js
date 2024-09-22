const jwt = require("jsonwebtoken");
const JWT_SECRET ="iamriyan";


async function auth(req,res, next){

    const token = req.headers.token;

    const decodedData = jwt.verify(token, JWT_SECRET)

    if(decodedData){
        re
    }
}
