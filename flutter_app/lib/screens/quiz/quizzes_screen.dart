import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../constants/app_colors.dart';
import '../../constants/app_strings.dart';
import '../../models/quiz.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';
import '../../widgets/bottom_bars.dart';
import '../../widgets/common_widgets.dart';
import '../chat/ask_aki_screen.dart';

/// Lists all quizzes assigned to the user.
class QuizzesScreen extends StatefulWidget {
  const QuizzesScreen({super.key});

  @override
  State<QuizzesScreen> createState() => _QuizzesScreenState();
}

class _QuizzesScreenState extends State<QuizzesScreen> {
  // Placeholder quiz list until the API is wired up.
  final List<Map<String, dynamic>> _quizzes = [
    {'id': '1', 'title': 'Lesson 1 Quiz', 'lessonNumber': 1},
    {'id': '2', 'title': 'Lesson 2 Quiz', 'lessonNumber': 2},
    {'id': '3', 'title': 'Kana Practice Quiz', 'lessonNumber': 1},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.paperBg,
      appBar: AppBar(
        title: const Text(AppStrings.assignedQuiz),
        backgroundColor: AppColors.paperBg,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(20),
        itemCount: _quizzes.length,
        itemBuilder: (ctx, i) {
          final q = _quizzes[i];
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              tileColor: AppColors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
                side: const BorderSide(color: AppColors.borderGray),
              ),
              title: Text(q['title'] as String),
              trailing: const Icon(
                Icons.chevron_right,
                color: AppColors.pencilGray,
              ),
              onTap: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => QuizScreen(
                    quizId: q['id'] as String,
                    title: q['title'] as String,
                    lessonNumber: q['lessonNumber'] as int,
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

/// Quiz-taking screen.
class QuizScreen extends StatefulWidget {
  final String quizId;
  final String title;
  final int lessonNumber;

  const QuizScreen({
    super.key,
    required this.quizId,
    required this.title,
    required this.lessonNumber,
  });

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  List<QuizQuestion> _questions = [];
  int _current = 0;
  final Map<int, int> _answers = {};
  bool _loading = true;
  String? _error;
  bool _submitted = false;

  @override
  void initState() {
    super.initState();
    _fetch();
  }

  Future<void> _fetch() async {
    final auth = context.read<AuthService>();
    final api = context.read<ApiService>();
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final questions = await api.fetchQuiz(widget.quizId, token: auth.token);
      setState(() => _questions = questions);
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } catch (_) {
      // Show demo questions if API fails
      setState(() => _questions = _demoQuestions);
    } finally {
      setState(() => _loading = false);
    }
  }

  static final _demoQuestions = [
    const QuizQuestion(
      id: 'd1',
      questionText: 'What is the hiragana for "ka"?',
      options: ['あ', 'か', 'さ', 'た'],
      correctIndex: 1,
    ),
    const QuizQuestion(
      id: 'd2',
      questionText: 'What does "こんにちは" mean?',
      options: ['Good morning', 'Good night', 'Hello', 'Goodbye'],
      correctIndex: 2,
    ),
    const QuizQuestion(
      id: 'd3',
      questionText: 'Which particle marks the topic?',
      options: ['を', 'が', 'は', 'に'],
      correctIndex: 2,
    ),
  ];

  Future<void> _submit() async {
    final auth = context.read<AuthService>();
    final api = context.read<ApiService>();
    try {
      await api.submitQuizResult(
        widget.quizId,
        {
          'answers': _answers,
          'total': _questions.length,
          'correct': _calculateScore(),
        },
        token: auth.token,
      );
    } catch (_) {}
    setState(() => _submitted = true);
  }

  int _calculateScore() {
    int score = 0;
    for (final entry in _answers.entries) {
      if (entry.value == _questions[entry.key].correctIndex) score++;
    }
    return score;
  }

  void _handleNext() {
    if (_current < _questions.length - 1) {
      setState(() => _current++);
    } else {
      _submit();
    }
  }

  void _handlePrev() {
    if (_current > 0) setState(() => _current--);
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return Scaffold(
        backgroundColor: AppColors.paperBg,
        appBar: AppBar(
          title: Text(widget.title),
          backgroundColor: AppColors.paperBg,
        ),
        body: const LoadingOverlay(),
      );
    }

    if (_error != null && _questions.isEmpty) {
      return Scaffold(
        backgroundColor: AppColors.paperBg,
        appBar: AppBar(title: Text(widget.title)),
        body: ErrorDisplay(message: _error!, onRetry: _fetch),
      );
    }

    if (_submitted) {
      return _ResultScreen(
        score: _calculateScore(),
        total: _questions.length,
        onRetry: () => setState(() {
          _submitted = false;
          _current = 0;
          _answers.clear();
        }),
      );
    }

    final question = _questions[_current];

    return Scaffold(
      backgroundColor: AppColors.paperBg,
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: AppColors.paperBg,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Progress
            LinearProgressIndicator(
              value: (_current + 1) / _questions.length,
              backgroundColor: Colors.grey[200],
              valueColor:
                  const AlwaysStoppedAnimation(AppColors.accentRed),
              minHeight: 6,
            ),
            const SizedBox(height: 8),
            Text(
              '${_current + 1} / ${_questions.length}',
              style: const TextStyle(
                color: AppColors.pencilGray,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 24),

            // Question
            Text(
              question.questionText,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppColors.inkColor,
              ),
            ),
            const SizedBox(height: 24),

            // Options
            Expanded(
              child: ListView.builder(
                itemCount: question.options.length,
                itemBuilder: (ctx, i) {
                  final isSelected = _answers[_current] == i;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: GestureDetector(
                      onTap: () =>
                          setState(() => _answers[_current] = i),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppColors.accentRed.withOpacity(0.08)
                              : AppColors.white,
                          border: Border.all(
                            color: isSelected
                                ? AppColors.accentRed
                                : AppColors.borderGray,
                            width: isSelected ? 1.5 : 1,
                          ),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          children: [
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              width: 20,
                              height: 20,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isSelected
                                      ? AppColors.accentRed
                                      : AppColors.borderGray,
                                  width: 2,
                                ),
                              ),
                              child: isSelected
                                  ? Center(
                                      child: Container(
                                        width: 10,
                                        height: 10,
                                        decoration: const BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: AppColors.accentRed,
                                        ),
                                      ),
                                    )
                                  : null,
                            ),
                            const SizedBox(width: 12),
                            Text(
                              question.options[i],
                              style: TextStyle(
                                fontSize: 16,
                                color: isSelected
                                    ? AppColors.inkColor
                                    : AppColors.pencilGray,
                                fontWeight: isSelected
                                    ? FontWeight.w600
                                    : FontWeight.normal,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: LessonBottomBar(
        onPrev: _current > 0 ? _handlePrev : null,
        onNext: _handleNext,
        onAskAki: () => Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) =>
                AskAkiScreen(lessonNumber: widget.lessonNumber),
          ),
        ),
        isLastQuestion: _current == _questions.length - 1,
      ),
    );
  }
}

/// Score result screen shown after quiz submission.
class _ResultScreen extends StatelessWidget {
  final int score;
  final int total;
  final VoidCallback onRetry;

  const _ResultScreen({
    required this.score,
    required this.total,
    required this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    final pct = total > 0 ? (score / total * 100).round() : 0;
    final passed = pct >= 70;

    return Scaffold(
      backgroundColor: AppColors.paperBg,
      appBar: AppBar(
        title: const Text('Results'),
        backgroundColor: AppColors.paperBg,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Hanko-style result
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: passed ? const Color(0xFF4ADE80) : AppColors.accentRed,
                    width: 4,
                  ),
                ),
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        '$pct%',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: passed
                              ? const Color(0xFF22C55E)
                              : AppColors.accentRed,
                        ),
                      ),
                      Text(
                        passed ? '合格' : '不合格',
                        style: TextStyle(
                          fontSize: 16,
                          color: passed
                              ? const Color(0xFF22C55E)
                              : AppColors.accentRed,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Text(
                '$score / $total correct',
                style: const TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppColors.inkColor,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                passed
                    ? 'Great work! Keep it up.'
                    : 'Keep practicing. You can do it!',
                style: const TextStyle(color: AppColors.pencilGray),
              ),
              const SizedBox(height: 40),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  OutlinedButton(
                    onPressed: onRetry,
                    child: const Text('Try Again'),
                  ),
                  const SizedBox(width: 16),
                  ElevatedButton(
                    onPressed: () => Navigator.pop(context),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.inkColor,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Done'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
