'use server';

/**
 * @fileOverview A translation AI agent that translates text to Bengali.
 *
 * - translateToBengali - A function that translates the input text to Bengali.
 * - TranslateToBengaliInput - The input type for the translateToBengali function.
 * - TranslateToBengaliOutput - The return type for the translateToBengali function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateToBengaliInputSchema = z.object({
  text: z.string().describe('The text to translate to Bengali.'),
});
export type TranslateToBengaliInput = z.infer<typeof TranslateToBengaliInputSchema>;

const TranslateToBengaliOutputSchema = z.object({
  translatedText: z.string().describe('The translated text in Bengali.'),
});
export type TranslateToBengaliOutput = z.infer<typeof TranslateToBengaliOutputSchema>;

export async function translateToBengali(input: TranslateToBengaliInput): Promise<TranslateToBengaliOutput> {
  return translateToBengaliFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateToBengaliPrompt',
  input: {schema: TranslateToBengaliInputSchema},
  output: {schema: TranslateToBengaliOutputSchema},
  prompt: `Translate the following text to Bengali: {{{text}}}`,
});

const translateToBengaliFlow = ai.defineFlow(
  {
    name: 'translateToBengaliFlow',
    inputSchema: TranslateToBengaliInputSchema,
    outputSchema: TranslateToBengaliOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
