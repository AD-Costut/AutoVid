import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("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");

const chatCompletion = await client.chatCompletion({
  provider: "cerebras",
  model: "Qwen/Qwen3-32B",
  messages: [
    {
      role: "user",
      content:
        "Write a concise 60-second video script questions about capitals of countries.",
    },
  ],
});

console.log(chatCompletion.choices[0].message);
//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
