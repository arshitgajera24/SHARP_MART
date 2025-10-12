import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../config/constants.js";
import { refreshTokens, verifyJWTToken } from "../services/userServices.js";

export const verifyAuthentication = async (req, res, next) => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    req.user = null;

    if(!accessToken && !refreshToken)
    {
        return next();
    }

    let decodedToken;
    if(accessToken)
    {
        decodedToken = verifyJWTToken(accessToken);
    }

    if(decodedToken)
    {
        req.user = decodedToken;
        return next();
    }

    if(refreshToken)
    {
        try {
            const {newAccessToken, newRefreshToken, user} = await refreshTokens(refreshToken);

            req.user = user;

            const baseConfig = { httpOnly: true, secure: process.env.NODE_ENV === "production" };

            res.cookie("access_token", newAccessToken, {
                ...baseConfig,
                maxAge: ACCESS_TOKEN_EXPIRY,
            })
            
            res.cookie("refresh_token", newRefreshToken, {
                ...baseConfig,
                maxAge: REFRESH_TOKEN_EXPIRY,
            })

            return next();

        } catch (error) {
            console.log("Refresh failed:", error.message);
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
        }
    }
    return next();
}