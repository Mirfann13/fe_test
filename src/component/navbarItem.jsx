import React, { useEffect, useState, Fragment } from "react";
import {
  Navbar,
  Typography,
  Button,
  //IconButton,
} from "@material-tailwind/react";
import { Menu, Transition } from "@headlessui/react";
import logojasamarga from "../utils/logojasamarga.png";
import { logout } from "../api.ts";
import { useNavigate, useLocation } from "react-router-dom";

export default function NavbarItem() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDashboardClicked, setIsDashboardClicked] = useState(false);
  const [isMasterDataClicked, setIsMasterDataClicked] = useState(false);

  const moveToDashboard = () => {
    setIsMasterDataClicked(false);
    setIsDashboardClicked(true);
    navigate("/dashboard");
  };

  const moveToMasterData = () => {
    setIsMasterDataClicked(true);
    setIsDashboardClicked(false);
    navigate("/masterData");
  };

  const [openNav, setOpenNav] = useState(false);

  const logoutFunction = () => {
    const result = window.confirm("Are you sure you want to sign out?");
    if (result) {
      logout((data) => {
        console.log(data);
        if (data === true) {
          localStorage.removeItem("tokenSession");
          navigate("/");
        }
      });
    }
  };

  const ModalProfile = () => {
    return (
      <Menu as="div" className="ml-auto mr-2">
        <div>
          <Menu.Button className=" rounded-xl inline-flex w-full gap-x-1.5 px-3 py-2 shadow-sm ring-1 ring-inset ring-black-100 hover:bg-yellow-100">
            <img
              className="rounded-full ml-auto w-12"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTedjHLztI_zoI4wjDqnXlGffDhr3nYXYItwMfpksZdC26AapL2xdjWpG9Lnze1BdO0ZFw&usqp=CAU"
              alt="profile"
            />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-110"
          enterFrom="transform opacity-0 scale-105"
          enterTo="transform opacity-110 scale-110"
          leave="transition ease-in duration-85"
          leaveFrom="transform opacity-110 scale-110"
          leaveTo="transform opacity-0 scale-105"
        >
          <Menu.Items className="absolute center-0 z-10 mt-2 w-65 origin-top-right text-center rounded-lg border-2 bg-bgBlack shadow-lg ring-1 ring-black ring-opacity-3 focus:outline-none">
            <div className="py-1 flex flex-col">
              <Menu.Item className="cursor-pointer text-center mb-4">
                {({ active }) => (
                  <div className=" hover:text-yellow-500 border-b-2 border-slate-300 p-2">
                    <button className="mx-auto flex justify-center ">
                      <svg
                        xmlns=""
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="none"
                        className="w-6 h-6"
                        style={{ stroke: "green" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>

                      <span>Profile</span>
                    </button>
                  </div>
                )}
              </Menu.Item>
              <Menu.Item className="cursor-pointer text-center -mt-2 p-1">
                {({ active }) => (
                  <div className=" hover:text-yellow-500">
                    <button
                      onClick={logoutFunction}
                      className="mx-auto flex justify-center "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="none"
                        className="w-6 h-6"
                        style={{ stroke: "red" }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  useEffect(() => {
    const isDashboardPage = location.pathname === "/dashboard";
    const isMasterDataPage = location.pathname === "/masterData";
    setIsDashboardClicked(isDashboardPage);
    setIsMasterDataClicked(isMasterDataPage);
  }, [location.pathname]);

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:ml-8 lg:flex-row  lg:gap-4">
      <Typography
        as="li"
        variant="small"
        className={`p-1 font-normal text-bgBlack ${
          isDashboardClicked ? "border-b-4 border-blue-500" : ""
        }`}
      >
        <button
          onClick={moveToDashboard}
          className="flex items-center cursor-pointer"
        >
          Dashboard
        </button>
      </Typography>
      <Typography
        as="li"
        variant="small"
        className={`p-1 font-normal text-bgBlack ${
          isMasterDataClicked ? "border-b-4 border-blue-500" : ""
        }`}
      >
        <button
          onClick={moveToMasterData}
          className="flex items-center cursor-pointer"
        >
          Master Data
        </button>
      </Typography>
    </ul>
  );

  return (
    <div className="bg-bgYellow ">
      {location.pathname !== "/" && (
        <Navbar className="mx-auto  py-2 px-4 lg:px-6 lg:py-4 border-none bg-bgYellow text-white font-[Calibri]">
          <div className="container mx-auto flex items-center justify-between text-blue-gray-900">
            <img src={logojasamarga} alt={logojasamarga} className="w-48" />
            <div className="hidden lg:block">{navList}</div>

            <ModalProfile />

            <Button
              variant="gradient"
              size="sm"
              className="rounded-xl inline-flex gap-x-1.5 px-3 py-2 shadow-sm ring-1 ring-inset ring-black-100 hover:bg-yellow-100"
            >
              <span className="hover:text-blue-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
              </span>
            </Button>
          </div>
          <div>
            {openNav ? (
              <div className="container mx-auto ">{navList}</div>
            ) : null}
          </div>
        </Navbar>
      )}
    </div>
  );
}
