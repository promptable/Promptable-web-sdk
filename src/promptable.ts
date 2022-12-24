import axios from "axios";

export interface Prompt {
  id: string;
  name: string;
  text: string;
  inputs?: { name: string; value: string }[];
}

interface GetActiveDeploymentArgs {
  promptId: string;
}

const getActiveDeployment = async ({ promptId }: GetActiveDeploymentArgs) => {
  const { data } = await axios.get(
    `https://promptable.ai/api/prompt/${encodeURIComponent(
      promptId
    )}/deployment/active`
  );
};

const injectVariables = (
  prompt: Prompt,
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

export { getActiveDeployment };
