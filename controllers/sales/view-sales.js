const { HttpError } = require("../../middlewares/errors/http-error");
const { httpResponse } = require("../../middlewares/http/http-response");
const { Sales } = require("../../model/sales/sales");


const viewSales =async(req,res,next)=>{
    try {
      const mSales = await Sales.findSales();
      const {branch_id} = req.userData;
      console.log(branch_id);
      if (mSales&&mSales.length>0) {
        const filterSale = mSales.filter(branch_sale=>branch_sale.branch==branch_id)
        httpResponse({status_code:200,response_message:'Sales successfully fetched', data:filterSale.reverse(),res})  
        return;
      }  
      const e = new HttpError(404, "You have not made any sales");
      return(e);
    } catch (error) {
        const e = new HttpError(500,error.message);
        return next(e);
    }
}




module.exports={
    viewSales
}






// for (let i = 0; i < filterSale.length; i++) {
//   for (let index = 0; index <filterSale[i].items.length; index++) {
//     console.log(filterSale[i].items[index].product);
//     const data ={
//       product_id: filterSale[i]._id,
//       barcode: filterSale[i].items[index].barcode,
//       product: filterSale[i].items[index].product,
//       selectedProduct: filterSale[i].items[index].selectedProduct,
//       serial_number: filterSale[i].items[index].serial_number,
//       invoice_number: filterSale[i].items[index].invoice_number,
//       cost_price: filterSale[i].items[index].cost_price,
//       selling_price: filterSale[i].items[index].selling_price,
//       amount: filterSale[i].items[index].amount,
//       quantity: filterSale[i].items[index].quantity
      
//     }
//     sale.push(data);
//   }

// }