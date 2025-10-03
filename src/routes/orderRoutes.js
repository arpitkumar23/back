import express, { Router } from 'express'
import { verifyJWT } from '../middleware/auth.middleware.js';
import { allOrder, placeOrder, placeOrderRozarpay, placeorderstrips, updatedStatus, UserOrder } from '../controllers/orderController.js';

const  router =Router()

router.route("/adminOrder").get( allOrder)

router.route("/status").post(verifyJWT , updatedStatus)


router.route("/place").post(verifyJWT , placeOrder)
router.route("/strips").post(verifyJWT , placeorderstrips)
router.route("/razorpay").post(verifyJWT , placeOrderRozarpay)


router.route("/userOrders").get(verifyJWT , UserOrder)





export default router;