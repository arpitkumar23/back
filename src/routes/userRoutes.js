import { Router } from "express";
import { Login , logout, profile, registerUser } from "../controllers/userController.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
 
const router = Router();

router.route("/register").post(registerUser)
router.route("/logout").post(logout)
router.route("/login").post(Login)
router.route("/profile").get(verifyJWT ,profile);


router.route("/user-auth").get(verifyJWT, (req, res) => {
    res.status(200).json({ ok: true }); 
});


router.route("/admin-auth").get(verifyJWT, (req, res) => {
    res.status(200).json({ message: "Welcome, Admin!" });
  });

export default router;