const experss = require("express");
const router = experss.Router();

const { isAuthenticatedUser } = require("../middlewares/authMiddleware");
const { createProduct, getAllProductsWithVendors, getVendorProducts, getProductById, updateProduct, deleteProduct} = require("../controllers/productController");
router.route('/').post(createProduct).get(getAllProductsWithVendors)
router.route('/vendor/:vendorId').get(getVendorProducts)
router.route('/:productId').get(getProductById).put(updateProduct).delete(deleteProduct)


module.exports = router;
