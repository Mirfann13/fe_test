import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRuas } from "../api.ts";

import {
  BarChart,
  PieChart,
  Pie,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
export default function Dashboard() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const [photo, setPhoto] = useState("");
  const [textPhoto, setTextPhoto] = useState("");
  const [dataRuas, setDataRuas] = useState("");

  const dataChart = Object.values(dataRuas).filter(
    (item) => typeof item === "object"
  );

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModalPhoto = (photo, text) => {
    setModalOpen(true);
    setPhoto(photo);
    setTextPhoto(text);
  };

  const downloadFile = (url, fileName) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.target = "_blank";
    anchor.click();
    anchor.remove();
  };

  const ModalDetailPhoto = () => {
    return (
      <div>
        <Dialog
          open={isModalOpen}
          onClose={closeModal}
          fullWidth
          maxWidth="sm"
          className="font-[Calibri]"
        >
          <DialogTitle
            id="view-cv-modal-title"
            className="text-2xl text-bold font-[Calibri] text-center"
          >
            Foto - {textPhoto}
          </DialogTitle>
          <DialogContent>
            <img src={photo} alt={photo} />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={closeModal}
              color="primary"
              className="bg-bgBlack"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("tokenSession");
    if (token === null) {
      navigate("/");
    }
    getAllRuas(currentPage, (data) => {
      setDataRuas(data);
    });
  }, [navigate, currentPage]);

  const TableData = () => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto font-[Calibri] text-center border-collapse border border-slate-500">
          <thead className="bg-bgBlack text-md text-white text-center">
            <tr>
              <th scope="col" className="px-7 py-4">
                No
              </th>
              <th scope="col" className="px-7 py-4">
                Ruas
              </th>
              <th scope="col" className="px-7 py-4">
                Lokasi
              </th>
              <th scope="col" className="px-7 py-4">
                Foto
              </th>
              <th scope="col" className="px-7 py-4">
                Document
              </th>
              <th scope="col" className="px-7 py-4">
                Unit Kerja
              </th>
              <th scope="col" className="px-7 py-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(dataRuas) && dataRuas.length > 0 ? (
              dataRuas.map((item, i) => (
                <tr key={item.id}>
                  <td className="border border-slate-600">{i + 1}</td>
                  <td className="border border-slate-600">{item.ruas_name}</td>
                  <td className="border border-slate-600">{item.long}</td>
                  <td className="border border-slate-600">
                    <button
                      onClick={() =>
                        openModalPhoto(item.photo_url, item.ruas_name)
                      }
                      className="dark:bg-yellow-500 text-black text-sm cursor-pointer w-24 rounded-md hover:text-blue-500"
                    >
                      Lihat
                    </button>
                  </td>
                  <td className="border border-slate-600">
                    <button
                      onClick={() =>
                        downloadFile(item.doc_url, `${item.ruas_name}`)
                      }
                      className=" dark:bg-yellow-500 text-black text-sm cursor-pointer w-28 rounded-md hover:text-yellow-500"
                    >
                      Download
                    </button>
                  </td>
                  <td className="border border-slate-600">{item.unitKerja}</td>
                  <td className="border border-slate-600">{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10">No Data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="lg:p-4 p-2">
        <span className="text-xl font-calibri flex justify-center text-decoration-line: underline">
          DASHBOARD
        </span>
        <div className="mt-4 flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          <div className="w-full flex justify-center ">
            <div className="border  border-blue-500 p-4 w-4/5 rounded-lg">
              <ResponsiveContainer
                width="100%"
                height={300}
                className="chartBar-wrapper"
              >
                <BarChart
                  data={dataChart}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 3,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="ruas_name"
                    angle={-12}
                    textAnchor="end"
                    interval={0}
                    tick={{
                      fontSize: 10,
                      fill: "#2472ac",
                    }}
                  />

                  <YAxis
                    label={{
                      value: "Panjang (KM)",
                      angle: -90,
                      position: "insideLeft",
                      offset: -14,
                      style: {
                        fill: "#2472ac",
                      },
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="long" fill={"#2472ac"} name="Panjang (KM)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <div className="border border-orange-500 p-4 w-4/5 rounded-lg">
              <ResponsiveContainer
                width="100%"
                height={300}
                className="chartPie-wrapper"
              >
                <PieChart>
                  <Pie
                    dataKey="long"
                    isAnimationActive={false}
                    data={dataChart}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#ffbb0d"
                    label
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      let tooltipContent = "";
                      dataChart.forEach((entry) => {
                        if (entry.id === props.payload.id) {
                          tooltipContent = `${entry.ruas_name} ( ${value} KM )`;
                        }
                      });
                      return [tooltipContent, "Nama Ruas"];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="lg:p-3 w-11/12 mx-auto mt-4">
          <TableData />
          <div className="flex flex-row justify-end mt-4 gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center space-x-1 rounded-md bg-bgYellow text-black text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                />
              </svg>
            </button>
            <span>Pages {currentPage}</span>
            <button
              onClick={handleNextPage}
              className="flex items-center space-x-1 rounded-md bg-bgYellow text-black "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </button>
          </div>

          <ModalDetailPhoto />
        </div>
      </div>
      <div className="flex justify-end lg:mr-40 mt-4 gap-4"></div>
    </div>
  );
}
