
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const sendMessage = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Messages are required.",
      });
    }

    const validMessages = messages
      .slice(-20)
      .filter(
        (msg) =>
          ["user", "assistant"].includes(msg.role) &&
          typeof msg.content === "string" &&
          msg.content.trim().length > 0
      )
      .map((msg) => ({
        role: msg.role,
        content: msg.content.trim().slice(0, 6000),
      }));

    if (
      validMessages.length === 0 ||
      validMessages[validMessages.length - 1].role !== "user"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please send a valid user message.",
      });
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions: `
        You are SmartBot, a professional AI assistant.

        Your behaviour:
        - Give clear, accurate and helpful answers.
        - Use simple English.
        - Explain programming concepts with examples.
        - When providing code, use proper formatting.
        - If you don't know something, admit it.
        - Avoid unnecessarily long answers.
        - Be friendly and professional.

        Programming expertise:
        - JavaScript
        - React.js
        - Node.js
        - Express.js
        - PHP
        - Laravel
        - MongoDB
        - PostgreSQL
        - REST APIs

        Always provide practical examples when explaining technical topics.
        `,
      input: validMessages,
    });

    return res.status(200).json({
      success: true,
      reply: response.output_text,
    });

  } catch (error) {
    console.error("OpenAI API Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to generate a response. Please try again.",
    });
  }
};
