import { Hono } from "hono";
import { getLink } from "@repo/data-ops/queries/links";

export const app = new Hono<{ Bindings: Env }>();

//c = context in Hono
app.get("/:id", async (c) => {

    const { id } = c.req.param();
    

    const linkInfoFromDb = await getLink(id);

    return c.json(linkInfoFromDb);
});