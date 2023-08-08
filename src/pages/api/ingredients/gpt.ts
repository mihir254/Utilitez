const { Configuration, OpenAIApi } = require("openai");
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const configuration = new Configuration({
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    // messages: [
    //   { role: "system", content: "You are a helpful assistant." },
    //   { role: "system", name: "example_user", content: `I will be giving you the name of a certain fruit or vegetable.
    //                                                     I would like you to give me a few details about that in this format:
    //                                                     Name : (name of the ingredient)
    //                                                     Category : (Is it a fruit or a vegetable or a spice or something else. This answer should be maximum of 1 word)`
    //   },
    //   { role: "system", name: "example_assistant", content: `Of course, I'd be happy to help! Please provide me with the name of the fruit,vegetable,
    //                                                         or ingredient you'd like information about, and I'll give you the details in the format you've mentioned.` },
    //   { role: "system", name: "example_user", content: "Tomato" },
    //   { role: "system", name: "example_assistant", content: `Name: Tomato
    //                                                             Category: Fruit` },
    //   { role: "user", content: "Potato" },
    // ],
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Who won the world series in 2020?" },
        { role: "assistant", content: "The Los Angeles Dodgers." },
        { role: "user", content: "Where was it played?" },
      ],
    max_tokens: 50,
    n: 1,
    stop: null,
    temperature: 1,
  });

  res.status(200).json({ answer: response.data.choices[0].message.content });
}