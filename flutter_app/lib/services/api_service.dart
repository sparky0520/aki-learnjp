import 'dart:convert';
import 'package:http/http.dart' as http;

import '../models/lesson.dart';
import '../models/quiz.dart';

/// REST client that mirrors the Next.js /api/* routes.
/// Change [baseUrl] to point at the deployed API server.
class ApiService {
  // Base URL for all API calls.
  // Set this to your deployed Next.js API domain.
  // Configure per-environment via a build flavor or --dart-define flag:
  //   flutter run --dart-define=AKI_API_URL=https://your-aki-api.vercel.app/api
  static const String baseUrl = String.fromEnvironment(
    'AKI_API_URL',
    defaultValue: 'https://your-aki-api.vercel.app/api',
  );

  final http.Client _client;

  ApiService({http.Client? client}) : _client = client ?? http.Client();

  Map<String, String> _headers({String? token}) {
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // ─── Auth ───────────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> signIn({
    required String email,
    required String password,
  }) async {
    final res = await _client.post(
      Uri.parse('$baseUrl/auth/sign-in'),
      headers: _headers(),
      body: json.encode({'email': email, 'password': password}),
    );
    return _handleResponse(res);
  }

  Future<Map<String, dynamic>> signUp({
    required String name,
    required String email,
    required String password,
  }) async {
    final res = await _client.post(
      Uri.parse('$baseUrl/auth/sign-up'),
      headers: _headers(),
      body: json.encode({'name': name, 'email': email, 'password': password}),
    );
    return _handleResponse(res);
  }

  // ─── Home / Dashboard ───────────────────────────────────────────────────────

  Future<HomeContent> fetchHomeContent({String? token}) async {
    final res = await _client.get(
      Uri.parse('$baseUrl/home'),
      headers: _headers(token: token),
    );
    final data = _handleResponse(res);
    return HomeContent.fromJson(data);
  }

  Future<int> fetchCompletedLessons(String userId, {String? token}) async {
    final res = await _client.get(
      Uri.parse('$baseUrl/progress/$userId/completed-lessons'),
      headers: _headers(token: token),
    );
    final data = _handleResponse(res);
    return data['completed_lessons'] as int? ?? 0;
  }

  // ─── Lessons ────────────────────────────────────────────────────────────────

  Future<Map<String, dynamic>> fetchLessonSection(
    int lessonNumber,
    String section, {
    String? token,
  }) async {
    final res = await _client.get(
      Uri.parse('$baseUrl/lesson/$lessonNumber/$section'),
      headers: _headers(token: token),
    );
    return _handleResponse(res);
  }

  Future<Map<String, dynamic>> fetchLessonProgress(
    String userId,
    int lessonNumber, {
    String? token,
  }) async {
    final res = await _client.get(
      Uri.parse('$baseUrl/progress/$userId/lesson/$lessonNumber'),
      headers: _headers(token: token),
    );
    return _handleResponse(res);
  }

  Future<void> markSectionComplete(
    String userId,
    int lessonNumber,
    String section, {
    String? token,
  }) async {
    await _client.post(
      Uri.parse('$baseUrl/progress/$userId/lesson/$lessonNumber/$section'),
      headers: _headers(token: token),
    );
  }

  // ─── Course chart ───────────────────────────────────────────────────────────

  Future<List<dynamic>> fetchCourseChart(int courseNumber,
      {String? token}) async {
    final res = await _client.get(
      Uri.parse('$baseUrl/course/$courseNumber'),
      headers: _headers(token: token),
    );
    final data = _handleResponse(res);
    return data['lessons'] as List<dynamic>? ?? [];
  }

  // ─── Quizzes ────────────────────────────────────────────────────────────────

  Future<List<QuizQuestion>> fetchQuiz(String quizId,
      {String? token}) async {
    final res = await _client.get(
      Uri.parse('$baseUrl/quiz/$quizId'),
      headers: _headers(token: token),
    );
    final data = _handleResponse(res);
    return (data['questions'] as List<dynamic>? ?? [])
        .map((e) => QuizQuestion.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<void> submitQuizResult(
    String quizId,
    Map<String, dynamic> result, {
    String? token,
  }) async {
    await _client.post(
      Uri.parse('$baseUrl/quiz/$quizId/submit'),
      headers: _headers(token: token),
      body: json.encode(result),
    );
  }

  // ─── Ask Aki (AI chat) ──────────────────────────────────────────────────────

  Future<String> askAki(
    String message,
    int lessonNumber, {
    String? token,
    String? motherTongue,
  }) async {
    final res = await _client.post(
      Uri.parse('$baseUrl/ask-aki'),
      headers: _headers(token: token),
      body: json.encode({
        'message': message,
        'lesson_number': lessonNumber,
        if (motherTongue != null) 'mother_tongue': motherTongue,
      }),
    );
    final data = _handleResponse(res);
    return data['reply'] as String? ?? '';
  }

  // ─── Onboarding ─────────────────────────────────────────────────────────────

  Future<void> submitOnboarding(
    Map<String, dynamic> formData, {
    String? token,
  }) async {
    await _client.post(
      Uri.parse('$baseUrl/onboarding/submit'),
      headers: _headers(token: token),
      body: json.encode(formData),
    );
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  Map<String, dynamic> _handleResponse(http.Response res) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return json.decode(res.body) as Map<String, dynamic>;
    }
    throw ApiException(
      statusCode: res.statusCode,
      message: _extractErrorMessage(res.body),
    );
  }

  String _extractErrorMessage(String body) {
    try {
      final json_ = json.decode(body) as Map<String, dynamic>;
      return json_['message'] as String? ??
          json_['error'] as String? ??
          'Unknown error';
    } catch (_) {
      return body.isNotEmpty ? body : 'Unknown error';
    }
  }
}

class ApiException implements Exception {
  final int statusCode;
  final String message;

  const ApiException({required this.statusCode, required this.message});

  @override
  String toString() => 'ApiException($statusCode): $message';
}
