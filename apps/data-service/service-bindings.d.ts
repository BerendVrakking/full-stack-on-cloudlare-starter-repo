interface DestinationStatusEvaluationParams {
	linkId: string;
	destinationUrl: string;
	accountId: string;
	destinationCountryCode: string;
}

interface Env extends Cloudflare.Env {
	DESTINATION_EVALUATION_WORKFLOW: Workflow<DestinationStatusEvaluationParams>;
}