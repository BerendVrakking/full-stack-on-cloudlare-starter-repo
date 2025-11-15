import { scheduleEvalWorkflow } from "@/helpers/route-ops";
import { addLinkClick } from "@repo/data-ops/queries/links";
import { LinkClickMessageType } from "@repo/data-ops/zod-schema/queue";

export async function handleLinkClick(env: Env, event: LinkClickMessageType) {
    await addLinkClick(event.data);

    console.log("Collecting link click data for", event.data.id, event.data.destination);
    await scheduleEvalWorkflow(env, event);
}