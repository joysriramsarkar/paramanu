import { z } from 'zod';
import { ai } from './genkit';

export const aiTutorFlow = ai.defineFlow(
  {
    name: 'aiTutorFlow',
    inputSchema: z.object({
      question: z.string(),
      elementContext: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ question, elementContext }) => {
    const response = await ai.generate({
      prompt: `
        তুমি একজন অভিজ্ঞ রসায়ন শিক্ষক। তোমার নাম "পরমাণু টিউটর"।
        বর্তমানে শিক্ষার্থী এই মৌলটি দেখছে:
        ${elementContext}

        শিক্ষার্থীর প্রশ্ন: "${question}"

        তুমি খুব সহজ বাংলায়, বন্ধুত্বপূর্ণ সুরে উত্তর দেবে। উত্তরটি সংক্ষিপ্ত এবং তথ্যবহুল হতে হবে।
        যদি প্রশ্নটি এই মৌল সম্পর্কিত না হয়, তবুও উত্তর দেবে, কিন্তু বর্তমান মৌলটির সাথে কোনো সম্পর্ক থাকলে তা উল্লেখ করবে।
        উত্তরটি মার্কডাউন ফরম্যাটে দাও।
      `,
    });
    return response.text;
  }
);
