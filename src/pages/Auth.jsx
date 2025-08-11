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
    <div
      className="h-screen overflow-y-scroll scrollbar-hide"
      style={{
        scrollSnapType: "y mandatory",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section
          className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-background via-background to-muted/20"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
            <div className="text-center space-y-12">
              <div className="space-y-8">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                  Unlock Deep Work with{" "}
                  <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Pomowaves
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-light">
                  25 minutes of pretending to work still beats zero minutes of
                  trying
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                {/* Google */}
                <button
                  onClick={handleGoogleLogin}
                  className="group inline-flex items-center justify-center px-8 py-3 text-base font-medium text-neutral-700 bg-stone-300 border-3 border-gray-300 rounded-xl hover: transition-all duration-300 shadow hover:shadow-lg hover:scale-105"
                >
                  <svg
                    className="w-5 h-5 mr-3 transition-transform group-hover:scale-110"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </button>

                {/* Demo */}
                <button
                  onClick={handleTestLogin}
                  className="group inline-flex items-center justify-center px-8 py-3 text-base font-medium text-foreground bg-background/80 backdrop-blur-sm border-3 border-border rounded-xl hover:bg-muted/50 transition-all duration-300 hover:border-primary/20 hover:scale-105"
                >
                  <LogIn className="w-4 h-4 mr-3 transition-transform group-hover:scale-110" />
                  Try Demo
                </button>
              </div>

              {/* Simple Stats */}
              <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 pt-16">
                <div className="text-center group">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                    25
                  </div>
                  <div className="text-sm text-muted-foreground font-medium leading-snug">
                    Minutes you might focus
                    <br />
                    if you don’t check your phone
                  </div>
                </div>

                {/* Divider for desktop */}
                <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent"></div>

                {/* Divider for mobile */}
                <div className="block lg:hidden w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

                <div className="text-center group">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                    5
                  </div>
                  <div className="text-sm text-muted-foreground font-medium leading-snug">
                    Minutes break you’ll stretch
                    <br />
                    into 45 with ease
                  </div>
                </div>

                {/* Divider for desktop */}
                <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent"></div>

                {/* Divider for mobile */}
                <div className="block lg:hidden w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

                <div className="text-center group">
                  <div className="text-3xl lg:text-4xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                    ∞
                  </div>
                  <div className="text-sm text-muted-foreground font-medium leading-snug">
                    Excuses
                    <br />
                    for not getting started
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Scroll Down Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer group">
            <span className="text-xs text-muted-foreground mb-1 tracking-wide">
              Scroll down
            </span>
            <svg
              onClick={() =>
                window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
              }
              className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </section>

        {/* What is Pomodoro Section */}
        <section
          className="min-h-screen flex items-center bg-gradient-to-br from-muted/10 to-background border-t border-border/50"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
            <div className="text-center mb-20">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 tracking-tight">
                What Is This Fancy Tomato Timer Thing?{" "}
              </h2>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
                A productivity ritual that makes you feel productive while doing
                the bare minimum — 25 minutes of scrolling Slack pretending it’s
                deep work, followed by a 5-minute snack hunt. Perfect for
                procrastinators with a calendar fetish.
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
                      <h3 className="text-xl font-semibold text-foreground">
                        Pretend to focus for 25 minutes
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        Stare at your screen, resist the urge to open YouTube,
                        fail gloriously.
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start space-x-6 p-6 rounded-2xl hover:bg-muted/30 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-lg font-bold">2</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        Take a 45-minute “5-minute” break
                      </h3>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        Walk to the kitchen like it’s a pilgrimage and scroll
                        Reels till you forget your name.
                      </p>
                    </div>
                  </div>

                  <div className="group flex items-start space-x-6 p-6 rounded-2xl hover:bg-muted/30 transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-lg font-bold">3</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        Repeat and question your life choices
                      </h3>
                      <p className="text-muted-foreground text-md leading-relaxed">
                        Do 4 cycles, then reward yourself with a weekend off.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-10 border border-border/50 shadow-xl">
                <h3 className="text-2xl font-semibold text-foreground mb-8">
                  Why it works
                </h3>
                <ul className="space-y-6 text-lg">
                  <li className="flex items-start group">
                    <CheckCircle className="w-6 h-6 mt-1 mr-4 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-muted-foreground leading-relaxed">
                      Fools your brain into thinking you're racing against the
                      clock{" "}
                    </span>
                  </li>
                  <li className="flex items-start group">
                    <CheckCircle className="w-6 h-6 mt-1 mr-4 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-muted-foreground leading-relaxed">
                      Because your attention span rivals a goldfish on Red Bull
                    </span>
                  </li>
                  <li className="flex items-start group">
                    <CheckCircle className="w-6 h-6 mt-1 mr-4 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-muted-foreground leading-relaxed">
                      Eventually you might open VSCode before Twitter (maybe){" "}
                    </span>
                  </li>
                  <li className="flex items-start group">
                    <CheckCircle className="w-6 h-6 mt-1 mr-4 flex-shrink-0 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-muted-foreground leading-relaxed">
                      So you can say “I worked” when you’ve done absolutely
                      nothing{" "}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="min-h-screen flex items-center bg-gradient-to-br from-background to-primary/5 border-t border-border/50"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24">
            <div className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-8 tracking-tight">
                Simple and Effective
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto font-light leading-relaxed">
                Add your tasks, start the timer, and immediately get lost in
                thought for 25 minutes straight.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "Mood-Based Time Bending",
                  description: "Because your focus changes every 3 minutes",
                },
                {
                  icon: <Brain className="w-8 h-8" />,
                  title: "Distraction-Free",
                  description: "Minimal UI, maximal inner chaos",
                },
                {
                  icon: <TrendingUp className="w-8 h-8" />,
                  title: "Spy on Yourself in Style",
                  description: "Judge yourself with sexy graphs",
                },
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Finish 10% of your to-do list",
                  description:
                    "Turn “Build an app” into a full-blown existential crisis roadmap.",
                },
                {
                  icon: <CheckCircle className="w-8 h-8" />,
                  title: "Organize Procrastination Professionally",
                  description: "Add tasks you’ll never check off",
                },
                {
                  icon: <Play className="w-8 h-8" />,
                  title: "No Excuses left",
                  description:
                    "Nothing to install. Inner chaos included by default.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group text-center space-y-6 p-8 rounded-3xl hover:bg-card/30 backdrop-blur-sm transition-all duration-300 hover:scale-105 border border-transparent hover:border-border/50"
                >
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
        <section
          className="min-h-screen flex items-center bg-gradient-to-br from-muted/10 to-background border-t border-border/50"
          style={{ scrollSnapAlign: "start" }}
        >
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
                  <h3 className="text-2xl font-semibold text-foreground">
                    Students
                  </h3>
                </div>
                <ul className="space-y-5">
                  {[
                    "Create the illusion of studying",
                    "Replace doomscrolling with timed doomscrolling",
                    "Manage your tasks—and your emotional damage.",
                    "Highlight everything, learn nothing",
                  ].map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start text-lg group/item hover:translate-x-2 transition-transform"
                    >
                      <CheckCircle className="w-6 h-6 text-primary mr-4 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                      <span className="text-muted-foreground leading-relaxed">
                        {benefit}
                      </span>
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
                  <h3 className="text-2xl font-semibold text-foreground">
                    Professionals
                  </h3>
                </div>
                <ul className="space-y-5">
                  {[
                    "Pretend to be productive on Slack",
                    "Miss the deadlines with structure",
                    "Burn out slower, but fancier",
                    "Blend work and life into anxiety",
                  ].map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start text-lg group/item hover:translate-x-2 transition-transform"
                    >
                      <CheckCircle className="w-6 h-6 text-primary mr-4 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                      <span className="text-muted-foreground leading-relaxed">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section
          className="min-h-screen flex items-center bg-gradient-to-br from-background to-muted/10 border-t border-border/50"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-20">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-8 tracking-tight">
                What People Think
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-balance">
                Totally real feedback from our most unqualified fans.
              </p>
            </div>

            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote: "It's just a CRUD app.",
                  name: "– Jealous friend",
                },
                {
                  quote: "I can build this in 2 days. Maybe 3 with animations.",
                  name: "– Vibe Coder",
                },
                {
                  quote: "Is this that tomato technique thing?",
                  name: "– Confused Friend",
                },
                {
                  quote: "I'll use it right after this YouTube video.",
                  name: "– Procrastination Pro",
                },
                {
                  quote: "Looks cute. Can I customize the font?",
                  name: "– Design Enthusiast",
                },
                {
                  quote: "But where's the dark mode toggle?",
                  name: "– Twitter User",
                },
                {
                  quote: "Does it sync with my Notion? No? Hmm.",
                  name: "– Productivity Tool Hoarder",
                },
                {
                  quote: "Great, another app I’ll forget exists in 2 days.",
                  name: "– Honest Beta Tester",
                },
                {
                  quote: "Can I connect this to ChatGPT and never work again?",
                  name: "– Automation Addict",
                },
              ].map(({ quote, name }, i) => (
                <blockquote
                  key={i}
                  className="group bg-card/50 backdrop-blur-sm border border-border/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/20"
                >
                  <p className="text-lg italic mb-4 text-muted-foreground leading-relaxed text-balance">
                    "{quote}"
                  </p>
                  <footer className="text-sm font-medium text-foreground">
                    {name}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section
          className="min-h-screen flex items-center bg-gradient-to-br from-primary/5 via-background to-primary/10 border-t border-border/50"
          style={{ scrollSnapAlign: "start" }}
        >
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-24 text-center">
            <div className="space-y-12">
              <div className="space-y-8">
                <h2 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
                  Start Pretending to Work Like a Pro
                </h2>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light max-w-3xl mx-auto">
                  All it takes is one 25-minute timer to feel like you’ve earned
                  a full-blown vacation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <button
                  onClick={handleGoogleLogin}
                  className="group inline-flex items-center justify-center px-12 py-4 text-lg font-medium bg-stone-300 text-primary-foreground rounded-xl hover: transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Sell your soul to productivity{" "}
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
