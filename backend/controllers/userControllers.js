import * as userValidators from "../validators/userValidators.js";
import * as userServices from "../services/userServices.js";
import {decodeIdToken, generateCodeVerifier, generateState} from "arctic"
import {google} from "../lib/OAuth/google.js"
import {github} from "../lib/OAuth/github.js"
import { OAUTH_EXCHANGE_EXPIRY } from "../config/constants.js";

export const postRegister = async (req, res) => {
    try {

        if(req.user) return res.json({ redirect: "/" });
        
        const {data, error} = userValidators.userRegisterValidatorSchema.safeParse(req.body);
        if(error)
        {
            const errors = error.issues[0].message;
            return res.json({ success: false, error: errors });
        }

        const {name, email, password} = data;

        const userExists = await userServices.findUserByEmail(email);
        if(userExists)
        {
            return res.json({success: false, error: "User Already Exists"});
        }

        const hashedPassword = await userServices.hashPassword(password);
        
        const userId = await userServices.addNewUser({name, email, password: hashedPassword});        
        const user = await userServices.findUserById(userId);        

        await userServices.authenticateUser({req, res, user, name, email});
        res.json({success: true, message: "Registration Successful", user});

    } catch (error) {
        console.error(error);
        res.json({ success: false, error: error.message });
    }
}

export const postLogin = async (req, res) => {
    if(req.user) return res.json({ redirect: "/" });

    const {data, error} = userValidators.userLoginValidatorSchema.safeParse(req.body);
    if(error)
    {
        const errors = error.issues[0].message;
        return res.json({ success: false, error: errors });
    }

    const { email, password } = data;

    const user = await userServices.findUserByEmail(email);
    if(!user)
    {
        return res.json({success: false, error: "Invalid Credentials"});
    }

    if(user.isBlocked)
    {
        return res.json({success: false, error: "Your Account has been Blocked. Contact Support."});
    }

    const isPasswordValid = await userServices.comparePassword(password, user.password);
    if(!isPasswordValid)
    {
        return res.json({success: false, error: "Invalid Credentials"});
    }
    
    await userServices.authenticateUser({req, res, user});
    res.json({success: true, message: "Login Successful", user});
}

export const logoutUser = async (req, res) => {
    try {
        await userServices.clearSession(req.user.sessionId);
        res.clearCookie("access_token", { httpOnly: true, secure: true, sameSite: "none" });
        res.clearCookie("refresh_token", { httpOnly: true, secure: true, sameSite: "none" });
        res.json({success:true, message: "Logout Successful"});
    } catch (error) {
        res.json({success:false, error: error.message});
    }
}

export const getCurrentUser = async (req, res) => {
    if(!req.user)
    {
        return res.json({success: false, authenticated: false});
    }

    const user = await userServices.findUserByIdWithoutPassword(req.user.id);
    if(user.isBlocked)
    {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return res.json({success: false, authenticated: false, error: "Your Account has been Blocked. Contact Support."});
    }
    res.json({success: true, authenticated:true, user});
}

export const getProfile = async (req, res) => {
    try {
        if(!req.user) return res.json({success:false, redirect: "/"});

        const user = await userServices.findUserById(req.user.id);
        if(!user) 
        {
            return res.json({success:false, redirect: "/"});
        }

        if(user.isBlocked)
        {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            return res.json({success: false, redirect: "/"});
        }
        else
        {
            const userData = [
                {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    isEmailValid: user.isEmailValid,
                    hasPassword: Boolean(user.password),
                    avatarUrl: user.avatarUrl,
                    createdAt: user.createdAt,
                },
            ];
            res.json({success: true, data: userData});
        }
    } catch (error) {
        res.json({success:false, error: error.message});
    }
}

export const resendVerificationLink = async (req, res) => {
    try {
        if(!req.user) return res.json({success:false, redirect: "/"});        
    
        const user = await userServices.findUserById(req.user.id);        
        if(!user)
        {
            return res.json({success:false, redirect: "/"});
        }
    
        await userServices.sendNewVerifyEmailLink({userId: user.id, email: user.email});
    
        res.json({success: true, message: "Verification Code Sent Successfully"});
    } catch (error) {
        res.json({success:false, error: error.message});
    }
}

export const verifyEmailToken = async (req, res) => {
    try {
        const {data, error} = userValidators.verifyEmailValidatorSchema.safeParse(req.query);
        if(error) return res.json({success: false, error: "Verification Link is Invalid or Expired!!"})

        const [token] = await userServices.findVerificationEmailToken(data);
        if(!token) return res.json({success: false, error: "Verification Link is Invalid or Expired!"})
        
        await userServices.verifyUserEmailAndUpdate(token.email);
        await userServices.clearVerifyEmailTokens(token.userId).catch(console.error);

        res.json({success: true, message: "Email Verified Successfully"});
    } catch (error) {
        res.json({success: false, error: error.message});
    }
}

export const getEditProfilePage = async (req, res) => {
    try {
        if(!req.user) return res.json({success:false, redirect: "/"});        
    
        const [user] = await userServices.findUserById(req.user.id);
        if(!user)
        {
            return res.json({success:false, redirect: "/"});
        }
        
        res.json({success: true, data: user});
    } catch (error) {
        res.json({success: false, error: error.message});
    }
}

export const postEditProfile = async (req, res) => {
    try {
        if(req.body.userId)
        {
            await userServices.removeAvatarByUserId(req.body.userId);
            return res.json({success: true, message: "Avatar Removed Successfully"})
        }

        const {data, error} = userValidators.editProfileValidatorSchema.safeParse(req.body);
        if(error)
        {
            const errors = error.issues[0].message;
            return res.json({ success: false, error: errors });
        }

        const {name} = data;
        const fileUrl = req.file ? req.file.filename : undefined;

        await userServices.EditUserProfile({userId: req.user.id, name, avatarUrl: fileUrl});
        res.json({success: true, message: "Profile Updated Successfully"});
    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}

export const postChangePassword = async (req, res) => {
    try {
        const {data, error} = userValidators.changePasswordVallidatorSchema.safeParse(req.body);
        if(error)
        {
            const errors = error.issues[0].message;
            return res.json({ success: false, error: errors });
        }

        const { currentPassword, newPassword } = data;

        const user = await userServices.findUserById(req.user.id);
        if(!user)
        {
            return res.json({success:false, redirect: "/"});
        }

        const isPasswordValid = await userServices.comparePassword(currentPassword, user.password);
        if(!isPasswordValid)
        {
            return res.json({success:false, error: "Current Password is Invalid"});
        }

        await userServices.updateUserPassword({userId: user.id, newPassword});
        res.json({success:true, message: "New Password Changed Successfully"});

    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}

export const postForgotPassword = async (req, res) => {
    try {
        
        const {data, error} = userValidators.forgotPasswordValidatorSchema.safeParse(req.body);
        if(error)
        {
            const errors = error.issues[0].message;
            return res.json({ success: false, error: errors });
        }

        const { email } = data;

        const user = await userServices.findUserByEmail(email);
        if(!user)
        {
            return res.json({success:false, redirect: "/", error: "Email is Not Registered"});
        }

        await userServices.sendNewForgotPasswordVerifyEmailLink({userId: user.id, email, name: user.name});
        res.json({success: true, message: "Reset Password Link Sent Successfully"});

    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}

export const postResetpasswordToken = async (req, res) => {
    try {
        const {token} = req.params;
        
        const passwordResetData = await userServices.getResetPasswordToken(token);
        if(!passwordResetData)
        {
            return res.json({success: false, error: "Your Password Reset Link has either Expired, or is Invalid!", redirect: "/"})
        }

        const { data, error } = userValidators.resetPasswordValidatorSchema.safeParse(req.body);
        if(error)
        {
            const errors = error.issues[0].message;
            return res.json({ success: false, error: errors });
        }

        const { newPassword } = data;

        const user = await userServices.findUserById(passwordResetData.userId);
        if(!user)
        {
            return res.json({success:false, redirect: "/", error: "User not Found"});
        }

        await userServices.clearResetPasswordToken(user.id);
        await userServices.updateUserPassword({userId: user.id, newPassword});
        
        res.json({success: true, message: "New Password Changed Successfully"});

    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}

export const getGoogleLoginPage = async (req, res) => {
    try {
        const state = generateState();
        const codeVerifier = generateCodeVerifier();
        const url = google.createAuthorizationURL(state, codeVerifier, [
            "openid",
            "profile",
            "email",
        ])

        const cookieConfig = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            max_Age: OAUTH_EXCHANGE_EXPIRY,
            sameSite: "lax",
        }

        res.cookie("google_oauth_state", state, cookieConfig);
        res.cookie("google_code_verifier", codeVerifier, cookieConfig);

        res.redirect(url);
    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}

export const getGoogleLoginCallback = async (req, res) => {
    try {
        const { code, state } = req.query;

        const {
            google_oauth_state: storedState,
            google_code_verifier: codeVerifier,
        } = req.cookies;

        function handleFailedLoginGoogle(req, res)
        {
            return res.json({success: false, error: "Couldn't Login with Google because of Invalid Login Attempt. Please Try Again!"});
        }

        if(!code || !state || !storedState || !codeVerifier || state !== storedState)
        {
            return handleFailedLoginGoogle(req, res);
        }
        

        let tokens;
        try {
            tokens = await google.validateAuthorizationCode(code, codeVerifier);
        } catch (error) {
            return handleFailedLoginGoogle(req, res);
        }

        const claims = decodeIdToken(tokens.idToken());
        const { sub: googleUserId, name, email, picture } = claims;

        let user = await userServices.getUserWithOAuthId({
            provider: "google",
            email,
        })

        if(user && !user.providerAccountId)
        {
            await userServices.linkUserWithOAuth({
                userId: user.id,
                provider: "google",
                providerAccountId: googleUserId,
                avatarUrl: picture
            })
        }

        if(!user)
        {
            user = await userServices.createUserWithOAuth({
                name, 
                email,
                provider: "google",
                providerAccountId: googleUserId,
                avatarUrl: picture,
            })
        }

        if(user.isBlocked)
        {
            return res.json({success: false, error: "Your Account has been Blocked. Contact Support."});
        }

        await userServices.authenticateUser({req, res, user, name, email});
        res.redirect(`${process.env.FRONTEND_URL}?login=success`);
        
    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}

export const getGithubLoginPage = async (req, res) => {
    try {
        const state = generateState();
        const url = github.createAuthorizationURL(state, ["user:email"]);

        const cookieConfig = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: OAUTH_EXCHANGE_EXPIRY,
            sameSite: "lax",
        }
        res.cookie("github_oauth_state", state, cookieConfig);
        res.redirect(url);

    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}

export const getGithubLoginCallback = async (req, res) => {
    try {
        const { code, state } = req.query; 
        const { github_oauth_state: storedState } = req.cookies;

        function handleFailedLoginGithub(req, res)
        {
            return res.json({success: false, error: "Couldn't Login with Github because of Invalid Login Attempt. Please Try Again!"});
        }

        if(!code || !state || !storedState || state !== storedState)
        {
            return handleFailedLoginGithub(req, res);
        }

        let tokens;
        try {
            tokens = await github.validateAuthorizationCode(code);
        } catch {
            return handleFailedLoginGithub(req, res);
        }
        
        const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`,
            }
        })
        if(!githubUserResponse.ok) return handleFailedLoginGithub(req, res);

        const githubUser = await githubUserResponse.json();    
        const { id: githubUserId, name, avatar_url } = githubUser;

        const githubEmailResponse = await fetch("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken()}`,
            }
        })
        if(!githubEmailResponse.ok) return handleFailedLoginGithub(req, res);

        const emails = await githubEmailResponse.json();
        const email = emails.filter((e) => e.primary)[0].email;
        if(!email) return handleFailedLoginGithub(req, res);

        let user = await userServices.getUserWithOAuthId({
            provider: "github",
            email,
        })

        if(user && !user.providerAccountId)
        {
            await userServices.linkUserWithOAuth({
                userId: user.id,
                provider: "github",
                providerAccountId: githubUserId,
                avatarUrl: avatar_url,
            })
        }

        if(!user)
        {
            user = await userServices.createUserWithOAuth({
                name, 
                email,
                provider: "github",
                providerAccountId: githubUserId,
                avatarUrl: avatar_url,
            })
        }

        await userServices.authenticateUser({ req, res, user, name, email });
        res.redirect(`${process.env.FRONTEND_URL}?login=success`);

    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}

export const postSetPassword = async (req, res) => {
    try {
        
        const {data, error} = userValidators.setPasswordValidatorSchema.safeParse(req.body);
        if(error)
        {
            const errors = error.issues[0].message;
            return res.json({ success: false, error: errors });
        }

        const { newPassword } = data;

        const user = await userServices.findUserById(req.user.id);
        if(!user)
        {
            return res.json({success:false, redirect: "/"});
        }

        await userServices.updateUserPassword({userId: user.id, newPassword});
        res.json({success:true, message: "New Password Set Successfully"});

    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await userServices.getAllUsersList();
        res.json({success:true, data: users });
    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}

export const postRemoveUser = async (req, res) => {
    try {
        const {userId} = req.body;        

        await userServices.deleteUserById(userId);
        res.json({success:true, message: "User Deleted Successfully" });
    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}

export const postBlockUser = async (req, res) => {
    try {
        const {userId, blockState} = req.body;        

        await userServices.blockUserById(userId, blockState);
        await userServices.clearSessionByUserId(userId);
        if(blockState === true) res.json({success:true, message: "User Blocked Successfully" });
        else res.json({success:true, message: "User Unblocked Successfully" });
    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}

export const getUserAllDetails = async (req, res) => {
    try {

        const { id } = req.params;        

        const user = await userServices.findUserById(id);
        if(!user)
        {
            return res.json({success:false, redirect: "/"});
        }

        if(user.isBlocked)
        {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            return res.json({success: false, redirect: "/", error: "Your Account has been Blocked. Contact Support."});
        }

        const fullUserDetails = await userServices.getFullDetailsByUserId(id);        
        res.json({success: true, data: fullUserDetails});
        
    } catch (error) {
        res.json({success: false, error: error.message});
        console.error(error)
    }
}
