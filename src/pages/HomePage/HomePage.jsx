import Hero from "../../components/Hero/Hero";
import PageSections from "../../components/PageSections/PageSections";
import Services from "../../components/Services/Services";

import { usePageTitle } from "../../hooks/usePageTitle";

function HomePage() {
  usePageTitle("صفحه اصلی"); // tab title: "صفحه اصلی | دیجی‌پی"

  return (
    <>
      <Hero />
      <Services />

      {/* قسطی شگفت / کد تخفیف / پرفروش‌ترین‌ها:
          turn each on or off in config/pageSections.js */}
      <PageSections page="home" />
    </>
  );
}

export default HomePage;