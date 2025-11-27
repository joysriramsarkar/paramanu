'use server';

import { aiTutorFlow } from '@/ai/tutorFlow';

export async function askAITutor(question: string, elementContext: string) {
  try {
    const response = await aiTutorFlow({ question, elementContext });
    return response;
  } catch (error) {
    console.error('Error asking AI Tutor:', error);
    throw new Error('AI টিউটরের সাথে সংযোগ স্থাপন করা যাচ্ছে না। দয়া করে পরে আবার চেষ্টা করুন।');
  }
}
