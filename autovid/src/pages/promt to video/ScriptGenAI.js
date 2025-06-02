import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("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");

export async function sendMessageToAi(message) {
  try {
    const res = await client.chatCompletion({
      provider: "cerebras",
      model: "Qwen/Qwen3-32B",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    return res.choices[0].message.content;
  } catch (error) {
    console.error("Hugging Face API error:", error);
    throw error;
  }
}
