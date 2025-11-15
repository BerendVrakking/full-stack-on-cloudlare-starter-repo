import { WorkflowEntrypoint, WorkflowEvent, WorkflowStep } from "cloudflare:workers";


export class DestinationEvaluationWorkflow extends WorkflowEntrypoint<Env, unknown> {
    async run(event: Readonly<WorkflowEvent<unknown>>, step: WorkflowStep) {
        
        const collectedData = await step.do("Collect Rendered destination page data", async () => {
            console.log("Collecting rendered destination page data");

            return {
                dummyData: "dummy data",
                url: "event.payload.url"
            }
        })

        console.log("Collected data:", collectedData);
    }
}