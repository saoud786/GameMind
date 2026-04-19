import "./Footer.css";

export default function WelcomeFooter() {
  return (
    <footer className="footer light-footer">

      <p className="footer-text">
        © 2026 GameMind • Built by <span className="name">Saoud Ali</span>
      </p>

      <div className="footer-socials">

        {/* 🔗 GitHub */}
        <a
          href="https://github.com/saoud786"
          target="_blank"
          rel="noreferrer"
          className="social-link"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.84 10.91.57.1.78-.25.78-.56 0-.27-.01-1.16-.02-2.1-3.19.69-3.86-1.54-3.86-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.74 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.52-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.47.11-3.06 0 0 .97-.31 3.18 1.17a11.03 11.03 0 012.9-.39c.98 0 1.97.13 2.9.39 2.2-1.48 3.17-1.17 3.17-1.17.63 1.59.24 2.77.12 3.06.73.8 1.17 1.82 1.17 3.07 0 4.41-2.7 5.38-5.26 5.67.41.35.77 1.04.77 2.1 0 1.52-.01 2.75-.01 3.13 0 .31.2.67.79.56A10.51 10.51 0 0023.5 12C23.5 5.65 18.35.5 12 .5z"/>
          </svg>
          <span>GitHub</span>
        </a>

        {/* 🔗 LinkedIn */}
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          className="social-link"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.6v2.2h.05c.5-.95 1.73-1.95 3.55-1.95 3.8 0 4.5 2.5 4.5 5.75V24h-4v-7.8c0-1.86-.03-4.25-2.6-4.25-2.6 0-3 2.03-3 4.1V24h-4V8z"/>
          </svg>
          <span>LinkedIn</span>
        </a>

      </div>

    </footer>
  );
}