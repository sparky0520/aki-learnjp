import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../constants/app_colors.dart';
import '../../constants/app_strings.dart';
import '../../models/lesson.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';
import '../../widgets/bottom_bars.dart';
import '../../widgets/common_widgets.dart';
import '../chat/ask_aki_screen.dart';
import '../kana/kana_screen.dart';
import '../lesson/course_screen.dart';
import '../lesson/lesson_screen.dart';
import '../quiz/quizzes_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _navIndex = 0;
  int _lastLesson = 1;

  HomeContent? _homeContent;
  int _completedLessons = 0;
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchData();
  }

  Future<void> _fetchData() async {
    final auth = context.read<AuthService>();
    final api = context.read<ApiService>();
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final content = await api.fetchHomeContent(token: auth.token);
      int completed = 0;
      if (auth.currentUser?.id != null) {
        completed = await api.fetchCompletedLessons(
          auth.currentUser!.id,
          token: auth.token,
        );
      }
      setState(() {
        _homeContent = content;
        _completedLessons = completed;
      });
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } catch (_) {
      setState(() => _error = 'Failed to load dashboard data.');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.paperBg,
      body: _buildBody(),
      bottomNavigationBar: AkiBottomNavBar(
        currentIndex: _navIndex,
        onTap: (i) => setState(() => _navIndex = i),
      ),
    );
  }

  Widget _buildBody() {
    switch (_navIndex) {
      case 0:
        return _DashboardHome(
          homeContent: _homeContent,
          completedLessons: _completedLessons,
          loading: _loading,
          error: _error,
          lastLesson: _lastLesson,
          onRetry: _fetchData,
        );
      case 1:
        return CourseScreen(courseNumber: 1, initialLesson: _lastLesson);
      case 2:
        return const KanaScreen();
      case 3:
        return AskAkiScreen(lessonNumber: _lastLesson);
      case 4:
        return _ProfileTab(onNavToIndex: (i) => setState(() => _navIndex = i));
      default:
        return const SizedBox.shrink();
    }
  }
}

// ─── Dashboard Home Tab ───────────────────────────────────────────────────────

class _DashboardHome extends StatelessWidget {
  final HomeContent? homeContent;
  final int completedLessons;
  final bool loading;
  final String? error;
  final int lastLesson;
  final VoidCallback onRetry;

  const _DashboardHome({
    required this.homeContent,
    required this.completedLessons,
    required this.loading,
    required this.error,
    required this.lastLesson,
    required this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    if (loading) return const LoadingOverlay();
    if (error != null) {
      return ErrorDisplay(message: error!, onRetry: onRetry);
    }

    final content = homeContent;
    if (content == null) return const LoadingOverlay();

    final total = content.totalLessons;
    final pct = total > 0 ? completedLessons / total : 0.0;

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: onRetry,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            // Greeting
            const Text(
              AppStrings.konnichiwa,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w900,
                color: AppColors.inkColor,
              ),
            ),
            const SizedBox(height: 20),

            // Lesson progress row
            Row(
              children: [
                const Text(
                  AppStrings.lessons,
                  style: TextStyle(fontSize: 17, color: AppColors.inkColor),
                ),
                const SizedBox(width: 24),
                Text(
                  '$completedLessons/$total',
                  style: const TextStyle(fontSize: 17, color: AppColors.inkColor),
                ),
                const SizedBox(width: 12),
                OutlinedButton(
                  onPressed: () => Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => LessonScreen(lessonNumber: lastLesson),
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.borderGray),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 4),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(6)),
                  ),
                  child: const Text(
                    AppStrings.continueLesson,
                    style: TextStyle(color: AppColors.inkColor, fontSize: 13),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Progress bar
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: LinearProgressIndicator(
                value: pct,
                backgroundColor: Colors.grey[400],
                valueColor: const AlwaysStoppedAnimation(Color(0xFF4ADE80)),
                minHeight: 20,
              ),
            ),
            const SizedBox(height: 6),
            Align(
              alignment: Alignment.centerRight,
              child: Text(
                '${(pct * 100).ceil()}%',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppColors.pencilGray,
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Quick links
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: [
                _QuickLink(
                  label: AppStrings.learnKana,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const KanaScreen()),
                  ),
                ),
                _QuickLink(
                  label: AppStrings.characterChart,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const KanaScreen()),
                  ),
                ),
                _QuickLink(
                  label: AppStrings.assignedQuiz,
                  onTap: () => Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const QuizzesScreen()),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 28),

            // News and Insights
            const Text(
              AppStrings.newsAndInsights,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: AppColors.inkColor,
              ),
            ),
            const SizedBox(height: 12),
            ...content.newsInsights.map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _NewsInsightCard(item: item),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickLink extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _QuickLink({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          border: Border.all(color: AppColors.borderGray),
          borderRadius: BorderRadius.circular(8),
          color: AppColors.white,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.open_in_new,
              size: 14,
              color: AppColors.pencilGray,
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: const TextStyle(
                color: Color(0xFF60A5FA),
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NewsInsightCard extends StatelessWidget {
  final NewsInsight item;

  const _NewsInsightCard({required this.item});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        final uri = Uri.tryParse(item.link);
        if (uri != null) {
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        }
      },
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.white,
          border: Border.all(color: AppColors.borderGray),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (item.media.type == 'image')
              ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(8)),
                child: Image.network(
                  item.media.link,
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => const SizedBox(height: 180),
                ),
              )
            else
              // YouTube thumbnail
              ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(8)),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      height: 180,
                      width: double.infinity,
                      color: Colors.black,
                    ),
                    const Icon(
                      Icons.play_circle_fill,
                      color: Colors.white,
                      size: 48,
                    ),
                    Positioned(
                      bottom: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: const Text(
                          'YouTube',
                          style:
                              TextStyle(color: Colors.white, fontSize: 11),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Text(
                item.description,
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.inkColor,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────

class _ProfileTab extends StatelessWidget {
  final ValueChanged<int> onNavToIndex;

  const _ProfileTab({required this.onNavToIndex});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final user = auth.currentUser;

    return SafeArea(
      child: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const SizedBox(height: 24),
          // Avatar
          Center(
            child: CircleAvatar(
              radius: 48,
              backgroundColor: AppColors.inkColor,
              child: Text(
                user?.name.isNotEmpty == true
                    ? user!.name[0].toUpperCase()
                    : 'U',
                style: const TextStyle(
                  fontSize: 40,
                  color: AppColors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Center(
            child: Text(
              user?.name ?? 'User',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppColors.inkColor,
              ),
            ),
          ),
          Center(
            child: Text(
              user?.email ?? '',
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.pencilGray,
              ),
            ),
          ),
          const SizedBox(height: 40),

          // Feature tiles
          _ProfileTile(
            icon: Icons.book_outlined,
            label: 'Course',
            onTap: () => onNavToIndex(1),
          ),
          _ProfileTile(
            icon: Icons.translate_outlined,
            label: 'Kana Practice',
            onTap: () => onNavToIndex(2),
          ),
          _ProfileTile(
            icon: Icons.quiz_outlined,
            label: 'Quizzes',
            onTap: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const QuizzesScreen()),
            ),
          ),

          const SizedBox(height: 24),

          // Sign out
          ElevatedButton.icon(
            onPressed: () async {
              await auth.signOut();
              if (context.mounted) {
                Navigator.pushReplacementNamed(context, '/sign-in');
              }
            },
            icon: const Icon(Icons.logout),
            label: const Text('Sign Out'),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.accentRed,
              foregroundColor: Colors.white,
            ),
          ),
        ],
      ),
    );
  }
}

class _ProfileTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _ProfileTile({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: AppColors.inkColor),
      title: Text(label),
      trailing: const Icon(Icons.chevron_right, color: AppColors.pencilGray),
      onTap: onTap,
    );
  }
}
