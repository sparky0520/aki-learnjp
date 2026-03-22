import 'package:flutter/material.dart';
import '../../constants/app_colors.dart';

/// Reusable kana grid section widget shared by Hiragana and Katakana screens.
class KanaSection extends StatelessWidget {
  final String title;
  final List<List<String>> items;
  final Set<String> highlighted;
  final String idPrefix;
  final void Function(String) onToggle;

  const KanaSection({
    super.key,
    required this.title,
    required this.items,
    required this.highlighted,
    required this.idPrefix,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: AppColors.pencilGray,
              ),
            ),
          ),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 5,
            mainAxisSpacing: 6,
            crossAxisSpacing: 6,
            childAspectRatio: 0.9,
          ),
          itemCount: items.length,
          itemBuilder: (ctx, i) {
            final id = '$idPrefix-$i';
            final isHighlighted = highlighted.contains(id);
            return KanaTile(
              kana: items[i][0],
              romaji: items[i][1],
              isHighlighted: isHighlighted,
              onTap: () => onToggle(id),
            );
          },
        ),
      ],
    );
  }
}

/// Single kana tile with tap-to-highlight.
class KanaTile extends StatelessWidget {
  final String kana;
  final String romaji;
  final bool isHighlighted;
  final VoidCallback onTap;

  const KanaTile({
    super.key,
    required this.kana,
    required this.romaji,
    required this.isHighlighted,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 250),
        decoration: BoxDecoration(
          color: isHighlighted ? const Color(0xFFFEF08A) : AppColors.white,
          border: Border.all(
            color: isHighlighted
                ? const Color(0xFFF59E0B)
                : AppColors.borderGray,
          ),
          borderRadius: BorderRadius.circular(8),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.06),
              blurRadius: 3,
              offset: const Offset(1, 1),
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              kana,
              style: const TextStyle(
                fontSize: 22,
                color: AppColors.inkColor,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              romaji,
              style: TextStyle(
                fontSize: 11,
                color:
                    isHighlighted ? AppColors.inkColor : AppColors.pencilGray,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
