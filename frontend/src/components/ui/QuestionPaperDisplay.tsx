'use client';

import React, { useState, useRef } from 'react';
import { QuestionPaper, Assignment } from '../../services/api';
import { Download, Printer } from 'lucide-react';

interface QuestionPaperDisplayProps {
  assignment: Assignment;
  paper: QuestionPaper;
}

export default function QuestionPaperDisplay({
  assignment,
  paper,
}: QuestionPaperDisplayProps) {
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!contentRef.current) return;
    const printWindow = window.open('', '', 'height=800,width=900');
    if (!printWindow) return;
    printWindow.document.write(contentRef.current.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="space-y-6">
      {/* Notification Bar */}
      <div className="bg-gray-800 text-white rounded-lg px-6 py-4 flex items-center justify-between gap-4">
        <p className="text-sm font-medium">
          Certainly! Here are customized Question Papers for your CBSE Grade 8 Science classes on the NCERT chapters:
        </p>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 text-sm"
        >
          <Download className="h-4 w-4" />
          Download as PDF
        </button>
      </div>

      {/* Download Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-1">Question Paper</h2>
          <p className="text-sm text-gray-600">
            {paper.sections.length} sections • {assignment.totalQuestions} questions • {assignment.totalMarks} marks
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors bg-white">
            <input
              type="checkbox"
              checked={showAnswerKey}
              onChange={(e) => setShowAnswerKey(e.target.checked)}
              className="rounded w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Show Answer Key</span>
          </label>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition-colors shadow-md"
          >
            <Printer className="h-4 w-4" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Question Paper Content */}
      <div
        ref={contentRef}
        className="bg-white rounded-lg overflow-hidden shadow-sm"
      >
        {/* Header */}
        <div className="px-8 md:px-12 py-8 text-center space-y-1 border-b border-gray-300">
          <h1 className="text-2xl font-bold text-gray-900">Delhi Public School, Sector-4, Bokaro</h1>
          <p className="text-sm text-gray-700">Subject: {assignment.title}</p>
          <p className="text-sm text-gray-700">Class: 5th</p>
        </div>

        {/* Time and Marks */}
        <div className="px-8 md:px-12 py-4 border-b border-gray-300 flex justify-between text-sm">
          <div>
            <span className="font-semibold">Time Allowed:</span> 45 minutes
          </div>
          <div>
            <span className="font-semibold">Maximum Marks:</span> {assignment.totalMarks}
          </div>
        </div>

        {/* General Instructions */}
        <div className="px-8 md:px-12 py-4 border-b border-gray-300 text-sm">
          <p>All questions are compulsory unless stated otherwise.</p>
        </div>

        {/* Student Info */}
        <div className="px-8 md:px-12 py-4 border-b border-gray-300">
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-8">
              <div className="flex-1">
                <span>Name: </span>
                <span className="border-b border-gray-400 inline-block w-48"></span>
              </div>
              <div className="flex-1">
                <span>Roll Number: </span>
                <span className="border-b border-gray-400 inline-block w-32"></span>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div>
                <span>Class: </span>
                <span>5th</span>
              </div>
              <div>
                <span>Section: </span>
                <span className="border-b border-gray-400 inline-block w-24"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Sections with Questions */}
        <div className="px-8 md:px-12 py-8 space-y-8">
          {paper.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              {/* Section Title */}
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-2">
                Section {String.fromCharCode(65 + sectionIndex)}
              </h2>

              {/* Section Type */}
              <p className="text-sm font-semibold text-gray-800">{section.title}</p>

              {/* Section Instruction */}
              {section.instruction && (
                <p className="text-xs text-gray-700 italic">{section.instruction}</p>
              )}

              {/* Questions */}
              <div className="space-y-4 mt-4">
                {section.questions.map((question, qIndex) => {
                  const questionNumber = paper.sections
                    .slice(0, sectionIndex)
                    .reduce((sum, s) => sum + s.questions.length, 0) + qIndex + 1;
                  
                  const difficultyMap: { [key: string]: string } = {
                    'easy': 'Easy',
                    'medium': 'Moderate',
                    'hard': 'Challenging'
                  };
                  
                  return (
                    <div key={qIndex} className="text-sm">
                      <p className="text-gray-900 leading-relaxed">
                        <span className="font-bold">{questionNumber}.</span> {question.question} <span className="text-gray-700">[{difficultyMap[question.difficulty]}] [{question.marks} Mark{question.marks > 1 ? 's' : ''}]</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* End of Question Paper */}
          <div className="text-center text-sm font-semibold text-gray-700 py-4 border-t border-gray-300 mt-8">
            End of Question Paper
          </div>
        </div>

        {/* Answer Key */}
        {showAnswerKey && (
          <>
            <div className="border-t-2 border-gray-900 mt-8 pt-8 px-8 md:px-12">
              <h3 className="text-xl font-bold text-gray-900 text-center mb-6 pb-2 border-b border-gray-300">
                Answer Key
              </h3>

              <div className="space-y-6">
                {paper.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <h4 className="font-bold text-sm text-gray-900 mb-4 pb-1 border-b border-gray-300">
                      Section {String.fromCharCode(65 + sectionIndex)}
                    </h4>

                    <div className="space-y-3 ml-4">
                      {section.questions.map((question, qIndex) => {
                        const questionNumber = paper.sections
                          .slice(0, sectionIndex)
                          .reduce((sum, s) => sum + s.questions.length, 0) + qIndex + 1;
                        
                        return (
                          <div key={qIndex} className="text-xs border-b border-gray-200 pb-3 last:border-b-0">
                            <p className="font-semibold text-gray-800 mb-1">
                              Q{questionNumber}. {question.question.substring(0, 100)}
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                              {question.answer || 'Provide response based on curriculum.'}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Answer Key Guidelines */}
              {paper.answerKey && (
                <div className="mt-8 pt-6 border-t border-gray-300">
                  <h4 className="font-bold text-sm text-gray-900 mb-2">General Evaluation Notes</h4>
                  <p className="text-xs text-gray-700 leading-relaxed">{paper.answerKey}</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
