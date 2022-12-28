import {
  getActiveDeployment,
  PromptDeployment,
  GetActiveDeploymentArgs,
  ModelConfig,
} from "./promptable";
const PromptableApi = { getActiveDeployment };

import {
  // streaming not supported yet
  // StreamCompletionArgs,
  // openCompletionStream,
  runCompletion,
  CompletionRequest,
  RunCompletionArgs,
} from "./completions";
const OpenAI = {
  // openCompletionStream,
  runCompletion,
};

// openai types
export type { CompletionRequest, RunCompletionArgs };

// promptable types
export type { GetActiveDeploymentArgs, PromptDeployment, ModelConfig };

export { PromptableApi, OpenAI };
