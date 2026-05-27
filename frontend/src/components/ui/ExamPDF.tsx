'use client';

import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet 
} from '@react-pdf/renderer';
import { Assignment, QuestionPaper } from '../../services/api';

interface ExamPDFProps {
  assignment: Assignment;
  paper: QuestionPaper;
  includeAnswerKey?: boolean;
}

// Define printable styles matching classic professional exam papers
const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    color: '#000',
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  schoolHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subjectClass: {
    fontSize: 10,
    marginBottom: 1,
  },
  examTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 5,
  },
  examDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    fontSize: 9,
  },
  detailsLabel: {
    fontWeight: 'bold',
  },
  generalInstructions: {
    fontSize: 9,
    marginVertical: 8,
    paddingLeft: 5,
    borderLeftWidth: 2,
    borderLeftColor: '#000',
  },
  studentInfoTable: {
    marginVertical: 12,
    fontSize: 9,
  },
  studentInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  studentInfoLabel: {
    width: '48%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    paddingBottom: 1,
  },
  sectionContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 2,
  },
  sectionInstruction: {
    fontSize: 8.5,
    fontStyle: 'italic',
    color: '#333',
    marginBottom: 8,
    marginLeft: 5,
  },
  questionRow: {
    marginVertical: 5,
    marginLeft: 5,
    fontSize: 9,
  },
  questionNumber: {
    fontWeight: 'bold',
    marginBottom: 1,
  },
  questionText: {
    marginBottom: 1,
  },
  questionMeta: {
    fontSize: 8.5,
    color: '#333',
    marginTop: 1,
  },
  answerKeyHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
  },
  answerRow: {
    marginVertical: 8,
    marginLeft: 5,
  },
  answerQuestion: {
    fontWeight: 'bold',
    fontSize: 9,
    marginBottom: 2,
  },
  answerText: {
    fontSize: 8.5,
    color: '#000',
    lineHeight: 1.3,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 7.5,
    color: '#666',
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    paddingTop: 3,
  }
});

export function ExamPDF({ assignment, paper, includeAnswerKey = false }: ExamPDFProps) {
  const dateStr = new Date(assignment.dueDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  // Map difficulty to text format
  const getDifficultyText = (difficulty: string) => {
    const map: { [key: string]: string } = {
      'easy': 'Easy',
      'medium': 'Moderate',
      'hard': 'Challenging'
    };
    return map[difficulty] || difficulty;
  };

  return (
    <Document>
      {/* Page 1: Main Exam Paper */}
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.schoolHeader}>{assignment.title}</Text>
          <Text style={styles.subjectClass}>Subject: Science</Text>
          <Text style={styles.subjectClass}>Class: 8th</Text>
        </View>

        {/* Exam Details */}
        <View style={styles.examDetails}>
          <View>
            <Text><Text style={styles.detailsLabel}>Time Allowed:</Text> 45 minutes</Text>
          </View>
          <View>
            <Text><Text style={styles.detailsLabel}>Maximum Marks:</Text> {assignment.totalMarks}</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.generalInstructions}>
          <Text>All questions are compulsory unless stated otherwise.</Text>
        </View>

        {/* Student Information */}
        <View style={styles.studentInfoTable}>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentInfoLabel}>Name: ___________________________________</Text>
            <Text style={styles.studentInfoLabel}>Roll Number: _________________________</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.studentInfoLabel}>Class: __________ Section: ____________</Text>
          </View>
        </View>

        {/* Sections and Questions */}
        {paper.sections.map((section, secIdx) => (
          <View key={secIdx} style={styles.sectionContainer}>
            {/* Section Header */}
            <Text style={styles.sectionTitle}>
              {String.fromCharCode(65 + secIdx)}. {section.title}
            </Text>
            
            {/* Section Instruction */}
            <Text style={styles.sectionInstruction}>
              Attempt all questions. Each question carries {section.questions[0]?.marks || 1} marks.
            </Text>

            {/* Questions */}
            {section.questions.map((q, qIdx) => {
              // Calculate global question number
              const globalQNum = paper.sections
                .slice(0, secIdx)
                .reduce((sum, s) => sum + s.questions.length, 0) + qIdx + 1;
              
              return (
                <View key={qIdx} style={styles.questionRow}>
                  <Text style={styles.questionNumber}>
                    {globalQNum}. {q.question}
                  </Text>
                  <Text style={styles.questionMeta}>
                    [{getDifficultyText(q.difficulty)}] [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                  </Text>
                </View>
              );
            })}
          </View>
        ))}

        {/* Footer */}
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} />
      </Page>

      {/* Page 2: Answer Key (Optional) */}
      {includeAnswerKey && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.schoolHeader}>Answer Key</Text>
            <Text style={styles.subjectClass}>Subject: Science | Class: 8th</Text>
          </View>

          <Text style={styles.answerKeyHeader}>Model Solutions</Text>

          {paper.sections.map((section, secIdx) => (
            <View key={secIdx} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                Section {String.fromCharCode(65 + secIdx)} - {section.title}
              </Text>
              
              {section.questions.map((q, qIdx) => {
                const globalQNum = paper.sections
                  .slice(0, secIdx)
                  .reduce((sum, s) => sum + s.questions.length, 0) + qIdx + 1;
                
                return (
                  <View key={qIdx} style={styles.answerRow}>
                    <Text style={styles.answerQuestion}>
                      Q{globalQNum}. {q.question.substring(0, 100)}
                    </Text>
                    <Text style={styles.answerText}>
                      {q.answer || 'Provide response based on curriculum.'}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}

          {/* Answer Key Guidelines */}
          {paper.answerKey && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Evaluation Guidelines</Text>
              <Text style={styles.answerText}>{paper.answerKey}</Text>
            </View>
          )}

          <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
          )} />
        </Page>
      )}
    </Document>
  );
}
