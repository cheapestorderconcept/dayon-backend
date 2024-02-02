const express = require('express');
const { loginStaff, authValidation } = require('../controllers/Auth/login');
const { staffProfile, updateProfile, suspendProfile, deleteProfile } = require('../controllers/Auth/profile');
const { registerStaff, viewStaff } = require('../controllers/Auth/staff-reg');
const { createStore } = require('../controllers/Branch/create-branch');
const { deleteBranch } = require('../controllers/Branch/delete-branch');
const { editBranch } = require('../controllers/Branch/update-branch');
const { listAllStores } = require('../controllers/Branch/view-branch');
const { addBrand } = require('../controllers/brand/add-brand');
const { deleteProductBrand } = require('../controllers/brand/delete-brand');
const { updateBrand } = require('../controllers/brand/update-brand');
const { viewAllBrands } = require('../controllers/brand/view-brands');
const { addNewCustomer } = require('../controllers/customers/add-customers');
const { viewTransactionHistory, viewCustomerPurchased, viewCustomerDeposit, updateCustomerPayment } = require('../controllers/customers/customer-txn');
const { deleteCustomers } = require('../controllers/customers/delete-customer');
const { updateCustomers } = require('../controllers/customers/update-customer');
const { viewAllCustomers, viewSingleCustomer } = require('../controllers/customers/view-customers');
const { addExpensesCategory, viewCategory } = require('../controllers/Expenses/add-category');
const { addExpenses } = require('../controllers/Expenses/add-expenses');
const { EditExpenses, deleteExpenses } = require('../controllers/Expenses/manage_expenses');
const { viewExpenses } = require('../controllers/Expenses/view-expenses');
const { addpaymentType } = require('../controllers/PaymentType/add-payment-type');
const { viewPaymentType, deletePaymentType } = require('../controllers/PaymentType/view-payment-type');
const { addProducts } = require('../controllers/products/add-product');
const { deleteProduct } = require('../controllers/products/delete-product');
const { updateProducts, BalanceStockLevel } = require('../controllers/products/update-product');
const { viewAllProducts, viewSingleProduct, viewSingleProductById, viewAllProductsbyBranch } = require('../controllers/products/view-products');
const { addPurchase } = require('../controllers/purchase/add-purchase');
const { deletePurchase } = require('../controllers/purchase/delete-purchase');
const { editPurchase } = require('../controllers/purchase/edit-purchase');
const { viewPurchase } = require('../controllers/purchase/view-purchase');
const { depositReport } = require('../controllers/reports/deposit-report');
const { fetchOutOfStock } = require('../controllers/reports/out-of-stock');
const { fetchProductPrice, stockLevel } = require('../controllers/reports/product-price-list');
const { viewProfitLossReport } = require('../controllers/reports/profit-loss-report');
const { reprintReceipt } = require('../controllers/reports/reprint_receipt');
const { viewSalesReport, viewSalesReportPerProduct } = require('../controllers/reports/sales-report');
const { addDeposit } = require('../controllers/sales/add-deposit');
const { addSales } = require('../controllers/sales/add-sales');
const { deleteSale } = require('../controllers/sales/delete-sales');
const { editSale } = require('../controllers/sales/edit-sale');
const { updatemountPaid } = require('../controllers/sales/update-deposit');
const { viewDeposit } = require('../controllers/sales/view-deposit');
const { viewSales } = require('../controllers/sales/view-sales');
const { initialCharge, processPayment } = require('../controllers/subscription/sub_payment');
const { addSupplier } = require('../controllers/suppliers/add-supplier');
const { deleteSupplier } = require('../controllers/suppliers/delete-supplier');
const { updateSupplier } = require('../controllers/suppliers/edit-supplier');
const { viewAllSuppliers } = require('../controllers/suppliers/view-suppliers');
const { verifyToken } = require('../middlewares/Authorization/jwt');
const { isManager, isAdmin, isAdminOrEditor, isAdminOrOperator } = require('../middlewares/Authorization/role');
const { transferProducts, getTransferHistory } = require('../controllers/products/transfer-product');

const router = express.Router();


 


/***Aunthenticated starts here */
router.get('/view-branch', listAllStores);

router.post('/login',authValidation, loginStaff);
router.post('/create-branch', createStore);
/***Aunthenticated routes stops here */
router.post('/register-staff',registerStaff);

router.post('/add-card', initialCharge);

router.post('/process-payment', processPayment);
/***Protected routes below */


router.use(verifyToken);
// router.post('/register-staff', isAdmin,registerStaff);
router.delete('/delete-branch/:id', deleteBranch);

router.put('/update-branch/:id', editBranch);


// router.post('register-staff', registerStaff);
router.get('/profile', staffProfile);
router.get('/view-staff', viewStaff);
router.put('/update-staff/:id', isAdmin,updateProfile);
router.put('/suspend-staff/:id', isAdmin,suspendProfile);
router.delete('/delete-staff/:id',isAdmin,deleteProfile);
// router.post('/create-store',isManager, createStore);

/***DEPOSITS...... */


router.get('/view-deposit', viewDeposit);

router.post('/add-deposit', addDeposit);

router.put('/update-deposit/:id', updatemountPaid);

router.get('/view-payment-type', viewPaymentType);
router.post('/add-payment-type',addpaymentType);


/****SUPPLIER ROUTES */

router.post('/add-supplier', addSupplier);
router.get('/view-supplier', viewAllSuppliers);
router.delete('/delete-supplier/:supplierId', deleteSupplier);
router.put('/update-supplier/:supplierId', updateSupplier)

/*****BRAND ROUTES */
router.post('/add-brand', addBrand);
router.get('/view-brand', viewAllBrands);
router.delete('/delete-brand/:brandId', deleteProductBrand);
router.put('/update-brand/:brandId', updateBrand);

/****PRODUCT ROUTES */
router.post('/add-product', addProducts);
router.post('/transfer-product', transferProducts);
router.get('/transfer-history?', getTransferHistory);
router.get('/view-product', viewAllProducts);
router.get('/view-product-by-branch?', viewAllProductsbyBranch);
router.get('/view-product-by-barcode/:product_barcode', viewSingleProduct);
router.put('/update-product/:productId',isAdmin, updateProducts);
router.get('/view-single-product-by-id/:id', viewSingleProductById);
/****ADD SALES ROUTES*/

router.post('/add-sales',isAdminOrOperator, addSales);
router.get('/view-sales', viewSales);
router.delete('/delete-sales/:id', isAdmin,deleteSale);
router.put('/update-sales/:id', isAdmin,editSale);
/***** */


/*****PURCHASE ROUTES */

router.post('/add-purchase', addPurchase);

router.get('/view-purchase', viewPurchase);

router.put('/update-purchase/:id', editPurchase);

router.delete('/delete-purchase/:id', isAdmin,deletePurchase);
/****PAYMENT TYPE */
router.post('/add-payment-type', addpaymentType);
router.get('/view-payment-type', viewPaymentType);
router.delete('/delete-payment-type/:paymentId', isAdmin,deletePaymentType)

/******EXPENSES  ***/
router.post('/add-expenses', addExpenses);
router.get('/view-expenses', viewExpenses);
router.post('/add-expenses-category', addExpensesCategory);
router.get('/view-expenses-categories', viewCategory);
router.put('/update-expenses/:id',isAdmin,EditExpenses);
router.delete('/delete-expenses/:id', isAdmin,deleteExpenses);

/***customer and individual transaction management */

router.post('/add-customer', addNewCustomer);
router.get('/get-customer/:customerId', viewSingleCustomer);
router.get('/view-customer-history/:customerId', viewTransactionHistory)
router.get('/view-customer-purchased/:customerId', viewCustomerPurchased);
router.get('/view-customer-deposit/:customerId', viewCustomerDeposit);
router.get('/view-all-customers', viewAllCustomers);
router.put('/update-customer/:customerId', updateCustomers);
router.delete('/delete-customer/:customerId', deleteCustomers);
router.get('/reprint-sales-receipt?', reprintReceipt);
router.put('/update-payment', updateCustomerPayment);
/*****END ***/
/****DEPOSITS ROUTE */
// router.post('/add-deposits', addDeposit);
// router.get('/view-deposits', viewDeposit);
/****REPORTS ROUTES */



router.get('/view-out-of-stock?', fetchOutOfStock);
router.get('/view-product-price', fetchProductPrice);
router.get('/view-deposit-reports?', depositReport);
router.get('/view-sales-report?', isAdmin ,viewSalesReport);
router.get('/view-product-sales-report?',viewSalesReportPerProduct);
router.get('/view-stock-level?', isAdmin,stockLevel);
router.put('/balance-stock-level/:id', isAdminOrEditor,BalanceStockLevel);
router.delete('/delete-product/:id', isAdmin,deleteProduct);
router.get('/view-profit-loss', isAdmin,viewProfitLossReport);

module.exports=router;