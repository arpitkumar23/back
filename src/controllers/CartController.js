import { User } from "../models/userModel.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add item to cart
const addTocart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { itemId, size, quantity } = req.body;

  if (!itemId || !size || !quantity) {
    throw new ApiError(400, "ItemId, size, quantity required");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  let cartData = user.cartData || [];

  const existingIndex = cartData.findIndex(
    (item) => item.itemId.toString() === itemId && item.size === size
  );

  if (existingIndex !== -1) {
    cartData[existingIndex].quantity += quantity;
  } else {
    cartData.push({ itemId, size, quantity });
  }

  user.cartData = cartData;
  await user.save();

  res.status(200).json({ message: "Item added to cart", cartData });
});

// Update item quantity
const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { itemId, size, quantity } = req.body;

  if (!itemId || !size) {
    throw new ApiError(400, "ItemId and size required");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  let cartData = user.cartData || [];

  const index = cartData.findIndex(
    (item) => item.itemId.toString() === itemId && item.size === size
  );

  if (quantity <= 0) {
    if (index !== -1) cartData.splice(index, 1);
  } else {
    if (index !== -1) cartData[index].quantity = quantity;
    else cartData.push({ itemId, size, quantity });
  }

  user.cartData = cartData;
  await user.save();

  res.status(200).json({ message: "Cart updated successfully", cartData });
});

// Get user cart
const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json({ cartData: user.cartData || [] });
});

// Remove item from cart
const removeCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { itemId, size } = req.body;

  if (!itemId || !size) {
    throw new ApiError(400, "ItemId and size required");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  let cartData = user.cartData || [];

  const index = cartData.findIndex(
    (item) => item.itemId.toString() === itemId && item.size === size
  );

  if (index !== -1) {
    cartData.splice(index, 1);
  }

  user.cartData = cartData;
  await user.save();

  res.status(200).json({ message: "Item removed from cart", cartData });
});

export { addTocart, updateCart, getUserCart, removeCart };
