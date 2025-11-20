import { Router } from "express";
import { migrate } from "drizzle-kit"; 

export const migrationRoute = Router();

migrationRoute.get("/run-migrations", async (req, res) => {
    try {
        await migrate();
        res.send("Migrations completed!");
    } catch (err) {
        res.status(500).send(err.message);
    }
});
