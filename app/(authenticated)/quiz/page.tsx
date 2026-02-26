"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Send } from "lucide-react";
import { QuizInterface } from "@/components/quiz/QuizInterface";
import { QuizEditor } from "@/components/quiz/QuizEditor";
import { useRouter } from "next/navigation";

interface Lesson {
    id: string;
    lesson_number: number;
    title: string;
}

export default function QuizPage() {
    const { orgRole, isLoaded: isAuthLoaded } = useAuth();
    const router = useRouter();
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDispatching, setIsDispatching] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<any[] | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAdmin = orgRole === "org:admin";

    useEffect(() => {
        if (isAuthLoaded && !isAdmin) {
            router.push("/quizzes");
        }
    }, [isAuthLoaded, isAdmin, router]);

    useEffect(() => {
        async function fetchLessons() {
            try {
                const { data, error } = await supabase
                    .from("lessons")
                    .select("id, lesson_number, title")
                    .order("lesson_number");

                if (error) throw error;
                setLessons(data || []);
            } catch (e) {
                console.error("Error fetching lessons:", e);
                setError("Failed to load lessons");
            } finally {
                setIsLoading(false);
            }
        }

        fetchLessons();
    }, []);

    const handleLessonToggle = (lessonId: string) => {
        setSelectedLessonIds((prev) =>
            prev.includes(lessonId)
                ? prev.filter((id) => id !== lessonId)
                : [...prev, lessonId]
        );
    };

    const handleStartQuiz = async (preview = false) => {
        if (selectedLessonIds.length === 0) return;

        setIsGenerating(true);
        setError(null);

        try {
            const response = await fetch("/api/quiz/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lesson_ids: selectedLessonIds,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate quiz");
            }

            const questions = await response.json();

            setQuizQuestions(questions);
            if (preview) {
                setIsEditing(true);
            }
        } catch (e: any) {
            console.error("Error generating quiz:", e);
            setError(e.message || "Failed to generate quiz. Please try again.");
            alert(e.message || "Failed to generate quiz");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDispatch = async (editedQuestions: any[]) => {
        setIsDispatching(true);
        setError(null);

        try {
            const response = await fetch("/api/quiz/dispatch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lesson_ids: selectedLessonIds,
                    questions: editedQuestions
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to dispatch quiz");
            }

            alert("Quiz dispatched successfully to the class!");
            handleRestart();
        } catch (e: any) {
            console.error("Error dispatching quiz:", e);
            setError(e.message || "Failed to dispatch quiz. Please try again.");
            alert(e.message || "Failed to dispatch quiz");
        } finally {
            setIsDispatching(false);
        }
    };

    const handleRestart = () => {
        setQuizQuestions(null);
        setSelectedLessonIds([]);
        setIsEditing(false);
    };

    if (isLoading || !isAuthLoaded) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (quizQuestions) {
        if (isEditing) {
            return (
                <div className="container max-w-5xl py-8">
                    <QuizEditor
                        questions={quizQuestions}
                        onSave={handleDispatch}
                        onCancel={handleRestart}
                        isSaving={isDispatching}
                    />
                </div>
            );
        }
        return <QuizInterface questions={quizQuestions} onRestart={handleRestart} />;
    }

    if (!isAdmin) return null; // Prevent flash of content before redirect

    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Quiz Generator</h1>
                    <p className="text-muted-foreground">
                        Select lessons to generate a custom quiz. Admins can preview and edit
                        before dispatching to the class.
                    </p>
                </div>
            </div>

            <Card className="shadow-lg border-primary/10">
                <CardHeader>
                    <CardTitle className="text-2xl">Select Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 border border-destructive/20 animate-in shake-1">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {lessons.map((lesson) => (
                            <div
                                key={lesson.id}
                                className={`
                  flex items-start space-x-3 p-4 rounded-lg border transition-all cursor-pointer shadow-sm
                  ${selectedLessonIds.includes(lesson.id)
                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                        : "hover:bg-muted/50 border-muted"
                                    }
                `}
                                onClick={() => handleLessonToggle(lesson.id)}
                            >
                                <Checkbox
                                    checked={selectedLessonIds.includes(lesson.id)}
                                />
                                <div className="space-y-1">
                                    <p className="font-semibold leading-none">
                                        Lesson {lesson.lesson_number}
                                    </p>
                                    <p className="text-sm text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ __html: lesson.title }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-4">
                        {isAdmin && (
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => handleStartQuiz(true)}
                                disabled={selectedLessonIds.length === 0 || isGenerating}
                                className="min-w-[200px] border-primary/20 hover:border-primary/50"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Generate & Preview
                                    </>
                                )}
                            </Button>
                        )}
                        <Button
                            size="lg"
                            onClick={() => handleStartQuiz(false)}
                            disabled={selectedLessonIds.length === 0 || isGenerating}
                            className="min-w-[150px] shadow-md shadow-primary/20"
                        >
                            {isGenerating && !isAdmin ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                "Start Practice"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
