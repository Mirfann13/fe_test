import React, { useState } from "react";
import logojasamarga from "../utils/logojasamarga.png";
import toltjjm from "../utils/toltjjm.png";
import { mdiEye, mdiEyeOff } from "@mdi/js";
import { login } from "../api.ts";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    login(data.username, data.password, (data) => {
      if (data.status === true) {
        navigate("/dashboard");
      }
    });
  };

  return (
    <div className="min-h-screen bg-bgYellow text-gray-900 flex justify-center font-[Calibri]">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-bgWhite shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-6/12 p-6 sm:p-12 flex flex-col justify-center">
          <div>
            <img src={logojasamarga} className="w-64 mx-auto" alt="logo" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <div className="w-full flex-1 mt-8">
              <div className="flex flex-col items-center"></div>

              <div className="mx-auto max-w-xs">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label>Username</label>
                    <input
                      className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                      type="text"
                      placeholder="Enter Username"
                      {...register("username", {
                        required: "Username Must Not Empty!",
                      })}
                    />
                    {errors.username && (
                      <span className="text-red-500">
                        {errors.username.message}
                      </span>
                    )}
                  </div>

                  <div className="mt-6 relative">
                    <label>Password</label>
                    <div className="relative">
                      <input
                        className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white pr-12"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        {...register("password", {
                          required: "Password Must Not Empty!",
                        })}
                      />
                      {errors.password && (
                        <span className="text-red-500">
                          {errors.password.message}
                        </span>
                      )}
                      <span
                        className={`password-toggle absolute right-4 top-1/2 transform -translate-y-1/2 ${
                          showPassword ? "" : "active"
                        }`}
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          width="18px"
                          height="24px"
                        >
                          <path d={showPassword ? mdiEye : mdiEyeOff} />
                        </svg>
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="submit"
                      className="tracking-wide bg-bgBlack text-gray-100 w-1/2 py-2 rounded-lg hover:bg-yellow-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                    >
                      <span>Login</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex-1 bg-indigo-100 text-center bg-cover bg-center hidden lg:flex"
          style={{ backgroundImage: `url(${toltjjm})` }}
        ></div>
      </div>
    </div>
  );
}
