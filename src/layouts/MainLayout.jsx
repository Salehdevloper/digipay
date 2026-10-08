import { Outlet } from "react-router-dom";

import Header from "../components/Header/Header";

/** Pages with the site header (home, stores, payment, ...). */
function MainLayout() {
  return (
    <div className="app">
      <Header />

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;