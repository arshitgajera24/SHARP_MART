import { and, eq, gte, inArray, isNull, lt, sql } from "drizzle-orm";
import { ACCESS_TOKEN_EXPIRY, MILLISECONDS_PER_SECOND, REFRESH_TOKEN_EXPIRY } from "../config/constants.js";
import { db } from "../config/db.js";
import { oauthAccountsTable, orderItemsTable, ordersTable, productsTable, resetPasswordTokenTable, sessionsTable, usersTable, verifyEmailTokenTable } from "../drizzle/schema.js";
import argon2 from "argon2"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import fs from "fs/promises"
import path from "path"
import mjml2html from "mjml";
import { sendEmail } from "../lib/sendEmail.js";


export const findUserByEmail = async (email) => {
    const [result] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    return result;
}

export const hashPassword = async (password) => {
    return await argon2.hash(password);
}

export const comparePassword = async (password, hash) => {
    return await argon2.verify(hash, password);
}

export const addNewUser = async ({name, email, password}) => {
    const [newUser] = await db.insert(usersTable).values({name, email, password}).returning({ id: usersTable.id });
    return newUser.id;
}

export const createSession = async (userId, { ip, userAgent }) => {
    const [session] = await db.insert(sessionsTable).values({userId, ip, userAgent}).returning({ id: sessionsTable.id });
    return session.id;
}

export const createAccessToken = ({id, name, email, sessionId}) => {
    return jwt.sign({id, name, email, sessionId}, process.env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND,      //15 Minute
    })
}

export const createRefreshToken = (sessionId) => {
    return jwt.sign({ sessionId }, process.env.JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY / MILLISECONDS_PER_SECOND,     //1 Week
    })
}

export const verifyJWTToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw error;
    }
}

export const findSessionById = async (sessionId) => {
    const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, sessionId));
    return session;
}

export const findUserById = async (userId) => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    return user;
}

export const findUserByIdWithoutPassword = async (userId) => {
    const [user] = await db.select({
        name: usersTable.name,
        email: usersTable.email,
        isBlocked: usersTable.isBlocked,
    }).from(usersTable).where(eq(usersTable.id, userId));
    return user;
}

export const refreshTokens = async (refreshToken) => {
    try {
        const decodedToken = verifyJWTToken(refreshToken);

        const currentSession = await findSessionById(decodedToken.sessionId);
        if(!currentSession || !currentSession.valid) throw new Error("Invalid Session");

        const user = await findUserById(currentSession.userId);
        if(!user) throw new Error("User not found");

        const userInfo = {
            id: user.id,
            name: user.name,
            email: user.email,
            sessionId: currentSession.id,
        }

        const newAccessToken = createAccessToken(userInfo);
        const newRefreshToken = createRefreshToken(currentSession.id);        

        return {
            newAccessToken,
            newRefreshToken,
            user: userInfo
        }

    } catch (error) {
        console.log(error.message);
        throw error;
    }
}

export const clearSession = async (sessionId) => {
    return await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
}

export const clearSessionByUserId = async (userId) => {
    return await db.delete(sessionsTable).where(eq(sessionsTable.userId, userId));
}

export const authenticateUser = async ({req, res, user, name, email}) => {
    const sessionId = await createSession(user.id, {
        ip: req.clientIp,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = createAccessToken({
        id: user.id,
        name: user.name || name,
        email: user.email || email,
        isEmailValid: false,
        sessionId: sessionId,
    })

    const refreshToken = createRefreshToken(sessionId);

    const baseConfig = { httpOnly: true, secure: true, sameSite: "none", };

    res.cookie("access_token", accessToken, {
        ...baseConfig,
        maxAge: ACCESS_TOKEN_EXPIRY,
    })

    res.cookie("refresh_token", refreshToken, {
        ...baseConfig,
        maxAge: REFRESH_TOKEN_EXPIRY,
    })
}

export const generateRandomToken = (digit = 8) => {
    const min = 10 ** (digit - 1);
    const max = 10 ** digit;

    return crypto.randomInt(min, max).toString();
}

export const insertVerifyEmailToken = async ({userId, token}) => {
    return db.transaction(async (tx) => {
        try 
        {
            await tx.delete(verifyEmailTokenTable).where(lt(verifyEmailTokenTable.expiresAt, sql`CURRENT_TIMESTAMP`));
            await tx.delete(verifyEmailTokenTable).where(eq(verifyEmailTokenTable.userId, userId));
            await tx.insert(verifyEmailTokenTable).values({userId, token});  
        } 
        catch (error) 
        {
            console.error("Failed to Insert Verification Token : ", error);
            throw new Error("Unable to Create Verification Token");
        }
    })
}

export const createEmailLink = async ({email, token}) => {
    const url = new URL(`${process.env.FRONTEND_URL}/verify-email`);

    url.searchParams.append("token", token);
    url.searchParams.append("email", email);

    return url.toString();
}


export const sendNewVerifyEmailLink = async ({userId, email}) => {

    const randomToken = generateRandomToken();
    await insertVerifyEmailToken({userId, token: randomToken});

    const verifyEmailLink = await createEmailLink({ email, token: randomToken });

    const mjmlTemplate = await fs.readFile(path.join(import.meta.dirname,"..","emails","verifyEmail.mjml"), "utf-8");
    const filledTemplate = mjmlTemplate.replace("{{CODE}}", randomToken).replace("{{LINK}}", verifyEmailLink);
    const htmlOutput = mjml2html(filledTemplate).html;

    await sendEmail({
        to: email,
        subject: "Verify Your Email",
        html: htmlOutput,
    }).catch(console.error);
}

export const findVerificationEmailToken = async ({token, email}) => {
    return db.select({
        userId: usersTable.id,
        email: usersTable.email,
        token: verifyEmailTokenTable.token,
        expiresAt: verifyEmailTokenTable.expiresAt
    }).from(verifyEmailTokenTable).where(and(eq(verifyEmailTokenTable.token, token), eq(usersTable.email, email), gte(verifyEmailTokenTable.expiresAt, sql`CURRENT_TIMESTAMP`))).innerJoin(usersTable, eq(usersTable.id, verifyEmailTokenTable.userId))
}

export const verifyUserEmailAndUpdate = async (email) => {
    return await db.update(usersTable).set({isEmailValid : true}).where(eq(usersTable.email, email));
}

export const clearVerifyEmailTokens = async (userId) => {
    return await db.delete(verifyEmailTokenTable).where(eq(verifyEmailTokenTable.userId, userId));
}

export const EditUserProfile = async ({userId, name, avatarUrl}) => {
    return await db.update(usersTable).set({name, avatarUrl}).where(eq(usersTable.id, userId));
}

export const removeAvatarByUserId = async (userId) => {
    return await db.update(usersTable).set({avatarUrl: null}).where(eq(usersTable.id, userId));
}

export const updateUserPassword = async ({userId, newPassword}) => {
    const newHashPassword = await hashPassword(newPassword);
    return await db.update(usersTable).set({password: newHashPassword}).where(eq(usersTable.id, userId));
}

export const sendNewForgotPasswordVerifyEmailLink = async ({userId, email, name}) => {
    const randomToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(randomToken).digest("hex");

    await db.delete(resetPasswordTokenTable).where(eq(resetPasswordTokenTable.userId, userId));
    await db.insert(resetPasswordTokenTable).values({ userId, tokenHash});

    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password/${randomToken}`;

    const mjmlTemplate = await fs.readFile(path.join(import.meta.dirname,"..","emails","resetPasswordEmail.mjml"), "utf-8");
    const filledTemplate = mjmlTemplate.replace(/{{LINK}}/g, resetPasswordLink).replace(/{{NAME}}/g, name);
    const htmlOutput = mjml2html(filledTemplate).html;

    await sendEmail({
        to: email,
        subject: "Reset Your Password",
        html: htmlOutput,
    }).catch(console.error);
}

export const getResetPasswordToken = async (token) => {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const [data] = await db.select().from(resetPasswordTokenTable).where(and(eq(resetPasswordTokenTable.tokenHash, tokenHash), gte(resetPasswordTokenTable.expiresAt, sql`CURRENT_TIMESTAMP`)));
    return data;
}

export const clearResetPasswordToken = async (userId) => {
    return await db.delete(resetPasswordTokenTable).where(eq(resetPasswordTokenTable.userId, userId));
}

export const getUserWithOAuthId = async ({provider, email}) => {
    const [user] = await db.select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        isEmailValid: usersTable.isEmailValid,
        providerAccountId: oauthAccountsTable.providerAccountId,
        provider: oauthAccountsTable.provider,
    }).from(usersTable).where(eq(usersTable.email, email)).leftJoin(oauthAccountsTable, and(eq(oauthAccountsTable.provider, provider), eq(oauthAccountsTable.userId, usersTable.id)))
    return user;
}

export const linkUserWithOAuth = async ({userId, provider, providerAccountId, avatarUrl}) => {
    await db.insert(oauthAccountsTable).values({userId, provider, providerAccountId});
    if(avatarUrl)
    {
        await db.update(usersTable).set({avatarUrl}).where(and(eq(usersTable.id, userId), isNull(usersTable.avatarUrl)));
    }
}

export const createUserWithOAuth = async ({name, email, provider, providerAccountId, avatarUrl}) => {
    const user = await db.transaction(async (tx) => {
        const [user] = await tx.insert(usersTable).values({name, email, avatarUrl, isEmailValid: true}).returning({ id: usersTable.id });
        await tx.insert(oauthAccountsTable).values({provider, providerAccountId, userId: user.id});

        return {
            id: user.id,
            name,
            email,
            isEmailValid: true,
            provider,
            providerAccountId
        };
    })

    return user;
}

export const getAllUsersList = async () => {
    const user = db.select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        isEmailValid: usersTable.isEmailValid,
        avatarUrl: usersTable.avatarUrl,
        isBlocked: usersTable.isBlocked,
        createdAt: sql`TO_CHAR(${usersTable.createdAt}, 'DD-MM-YYYY')`,
        updatedAt: sql`TO_CHAR(${usersTable.updatedAt}, 'DD-MM-YYYY')`,
        providers: sql`COALESCE(STRING_AGG(DISTINCT ${oauthAccountsTable.provider}::text, ','), 'local')`.as("providers"),
        totalOrders: sql`COUNT(DISTINCT ${ordersTable.id})`.as("totalOrders"),
        totalSpent: sql`COALESCE(SUM(${ordersTable.amount} + 100), 0)`.as("totalSpent"),
        activeSession: sql`CASE WHEN EXISTS(SELECT 1 FROM ${sessionsTable} WHERE ${sessionsTable.userId} = ${usersTable.id} AND ${sessionsTable.valid} = TRUE) THEN 'Active' ELSE 'Offline' END`.as("activeSession"),
    }).from(usersTable).leftJoin(oauthAccountsTable, eq(usersTable.id, oauthAccountsTable.userId)).leftJoin(ordersTable, eq(usersTable.id, ordersTable.userId)).leftJoin(sessionsTable, eq(usersTable.id, sessionsTable.userId)).groupBy(usersTable.id).orderBy(sql`${usersTable.createdAt} DESC`);

    return user;
}

export const deleteUserById = async (userId) => {
    return await db.delete(usersTable).where(eq(usersTable.id, userId));
}

export const blockUserById = async (userId, blockState) => {
    return await db.update(usersTable).set({isBlocked: blockState}).where(eq(usersTable.id, userId));
}

export const getFullDetailsByUserId = async (userId) => {
    const [user] = await db.select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        avatarUrl: usersTable.avatarUrl,
        isEmailValid: usersTable.isEmailValid,
        isBlocked: usersTable.isBlocked,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
        providers: sql`COALESCE(STRING_AGG(DISTINCT ${oauthAccountsTable.provider}::text, ','), 'local')`.as("providers"),
    }).from(usersTable).leftJoin(oauthAccountsTable, eq(usersTable.id, oauthAccountsTable.userId)).where(eq(usersTable.id, userId)).groupBy(usersTable.id);
    
    if(!user) return null;

    const [summary] = await db.select({
        totalOrders: sql`COUNT(*)`.as("totalOrders"),
        totalSpent: sql`COALESCE(SUM(${ordersTable.amount} + 100), 0)`.as("totalSpent"),
        lastOrderDate: sql`MAX(DATE_FORMAT(${usersTable.createdAt}, '%d-%m-%Y'))`.as("lastOrderDate"),
        lastOrderAmount: sql`(SELECT amount + 100 FROM ${ordersTable} WHERE ${ordersTable.userId} = ${userId} ORDER BY ${ordersTable.createdAt} DESC LIMIT 1)`.as("lastOrderAmount"),
    }).from(ordersTable).where(eq(ordersTable.userId, userId));

    const recentOrdersRows = await db.select({
        id: ordersTable.id,
        amount: sql`${ordersTable.amount} + 100`.as("amount"),
        status: ordersTable.status,
        createdAt: ordersTable.createdAt
    }).from(ordersTable).where(eq(ordersTable.userId, userId)).orderBy(sql`${ordersTable.createdAt} DESC`).limit(5);
    
    const orderIds = recentOrdersRows.map(o => o.id);
    let orderItems = [];

    if(orderIds.length > 0)
    {
        orderItems = await db.select({
            id: orderItemsTable.id,
            orderId: orderItemsTable.orderId,
            productId: orderItemsTable.productId,
            quantity: orderItemsTable.quantity,
            price: orderItemsTable.price,
            productName: productsTable.name,
            productImage: productsTable.image
        }).from(orderItemsTable).leftJoin(productsTable, eq(orderItemsTable.productId, productsTable.id)).where(inArray(orderItemsTable.orderId, orderIds));
    }
    else
    {
        orderItems = [];
    }    


    const recentOrders = recentOrdersRows.map(order => ({
        ...order,
        items: orderItems.filter(item => item.orderId === order.id)
    }));

    return {
        user, summary, recentOrders
    }
}
