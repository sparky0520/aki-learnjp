"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ClipboardCheck, History, ArrowRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { QuizInterface } from "@/components/quiz/QuizInterface";
import { Badge } from "@/components/ui/badge";

interface Quiz {
    id: string;
    created_at: string;
    lesson_ids: string[];
    questions: any[];
    attempted: boolean;
    last_score: number | null;
    total_q: number | null;
    attempted_at: string | null;
}

export default function StudentQuizzesPage() {
    const { isLoaded, orgId } = useAuth();
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchQuizzes = async () => {
        try {
            const response = await fetch("/api/quizzes");
            if (!response.ok) throw new Error("Failed to fetch quizzes");
            const data = await response.json();
            setQuizzes(data);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isLoaded && orgId) {
            fetchQuizzes();
        }
    }, [isLoaded, orgId]);

    const handleAttemptQuiz = (quiz: Quiz) => {
        setActiveQuiz(quiz);
    };

    const handleQuizComplete = async (results: any) => {
        if (!activeQuiz) return;

        setIsSubmitting(true);
        const score = results.filter((r: any) => r.isCorrect).length;

        try {
            const response = await fetch("/api/quizzes/attempt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quiz_id: activeQuiz.id,
                    score,
                    total_questions: activeQuiz.questions.length,
                    results
                })
            });

            if (!response.ok) throw new Error("Failed to save quiz attempt");

            alert(`Quiz completed! Your score: ${score}/${activeQuiz.questions.length}`);
            setActiveQuiz(null);
            fetchQuizzes(); // Refresh the list
        } catch (error) {
            console.error("Error saving attempt:", error);
            alert("Failed to save your quiz results. Your progress might not be tracked.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isLoaded || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (activeQuiz) {
        return (
            <div className="container py-8">
                <QuizInterface
                    questions={activeQuiz.questions}
                    onRestart={() => setActiveQuiz(null)}
                    onComplete={handleQuizComplete}
                />
                {isSubmitting && (
                    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            <p className="font-semibold text-lg">Saving your results...</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const activeQuizzes = quizzes.filter(q => !q.attempted);
    const pastQuizzes = quizzes.filter(q => q.attempted);

    return (
        <div className="container max-w-6xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Class Quizzes</h1>
                <p className="text-muted-foreground">
                    View and attempt quizzes assigned by your organization teacher.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Quizzes */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <ClipboardCheck className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-semibold">Active Quizzes</h2>
                    </div>
                    {activeQuizzes.length === 0 ? (
                        <Card className="bg-muted/30 border-dashed">
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No new quizzes assigned. Check back later!
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {activeQuizzes.map(quiz => (
                                <Card key={quiz.id} className="hover:border-primary/50 transition-colors">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    Assigned {new Date(quiz.created_at).toLocaleDateString()}
                                                </CardTitle>
                                                <CardDescription>
                                                    {quiz.questions.length} Questions
                                                </CardDescription>
                                            </div>
                                            <Badge variant="secondary">New</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            className="w-full"
                                            onClick={() => handleAttemptQuiz(quiz)}
                                        >
                                            Start Quiz <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* Past Attempts */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <History className="w-6 h-6 text-muted-foreground" />
                        <h2 className="text-2xl font-semibold">Past Attempts</h2>
                    </div>
                    {pastQuizzes.length === 0 ? (
                        <Card className="bg-muted/10 border-dashed">
                            <CardContent className="py-12 text-center text-muted-foreground">
                                No past attempts yet. Complete your first quiz!
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {pastQuizzes.map(quiz => (
                                <Card key={quiz.id} className="opacity-80">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">
                                                    Attempted {new Date(quiz.attempted_at!).toLocaleDateString()}
                                                </CardTitle>
                                                <CardDescription>
                                                    Assigned {new Date(quiz.created_at).toLocaleDateString()}
                                                </CardDescription>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-primary">
                                                    {quiz.last_score}/{quiz.total_q}
                                                </div>
                                                <p className="text-xs text-muted-foreground text-center">Score</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => handleAttemptQuiz(quiz)}
                                        >
                                            Retake Quiz
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
