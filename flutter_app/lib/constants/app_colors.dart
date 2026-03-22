import 'package:flutter/material.dart';

/// Brand colours extracted from the Next.js globals.css.
class AppColors {
  AppColors._();

  /// #fffce8 – warm cream paper background
  static const Color paperBg = Color(0xFFFFFCE8);

  /// #2c2c2c – near-black ink colour
  static const Color inkColor = Color(0xFF2C2C2C);

  /// #555555 – pencil-grey for secondary text
  static const Color pencilGray = Color(0xFF555555);

  /// #d93d3d – accent red (hanko stamp, highlights)
  static const Color accentRed = Color(0xFFD93D3D);

  /// #a0c4ff – line blue
  static const Color lineBlue = Color(0xFFA0C4FF);

  /// Grid-line overlay colour (very subtle black)
  static const Color gridLine = Color(0x0D000000);

  /// White – card backgrounds
  static const Color white = Color(0xFFFFFFFF);

  /// Light grey for dividers / borders
  static const Color borderGray = Color(0xFFE0E0E0);
}
