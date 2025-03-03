/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle, getCurrentUser, testUserLogin } from "../api/auth.js";
import { FiLogIn } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (user) {
      navigate("/");
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  const handleTestLogin = async () => {
    await testUserLogin().then(() => navigate("/"));
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h1>Pomowaves</h1>
        <div className="button-container">
          <button className="signin-btn" onClick={handleGoogleLogin}>
            {/* <img src="/icons/google.png" alt="Google logo" /> */}
            <FcGoogle size={20} />
            Sign up with Google
          </button>
          <button className="signin-btn" onClick={handleTestLogin}>
            {/* <img src="/icons/enter.png" alt="Google logo" /> */}
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
            study, writing, or coding. This app is inspired by Pomodoro
            Technique which is a time management method developed by Francesco
            Cirillo.
          </p>
        </section>

        <section className="info-section">
          <h2>What is Pomodoro Technique?</h2>
          <p>
            The Pomodoro Technique is created by Francesco Cirillo for a more
            productive way to work and study. The technique uses a timer to
            break down work into intervals, traditionally 25 minutes in length,
            separated by short breaks. Each interval is known as a pomodoro,
            from the Italian word for {"tomato"}, after the tomato-shaped
            kitchen timer that Cirillo used as a university student. -{" "}
            <a
              target="_blank"
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
            <li>Set estimate pomodoros (1 = 25min of work) for each tasks</li>
            <li>Select a task to work on</li>
            <li>Start timer and focus on the task for 25 minutes</li>
            <li>Take a break for 5 minutes when the alarm ring</li>
            <li>Iterate 3-5 until you finish the tasks</li>
          </ol>
        </section>
      </div>
    </div>
  );
};

export default Auth;
