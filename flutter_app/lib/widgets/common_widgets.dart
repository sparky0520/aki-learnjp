import 'package:flutter/material.dart';
import '../constants/app_colors.dart';

/// A card that mimics the paper-card CSS class from the web app:
/// slight rotation, drop shadow, white background, border.
class PaperCard extends StatefulWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final double initialRotation;

  const PaperCard({
    super.key,
    required this.child,
    this.padding,
    this.initialRotation = -1.0,
  });

  @override
  State<PaperCard> createState() => _PaperCardState();
}

class _PaperCardState extends State<PaperCard> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
        transform: Matrix4.rotationZ(
          _hovered ? 0 : (widget.initialRotation * 3.14159 / 180),
        ),
        decoration: BoxDecoration(
          color: AppColors.white,
          border: Border.all(color: AppColors.borderGray),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(_hovered ? 0.15 : 0.1),
              blurRadius: _hovered ? 10 : 5,
              offset: const Offset(2, 3),
            ),
          ],
        ),
        child: Padding(
          padding:
              widget.padding ?? const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: widget.child,
        ),
      ),
    );
  }
}

/// Outlined button with the hand-drawn offset shadow style from the landing page.
class InkButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final Color? backgroundColor;
  final Color? textColor;
  final bool isLoading;

  const InkButton({
    super.key,
    required this.label,
    this.onPressed,
    this.backgroundColor,
    this.textColor,
    this.isLoading = false,
  });

  @override
  State<InkButton> createState() => _InkButtonState();
}

class _InkButtonState extends State<InkButton> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final bg = widget.backgroundColor ?? AppColors.white;
    final fg = widget.textColor ?? AppColors.inkColor;

    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) {
        setState(() => _pressed = false);
        widget.onPressed?.call();
      },
      onTapCancel: () => setState(() => _pressed = false),
      child: Stack(
        children: [
          // Shadow layer
          Positioned(
            left: 6,
            top: 6,
            right: 0,
            bottom: 0,
            child: Container(color: AppColors.inkColor),
          ),
          // Main button
          AnimatedContainer(
            duration: const Duration(milliseconds: 150),
            transform: Matrix4.translationValues(
              _pressed ? 6 : 0,
              _pressed ? 6 : 0,
              0,
            ),
            decoration: BoxDecoration(
              color: bg,
              border: Border.all(color: AppColors.inkColor, width: 2),
            ),
            padding:
                const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
            child: widget.isLoading
                ? SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: fg,
                    ),
                  )
                : Text(
                    widget.label,
                    style: TextStyle(
                      color: fg,
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                      letterSpacing: 2,
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}

/// A subtle grid-paper background widget.
class GridPaperBackground extends StatelessWidget {
  final Widget child;

  const GridPaperBackground({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.paperBg,
      ),
      child: CustomPaint(
        painter: _GridPainter(),
        child: child,
      ),
    );
  }
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.gridLine
      ..strokeWidth = 1;

    const step = 20.0;
    for (double x = 0; x <= size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y <= size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Hanko stamp decoration (合格 / Pass) in red circle.
class HankoStamp extends StatelessWidget {
  const HankoStamp({super.key});

  @override
  Widget build(BuildContext context) {
    return Transform.rotate(
      angle: 15 * 3.14159 / 180,
      child: Container(
        width: 64,
        height: 64,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: AppColors.accentRed,
            width: 3,
          ),
        ),
        child: const Center(
          child: Text(
            '合格\nPass',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: AppColors.accentRed,
              fontSize: 11,
              fontWeight: FontWeight.bold,
              height: 1.2,
            ),
          ),
        ),
      ),
    );
  }
}

/// Loading overlay shown while data is fetching.
class LoadingOverlay extends StatelessWidget {
  const LoadingOverlay({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: CircularProgressIndicator(color: AppColors.accentRed),
    );
  }
}

/// Error display widget.
class ErrorDisplay extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;

  const ErrorDisplay({super.key, required this.message, this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.error_outline, color: AppColors.accentRed, size: 48),
          const SizedBox(height: 12),
          Text(
            message,
            textAlign: TextAlign.center,
            style: const TextStyle(color: AppColors.pencilGray),
          ),
          if (onRetry != null) ...[
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: onRetry,
              child: const Text('Retry'),
            ),
          ],
        ],
      ),
    );
  }
}
