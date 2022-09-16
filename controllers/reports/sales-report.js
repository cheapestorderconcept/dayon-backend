

const joi = require("joi");
const { HttpError } = require("../../middlewares/errors/http-error");
const joiError = require("../../middlewares/errors/joi-error");
const { httpResponse } = require("../../middlewares/http/http-response");

const {Sales} = require("../../model/sales/sales");

const VALIADATIONOBJECT = joi.object({
    from: joi.date().required(),
     to: joi.date().required(),
     branch: joi.string().required(),
     payment_type: ''
})

const viewSalesReport =async(req,res,next)=>{
    try {
  
      const VALIDATEDOBJECT = await VALIADATIONOBJECT.validateAsync(req.query)
      console.log( req.query);
      const FILTEREDRESULTS =await  Sales.aggregate([
            { "$match": {
              "$and": [
                { "created_at": { "$gte": VALIDATEDOBJECT.from, "$lte": VALIDATEDOBJECT.to }},

              ]
            }}
          ]);
          if (FILTEREDRESULTS&&FILTEREDRESULTS.length>0) {
            if (req.query.payment_type=='') {
              const branchReport = FILTEREDRESULTS.filter(item=>item.branch==req.query.branch);
              httpResponse({status_code:200, response_message:'Sales record available', data:branchReport, res});
            }else{
              const branchReport = FILTEREDRESULTS.filter(item=>item.branch==req.query.branch&&item.payment_type==req.query.payment_type);
              httpResponse({status_code:200, response_message:'Sales record available', data:branchReport, res});
            }
           
          }else{
              const e = new HttpError(404, "No record found within this range of date");
              return next(e);
          }
    } catch (error) {
       joiError(error,next);
    }
}


module.exports={
    viewSalesReport
}