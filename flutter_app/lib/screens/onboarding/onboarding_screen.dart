import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../../constants/app_colors.dart';
import '../../constants/app_strings.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';
import '../../widgets/common_widgets.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _step = 1;
  bool _loading = false;

  String _japaneseLevel = '';
  String _takenCourse = '';
  String _instituteName = '';
  String _motivation = '';
  String _motivationDetails = '';

  double get _progress => _step / 3;

  void _next() {
    if (_step < 3) setState(() => _step++);
  }

  void _prev() {
    if (_step > 1) setState(() => _step--);
  }

  Future<void> _submit() async {
    setState(() => _loading = true);
    try {
      final auth = context.read<AuthService>();
      final api = context.read<ApiService>();
      await api.submitOnboarding(
        {
          'japaneseLevel': _japaneseLevel,
          'takenCourse': _takenCourse,
          'instituteName': _instituteName,
          'motivation': _motivation,
          'motivationDetails': _motivationDetails,
        },
        token: auth.token,
      );
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/dashboard');
      }
    } catch (_) {
      // Even on error, navigate to dashboard
      if (mounted) {
        Navigator.pushReplacementNamed(context, '/dashboard');
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.paperBg,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              // Progress bar
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: _progress,
                  backgroundColor: Colors.grey[200],
                  valueColor: const AlwaysStoppedAnimation(AppColors.accentRed),
                  minHeight: 8,
                ),
              ),
              const SizedBox(height: 24),

              // Card
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: AppColors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.08),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        Expanded(child: _buildStep()),
                        const Divider(height: 32),
                        _buildNavButtons(),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStep() {
    switch (_step) {
      case 1:
        return _StepJapaneseLevel(
          selected: _japaneseLevel,
          onSelect: (v) => setState(() => _japaneseLevel = v),
        );
      case 2:
        return _StepCourseHistory(
          takenCourse: _takenCourse,
          instituteName: _instituteName,
          onTakenChange: (v) => setState(() => _takenCourse = v),
          onInstituteChange: (v) => setState(() => _instituteName = v),
        );
      case 3:
        return _StepMotivation(
          selected: _motivation,
          details: _motivationDetails,
          onSelect: (v) => setState(() => _motivation = v),
          onDetailsChange: (v) => setState(() => _motivationDetails = v),
        );
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildNavButtons() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Previous
        if (_step > 1)
          TextButton.icon(
            onPressed: _prev,
            icon: const Icon(Icons.arrow_back, size: 16),
            label: const Text(AppStrings.previous),
            style: TextButton.styleFrom(foregroundColor: AppColors.pencilGray),
          )
        else
          const SizedBox(width: 80),

        // Skip + Next/Submit
        Row(
          children: [
            TextButton(
              onPressed: _next,
              style: TextButton.styleFrom(foregroundColor: AppColors.pencilGray),
              child: const Text(AppStrings.skip),
            ),
            const SizedBox(width: 8),
            if (_step < 3)
              ElevatedButton.icon(
                onPressed: _next,
                icon: const Icon(Icons.arrow_forward, size: 16),
                label: const Text(AppStrings.next),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.inkColor,
                  foregroundColor: Colors.white,
                ),
              )
            else
              ElevatedButton.icon(
                onPressed: _loading ? null : _submit,
                icon: _loading
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.check, size: 16),
                label: const Text(AppStrings.submit),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accentRed,
                  foregroundColor: Colors.white,
                ),
              ),
          ],
        ),
      ],
    );
  }
}

// ─── Step widgets ────────────────────────────────────────────────────────────

class _StepJapaneseLevel extends StatelessWidget {
  final String selected;
  final ValueChanged<String> onSelect;

  const _StepJapaneseLevel({required this.selected, required this.onSelect});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          AppStrings.onboardingTitle1,
          style: Theme.of(context).textTheme.titleMedium,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        const Text(
          AppStrings.onboardingSubtitle1,
          style: TextStyle(color: AppColors.pencilGray, fontSize: 13),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          alignment: WrapAlignment.center,
          children: List.generate(
            10,
            (i) {
              final val = '${i + 1}';
              final isSelected = selected == val;
              return GestureDetector(
                onTap: () => onSelect(val),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: isSelected ? AppColors.accentRed : AppColors.white,
                    border: Border.all(
                      color: isSelected
                          ? AppColors.accentRed
                          : AppColors.borderGray,
                    ),
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: isSelected
                        ? [
                            BoxShadow(
                              color: AppColors.accentRed.withOpacity(0.3),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ]
                        : [],
                  ),
                  child: Center(
                    child: Text(
                      val,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : AppColors.inkColor,
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }
}

class _StepCourseHistory extends StatelessWidget {
  final String takenCourse;
  final String instituteName;
  final ValueChanged<String> onTakenChange;
  final ValueChanged<String> onInstituteChange;

  const _StepCourseHistory({
    required this.takenCourse,
    required this.instituteName,
    required this.onTakenChange,
    required this.onInstituteChange,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppStrings.onboardingTitle2,
            style: Theme.of(context).textTheme.titleMedium,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),

          _ChoiceCard(
            label: 'Yes, I have',
            isSelected: takenCourse == 'true',
            onTap: () => onTakenChange('true'),
          ),
          const SizedBox(height: 12),
          _ChoiceCard(
            label: "No, I haven't",
            isSelected: takenCourse == 'false',
            onTap: () => onTakenChange('false'),
          ),

          if (takenCourse == 'true') ...[
            const SizedBox(height: 20),
            const Text(
              'Institute Name (Optional)',
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.pencilGray,
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              onChanged: onInstituteChange,
              decoration: InputDecoration(
                hintText: 'e.g. Tokyo Central Japanese Language School',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                filled: true,
                fillColor: AppColors.white,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _StepMotivation extends StatelessWidget {
  final String selected;
  final String details;
  final ValueChanged<String> onSelect;
  final ValueChanged<String> onDetailsChange;

  const _StepMotivation({
    required this.selected,
    required this.details,
    required this.onSelect,
    required this.onDetailsChange,
  });

  static const _options = [
    'Travel & Tourism',
    'Work & Career',
    'Anime & Manga',
    'Culture & History',
    'Family & Friends',
    'Other',
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppStrings.onboardingTitle3,
            style: Theme.of(context).textTheme.titleMedium,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          ..._options.map(
            (opt) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: _ChoiceCard(
                label: opt,
                isSelected: selected == opt,
                onTap: () => onSelect(opt),
              ),
            ),
          ),
          const SizedBox(height: 8),
          TextField(
            onChanged: onDetailsChange,
            decoration: InputDecoration(
              hintText: 'Tell us more (Optional)',
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              filled: true,
              fillColor: AppColors.white,
            ),
          ),
        ],
      ),
    );
  }
}

class _ChoiceCard extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _ChoiceCard({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.accentRed.withOpacity(0.08)
              : AppColors.white,
          border: Border.all(
            color: isSelected ? AppColors.accentRed : AppColors.borderGray,
            width: isSelected ? 1.5 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
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
                  color: isSelected ? AppColors.accentRed : AppColors.borderGray,
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
              label,
              style: TextStyle(
                fontWeight: FontWeight.w500,
                color: isSelected ? AppColors.inkColor : AppColors.pencilGray,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
