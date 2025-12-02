import { useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await api.post("user/logout/");
      } catch (error) {
        console.error("Logout error:", error);
      }

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="text-center mt-10 text-lg font-semibold">
      Logging you out...
    </div>
  );
};

export default Logout;
