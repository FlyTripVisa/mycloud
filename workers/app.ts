import { createRequestHandler } from "react-router";
import { WorkflowEntrypoint, type WorkflowStep, type WorkflowEvent } from 'cloudflare:workers';

declare global {
  interface CloudflareEnvironment extends Env {}
}

type Env = {
  MY_WORKFLOW: Workflow;
};

export class MyWorkflow extends WorkflowEntrypoint<Env> {
  override async run(event: WorkflowEvent<{ hello: string }>, step: WorkflowStep) {
    await step.do("first step", async () => {
      return { output: "First step result" };
    });

    await step.sleep("sleep", "1 second");

    await step.do("second step", async () => {
      return { output: "Second step result" };
    });

    return "Workflow output";
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    return requestHandler(request, {
      cloudflare: { env, ctx },
    });
  },
} satisfies ExportedHandler<CloudflareEnvironment>;