import 'package:flutter/material.dart';
import '../constants/app_colors.dart';
import '../constants/app_strings.dart';

/// Bottom navigation bar for the main app sections.
class AkiBottomNavBar extends StatelessWidget {
  final int currentIndex;
  final ValueChanged<int> onTap;

  const AkiBottomNavBar({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      currentIndex: currentIndex,
      onTap: onTap,
      backgroundColor: AppColors.paperBg,
      selectedItemColor: AppColors.inkColor,
      unselectedItemColor: AppColors.pencilGray,
      showUnselectedLabels: true,
      type: BottomNavigationBarType.fixed,
      selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold),
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home_outlined),
          activeIcon: Icon(Icons.home),
          label: AppStrings.home,
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.book_outlined),
          activeIcon: Icon(Icons.book),
          label: AppStrings.course,
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.translate_outlined),
          activeIcon: Icon(Icons.translate),
          label: AppStrings.kana,
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.chat_bubble_outline),
          activeIcon: Icon(Icons.chat_bubble),
          label: AppStrings.chat,
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person_outline),
          activeIcon: Icon(Icons.person),
          label: AppStrings.profile,
        ),
      ],
    );
  }
}

/// Lesson bottom action bar  (< 前 | Ask Aki | 次 >).
class LessonBottomBar extends StatelessWidget {
  final VoidCallback? onPrev;
  final VoidCallback? onNext;
  final VoidCallback onAskAki;
  final bool isReading;
  final bool isLastQuestion;

  const LessonBottomBar({
    super.key,
    this.onPrev,
    this.onNext,
    required this.onAskAki,
    this.isReading = false,
    this.isLastQuestion = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.paperBg.withOpacity(0.95),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      child: SafeArea(
        top: false,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            if (!isReading)
              TextButton(
                onPressed: onPrev,
                child: const Text(
                  AppStrings.mae,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.inkColor,
                  ),
                ),
              )
            else
              const SizedBox(width: 60),

            // Ask Aki button
            GestureDetector(
              onTap: onAskAki,
              child: Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.borderGray),
                  borderRadius: BorderRadius.circular(8),
                  color: AppColors.paperBg,
                ),
                child: const Text(
                  AppStrings.askAki,
                  style: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: AppColors.inkColor,
                  ),
                ),
              ),
            ),

            if (!isReading)
              TextButton(
                onPressed: onNext,
                child: Text(
                  isLastQuestion ? AppStrings.teishutsu : AppStrings.tsugi,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: AppColors.inkColor,
                  ),
                ),
              )
            else
              const SizedBox(width: 60),
          ],
        ),
      ),
    );
  }
}
