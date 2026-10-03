import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import FlashDeals from "./components/Flashdeals/Flashdeals";

function App() {
  return (
    <div className="app">
      <Header />

      <main>
        <Hero />
        <Services />
        <FlashDeals />
      </main>
    </div>
  );
}

export default App;