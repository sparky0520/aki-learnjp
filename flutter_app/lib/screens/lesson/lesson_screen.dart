import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:provider/provider.dart';

import '../../constants/app_colors.dart';
import '../../constants/app_strings.dart';
import '../../services/api_service.dart';
import '../../services/auth_service.dart';
import '../../widgets/app_drawer.dart';
import '../../widgets/bottom_bars.dart';
import '../../widgets/common_widgets.dart';
import '../chat/ask_aki_screen.dart';

/// Main lesson screen – shows individual lesson sections via tabs.
class LessonScreen extends StatefulWidget {
  final int lessonNumber;

  const LessonScreen({super.key, required this.lessonNumber});

  @override
  State<LessonScreen> createState() => _LessonScreenState();
}

class _LessonScreenState extends State<LessonScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  Map<String, bool> _progress = {};

  static const _readingSections = [
    ('goi', AppStrings.vocabulary),
    ('bunkei', AppStrings.sentencePatterns),
    ('reibun', AppStrings.exampleSentences),
    ('renshuua', AppStrings.practiceA),
  ];

  static const _exerciseSections = [
    ('renshuub', AppStrings.practiceB),
    ('renshuuc', AppStrings.practiceC),
    ('mondai', AppStrings.problems),
    ('kaiwa', AppStrings.conversation),
  ];

  static const _allSections = [
    ..._readingSections,
    ..._exerciseSections,
  ];

  @override
  void initState() {
    super.initState();
    _tabController =
        TabController(length: _allSections.length, vsync: this);
    _fetchProgress();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _fetchProgress() async {
    final auth = context.read<AuthService>();
    final api = context.read<ApiService>();
    if (auth.currentUser?.id == null) return;
    try {
      final data = await api.fetchLessonProgress(
        auth.currentUser!.id,
        widget.lessonNumber,
        token: auth.token,
      );
      setState(() => _progress = data.map(
            (k, v) => MapEntry(k, v is bool ? v : false),
          ));
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.paperBg,
      appBar: AppBar(
        title: Text('Lesson ${widget.lessonNumber}'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: AppColors.inkColor,
          unselectedLabelColor: AppColors.pencilGray,
          indicatorColor: AppColors.accentRed,
          tabs: _allSections
              .map((s) => Tab(text: s.$2))
              .toList(),
        ),
      ),
      drawer: AppDrawer(
        lessonNumber: widget.lessonNumber,
        progress: _progress,
      ),
      body: TabBarView(
        controller: _tabController,
        children: _allSections.map((s) {
          return LessonSectionView(
            lessonNumber: widget.lessonNumber,
            section: s.$1,
            sectionLabel: s.$2,
          );
        }).toList(),
      ),
      bottomNavigationBar: LessonBottomBar(
        isReading: true,
        onAskAki: () => Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) =>
                AskAkiScreen(lessonNumber: widget.lessonNumber),
          ),
        ),
      ),
    );
  }
}

/// Fetches and renders a single lesson section.
class LessonSectionView extends StatefulWidget {
  final int lessonNumber;
  final String section;
  final String sectionLabel;

  const LessonSectionView({
    super.key,
    required this.lessonNumber,
    required this.section,
    required this.sectionLabel,
  });

  @override
  State<LessonSectionView> createState() => _LessonSectionViewState();
}

class _LessonSectionViewState extends State<LessonSectionView>
    with AutomaticKeepAliveClientMixin {
  Map<String, dynamic>? _data;
  bool _loading = true;
  String? _error;

  @override
  bool get wantKeepAlive => true;

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
      final data = await api.fetchLessonSection(
        widget.lessonNumber,
        widget.section,
        token: auth.token,
      );
      setState(() => _data = data);
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } catch (_) {
      setState(() => _error = 'Could not load section.');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);

    if (_loading) return const LoadingOverlay();
    if (_error != null) {
      return ErrorDisplay(message: _error!, onRetry: _fetch);
    }

    final content = _data?['content'] as String? ?? '';
    final items = _data?['items'] as List<dynamic>?;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.sectionLabel,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: AppColors.inkColor,
            ),
          ),
          const SizedBox(height: 16),
          if (content.isNotEmpty)
            MarkdownBody(
              data: content,
              styleSheet: MarkdownStyleSheet(
                p: const TextStyle(fontSize: 15, color: AppColors.inkColor),
                h2: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppColors.inkColor,
                ),
                tableBody: const TextStyle(fontSize: 14),
              ),
            ),
          if (items != null)
            ...items.map(
              (item) => _ItemCard(item: item as Map<String, dynamic>),
            ),
        ],
      ),
    );
  }
}

class _ItemCard extends StatelessWidget {
  final Map<String, dynamic> item;

  const _ItemCard({required this.item});

  @override
  Widget build(BuildContext context) {
    final japanese = item['japanese'] as String? ?? '';
    final reading = item['reading'] as String? ?? '';
    final meaning = item['meaning'] as String? ?? item['english'] as String? ?? '';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.white,
        border: Border.all(color: AppColors.borderGray),
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 3,
            offset: const Offset(1, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (japanese.isNotEmpty)
            Text(
              japanese,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: AppColors.inkColor,
              ),
            ),
          if (reading.isNotEmpty)
            Text(
              reading,
              style: const TextStyle(
                fontSize: 14,
                color: AppColors.pencilGray,
              ),
            ),
          if (meaning.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Text(
                meaning,
                style: const TextStyle(
                  fontSize: 14,
                  color: AppColors.inkColor,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
