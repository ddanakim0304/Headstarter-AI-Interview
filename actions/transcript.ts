'use server';

import {
    AzureKeyCredential,
    ChatRequestMessage,
    OpenAIClient
} from "@azure/openai";

async function transcript(prevState: any, formData: FormData) {
    console.log("PREVIOUS STATE:", prevState);
  
    const id = Math.random().toString(36);
  
    if (
      process.env.AZURE_API_KEY === undefined ||
      process.env.AZURE_ENDPOINT === undefined ||
      process.env.AZURE_DEPLOYMENT_NAME === undefined ||
      process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME === undefined
    ) {
      console.error("Azure credentials not set");
      return {
        sender: "",
        response: "Azure credentials not set",
      };
    }
  
    const file = formData.get("audio") as File;
    if (file.size === 0) {
      return {
        sender: "",
        response: "No audio file provided",
      };
    }
  
    const arrayBuffer = await file.arrayBuffer();
    const audio = new Uint8Array(arrayBuffer);
  
    const client = new OpenAIClient(
      process.env.AZURE_ENDPOINT,
      new AzureKeyCredential(process.env.AZURE_API_KEY)
    );
  
    const result = await client.getAudioTranscription(
      process.env.AZURE_DEPLOYMENT_NAME,
      audio
    );
  
    console.log(`Transcription: ${result.text}`);
  
    // Hardcoded purpose and time within the function
    const purpose = "Gather more detailed feedback on user experience"; 
    const time = "2 minutes";
  
    const messages: ChatRequestMessage[] = [
      {
        role: "system",
        content: `You are a helpful assistant. Your task is to generate follow-up questions based on the provided survey response. The follow-up questions should align with the purpose: "${purpose}" and should be completed within a time limit of ${time}. If no specific area of interest is provided, ask the respondent to elaborate on their reasoning or provide more details about their response.`,
      },
      {
        role: "user",
        content: result.text,
      },
    ];
  
    const completions = await client.getChatCompletions(
      process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME,
      messages,
      { maxTokens: 128 }
    );
  
    const response = completions.choices[0].message?.content;
    console.log(prevState.sender, "+++", result.text);
  
    return {
      sender: result.text,
      response: response,
      id: id,
    };
  }
  
  export default transcript;
  
