import React from "react";
// import Login from "./pages/auth/login";
// import Signup from "./pages/Signup";
import HeroSlider from "./components/autoSlider";




function App() {

  const access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  return (
    <div>
      {/* <HeroSlider/> */}
    </div>
  );
}

export default App;
