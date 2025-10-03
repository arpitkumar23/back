import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/productModel.js";

const addProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, subCategory, size, bestseller } = req.body;

  // ✅ Validation
  if (![name, price, description, category, subCategory, size].every(Boolean)) {
    throw new ApiError(400, "All fields are required");
  }

  // ✅ Handle images
  const imageFiles = [
    req.files?.image1?.[0],
    req.files?.image2?.[0],
    req.files?.image3?.[0],
    req.files?.image4?.[0],
  ].filter(Boolean);

  if (!imageFiles.length) {
    throw new ApiError(400, "At least one image is required");
  }

  // ✅ Upload images in parallel
  const imageUrls = await Promise.all(
    imageFiles.map(async (file) => {
      const result = await uploadOnCloudinary(file.path);
      return result.secure_url;
    })
  );

  // ✅ Parse size safely
  let parsedSize;
  try {
    parsedSize = typeof size === "string" ? JSON.parse(size) : size;
  } catch (error) {
    throw new ApiError(400, "Invalid size format. Must be an array or JSON string.");
  }

  // ✅ Save product
  const product = await Product.create({
    name,
    description,
    price,
    category,
    subCategory,
    size: parsedSize,
    bestseller,
    date: new Date(),
    image: imageUrls,
  });

  // ✅ Response
  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product added successfully"));
});
const listProduct = asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({});
        return res.status(200).json(
            new ApiResponse(200, products, "Products retrieved successfully")
        );
    } catch (error) {
        throw new ApiError(500, "Something went wrong while listing products")

    }





})

const removeProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        return res.status(200).json(new ApiResponse(200, null, "Product removed successfully"));

    } catch (error) {
        throw new ApiError(500, "Something went wrong while removing product")

    }
})

const singleProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        return res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching single product")

    }
})



export {
    addProduct
    , listProduct
    , removeProduct
    , singleProduct
}
