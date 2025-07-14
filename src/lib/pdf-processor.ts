import * as pdfjsLib from 'pdfjs-dist';
import { GeneratedQuestion, GenerationOptions } from '@/components/question-generator';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
}

export function processSentences(text: string): string[] {
  // Split text into sentences and filter meaningful ones
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.split(' ').length > 4)
    .slice(0, 5); // Take top 5 meaningful sentences
  
  return sentences;
}

export function generateQuestions(
  sentences: string[], 
  options: GenerationOptions
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  
  sentences.forEach((sentence, sentenceIndex) => {
    const words = sentence.split(' ');
    const firstWord = words[0] || 'this';
    
    if (options.useTemplate) {
      const templates = [
        `Who ${firstWord.toLowerCase()}?`,
        `What is the main contribution of ${firstWord}?`,
        `Where is ${firstWord} from?`,
        `Why is ${firstWord} significant?`,
        `How does ${firstWord} relate to the topic?`
      ];
      
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      questions.push({
        id: `template-${sentenceIndex}-${Date.now()}`,
        question: randomTemplate,
        type: 'template',
        sentence: sentence
      });
    }
    
    if (options.useBert) {
      // Simulate BERT-style question generation
      const bertQuestions = [
        `What can you tell about ${firstWord}?`,
        `How would you analyze ${firstWord}?`,
        `What is the significance of ${firstWord} in this context?`,
        `Can you explain the role of ${firstWord}?`
      ];
      
      const randomBert = bertQuestions[Math.floor(Math.random() * bertQuestions.length)];
      questions.push({
        id: `bert-${sentenceIndex}-${Date.now()}`,
        question: randomBert,
        type: 'bert',
        sentence: sentence
      });
    }
    
    if (options.useT5) {
      // Simulate T5-style question generation
      const t5Questions = [
        `What does the text say about ${firstWord}?`,
        `Based on this information, what is ${firstWord}?`,
        `According to the passage, how is ${firstWord} defined?`,
        `What key point does the text make about ${firstWord}?`
      ];
      
      const randomT5 = t5Questions[Math.floor(Math.random() * t5Questions.length)];
      questions.push({
        id: `t5-${sentenceIndex}-${Date.now()}`,
        question: randomT5,
        type: 't5',
        sentence: sentence
      });
    }
  });
  
  return questions;
}