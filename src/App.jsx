import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header/Header";

import HomePage from "./pages/Homepage/Homepage";
import StoresPage from "./pages/Storespage/Storespage";

import "./styles/responsive.css";

/** Every page change starts from the top of the page. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <div className="app">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/stores" element={<StoresPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;