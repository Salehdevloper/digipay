import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import FlashDeals from "../../components/Flashdeals/Flashdeals";
import DiscountCodes from "../../components/Discountcodes/Discountcodes";

import { usePageTitle } from "../../hooks/usepagetitle";

function HomePage() {
  usePageTitle("صفحه اصلی"); // tab title: "صفحه اصلی | دیجی‌پی"

  return (
    <>
      <Hero />
      <Services />
      <FlashDeals />
      <DiscountCodes />
    </>
  );
}

export default HomePage;