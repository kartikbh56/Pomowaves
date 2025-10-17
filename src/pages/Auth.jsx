import {
  Clock,
  Brain,
  Target,
  TrendingUp,
  Users,
  CheckCircle,
  Play,
  LogIn,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PomowavesLanding() {
  const navigate = useNavigate();
  const location = useLocation();
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const testUserLogin = useAuthStore((state) => state.testUserLogin);
  const handleCallback = useAuthStore((state) => state.handleCallback);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const [callbackProcessed, setCallbackProcessed] = useState(false);

  // Handle /auth/callback route for OAuth2 token login
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");
    // Only process callback on /auth/callback
    if (
      location.pathname === "/auth/callback" &&
      userId &&
      secret &&
      !callbackProcessed
    ) {
      setCallbackProcessed(true);
      handleCallback(userId, secret).then(() => {
        navigate("/");
        window.location.reload();
      });
    }
  }, [location, handleCallback, navigate, callbackProcessed]);

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };
  const handleTestLogin = async () => {
    await testUserLogin();
    navigate("/");
    window.location.reload();
  };

  // Show loading or error on callback
  if (location.pathname === "/auth/callback") {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="text-lg font-semibold">Signing you in…</div>
        ) : error ? (
          <div className="text-red-500 font-semibold">{error}</div>
        ) : (
          <div className="text-lg font-semibold">Redirecting…</div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-scroll scrollbar-hide" style={{ scrollSnapType: 'y mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-background via-background to-muted/20" style={{ scrollSnapAlign: 'start' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
            <div className="text-center space-y-12">
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                  Focus Better with{" "}
                  <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Pomowaves
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-light">
                  A simple, distraction-free app to boost your productivity.
                  Perfect for students, professionals, and anyone looking to improve their focus.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <button
                  onClick={handleGoogleLogin}
                  className="group inline-flex items-center justify-center px-8 py-3 text-base font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign up with Google
                </button>
                <button
                  onClick={handleTestLogin}
                  className="group inline-flex items-center justify-center px-8 py-3 text-base font-medium text-foreground bg-background/80 backdrop-blur-sm border-2 border-border rounded-xl hover:bg-muted/50 transition-all duration-300 hover:border-primary/50 hover:scale-105"
                >
                  <LogIn className="w-4 h-4 mr-3 transition-transform group-hover:scale-110" />
                  Try Demo
                </button>
              </div>

              {/* Simple Stats */}
              <div className="flex justify-center items-center gap-12 pt-16">
                <div className="text-center group">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">25</div>
                  <div className="text-sm text-muted-foreground font-medium">minutes focus</div>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="text-center group">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">5</div>
                  <div className="text-sm text-muted-foreground font-medium">minutes break</div>
                </div>
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="text-center group">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">∞</div>
                  <div className="text-sm text-muted-foreground font-medium">productivity</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What is Pomodoro Section */}
        <section className="min-h-screen flex items-center bg-gradient-to-br from-muted/10 to-background border-t border-border/50" style={{ scrollSnapAlign: 'start' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
            <div className="text-center mb-20">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 tracking-tight">
                What is the Pomodoro Technique?
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                A time management method that breaks work into focused 25-minute intervals,
                separated by short breaks. This technique helps maintain concentration and prevents burnout.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                <div className="space-y-8">
                  <div className="group flex items-start space-x-6 p-6 rounded-2xl hover:bg-muted/30 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-lg font-bold">1</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">Work for 25 minutes</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">Focus on a single task without distractions.</p>
                    </div>
                  </div>

                  <div className="group flex items-start space-x-6 p-6 rounded-2xl hover:bg-muted/30 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-lg font-bold">2</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">Take a 5-minute break</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">Step away, stretch, or relax briefly.</p>
                    </div>
                  </div>

                  <div className="group flex items-start space-x-6 p-6 rounded-2xl hover:bg-muted/30 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-lg font-bold">3</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">Repeat the cycle</h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">After 4 cycles, take a longer break.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-10 border border-border/50 shadow-xl">
                <h3 className="text-2xl font-semibold text-foreground mb-8">Why it works</h3>
                <ul className="space-y-6 text-lg">
                  <li className="flex items-start group">
                    <CheckCircle className="w-6 h-6 mt-1 mr-4 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-muted-foreground leading-relaxed">Creates gentle time pressure to maintain focus</span>
                  </li>
                  <li className="flex items-start group">
                    <CheckCircle className="w-6 h-6 mt-1 mr-4 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-muted-foreground leading-relaxed">Prevents mental fatigue with regular breaks</span>
                  </li>
                  <li className="flex items-start group">
                    <CheckCircle className="w-6 h-6 mt-1 mr-4 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-muted-foreground leading-relaxed">Builds sustainable productivity habits</span>
                  </li>
                  <li className="flex items-start group">
                    <CheckCircle className="w-6 h-6 mt-1 mr-4 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-muted-foreground leading-relaxed">Provides measurable progress tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="min-h-screen flex items-center bg-gradient-to-br from-background to-primary/5 border-t border-border/50" style={{ scrollSnapAlign: 'start' }}>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-8 tracking-tight">
                Simple and Effective
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed">
                Everything you need to implement the Pomodoro Technique,
                without distractions or unnecessary complexity.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "Customizable Timer",
                  description: "Adjust session lengths to match your workflow and preferences."
                },
                {
                  icon: <Brain className="w-8 h-8" />,
                  title: "Distraction-Free",
                  description: "Clean, minimal interface designed to keep you focused."
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "Progress Tracking",
                  description: "Monitor your productivity and build consistent habits."
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Goal Achievement",
                  description: "Break large projects into manageable, focused sessions."
                },
                {
                  icon: <CheckCircle className="w-8 h-8" />,
                  title: "Task Management",
                  description: "Organize your work and track completion status."
                },
                {
                  icon: <Play className="w-8 h-8" />,
                  title: "Instant Access",
                  description: "No downloads required. Start focusing immediately."
                }
              ].map((feature, index) => (
                <div key={index} className="group text-center space-y-6 p-8 rounded-3xl hover:bg-card/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 border border-transparent hover:border-border/50">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="min-h-screen flex items-center bg-gradient-to-br from-muted/10 to-background border-t border-border/50" style={{ scrollSnapAlign: 'start' }}>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-8 tracking-tight">
                Who Benefits from Pomodoro?
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* For Students */}
              <div className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="flex items-center mb-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-primary/20 transition-colors">
                    <Users className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">Students</h3>
                </div>
                <ul className="space-y-5">
                  {[
                    "Improve study sessions and exam preparation",
                    "Reduce academic procrastination",
                    "Better time management for assignments",
                    "Enhanced retention and learning efficiency"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start text-lg group/item hover:translate-x-2 transition-transform">
                      <CheckCircle className="w-6 h-6 text-primary mr-4 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                      <span className="text-muted-foreground leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* For Professionals */}
              <div className="group bg-card/50 backdrop-blur-sm border border-border/50 rounded-3xl p-10 hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="flex items-center mb-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-primary/20 transition-colors">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">Professionals</h3>
                </div>
                <ul className="space-y-5">
                  {[
                    "Increase workplace productivity",
                    "Manage deadlines more effectively",
                    "Reduce burnout and mental fatigue",
                    "Improve work-life balance"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start text-lg group/item hover:translate-x-2 transition-transform">
                      <CheckCircle className="w-6 h-6 text-primary mr-4 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                      <span className="text-muted-foreground leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="min-h-screen flex items-center bg-gradient-to-br from-primary/5 via-background to-primary/10 border-t border-border/50" style={{ scrollSnapAlign: 'start' }}>
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-24 text-center">
            <div className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                  Start Your First Pomodoro
                </h2>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
                  The Pomodoro Technique is simple to learn but powerful in practice.
                  Start with just one 25-minute session and experience the difference focused work can make.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <button
                  onClick={handleGoogleLogin}
                  className="group inline-flex items-center justify-center px-12 py-5 text-lg font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleTestLogin}
                  className="group inline-flex items-center justify-center px-12 py-5 text-lg font-medium text-foreground bg-background/80 backdrop-blur-sm border-2 border-border rounded-xl hover:bg-muted/50 transition-all duration-300 hover:border-primary/50 hover:scale-105"
                >
                  Try Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
