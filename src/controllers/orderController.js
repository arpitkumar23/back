import { order } from "../models/orderModel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";
 
const placeOrder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, amount, address, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required and must be an array",
      });
    }

    const newOrder = new order({
      userId,
      items,
      amount,
      address,
      paymentMethod,
      payment: paymentMethod !== "cod",
      date: new Date(),
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while placing order",
    });
  }
});
 
const UserOrder = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await order.find({ userId }).sort({ date: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You have no orders yet",
        orders: [],
      });
    } 
    const populatedOrders = await Promise.all(
      orders.map(async (ord) => {
        const populatedItems = await Promise.all(
          ord.items.map(async (item) => {
            const product = await Product.findById(item.itemId).select(
              "name price image category subCategory description bestseller"
            );

            return {
              ...item,  
              itemId: product,
            };
          })
        );

        return {
          ...ord.toObject(), 
          items: populatedItems,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "User orders fetched successfully",
      orders: populatedOrders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders",
    });
  }
});

 
const placeorderstrips = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Stripe order endpoint" });
});
 
const placeOrderRozarpay = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Razorpay order endpoint" });
});

 
const   allOrder = asyncHandler(async (req, res) => {
  try {
    // Fetch all orders, sorted by date (newest first)
    const orders = await order.find().sort({ date: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
        orders: [],
      });
    }

    // Populate each order's items with product details
    const populatedOrders = await Promise.all(
      orders.map(async (ord) => {
        const populatedItems = await Promise.all(
          ord.items.map(async (item) => {
            const product = await Product.findById(item.itemId).select(
              "name price image category subCategory description bestseller"
            );

            return {
              ...item,
              itemId: product,
            };
          })
        );

        return {
          ...ord.toObject(),
          items: populatedItems,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "All orders fetched successfully",
      orders: populatedOrders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders",
    });
  }
});

 
const updatedStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;


  const ord = await order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true } // ✅ return updated doc
  );

  console.log(orderId);
  
  if (!ord) {
    throw new ApiError(404, "Order not found");
  }

  res.status(200).json({
    success: true,
    message: "Order status updated",
    order: ord,
  });
});


export {
  allOrder,
  placeOrder,
  placeOrderRozarpay,
  placeorderstrips,
  UserOrder,
  updatedStatus,
};
