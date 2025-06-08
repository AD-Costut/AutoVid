// import { InferenceClient } from "@huggingface/inference";

// const client = new InferenceClient("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");

// export async function sendMessageToAi(message) {
//   try {
//     const res = await client.chatCompletion({
//       provider: "cerebras",
//       model: "Qwen/Qwen3-32B",

//       messages: [
//         {
//           role: "user",
//           content: message,
//         },
//       ],
//     });
//     const fullText = res.choices[0].message.content;

//     const match = fullText.match(/#%#([\s\S]*?)#%#/);
//     if (match && match[1]) {
//       return match[1].trim();
//     } else {
//       return fullText.trim();
//     }
//   } catch (error) {
//     console.error("Hugging Face API error:", error);
//     throw error;
//   }
// }

export async function sendMessageToAi(message) {
  const response = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization:
        "Bearer 61b8ec4990b595df2d9acba24bc6a833652eb846aa1e3ed4641d718f5867eaca",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      messages: [{ role: "user", content: message }],
    }),
  });

  console.log(message);
  const data = await response.json();

  const fullText = data.choices[0].message.content;

  const match = fullText.match(/#%#([\s\S]*?)#%#/);
  if (match && match[1]) {
    return match[1].trim();
  } else {
    return fullText.trim();
  }
}
