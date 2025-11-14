import { Hono } from "hono";
import { cloudflareInfoSchema } from "@repo/data-ops/zod-schema/links";
import { getDestinationForCountry, getRoutingDestination } from "../helpers/route-ops";
import { LinkClickMessageType } from "@repo/data-ops/zod-schema/queue";

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

    const queueMessage: LinkClickMessageType = {
        "type": "LINK_CLICK",
        data: {
          id: id,
          country: headers.country,
          destination: destination,
          accountId: linkInfo.accountId,
          latitude: headers.latitude,
          longitude: headers.longitude,
          timestamp: new Date().toISOString()
        }
      }

    // The message is sent to the queue asynchronously after responding to the client,
    // ensuring the redirect happens immediately and queue processing does not block the request.
    // This is managed using waitUntil to extend the worker's lifetime for background tasks.
    c.executionCtx.waitUntil(
        c.env.QUEUE.send(queueMessage)
      )
    
    return c.redirect(destination);

});