import { RunnableLike } from "@langchain/core/runnables";
import { ApplicationDescriptionSheet } from "../types/ApplicationDescriptionSheet.type";
import { getLlmOpenAI } from "./LLMService";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ApplicationDescriptionSheetSchema } from "../types/ApplicationDescriptionSheetZodParser";
import { StructuredOutputParser } from "@langchain/core/output_parsers";


export async function generateApplicationDescriptionSheet(prompt : string) : Promise<ApplicationDescriptionSheet>{

    const llmModel = await  getLlmOpenAI(0.7);
    return await promptGenerateApplicationDescription({model: llmModel, prompt}) as ApplicationDescriptionSheet;
}

async function promptGenerateApplicationDescription({
    model,
    prompt,
  }: {
    model: RunnableLike<any, any>;
    prompt: string;
  }) {
    const promptTemplate = ChatPromptTemplate.fromTemplate(`
      System : You are an experienced business application designer. 
      Generate a detailed description of the user application based on user input.
      User : {input}  
      Format instructions: {format_instructions}

      Follow this rules:
      1. For each feature specifies which actors have access to it and what the feature does.
      Example : 
      Access the book catalog: As a customer or bookseller, I want to consult the book stocks in a bookstore.
    `);
  
    const parser = StructuredOutputParser.fromZodSchema(ApplicationDescriptionSheetSchema);
  
    const chain = promptTemplate.pipe(model).pipe(parser);
  
    return await chain.invoke({
      format_instructions: parser.getFormatInstructions(),
      input: prompt,
    });
  }