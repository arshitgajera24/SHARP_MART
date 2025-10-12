import { Router } from "express";
import * as userControllers from "../controllers/userControllers.js";
import multer from "multer"
import path from "path"
import { verifyAuthentication } from "../middleware/verifyUserMiddleware.js";

export const userRouter = Router();
export const githubRouter = Router();

userRouter.route("/register").post(verifyAuthentication, userControllers.postRegister);
userRouter.route("/login").post(verifyAuthentication, userControllers.postLogin);
userRouter.route("/me").get(verifyAuthentication, userControllers.getCurrentUser);
userRouter.route("/logout").get(verifyAuthentication, userControllers.logoutUser);

userRouter.route("/profile").get(verifyAuthentication, userControllers.getProfile);

userRouter.route("/resend-verification-link").post(verifyAuthentication, userControllers.resendVerificationLink);
userRouter.route("/verify-email-token").get(verifyAuthentication, userControllers.verifyEmailToken);

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/avatar");
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}_${Math.random()}${ext}`);
    }
})

const avatarFileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith("image/"))
    {
        cb(null, true);
    }
    else
    {
        cb(new Error("Only Image Files are Allowed"), false);
    }
}

const avatarUpload = multer({
    storage: avatarStorage,
    fileFilter: avatarFileFilter,
    limits: {fileSize: 5*1024*1024},
})

userRouter.route("/edit-profile").get(verifyAuthentication, userControllers.getEditProfilePage).post(avatarUpload.single("avatar"), verifyAuthentication, userControllers.postEditProfile);

userRouter.route("/change-password").post(verifyAuthentication, userControllers.postChangePassword);
userRouter.route("/forgot-password").post(userControllers.postForgotPassword);
userRouter.route("/reset-password/:token").post(userControllers.postResetpasswordToken);

userRouter.route("/google").get(userControllers.getGoogleLoginPage)
userRouter.route("/google/callback").get(userControllers.getGoogleLoginCallback)

githubRouter.route("/github").get(userControllers.getGithubLoginPage)
githubRouter.route("/github/callback").get(userControllers.getGithubLoginCallback)

userRouter.route("/set-password").post(verifyAuthentication, userControllers.postSetPassword);

userRouter.route("/list").get(userControllers.getAllUsers);
userRouter.route("/remove").post(userControllers.postRemoveUser);
userRouter.route("/block").post(userControllers.postBlockUser);
userRouter.route("/details/:id").get(userControllers.getUserAllDetails);