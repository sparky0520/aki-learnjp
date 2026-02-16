"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Question {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

interface QuizInterfaceProps {
    questions: Question[];
    onRestart: () => void;
}

export function QuizInterface({ questions, onRestart }: QuizInterfaceProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswerChecked, setIsAnswerChecked] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionSelect = (option: string) => {
        if (isAnswerChecked) return;
        setSelectedOption(option);
    };

    const handleCheckAnswer = () => {
        if (!selectedOption) return;

        const isCorrect = selectedOption === currentQuestion.correct_answer;
        if (isCorrect) {
            setScore((prev) => prev + 1);
        }
        setIsAnswerChecked(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption(null);
            setIsAnswerChecked(false);
        } else {
            setShowResults(true);
        }
    };

    if (showResults) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Quiz Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-center">
                        <div className="text-6xl font-bold text-primary">
                            {score} / {questions.length}
                        </div>
                        <p className="text-muted-foreground">
                            {score === questions.length
                                ? "Perfect score! Outstanding work!"
                                : score >= questions.length * 0.7
                                    ? "Great job! Keep practicing!"
                                    : "Good effort! Review the lessons and try again."}
                        </p>
                        <Button onClick={onRestart} className="w-full">
                            Take Another Quiz
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                <span>
                    Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span>Score: {score}</span>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">
                        <ReactMarkdown>{currentQuestion.question}</ReactMarkdown>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-3">
                        {currentQuestion.options.map((option, index) => {
                            let variant = "outline";
                            if (isAnswerChecked) {
                                if (option === currentQuestion.correct_answer) {
                                    variant = "success"; // Will need to style this mostly likely with tailwind classes directly
                                } else if (option === selectedOption) {
                                    variant = "destructive";
                                }
                            } else if (option === selectedOption) {
                                variant = "default";
                            }

                            return (
                                <div
                                    key={index}
                                    onClick={() => handleOptionSelect(option)}
                                    className={`
                    p-4 rounded-lg border cursor-pointer transition-all
                    ${isAnswerChecked && option === currentQuestion.correct_answer
                                            ? "bg-green-100 border-green-500 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800"
                                            : ""
                                        }
                    ${isAnswerChecked &&
                                            option === selectedOption &&
                                            option !== currentQuestion.correct_answer
                                            ? "bg-red-100 border-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800"
                                            : ""
                                        }
                    ${!isAnswerChecked && selectedOption === option
                                            ? "bg-primary/20 border-primary ring-2 ring-primary/20"
                                            : "hover:bg-muted/50"
                                        }
                  `}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{option}</span>
                                        {isAnswerChecked &&
                                            option === currentQuestion.correct_answer && (
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                            )}
                                        {isAnswerChecked &&
                                            option === selectedOption &&
                                            option !== currentQuestion.correct_answer && (
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {isAnswerChecked && (
                        <div className="mt-4 p-4 bg-muted rounded-lg animate-in fade-in slide-in-from-top-2">
                            <p className="font-semibold text-sm mb-1">Explanation:</p>
                            <p className="text-sm text-muted-foreground">
                                {currentQuestion.explanation}
                            </p>
                        </div>
                    )}

                    <Button
                        onClick={isAnswerChecked ? handleNextQuestion : handleCheckAnswer}
                        disabled={!selectedOption}
                        className="w-full mt-6"
                    >
                        {isAnswerChecked
                            ? currentQuestionIndex < questions.length - 1
                                ? "Next Question"
                                : "Finish Quiz"
                            : "Check Answer"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
