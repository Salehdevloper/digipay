import { useState } from "react";

import AuthStory from "./AuthStory";
import { AUTH_SLIDES, STORY_DURATION } from "./authSlides";

import "./AuthShell.css";

/**
 * Page frame of login-like pages: a centered column with the colored
 * story header and a white "sheet" below it where the form goes.
 * The background color follows the active slide.
 *
 *   <AuthShell>
 *     ...form...
 *   </AuthShell>
 */
function AuthShell({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = AUTH_SLIDES[activeIndex];

  return (
    <div
      className="auth-shell"
      style={{ "--auth-from": slide.from, "--auth-to": slide.to }}
    >
      <div className="auth-shell__column">
        <AuthStory
          slides={AUTH_SLIDES}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          duration={STORY_DURATION}
        />

        <div className="auth-shell__sheet">{children}</div>
      </div>
    </div>
  );
}

export default AuthShell;