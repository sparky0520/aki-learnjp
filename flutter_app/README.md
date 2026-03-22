# Aki Flutter App

Mobile application for **Aki – Japanese Learning**, migrated from the Next.js web app.

## Overview

This Flutter project mirrors the essential features of the Next.js `aki-next` web app:

| Feature | Web Route | Flutter Screen |
|---|---|---|
| Landing / Sign In | `/` | `SignInScreen` |
| Sign Up | `/sign-up` | `SignUpScreen` |
| Onboarding | `/onboarding` | `OnboardingScreen` |
| Dashboard | `/dashboard` | `DashboardScreen` |
| Course Chart | `/course/[n]` | `CourseScreen` |
| Lesson | `/lesson/[n]/[section]` | `LessonScreen` |
| Kana Chart | `/hatsuon` | `KanaScreen` → `HiraganaScreen` / `KatakanaScreen` |
| Ask Aki (AI Chat) | Bottom bar "Ask Aki" | `AskAkiScreen` |
| Quizzes | `/quizzes` | `QuizzesScreen` / `QuizScreen` |

## Project Structure

```
lib/
├── main.dart                     # App entry point + AuthGate
├── constants/
│   ├── app_colors.dart           # Brand colours from globals.css
│   └── app_strings.dart          # All UI strings
├── models/
│   ├── user.dart
│   ├── lesson.dart               # Lesson, LessonProgress, HomeContent, NewsInsight
│   └── quiz.dart                 # QuizQuestion, ChatMessage
├── services/
│   ├── auth_service.dart         # ChangeNotifier – session persistence via SharedPreferences
│   └── api_service.dart          # HTTP client – mirrors /api/* Next.js routes
├── widgets/
│   ├── common_widgets.dart       # PaperCard, InkButton, GridPaperBackground, …
│   ├── app_drawer.dart           # Sidebar navigation drawer
│   └── bottom_bars.dart          # AkiBottomNavBar + LessonBottomBar
└── screens/
    ├── auth/
    │   ├── sign_in_screen.dart
    │   └── sign_up_screen.dart
    ├── onboarding/
    │   └── onboarding_screen.dart
    ├── dashboard/
    │   └── dashboard_screen.dart
    ├── lesson/
    │   ├── course_screen.dart
    │   └── lesson_screen.dart
    ├── kana/
    │   ├── kana_screen.dart
    │   ├── hiragana_screen.dart
    │   └── katakana_screen.dart
    ├── quiz/
    │   └── quizzes_screen.dart
    └── chat/
        └── ask_aki_screen.dart
```

## Getting Started

### Prerequisites

- Flutter SDK ≥ 3.0 — [install guide](https://docs.flutter.dev/get-started/install)
- Dart ≥ 3.0

### Setup

```bash
cd flutter_app
flutter pub get
```

### API Configuration

Edit `lib/services/api_service.dart` to set `AKI_API_URL`, or pass it at build/run time via `--dart-define`:

```bash
flutter run --dart-define=AKI_API_URL=https://your-aki-api.vercel.app/api
flutter build apk --dart-define=AKI_API_URL=https://your-aki-api.vercel.app/api
```

This should point to the deployed Next.js backend (the existing `aki-next` Vercel deployment).

### Run

```bash
# Android / iOS device or emulator
flutter run

# Web (for testing)
flutter run -d chrome
```

### Build

```bash
# Android APK
flutter build apk --release

# iOS (requires macOS + Xcode)
flutter build ios --release
```

## Design System

The Flutter app reproduces the paper/notebook aesthetic of the web app:

| Token | Hex | Usage |
|---|---|---|
| `paperBg` | `#fffce8` | Background |
| `inkColor` | `#2c2c2c` | Primary text, buttons |
| `pencilGray` | `#555555` | Secondary text |
| `accentRed` | `#d93d3d` | Highlights, CTA |
| `lineBlue` | `#a0c4ff` | Accents |

## Authentication

The web app uses **Clerk** (a hosted auth provider). The Flutter app uses a token-based approach:

1. User signs in → server returns a JWT/session token.
2. Token is persisted in `SharedPreferences`.
3. Token is attached as `Authorization: Bearer <token>` on all API calls.

> If you migrate the auth backend away from Clerk, update `ApiService.signIn` / `signUp` accordingly.

## Dependencies

| Package | Purpose |
|---|---|
| `provider` | State management |
| `http` | REST API calls |
| `shared_preferences` | Local session storage |
| `google_fonts` | Noto Sans JP font |
| `flutter_markdown` | Render lesson Markdown content |
| `url_launcher` | Open external links |
| `cached_network_image` | Cached news images |
