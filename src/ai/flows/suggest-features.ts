'use server';

/**
 * @fileOverview Suggests additional project features based on an analysis of the code.
 *
 * - suggestFeatures - A function that suggests additional project features.
 * - SuggestFeaturesInput - The input type for the suggestFeatures function.
 * - SuggestFeaturesOutput - The return type for the suggestFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFeaturesInputSchema = z.object({
  projectPath: z
    .string()
    .describe('The path to the project to analyze.'),
  existingFeatures: z.array(z.string()).describe('The features that already detected in the project'),
  fileList: z.array(z.string()).describe('List of files in the project'),
});
export type SuggestFeaturesInput = z.infer<typeof SuggestFeaturesInputSchema>;

const SuggestFeaturesOutputSchema = z.object({
  suggestedFeatures: z.array(z.string()).describe('The features suggested by the system.'),
});
export type SuggestFeaturesOutput = z.infer<typeof SuggestFeaturesOutputSchema>;

export async function suggestFeatures(input: SuggestFeaturesInput): Promise<SuggestFeaturesOutput> {
  return suggestFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFeaturesPrompt',
  input: {schema: SuggestFeaturesInputSchema},
  output: {schema: SuggestFeaturesOutputSchema},
  prompt: `You are an expert in analyzing projects, identify features the project might have based on the file list provided.

You have to suggest new features based on the file list given, you should not repeat any of the features that already exists.

Existing Features:
{{#each existingFeatures}}
- {{this}}
{{/each}}

File List:
{{#each fileList}}
- {{this}}
{{/each}}

Suggested Features (respond ONLY with the name of the feature):
`,
});

const suggestFeaturesFlow = ai.defineFlow(
  {
    name: 'suggestFeaturesFlow',
    inputSchema: SuggestFeaturesInputSchema,
    outputSchema: SuggestFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      suggestedFeatures: output?.suggestedFeatures ?? [],
    };
  }
);
