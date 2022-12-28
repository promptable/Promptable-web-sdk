import axios from "axios";

export interface ModelConfig {
  provider: string;
  model: string;
  temperature: number;
  stop: string[] | null;
  max_tokens: number;
}
export interface PromptDeployment {
  id: string;
  name: string;
  isActive: boolean;
  text: string;
  config: ModelConfig;
  inputs: { name: string; value: string }[] | null;
  createdAt: Date;
  updatedAt: Date;
  promptId: string;
}

export interface GetActiveDeploymentArgs {
  promptId: string;
}

const getActiveDeployment = async ({ promptId }: GetActiveDeploymentArgs) => {
  const { data } = await axios.get(
    `https://promptable.ai/api/prompt/${encodeURIComponent(
      promptId
    )}/deployment/active`
  );

  return data as PromptDeployment;
};

const injectVariables = (
  prompt: PromptDeployment,
  variablesMap: { [key: string]: string }
) => {
  return prompt.inputs?.reduce((acc, input) => {
    const variable = variablesMap[input.name];
    if (typeof variable === "undefined") {
      return acc;
    }

    return acc.replaceAll(`{{${input.name}}}`, variable);
  }, prompt.text);
};

export { getActiveDeployment, injectVariables };
