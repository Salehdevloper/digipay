import { resolveImage } from "../../utils/resolveImage";

import "./AuthStory.css";

/* Illustrations: src/assets/images/auth/<slide id>.webp|png|svg
   (a missing file just shows no picture) */
const IMAGES = import.meta.glob("../../assets/images/auth/*.{webp,png,jpg,svg}", {
  eager: true,
  import: "default",
});

/**
 * Header of the login page:
 *   progress bars (one per slide) + title + text + illustration.
 * The active bar fills up; when it is full the next slide starts.
 *
 * Props: slides, activeIndex, onChange(index), duration (ms)
 */
function AuthStory({ slides, activeIndex, onChange, duration }) {
  const slide = slides[activeIndex];
  const image = resolveImage(IMAGES, slide.id);

  const goToNext = () => onChange((activeIndex + 1) % slides.length);

  return (
    <header className="auth-story">
      <div className="auth-story__progress" role="tablist" aria-label="اسلایدها">
        {slides.map(({ id, title }, index) => (
          <button
            type="button"
            key={id}
            role="tab"
            aria-label={title}
            aria-selected={index === activeIndex}
            className="auth-story__segment"
            onClick={() => onChange(index)}
          >
            <span
              className={`auth-story__fill ${
                index < activeIndex
                  ? "auth-story__fill--done"
                  : index === activeIndex
                  ? "auth-story__fill--active"
                  : ""
              }`}
              style={{ animationDuration: `${duration}ms` }}
              onAnimationEnd={index === activeIndex ? goToNext : undefined}
            />
          </button>
        ))}
      </div>

      {/* key = slide id: the text and picture fade in again on every slide */}
      <div className="auth-story__content" key={slide.id}>
        <h2 className="auth-story__title">{slide.title}</h2>
        <p className="auth-story__description">{slide.description}</p>

        <div className="auth-story__image">
          {image && <img src={image} alt="" draggable={false} />}
        </div>
      </div>
    </header>
  );
}

export default AuthStory;