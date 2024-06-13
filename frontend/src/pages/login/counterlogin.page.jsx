import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function CounterLogin() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Please fill in all the required fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);

      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;
      const assignUser = decodedToken.userId;
      console.log(decodedToken);
      console.log(assignUser);

      // Redirect based on user role
      if (role === 1) {
        alert("Counter login successful!!");

        try {
          const response = await axios.put(
            "http://localhost:3000/counter/assign_user",
            {
              assignUser,
            }
          );

          navigate("/counter/allissues");
        } catch (assignError) {
          if (
            assignError.response &&
            assignError.response.data &&
            assignError.response.data.message === "No available counters"
          ) {
            alert("All counters are full!");
          } else {
            alert("Error assigning user to counter");
            console.error("Error assigning user to counter:", assignError);
          }
        }
      } else {
        alert("Not a Counter role");
        return;
      }
    } catch (error) {
      alert("Not registered User!");
      console.error("Error logging in:", error);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="border-solid border-4 p-16 ">
        <div className="flex items-center justify-center text-2xl font-bold mb-5">
          <h1>Counter Login</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="text">Username</label>
          <br />
          <input
            type="text"
            id="username"
            className=" my-4 border-solid border-2 p-2"
            placeholder="Username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            id="password"
            className=" my-4 border-solid border-2 p-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />

          <button
            type="submit"
            className=" p-2 bg-blue-600 text-white rounded-lg w-full my-4"
          >
            LogIn
          </button>
          <button
            onClick={handleRegisterClick}
            className=" p-2 bg-red-600 text-white rounded-lg w-full "
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default CounterLogin;
