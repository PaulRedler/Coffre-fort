module.exports = () => {
  return (req,res,next)=>{
    const now = new Date();
    // récupère depuis DB -> ici hardcodé
    const allowedStart = new Date("2024-01-01");
    const allowedEnd = new Date("2030-01-01");

    if(now < allowedStart || now > allowedEnd){
      return res.status(403).json({error:"Access outside allowed window"});
    }
    next();
  }
}
