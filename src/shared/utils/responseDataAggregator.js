export const responseDataAggregator = (req,data)=>{
    const obj = data;
    if(res.token){
        obj.token = req.token;
    }
    return obj;
}