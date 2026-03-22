import 'package:flutter/material.dart';

import '../../constants/app_colors.dart';
import '../../constants/app_strings.dart';
import 'hiragana_screen.dart';
import 'katakana_screen.dart';

/// Top-level Kana screen with tabs for Hiragana and Katakana.
class KanaScreen extends StatelessWidget {
  const KanaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: AppColors.paperBg,
        appBar: AppBar(
          title: const Text(AppStrings.hatsuon),
          bottom: const TabBar(
            labelColor: AppColors.inkColor,
            unselectedLabelColor: AppColors.pencilGray,
            indicatorColor: AppColors.accentRed,
            tabs: [
              Tab(text: AppStrings.hiragana),
              Tab(text: AppStrings.katakana),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            HiraganaScreen(),
            KatakanaScreen(),
          ],
        ),
      ),
    );
  }
}
