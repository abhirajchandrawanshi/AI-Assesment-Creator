import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

interface QuestionConfig {
  questionType: string;
  count: number;
  marks: number;
}

export interface GeneratedQuestion {
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  answer: string;
}

export interface GeneratedSection {
  title: string;
  instruction: string;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
  sections: GeneratedSection[];
  answerKey?: string;
}

/**
 * Main AI Generation service that supports Gemini, OpenAI, or Mock fallback.
 */
export async function generateQuestionPaper(
  materialText: string,
  configs: QuestionConfig[],
  additionalInstructions?: string
): Promise<GeneratedPaper> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const configText = configs
    .map((c, i) => `Section ${i + 1}: Title/Type: "${c.questionType}", Number of Questions: ${c.count}, Marks per Question: ${c.marks}`)
    .join('\n');

  const systemInstructions = `You are an elite, professional assessment generator.
Your task is to generate a comprehensive, highly professional exam question paper and answer key based strictly on the provided study material.

You MUST follow the question pattern layout requested by the user:
${configText}

Additional instructions from user: ${additionalInstructions || 'None'}

You must output a strict JSON structure. Do NOT wrap the JSON in markdown code blocks like \\\`\\\`\\\`json. Output raw JSON.
The output format must exactly match this JSON schema:
{
  "sections": [
    {
      "title": "Section Title (e.g., Section A: Multiple Choice Questions)",
      "instruction": "Instructions for this section (e.g., Attempt all questions. Each question carries 1 mark.)",
      "questions": [
        {
          "question": "The question text.",
          "difficulty": "easy" | "medium" | "hard",
          "marks": number,
          "answer": "Detailed solution or answer key description for this question."
        }
      ]
    }
  ],
  "answerKey": "General answer guidelines, grading rubrics, or summary answers if applicable."
}

Ensure the number of questions and marks in each section match the user's config exactly.
Ensure the questions are challenging, educational, and direct derivations from the study material.`;

  const prompt = `Here is the study material text to generate the assessment from:
-----------------------------------------
${materialText.substring(0, 30000)} // Truncate if extremely long to avoid context token issues
-----------------------------------------

Generate the structured question paper now:`;

  if (geminiKey) {
    try {
      console.log('🤖 Generating assessment using Gemini API...');
      const genAI = new GoogleGenerativeAI(geminiKey);
      // Using gemini-2.5-flash for speed and structured output capabilities
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: `${systemInstructions}\n\n${prompt}` }] }
        ]
      });

      const responseText = result.response.text();
      const parsed = JSON.parse(responseText);
      return validateAndCleanPaper(parsed, configs);
    } catch (error: any) {
      console.error('❌ Gemini generation failed, attempting OpenAI or fallback. Error:', error.message);
    }
  }

  if (openaiKey) {
    try {
      console.log('🤖 Generating assessment using OpenAI API...');
      const openai = new OpenAI({ apiKey: openaiKey });
      
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemInstructions },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      });

      const responseText = response.choices[0].message.content || '{}';
      const parsed = JSON.parse(responseText);
      return validateAndCleanPaper(parsed, configs);
    } catch (error: any) {
      console.error('❌ OpenAI generation failed, attempting fallback. Error:', error.message);
    }
  }

  // Fallback to high-quality mockup paper generator if keys fail or are missing
  console.log('💡 Using Local Mock Assessment Generator...');
  return generateMockPaper(materialText, configs, additionalInstructions);
}

/**
 * Validates that the AI JSON contains the required sections and structures.
 */
function validateAndCleanPaper(parsed: any, configs: QuestionConfig[]): GeneratedPaper {
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('AI returned invalid format');
  }

  const cleanSections = (parsed.sections || []).map((sec: any, idx: number) => {
    const config = configs[idx] || { questionType: 'General', count: 1, marks: 5 };
    const title = sec.title || `Section ${String.fromCharCode(65 + idx)}: ${config.questionType}`;
    const instruction = sec.instruction || `Answer all questions. Each carries ${config.marks} marks.`;
    
    // Ensure we have correct number of questions (even if AI hallucinated counts)
    const rawQuestions = Array.isArray(sec.questions) ? sec.questions : [];
    const questions: GeneratedQuestion[] = [];
    
    for (let i = 0; i < config.count; i++) {
      const q = rawQuestions[i] || {};
      questions.push({
        question: q.question || `Explain the concept of topic ${i + 1} from the study material.`,
        difficulty: (q.difficulty === 'easy' || q.difficulty === 'medium' || q.difficulty === 'hard') 
          ? q.difficulty 
          : (i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard'),
        marks: Number(q.marks) || config.marks,
        answer: q.answer || `Model solution for question ${i + 1} based on core material concepts.`
      });
    }

    return { title, instruction, questions };
  });

  return {
    sections: cleanSections,
    answerKey: parsed.answerKey || 'Grades should be awarded based on depth of coverage and accuracy.'
  };
}

/**
 * Generates structured questions using text parsing heuristics.
 */
function generateMockPaper(materialText: string, configs: QuestionConfig[], additionalInstructions?: string): GeneratedPaper {
  // Extract sentences to get some "key terms"
  const cleanText = materialText.replace(/\s+/g, ' ').trim();
  const sentences = cleanText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 15);
  
  // Basic vocabulary/concept extractor
  const topics = sentences.slice(0, 15).map(s => {
    const words = s.split(' ');
    // Take a phrase of 3-5 words
    const startIndex = Math.max(0, Math.floor(words.length / 4));
    return words.slice(startIndex, startIndex + 5).join(' ').replace(/[,;]/g, '');
  }).filter(t => t.length > 5);

  const defaultTopics = [
    'fundamental theories and concepts',
    'practical applications and examples',
    'system design and components',
    'performance metrics and constraints',
    'comparative analysis of alternatives',
    'future trends and research directions',
    'historical context and evolution',
    'standard protocols and best practices'
  ];

  const sections: GeneratedSection[] = configs.map((config, secIdx) => {
    const sectionLetter = String.fromCharCode(65 + secIdx);
    const title = `Section ${sectionLetter}: ${config.questionType}`;
    const instruction = `Attempt all ${config.count} questions. Each question carries ${config.marks} marks.`;
    const questions: GeneratedQuestion[] = [];

    for (let i = 0; i < config.count; i++) {
      const topicIndex = (secIdx * 3 + i) % (topics.length || 1);
      const chosenTopic = topics[topicIndex] || defaultTopics[i % defaultTopics.length];
      
      let questionText = '';
      let mockAnswer = '';
      
      const typeLower = config.questionType.toLowerCase();
      if (typeLower.includes('mcq') || typeLower.includes('multiple choice')) {
        questionText = `Which of the following best describes the core mechanism of "${chosenTopic}"? \n  a) Standard optimization loop \n  b) Direct implementation bottleneck \n  c) Secondary fallback strategy \n  d) Primary operational directive`;
        mockAnswer = `Option (a). The text explicitly outlines that "${chosenTopic}" relies heavily on standard optimization parameters.`;
      } else if (typeLower.includes('short') || typeLower.includes('brief')) {
        questionText = `Briefly explain the significance of "${chosenTopic}" as discussed in the study material.`;
        mockAnswer = `"${chosenTopic}" is critical because it establishes the foundational constraints for the systems described. A complete response should highlight key attributes and boundaries.`;
      } else {
        questionText = `Discuss in detail the architectural implications of "${chosenTopic}". How does it affect performance, scaling, and operational efficiency?`;
        mockAnswer = `A comprehensive essay discussing "${chosenTopic}". Key points to cover: 1) System design integrations. 2) Direct correlation to scaling bottlenecks. 3) Solutions proposed in the reference material (like buffer pools or thread pools).`;
      }

      questions.push({
        question: questionText,
        difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
        marks: config.marks,
        answer: mockAnswer
      });
    }

    return { title, instruction, questions };
  });

  return {
    sections,
    answerKey: `Grading Key:\n` + sections.map(s => 
      `--- ${s.title} ---\n` + s.questions.map((q, idx) => `Q${idx+1}: ${q.answer}`).join('\n')
    ).join('\n\n')
  };
}
