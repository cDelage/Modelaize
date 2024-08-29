import { RunnableLike } from "@langchain/core/runnables";
import { WatsonxAI } from "@langchain/community/llms/watsonx_ai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { getSettings } from "./SettingsService";

/**
 * Deprecated, for the moment use only WatsonXAI.
 * @returns
 */
export async function getLlmModel(): Promise<RunnableLike<any, any>> {
  const { token, projectId, platform } = await getSettings();
  if (platform === "WATSONX") {
    return new WatsonxAI({
      ibmCloudApiKey: token,
      projectId: projectId,
      modelId: "meta-llama/llama-3-70b-instruct",
      modelParameters: {
        max_new_tokens: 4095,
        temperature: 0.7,
        repetition_penalty: 1,
      },
    });
  } else if (platform === "CLAUDE-SONNET") {
    return new ChatAnthropic({
      temperature: 0.7,
      model: "claude-3-5-sonnet-20240620",
      apiKey: token,
    });
  } else {
    return new ChatOpenAI({
      modelName: "gpt-4o-mini-2024-07-18",
      temperature: 0.7,
      apiKey: token,
    });
  }
}

export async function getLlmOpenAI(temperature: number): Promise<RunnableLike<any, any>> {
  const { token } = await getSettings();
  return new ChatOpenAI({
    modelName: "gpt-4o-mini-2024-07-18",
    temperature: temperature,
    apiKey: token,
  });
}
