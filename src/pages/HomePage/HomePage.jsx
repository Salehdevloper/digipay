import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import FlashDeals from "../../components/FlashDeals/FlashDeals";
import DiscountCodes from "../../components/DiscountCodes/DiscountCodes";

import { usePageTitle } from "../../hooks/usePageTitle";

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