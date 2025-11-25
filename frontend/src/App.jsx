import React from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {

  const access = localStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token");

  return (
    <div>
      <main>

        <h1>This is Main App</h1>  
        <p>Access Token: {access ? access : "No access token"}</p>
        <p>Refresh Token: {refresh ? refresh : "No refresh token"}</p>

      </main>
    </div>
  );
}

export default App;
