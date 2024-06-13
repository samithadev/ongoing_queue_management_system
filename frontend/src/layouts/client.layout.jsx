import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function ClientLayout() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <main className="container">
      <Outlet />
    </main>
  );
}

export default ClientLayout;
