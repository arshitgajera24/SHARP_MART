import { Router } from "express";
import { migrate } from "drizzle-kit"; 

const router = Router();

router.get("/run-migrations", async (req, res) => {
    try {
        await migrate();
        res.send("Migrations completed!");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;
