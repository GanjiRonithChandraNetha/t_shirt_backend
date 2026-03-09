export const responseDataAggregator = (req,data)=>{
    const obj = data;
    if(req.token){
        obj.token = req.token;
    }
    return obj;
}