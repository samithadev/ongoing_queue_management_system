import React, { useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please fill in all the required fields");
      return;
    }

    const roleId = roleName === "Counter" ? 1 : 2;

    try {
      const response = await axios.post("http://localhost:3000/user/create", {
        username,
        password,
        roleId,
      });
      console.log(response.data);
      // show success alert
      alert("User registered successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating user:", error);
      // show an error alert
      alert("error register");
    }
  };

  const handleLoginClick = () => {
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="border-solid border-4 p-20 ">
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Username</label>
          <br />
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            className=" my-4 border-solid border-2 p-2"
            placeholder="Username"
            required
          />
          <br />
          <label htmlFor="password">Password</label>
          <br />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className=" my-4 border-solid border-2 p-2"
            placeholder="Password"
            required
          />
          <br />

          <label htmlFor="role">Role: </label>
          <select
            id="role"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className=" my-4 p-2"
            required
          >
            <option value="User">User</option>
            <option value="Counter">Counter</option>
          </select>
          <br />

          <button
            type="submit"
            className=" p-2 bg-red-600 text-white rounded-lg w-full my-4"
          >
            Register
          </button>
          <button
            onClick={handleLoginClick}
            className=" p-2 bg-slate-500 text-white rounded-lg w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
