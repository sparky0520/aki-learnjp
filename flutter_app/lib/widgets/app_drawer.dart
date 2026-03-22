import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../constants/app_colors.dart';
import '../constants/app_strings.dart';
import '../services/auth_service.dart';

/// Drawer / sidebar navigation mirroring the web Sidebar component.
class AppDrawer extends StatelessWidget {
  final int lessonNumber;
  final int? courseNumber;
  final Map<String, bool>? progress;

  const AppDrawer({
    super.key,
    required this.lessonNumber,
    this.courseNumber,
    this.progress,
  });

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();
    final user = auth.currentUser;

    return Drawer(
      backgroundColor: AppColors.paperBg,
      child: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(
                    horizontal: 20, vertical: 12),
                children: [
                  // Aki logo / home
                  ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: const Text(
                      'あき',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: AppColors.inkColor,
                      ),
                    ),
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pushNamed(context, '/dashboard');
                    },
                  ),
                  const SizedBox(height: 16),

                  // Course chart
                  _SidebarLink(
                    label: 'Course Chart',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pushNamed(
                        context,
                        '/course',
                        arguments: courseNumber ?? 1,
                      );
                    },
                  ),

                  // About lesson
                  _SidebarLink(
                    label: 'About Lesson',
                    onTap: () {
                      Navigator.pop(context);
                      Navigator.pushNamed(
                        context,
                        '/lesson',
                        arguments: lessonNumber,
                      );
                    },
                  ),

                  const SizedBox(height: 8),
                  const _SectionHeader(label: AppStrings.reading),
                  ...[
                    ('goi', AppStrings.vocabulary),
                    ('bunkei', AppStrings.sentencePatterns),
                    ('reibun', AppStrings.exampleSentences),
                    ('renshuua', AppStrings.practiceA),
                  ].map(
                    (e) => _SidebarLink(
                      label: e.$2,
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(
                          context,
                          '/lesson/section',
                          arguments: {
                            'lesson': lessonNumber,
                            'section': e.$1,
                          },
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 8),
                  const _SectionHeader(label: AppStrings.exercise),
                  ...[
                    ('renshuub', AppStrings.practiceB, 'renshuu_b_completed'),
                    ('renshuuc', AppStrings.practiceC, 'renshuu_c_completed'),
                    ('mondai', AppStrings.problems, 'mondai_completed'),
                    ('kaiwa', AppStrings.conversation, 'kaiwa_completed'),
                  ].map(
                    (e) => _SidebarExerciseLink(
                      label: e.$2,
                      completed: progress?[e.$3] ?? false,
                      onTap: () {
                        Navigator.pop(context);
                        Navigator.pushNamed(
                          context,
                          '/lesson/section',
                          arguments: {
                            'lesson': lessonNumber,
                            'section': e.$1,
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),

            // Bottom: profile & sign out
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Divider(),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const CircleAvatar(
                        radius: 20,
                        backgroundColor: AppColors.inkColor,
                        child: Icon(
                          Icons.person,
                          color: AppColors.paperBg,
                          size: 22,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          user?.name ?? 'User',
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            color: AppColors.inkColor,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.logout,
                            color: AppColors.pencilGray),
                        tooltip: 'Sign Out',
                        onPressed: () async {
                          await auth.signOut();
                          if (context.mounted) {
                            Navigator.pushNamedAndRemoveUntil(
                              context,
                              '/sign-in',
                              (_) => false,
                            );
                          }
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String label;
  const _SectionHeader({required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 8, bottom: 4),
      child: Text(
        label,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: AppColors.inkColor,
        ),
      ),
    );
  }
}

class _SidebarLink extends StatelessWidget {
  final String label;
  final VoidCallback onTap;

  const _SidebarLink({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: GestureDetector(
        onTap: onTap,
        child: Text(
          label,
          style: const TextStyle(
            fontSize: 15,
            color: AppColors.inkColor,
          ),
        ),
      ),
    );
  }
}

class _SidebarExerciseLink extends StatelessWidget {
  final String label;
  final bool completed;
  final VoidCallback onTap;

  const _SidebarExerciseLink({
    required this.label,
    required this.completed,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: GestureDetector(
        onTap: onTap,
        child: Row(
          children: [
            if (completed)
              const Padding(
                padding: EdgeInsets.only(right: 6),
                child: Icon(
                  Icons.check_circle_outline,
                  size: 18,
                  color: AppColors.pencilGray,
                ),
              ),
            Text(
              label,
              style: const TextStyle(
                fontSize: 15,
                color: AppColors.inkColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
