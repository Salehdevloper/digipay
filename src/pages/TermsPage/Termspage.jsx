import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

import { TERMS_SECTIONS, TERMS_TITLE } from "../../constants/termsContent";
import { usePageTitle } from "../../hooks/usePageTitle";

import "./Termspage.css";

/** Terms of use (/terms): a long page that simply scrolls. */
function TermsPage() {
  usePageTitle("شرایط استفاده");

  const navigate = useNavigate();
  const location = useLocation();

  /* Came from the login page: go back there. Opened directly: go to /login. */
  const goBack = () => {
    if (location.key !== "default") navigate(-1);
    else navigate("/login", { replace: true });
  };

  return (
    <div className="terms-page">
      <article className="terms-page__column">
        <header className="terms-page__bar">
          <button
            type="button"
            className="terms-page__back"
            onClick={goBack}
            aria-label="بازگشت"
          >
            <FiArrowRight aria-hidden="true" />
          </button>
        </header>

        <div className="terms-page__body">
          <h1 className="terms-page__title">{TERMS_TITLE}</h1>

          {TERMS_SECTIONS.map(({ id, title, paragraphs }) => (
            <section className="terms-page__section" key={id}>
              <h2 className="terms-page__heading">{title}</h2>

              {paragraphs.map((paragraph, index) => (
                <p className="terms-page__text" key={index}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

export default TermsPage;