// src/ai/flows/enhance-description.ts
'use server';

/**
 * @fileOverview Enhances a project description using an intelligent system to be more engaging and informative.
 *
 * - enhanceDescription - A function that enhances the project description.
 * - EnhanceDescriptionInput - The input type for the enhanceDescription function.
 * - EnhanceDescriptionOutput - The return type for the enhanceDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceDescriptionInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  originalDescription: z.string().describe('The original project description.'),
  techStack: z.string().describe('The tech stack used in the project.'),
  features: z.string().describe('The features of the project.'),
});
export type EnhanceDescriptionInput = z.infer<typeof EnhanceDescriptionInputSchema>;

const EnhanceDescriptionOutputSchema = z.object({
  enhancedDescription: z.string().describe('The enhanced project description.'),
});
export type EnhanceDescriptionOutput = z.infer<typeof EnhanceDescriptionOutputSchema>;

export async function enhanceDescription(input: EnhanceDescriptionInput): Promise<EnhanceDescriptionOutput> {
  return enhanceDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceDescriptionPrompt',
  input: {schema: EnhanceDescriptionInputSchema},
  output: {schema: EnhanceDescriptionOutputSchema},
  prompt: `You are an expert in writing engaging and informative project descriptions.

  You will be given the project name, original description, tech stack, and features of a project.
  Your goal is to enhance the original description to be more engaging and informative.
  If the original description is empty or very short, you should create a new description based on the project name, tech stack, and features.

  Project Name: {{{projectName}}}
  Original Description: {{{originalDescription}}}
  Tech Stack: {{{techStack}}}
  Features: {{{features}}}

  Enhanced Description:`,
});

const enhanceDescriptionFlow = ai.defineFlow(
  {
    name: 'enhanceDescriptionFlow',
    inputSchema: EnhanceDescriptionInputSchema,
    outputSchema: EnhanceDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      enhancedDescription: output!.enhancedDescription,
    };
  }
);
