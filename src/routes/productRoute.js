import {Router} from 'express'
import { addProduct, listProduct, removeProduct, singleProduct } from '../controllers/ProductController.js';
import {upload} from '../middleware/multer.middlewares.js' 
import { verifyJWT } from '../middleware/auth.middleware.js';
const router = Router()


router.route("/products").post(
    
  
     upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
  ]), addProduct
)

router.route("/list-product").get(listProduct)
router.route("/remove-product/:id").delete(removeProduct)
router.route("/single-product/:id").get(singleProduct)

export default router;
