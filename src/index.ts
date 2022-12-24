import { getActiveDeployment } from "./promptable";
const PromptableApi = { getActiveDeployment };

import { openCompletionStream, runCompletion } from "./completions";
const OpenAI = { openCompletionStream, runCompletion };

export { PromptableApi, OpenAI };
