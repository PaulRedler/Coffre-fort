module.exports = function(requiredRole){
  return (req,res,next)=>{
    if(!req.user.roles.includes(requiredRole)){
      return res.status(403).json({error:"Forbidden"});
    }
    next();
  }
}
