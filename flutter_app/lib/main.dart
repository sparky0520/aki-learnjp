import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import 'constants/app_colors.dart';
import 'services/auth_service.dart';
import 'services/api_service.dart';
import 'screens/auth/sign_in_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/onboarding/onboarding_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()),
        Provider(create: (_) => ApiService()),
      ],
      child: const AkiApp(),
    ),
  );
}

class AkiApp extends StatelessWidget {
  const AkiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Aki - Japanese Learning',
      debugShowCheckedModeBanner: false,
      theme: _buildTheme(),
      home: const AuthGate(),
      routes: {
        '/sign-in': (_) => const SignInScreen(),
        '/onboarding': (_) => const OnboardingScreen(),
        '/dashboard': (_) => const DashboardScreen(),
      },
    );
  }

  ThemeData _buildTheme() {
    final base = ThemeData(
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.accentRed,
        surface: AppColors.paperBg,
        primary: AppColors.inkColor,
        secondary: AppColors.accentRed,
      ),
      scaffoldBackgroundColor: AppColors.paperBg,
      useMaterial3: true,
    );

    return base.copyWith(
      textTheme: GoogleFonts.notoSansJpTextTheme(base.textTheme).copyWith(
        bodyLarge: GoogleFonts.notoSansJp(
          color: AppColors.inkColor,
          fontSize: 16,
        ),
        bodyMedium: GoogleFonts.notoSansJp(
          color: AppColors.inkColor,
          fontSize: 14,
        ),
        titleLarge: GoogleFonts.notoSansJp(
          color: AppColors.inkColor,
          fontSize: 22,
          fontWeight: FontWeight.bold,
        ),
        titleMedium: GoogleFonts.notoSansJp(
          color: AppColors.inkColor,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
        labelLarge: GoogleFonts.notoSansJp(
          color: AppColors.inkColor,
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.paperBg,
        foregroundColor: AppColors.inkColor,
        elevation: 0,
        scrolledUnderElevation: 1,
        titleTextStyle: GoogleFonts.notoSansJp(
          color: AppColors.inkColor,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.inkColor,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: AppColors.pencilGray.withOpacity(0.5)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: AppColors.accentRed),
        ),
        filled: true,
        fillColor: Colors.white,
      ),
    );
  }
}

/// Gate that checks auth state and routes accordingly.
class AuthGate extends StatefulWidget {
  const AuthGate({super.key});

  @override
  State<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends State<AuthGate> {
  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final auth = context.read<AuthService>();
    await auth.loadUser();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthService>();

    if (auth.isLoading) {
      return const Scaffold(
        backgroundColor: AppColors.paperBg,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'あき',
                style: TextStyle(
                  fontSize: 64,
                  color: AppColors.inkColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 24),
              CircularProgressIndicator(
                color: AppColors.accentRed,
              ),
            ],
          ),
        ),
      );
    }

    if (auth.isAuthenticated) {
      return const DashboardScreen();
    }

    return const SignInScreen();
  }
}
