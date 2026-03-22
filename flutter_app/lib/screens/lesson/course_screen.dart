import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../constants/app_colors.dart';
import '../../models/lesson.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';
import '../../widgets/common_widgets.dart';
import 'lesson_screen.dart';

/// Displays the course chart for a given course number.
class CourseScreen extends StatefulWidget {
  final int courseNumber;
  final int initialLesson;

  const CourseScreen({
    super.key,
    required this.courseNumber,
    this.initialLesson = 1,
  });

  @override
  State<CourseScreen> createState() => _CourseScreenState();
}

class _CourseScreenState extends State<CourseScreen> {
  List<Lesson> _lessons = [];
  bool _loading = true;
  String? _error;

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
      final raw = await api.fetchCourseChart(
        widget.courseNumber,
        token: auth.token,
      );
      setState(() {
        _lessons = raw
            .map((e) => Lesson.fromJson(e as Map<String, dynamic>))
            .toList();
      });
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } catch (_) {
      setState(() => _error = 'Failed to load course chart.');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.paperBg,
      appBar: AppBar(
        title: Text('Course ${widget.courseNumber}'),
        backgroundColor: AppColors.paperBg,
      ),
      body: _loading
          ? const LoadingOverlay()
          : _error != null
              ? ErrorDisplay(message: _error!, onRetry: _fetch)
              : _lessons.isEmpty
                  ? _FallbackLessons(
                      initialLesson: widget.initialLesson,
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(20),
                      itemCount: _lessons.length,
                      itemBuilder: (ctx, i) {
                        final lesson = _lessons[i];
                        return _LessonTile(
                          lesson: lesson,
                          isActive:
                              lesson.lessonNumber == widget.initialLesson,
                        );
                      },
                    ),
    );
  }
}

/// Shown when the API returns an empty list — renders a static placeholder list.
class _FallbackLessons extends StatelessWidget {
  final int initialLesson;

  const _FallbackLessons({required this.initialLesson});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: 20,
      itemBuilder: (ctx, i) {
        final num = i + 1;
        return _LessonTile(
          lesson: Lesson(lessonNumber: num, title: 'Lesson $num'),
          isActive: num == initialLesson,
        );
      },
    );
  }
}

class _LessonTile extends StatelessWidget {
  final Lesson lesson;
  final bool isActive;

  const _LessonTile({required this.lesson, this.isActive = false});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => LessonScreen(lessonNumber: lesson.lessonNumber),
        ),
      ),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isActive
              ? AppColors.inkColor
              : AppColors.white,
          border: Border.all(color: AppColors.borderGray),
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 4,
              offset: const Offset(1, 2),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: lesson.isCompleted
                    ? const Color(0xFF4ADE80)
                    : isActive
                        ? AppColors.white
                        : AppColors.borderGray,
              ),
              child: Center(
                child: lesson.isCompleted
                    ? const Icon(Icons.check, size: 20, color: Colors.white)
                    : Text(
                        '${lesson.lessonNumber}',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color:
                              isActive ? AppColors.inkColor : AppColors.pencilGray,
                        ),
                      ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    lesson.title,
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 15,
                      color: isActive ? AppColors.white : AppColors.inkColor,
                    ),
                  ),
                  if (lesson.subtitle != null)
                    Text(
                      lesson.subtitle!,
                      style: TextStyle(
                        fontSize: 12,
                        color: isActive
                            ? AppColors.white.withOpacity(0.7)
                            : AppColors.pencilGray,
                      ),
                    ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: isActive ? AppColors.white : AppColors.pencilGray,
            ),
          ],
        ),
      ),
    );
  }
}
