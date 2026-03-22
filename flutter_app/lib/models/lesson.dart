/// Represents a lesson in the Aki course.
class Lesson {
  final int lessonNumber;
  final String title;
  final String? subtitle;
  final bool isCompleted;

  const Lesson({
    required this.lessonNumber,
    required this.title,
    this.subtitle,
    this.isCompleted = false,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      lessonNumber: json['lesson_number'] as int? ?? 0,
      title: json['title'] as String? ?? '',
      subtitle: json['subtitle'] as String?,
      isCompleted: json['is_completed'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'lesson_number': lessonNumber,
        'title': title,
        'subtitle': subtitle,
        'is_completed': isCompleted,
      };
}

/// Lesson progress for a single lesson.
class LessonProgress {
  final int lessonNumber;
  final bool renshuuBCompleted;
  final bool renshuuCCompleted;
  final bool mondaiCompleted;
  final bool kaiwaCompleted;

  const LessonProgress({
    required this.lessonNumber,
    this.renshuuBCompleted = false,
    this.renshuuCCompleted = false,
    this.mondaiCompleted = false,
    this.kaiwaCompleted = false,
  });

  factory LessonProgress.fromJson(Map<String, dynamic> json) {
    return LessonProgress(
      lessonNumber: json['lesson_number'] as int? ?? 0,
      renshuuBCompleted: json['renshuu_b_completed'] as bool? ?? false,
      renshuuCCompleted: json['renshuu_c_completed'] as bool? ?? false,
      mondaiCompleted: json['mondai_completed'] as bool? ?? false,
      kaiwaCompleted: json['kaiwa_completed'] as bool? ?? false,
    );
  }
}

/// A media item attached to a news/insight card.
class NewsMedia {
  final String type; // 'youtube' | 'image'
  final String link;

  const NewsMedia({required this.type, required this.link});

  factory NewsMedia.fromJson(Map<String, dynamic> json) {
    return NewsMedia(
      type: json['type'] as String? ?? 'image',
      link: json['link'] as String? ?? '',
    );
  }
}

/// A news / insight card shown on the dashboard.
class NewsInsight {
  final String link;
  final String description;
  final NewsMedia media;

  const NewsInsight({
    required this.link,
    required this.description,
    required this.media,
  });

  factory NewsInsight.fromJson(Map<String, dynamic> json) {
    return NewsInsight(
      link: json['link'] as String? ?? '',
      description: json['description'] as String? ?? '',
      media: NewsMedia.fromJson(json['media'] as Map<String, dynamic>? ?? {}),
    );
  }
}

/// Home page data returned by /api/home.
class HomeContent {
  final int totalLessons;
  final List<NewsInsight> newsInsights;

  const HomeContent({
    required this.totalLessons,
    required this.newsInsights,
  });

  factory HomeContent.fromJson(Map<String, dynamic> json) {
    return HomeContent(
      totalLessons: json['totalLessons'] as int? ?? 0,
      newsInsights: (json['newsInsights'] as List<dynamic>? ?? [])
          .map((e) => NewsInsight.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}
