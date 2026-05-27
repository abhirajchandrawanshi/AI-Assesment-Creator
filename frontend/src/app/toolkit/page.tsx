'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  FileText,
  ArrowRight,
  X
} from 'lucide-react';

export default function AIToolkitPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const tools = [
    {
      id: 'quiz',
      name: 'Generate Quiz',
      description: 'Create interactive quizzes from any topic',
      icon: BookOpen,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      id: 'questions',
      name: 'Generate Questions',
      description: 'Generate questions with multiple difficulty levels',
      icon: FileText,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
    },
    {
      id: 'difficulty',
      name: 'Difficulty Analyzer',
      description: 'Analyze and adjust question difficulty',
      icon: TrendingUp,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
    },
    {
      id: 'rubric',
      name: 'Rubric Generator',
      description: 'Create assessment rubrics automatically',
      icon: Sparkles,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
    },
  ];

  const mockResults = {
    quiz: `Generated Quiz: Machine Learning Basics
    
Question 1: What is supervised learning?
- Multiple choice
- 4 options
- Difficulty: Easy

Question 2: Explain gradient descent
- Short answer
- Difficulty: Medium

Question 3: Compare neural networks vs traditional ML
- Essay type
- Difficulty: Hard

✓ 3 questions generated
✓ 5-10 minute duration estimated`,

    questions: `Generated Questions:

Easy (2 questions):
• What is the basic definition of data science?
• Name three programming languages used in ML.

Medium (2 questions):
• How does cross-validation improve model reliability?
• Explain the bias-variance tradeoff.

Difficult (1 question):
• Design a machine learning pipeline for time-series forecasting with feature engineering and model selection considerations.`,

    difficulty: `Difficulty Analysis Report:

Content: "Implement a neural network from scratch"
Current Level: Hard (8.5/10)

Recommendations:
✓ Break into smaller steps
✓ Add foundational concepts first
✓ Provide pseudo-code example
✓ Include step-by-step walkthrough

Suggested Adjusted Level: Medium-Hard (6.5/10)
Estimated Time: 45-60 minutes`,

    rubric: `Assessment Rubric Generated:

Criteria 1: Understanding (25%)
- Excellent: Complete understanding demonstrated
- Good: Mostly correct with minor gaps
- Fair: Partial understanding
- Poor: Lacks fundamental concepts

Criteria 2: Application (25%)
- Excellent: Correctly applies in new contexts
- Good: Applies with minor issues
- Fair: Limited application
- Poor: No application shown

Criteria 3: Analysis (25%)
- Excellent: Deep critical analysis
- Good: Adequate analysis present
- Fair: Basic analysis only
- Poor: No analysis

Criteria 4: Presentation (25%)
- Excellent: Clear and well-organized
- Good: Generally clear
- Fair: Somewhat unclear
- Poor: Confusing presentation`,
  };

  const handleGenerateMockResult = (toolId: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedResult(mockResults[toolId as keyof typeof mockResults]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Teacher's Toolkit</h1>
        <p className="text-sm text-gray-600 mt-1">Leverage AI to create better assessments and content</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`text-left p-5 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${tool.color} hover:border-opacity-100 border-opacity-50`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={`h-5 w-5 ${tool.iconColor} flex-shrink-0`} />
                    <h3 className="font-bold text-base text-gray-900">{tool.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleGenerateMockResult(tool.id);
                  setSelectedTool(tool.id);
                }}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-white text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors duration-200 border border-gray-200"
              >
                Try Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </button>
          );
        })}
      </div>

      {/* Modal for Generated Result */}
      {selectedTool && generatedResult && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {tools.find(t => t.id === selectedTool)?.name}
              </h2>
              <button
                onClick={() => {
                  setSelectedTool(null);
                  setGeneratedResult(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-orange-500 animate-spin mb-4" />
                  <p className="text-gray-600 font-medium">Generating content...</p>
                </div>
              ) : (
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-800">
                  {generatedResult}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {!isGenerating && (
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedTool(null);
                    setGeneratedResult(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleGenerateMockResult(selectedTool)}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#0B1220] text-white font-medium hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
