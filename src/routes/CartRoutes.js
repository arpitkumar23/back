import express, { Router } from "express"; 
import { verifyJWT } from "../middleware/auth.middleware.js";
import { addTocart,   getUserCart, removeCart, updateCart } from "../controllers/CartController.js"; 

const router = Router(); 

router.route("/getCart").get (verifyJWT ,getUserCart)
router.route("/addToCart").post(verifyJWT, addTocart)
router.route("/updateCart").put(verifyJWT ,updateCart)
router.route("/removeCart").delete(verifyJWT , removeCart)

 

export default router;
