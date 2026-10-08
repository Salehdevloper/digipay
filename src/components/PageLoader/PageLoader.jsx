import "./PageLoader.css";

/** Full-screen spinner: shown while a page is loading. */
function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-label="در حال بارگذاری">
      <span className="page-loader__spinner" />
    </div>
  );
}

export default PageLoader;