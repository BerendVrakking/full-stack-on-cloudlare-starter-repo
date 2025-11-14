import { Hono } from "hono";
import { cloudflareInfoSchema } from "@repo/data-ops/zod-schema/links";
import { getDestinationForCountry, getRoutingDestination } from "../helpers/route-ops";

export const app = new Hono<{ Bindings: Env }>();

//c = context in Hono
app.get("/:id", async (c) => {

    const { id } = c.req.param();
    
    const linkInfo = await getRoutingDestination(c.env, id);
    if (!linkInfo) {
        return c.json({ error: "Destination not found" }, 404);
    }

    const cfHeader = cloudflareInfoSchema.safeParse(c.req.raw.cf);
    if (!cfHeader.success) {
        return c.text("Invalid Cloudflare Header", 400);
    }

    const headers = cfHeader.data;
    const destination = getDestinationForCountry(linkInfo, headers.country);
    console.log(destination);
    
    return c.redirect(destination);

});