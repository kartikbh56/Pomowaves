/* eslint-disable react/prop-types */
import { Navigate, useNavigate } from "react-router-dom";
import {
  loginWithGoogle,
  testUserLogin,
  getCurrentUser,
} from "../backend/auth.js";
import { FiLogIn } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function Auth({ user, setUser }) {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      const user = await getCurrentUser();
      if (user) {
        setUser(user);
        navigate("/");
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const handleTestLogin = async () => {
    try {
      await testUserLogin();
      await getCurrentUser();
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Test login failed:", error);
    }
  };

  if (user) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="auth-container">
      <div className="auth-content">
        <div>
          <h1>Pomowaves</h1>
        </div>
        <div className="button-container">
          <button className="signin-btn" onClick={handleGoogleLogin}>
            <FcGoogle size={20} />
            Sign up with Google
          </button>
          <button className="signin-btn" onClick={handleTestLogin}>
            <FiLogIn />
            Login with Test Account
          </button>
        </div>

        <section className="info-section">
          <h2>What is Pomowaves?</h2>
          <p>
            Pomowaves is a customizable online Pomodoro Timer to boost your
            productivity that works on desktop & mobile browser. The aim of this
            app is to help you focus on any task you are working on, such as
            study, writing, or coding. This app is inspired by the Pomodoro
            Technique, a time management method developed by Francesco Cirillo.
          </p>
        </section>

        <section className="info-section">
          <h2>What is Pomodoro Technique?</h2>
          <p>
            The Pomodoro Technique was created by Francesco Cirillo for a more
            productive way to work and study. The technique uses a timer to
            break down work into intervals, traditionally 25 minutes in length,
            separated by short breaks. Each interval is known as a pomodoro,
            from the Italian word for &ldquo;tomato&rdquo; after the
            tomato-shaped kitchen timer that Cirillo used as a university
            student. -{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://en.wikipedia.org/wiki/Pomodoro_Technique"
            >
              Wikipedia
            </a>
          </p>
        </section>

        <section className="info-section">
          <h2>How to use the Pomodoro Timer?</h2>
          <ol>
            <li>Add tasks to work on today</li>
            <li>Set estimated pomodoros (1 = 25min of work) for each task</li>
            <li>Select a task to work on</li>
            <li>Start the timer and focus on the task for 25 minutes</li>
            <li>Take a break for 5 minutes when the alarm rings</li>
            <li>Repeat until you finish your tasks</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
