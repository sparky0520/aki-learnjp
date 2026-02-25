"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    Search,
    Filter,
    ArrowUpDown,
    User,
    BookOpen,
    Calendar,
    BarChart3
} from "lucide-react";

interface Attempt {
    id: string;
    quiz_id: string;
    user_id: string;
    score: number;
    total_questions: number;
    attempted_at: string;
    student_name: string;
    student_image: string;
    lesson_numbers: number[];
    org_quizzes: {
        lesson_ids: string[];
        created_at: string;
    };
}

export default function AdminAnalysePage() {
    const { orgRole, isLoaded: isAuthLoaded } = useAuth();
    const router = useRouter();
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedQuizId, setSelectedQuizId] = useState<string>("all");
    const [sortConfig, setSortConfig] = useState<{ key: keyof Attempt | 'percentage'; direction: 'asc' | 'desc' } | null>(null);

    const isAdmin = orgRole === "org:admin";

    useEffect(() => {
        if (isAuthLoaded && !isAdmin) {
            router.push("/dashboard");
        }
    }, [isAuthLoaded, isAdmin, router]);

    useEffect(() => {
        async function fetchAnalysisData() {
            try {
                const response = await fetch("/api/admin/quizzes/attempts");
                if (!response.ok) throw new Error("Failed to fetch analysis data");
                const data = await response.json();
                setAttempts(data);
            } catch (error) {
                console.error("Error fetching analysis:", error);
            } finally {
                setIsLoading(false);
            }
        }

        if (isAdmin) {
            fetchAnalysisData();
        }
    }, [isAdmin]);

    if (!isAuthLoaded || isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAdmin) return null;

    // Filter unique quizzes for the dropdown
    const uniqueQuizzes = Array.from(new Set(attempts.map(a => a.quiz_id))).map(id => {
        const attempt = attempts.find(a => a.quiz_id === id);
        return {
            id,
            date: new Date(attempt?.org_quizzes?.created_at || "").toLocaleDateString(),
            lessonNumbers: attempt?.lesson_numbers || []
        };
    });

    // Filtering logic
    const filteredAttempts = attempts.filter(attempt => {
        const matchesSearch = attempt.student_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesQuiz = selectedQuizId === "all" || attempt.quiz_id === selectedQuizId;
        return matchesSearch && matchesQuiz;
    });

    // Sorting logic
    const sortedAttempts = [...filteredAttempts].sort((a, b) => {
        if (!sortConfig) return 0;

        let aValue: any;
        let bValue: any;

        if (sortConfig.key === 'percentage') {
            aValue = (a.score / a.total_questions) * 100;
            bValue = (b.score / b.total_questions) * 100;
        } else {
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof Attempt | 'percentage') => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    // Stats
    const totalAttempts = filteredAttempts.length;
    const avgScore = totalAttempts > 0
        ? (filteredAttempts.reduce((acc, current) => acc + (current.score / current.total_questions), 0) / totalAttempts) * 100
        : 0;

    return (
        <div className="container max-w-7xl py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <BarChart3 className="w-8 h-8 text-primary" />
                        Class Performance Analysis
                    </h1>
                    <p className="text-muted-foreground">
                        Track and analyze quiz results for all organization members.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by student..."
                            className="w-full pl-9 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative flex-1 md:w-64">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                            className="w-full pl-9 pr-4 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                            value={selectedQuizId}
                            onChange={(e) => setSelectedQuizId(e.target.value)}
                        >
                            <option value="all">All Quizzes</option>
                            {uniqueQuizzes.map(quiz => (
                                <option key={quiz.id} value={quiz.id}>
                                    Quiz from {quiz.date} (Lessons {quiz.lessonNumbers.join(", ")})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                            <User className="w-4 h-4" /> Total Attempts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalAttempts}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" /> Average Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-primary">{avgScore.toFixed(1)}%</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Unique Students
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {new Set(filteredAttempts.map(a => a.user_id)).size}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis Table */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-muted/50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-sm">Student</th>
                                <th className="p-4 font-semibold text-sm">
                                    <button
                                        className="flex items-center gap-1 hover:text-primary transition-colors"
                                        onClick={() => handleSort('percentage')}
                                    >
                                        Score <ArrowUpDown className="w-4 h-4" />
                                    </button>
                                </th>
                                <th className="p-4 font-semibold text-sm">Quiz Lessons</th>
                                <th className="p-4 font-semibold text-sm">
                                    <button
                                        className="flex items-center gap-1 hover:text-primary transition-colors"
                                        onClick={() => handleSort('attempted_at')}
                                    >
                                        Date <ArrowUpDown className="w-4 h-4" />
                                    </button>
                                </th>
                                <th className="p-4 font-semibold text-sm">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {sortedAttempts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                        No results found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                sortedAttempts.map((attempt) => {
                                    const percentage = (attempt.score / attempt.total_questions) * 100;
                                    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";

                                    if (percentage >= 80) badgeVariant = "default";
                                    else if (percentage >= 50) badgeVariant = "secondary";
                                    else badgeVariant = "destructive";

                                    return (
                                        <tr key={attempt.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {attempt.student_image ? (
                                                        <img
                                                            src={attempt.student_image}
                                                            alt={attempt.student_name}
                                                            className="w-8 h-8 rounded-full border shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    <span className="font-medium">{attempt.student_name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-bold">
                                                        {attempt.score} / {attempt.total_questions}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground tracking-wider">
                                                        ({percentage.toFixed(0)}%)
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {attempt.lesson_numbers?.map((lN, idx) => (
                                                        <Badge key={idx} variant="outline" className="text-[10px] px-1.5 py-0">
                                                            L-{lN}
                                                        </Badge>
                                                    ))}
                                                    {(!attempt.lesson_numbers || attempt.lesson_numbers.length === 0) && (
                                                        <span className="text-xs text-muted-foreground italic">No lessons</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(attempt.attempted_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Badge variant={badgeVariant}>
                                                    {percentage >= 80 ? 'Excellent' : percentage >= 50 ? 'Passed' : 'Needs Review'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
