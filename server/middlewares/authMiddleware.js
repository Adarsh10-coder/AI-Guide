const jwt=require("jsonwebtoken");

module.exports=(req,res,next)=>{

    const token=req.cookies.token;

    if(!token){

        return res.status(401).json({
            message:"Login First"
        });

    }

    try{

        const decoded=jwt.verify(token,process.env.JWT_SECRET);

        req.user=decoded;

        next();

    }

    catch{

        return res.status(401).json({
            message:"Invalid Token"
        });

    }

}