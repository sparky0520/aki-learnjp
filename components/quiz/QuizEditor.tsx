"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Send, X, GripVertical } from "lucide-react";

interface Question {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

interface QuizEditorProps {
    questions: Question[];
    onSave: (questions: Question[]) => void;
    onCancel: () => void;
    isSaving?: boolean;
}

export function QuizEditor({ questions: initialQuestions, onSave, onCancel, isSaving = false }: QuizEditorProps) {
    const [questions, setQuestions] = useState<Question[]>(initialQuestions);

    const handleQuestionChange = (index: number, field: keyof Question, value: any) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const updatedQuestions = [...questions];
        const updatedOptions = [...updatedQuestions[qIndex].options];
        updatedOptions[oIndex] = value;
        updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], options: updatedOptions };
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "New Question",
                options: ["Option 1", "Option 2", "Option 3", "Option 4"],
                correct_answer: "Option 1",
                explanation: ""
            }
        ]);
    };

    const deleteQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold">Preview & Edit Quiz</h2>
                    <p className="text-muted-foreground">Review and refine the generated questions before dispatching to students.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={onCancel} disabled={isSaving}>
                        <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button onClick={() => onSave(questions)} disabled={isSaving || questions.length === 0}>
                        {isSaving ? (
                            <>Dispatching...</>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" /> Dispatch to Class
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 pb-20">
                {questions.map((q, qIndex) => (
                    <Card key={qIndex} className="relative group hover:border-primary/50 transition-all duration-300 shadow-sm overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors" />
                        <CardHeader className="pb-3 flex flex-row items-start justify-between">
                            <div className="space-y-1 flex-1 mr-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="font-mono">Question {qIndex + 1}</Badge>
                                </div>
                                <textarea
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                                    className="w-full text-lg font-semibold bg-transparent border-none focus:ring-0 resize-none p-0 min-h-[60px]"
                                    placeholder="Enter question text..."
                                />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteQuestion(qIndex)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 -mt-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((option, oIndex) => (
                                    <div key={oIndex} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${q.correct_answer === option ? 'border-primary bg-primary/5 border-2 shadow-sm' : 'border-transparent bg-muted/30 hover:bg-muted/50'}`}>
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${q.correct_answer === option ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}
                                            onClick={() => handleQuestionChange(qIndex, "correct_answer", option)}
                                        >
                                            {String.fromCharCode(65 + oIndex)}
                                        </div>
                                        <input
                                            value={option}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                const oldCorrect = q.correct_answer === option;
                                                handleOptionChange(qIndex, oIndex, newValue);
                                                if (oldCorrect) {
                                                    handleQuestionChange(qIndex, "correct_answer", newValue);
                                                }
                                            }}
                                            className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-sm font-medium"
                                            placeholder={`Option ${oIndex + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                                    Explanation
                                </label>
                                <textarea
                                    value={q.explanation}
                                    onChange={(e) => handleQuestionChange(qIndex, "explanation", e.target.value)}
                                    className="w-full text-sm bg-muted/30 border-none focus:ring-0 rounded-md p-3 min-h-[80px]"
                                    placeholder="Why is the answer correct?"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <Button
                    variant="outline"
                    className="w-full py-8 border-dashed border-2 hover:border-primary hover:bg-primary/5 group"
                    onClick={addQuestion}
                >
                    <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Add Question
                </Button>
            </div>
        </div>
    );
}
