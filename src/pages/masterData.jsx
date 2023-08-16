import React, { useEffect, useState } from "react";
import { getAllRuas, deleteRuas, updateRuas, addRuas} from "../api.ts";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Spinner from "../component/spinner";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function MasterData({ initialData }) {
  // let [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const [dataRuas, setDataRuas] = useState(false);
  // const [dataUnit, setDataUnit] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpenDelete, setModalOpenDelete] = useState(false);
  const [isModalOpenCRUD, setModalOpenCRUD] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [photo, setPhoto] = useState("");
  const [idData, setDataId] = useState("");
  const [textPhoto, setTextPhoto] = useState("");
  const [textDelete, setTextDelete] = useState("");
  const [viewData, setViewData] = useState("");
  const [loading, setLoading] = useState(true);

  // start function handle modal,dll\
  const openModalPhoto = (photo, text) => {
    setModalOpen(true);
    setPhoto(photo);
    setTextPhoto(text);
  };

  const openModalDelete = (id, name) => {
    setModalOpenDelete(true);
    setDataId(id);
    setTextDelete(name);
  };

  const openModalCRUD = ({ data, mode }) => {
    setModalOpenCRUD(true);
    setViewData(data);
    setModalMode(mode);
  };

  const closeModal = () => {
    reset();
    setModalOpen(false);
    setModalOpenDelete(false);
    setModalOpenCRUD(false);
  };

  const downloadFile = (url, fileName) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.target = "_blank";
    anchor.click();
    anchor.remove();
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();


  //end function handle modal,dll

  // function send data to api (add data,update data,delete data) & fetch data

  useEffect(() => {
    const token = localStorage.getItem("tokenSession");
    if (token === null) {
      navigate("/");
    }

    getAllRuas(currentPage, (data) => {
      setDataRuas(data);
    });

    // getUnitKerja((data) => {
    //   setDataUnit(data);
    // });

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [currentPage, navigate]);

  useEffect(() => {
    if (viewData) {
      const fieldsToSet = [
        "ruas_name",
        "km_awal",
        "km_akhir",
        "status",
        "unit_id",
        "photo",
        "file",
        "long",
      ];
      fieldsToSet.forEach((field) => {
        setValue(field, viewData[field]);
      });
    }
  }, [viewData, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    const id = data.id;
    if (modalMode === "tambah") {
      setLoading(true);

      addRuas(data, async (response) => {
        if (response.status === true) {
          alert("Tambah Data Berhasil");

          const updatedData = await getAllRuas();
          setDataRuas(updatedData);
          setCurrentPage(1);
        }

        setLoading(false);
        setModalOpenCRUD(false);
      });
    } else {
      setLoading(true);
      updateRuas(data, id, async (response) => {
        console.log(response.status);
        if (response.status === true) {
          alert("Update Data Berhasil");
          const updatedData = await getAllRuas();
          setDataRuas(updatedData);
          setCurrentPage(1);
        }
        setLoading(false);
        setModalOpenCRUD(false);
      });
    }
  };

  const deleteData = (id) => {
    setLoading(true);

    deleteRuas(id, async (response) => {
      console.log(response.status);
      if (response.status === true) {
        alert("Delete Data Berhasil");
        const updatedData = await getAllRuas();
        setDataRuas(updatedData);
        setCurrentPage(1);
      }
      setLoading(false);
      setModalOpenDelete(false);
    });
  };

  const TableData = () => {
    return (
      <div className="mt-5 mr-4 overflow-x-auto">
        <table className="min-w-full table-auto font-[Calibri] text-center border-collapse border border-slate-500">
          <thead className="bg-bgBlack text-white text-md text-center">
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
              <th scope="col" className="px-7 py-4">
                Aksi
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
                      className=" dark:bg-yellow-500 text-black text-sm cursor-pointer w-24 rounded-md hover:text-blue-500"
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
                  <td className="border border-slate-600 flex flex-row">
                    <span
                      className="hover:text-green-500"
                      onClick={() => {
                        const data = {
                          id: item.id,
                          ruas_name: item.ruas_name,
                          long: item.long,
                          unit: item.unit_id,
                          km_awal: item.km_awal,
                          km_akhir: item.km_akhir,
                          photo: item.photo_url,
                          document: item.doc_url,
                          status: item.status,
                        };
                        openModalCRUD({ data, mode: "edit" });
                      }}
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
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                    </span>
                    <span
                      className="hover:text-blue-500"
                      onClick={() => {
                        const data = {
                          id: item.id,
                          ruas_name: item.ruas_name,
                          long: item.long,
                          unit: item.unit_id,
                          km_awal: item.km_awal,
                          km_akhir: item.km_akhir,
                          photo: item.photo_url,
                          document: item.doc_url,
                          status: item.status,
                        };
                        openModalCRUD({ data, mode: "view" });
                      }}
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
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </span>
                    <span
                      className="hover:text-red-500"
                      onClick={() => openModalDelete(item.id, item.ruas_name)}
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
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </span>
                  </td>
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

  // Modal Detail Photo
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

  //Modal Delete Data
  const ModalDeleteData = () => {
    return (
      <div>
        <Dialog
          open={isModalOpenDelete}
          onClose={closeModal}
          aria-labelledby="view-cv-modal-title"
          fullWidth
          maxWidth="sm"
          className="font-[Calibri]"
        >
          <DialogTitle
            id="view-cv-modal-title"
            className="text-2xl text-bold font-[Calibri] text-center"
          >
            Konfirmasi Hapus Ruas
          </DialogTitle>
          <DialogContent>
            Apakah anda yakin ingin menghapus data
            {textDelete}?
          </DialogContent>
          <DialogActions>
            <button
              onClick={closeModal}
              className="bg-bgRed text-white w-24 rounded-md mr-1"
            >
              Tidak
            </button>
            <button
              onClick={() => deleteData(idData)}
              className="bg-bgGreen border-2 border-slate-600 rounded-md w-24"
            >
              Ya
            </button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };
  //end function untuk display component table , modaldetail photo, modaldelete

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div className="ml-10 mt-4 font-[Calibri]">
          <div className=" overflow-y-auto">
            <div className="flex lg:flex-row flex-col justify-between">
              <span className="text-xl mb-4 flex justify-center text-decoration-line: underline">Master Data Ruas</span>
              <div className="flex flex-row gap-2 mr-30 lg:mr-40">
                <label className="relative block">
                  <span className="sr-only">Search</span>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-2">
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
                        d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <input
                    className="placeholder:italic placeholder:text-slate-400 block bg-white w-13 border border-slate-500 rounded-md py-2 pl-9 pr-0 shadow-sm focus:outline-none focus:border-bgBlack focus:bgBlack focus:ring-1 sm:text-sm"
                    placeholder="Search"
                    type="text"
                    name="search"
                  />
                </label>
                <button
                  className="relative block"
                  onClick={() => {
                    const data = {
                      ruas_name: "",
                      long: "",
                      unit_id: "",
                      km_awal: "",
                      km_akhir: "",
                      photo: "",
                      document: "",
                      status: "",
                    };
                    openModalCRUD({ data, mode: "tambah" });
                  }}
                >
                  <span className="absolute inset-y-0 left-3 flex items-center pl-2 border-4 text-white w-32 border-white rounded-lg bg-bgBlack">
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
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Tambah
                  </span>
                </button>
              </div>
            </div>

            <TableData />
            <div className="flex justify-end mr-4 mt-4 gap-4">
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
            <ModalDeleteData />

            {/* Modal CRUD */}
            <div>
              <Dialog
                open={isModalOpenCRUD}
                onClose={closeModal}
                aria-labelledby="view-cv-modal-title"
                fullWidth
                maxWidth="sm"
                className="font-[Calibri]"
              >
                {modalMode === "tambah" && (
                  <DialogTitle
                    id="view-cv-modal-title"
                    className="text-2xl text-bold text-bgBlack font-[Calibri] text-center"
                  >
                    Tambah Ruas
                  </DialogTitle>
                )}

                {modalMode === "view" && (
                  <DialogTitle
                    id="view-cv-modal-title"
                    className="text-2xl text-bold text-bgBlack font-[Calibri] text-center text-decoration-line: underline"
                  >
                    Detail Ruas
                  </DialogTitle>
                )}

                {modalMode === "edit" && (
                  <DialogTitle
                    id="view-cv-modal-title"
                    className="text-2xl text-bold text-bgBlack font-[Calibri] text-center text-decoration-line: underline"
                  >
                    Edit Ruas
                  </DialogTitle>
                )}

                <DialogContent>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="ruas" className="block font-medium">
                          Ruas
                          {errors.ruas_name && (
                            <span className="text-red-500">
                              {errors.ruas_name.message}
                            </span>
                          )}
                        </label>
                        {modalMode === "view" ? (
                          <input
                            type="text"
                            id="ruas"
                            name="ruas"
                            value={viewData.ruas_name}
                            readOnly
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                          />
                        ) : (
                          <input
                            type="text"
                            id="ruas"
                            name="ruas"
                            defaultValue={viewData ? viewData.ruas_name : ""}
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                            {...register("ruas_name", {
                              required: "*",
                            })}
                          />
                        )}
                      </div>

                      <div>
                        <label htmlFor="panjang" className="block font-medium">
                          Panjang (km){" "}
                          {errors.long && (
                            <span className="text-red-500">
                              {errors.long.message}
                            </span>
                          )}
                        </label>
                        {modalMode === "view" ? (
                          <input
                            type="number"
                            id="panjang"
                            name="panjang"
                            value={viewData.long}
                            readOnly
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                          />
                        ) : (
                          <input
                            type="number"
                            id="panjang"
                            name="panjang"
                            defaultValue={viewData.long}
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                            {...register("long", {
                              required: "*",
                            })}
                          />
                        )}
                      </div>
                      <div>
                        <label htmlFor="unit" className="block font-medium">
                          Unit Kerja{" "}
                          {errors.unit_id && (
                            <span className="text-red-500">
                              {errors.unit_id.message}
                            </span>
                          )}
                        </label>
                        {modalMode === "view" ? (
                          <input
                            type="text"
                            id="unit"
                            name="unit"
                            value={viewData.unit}
                            readOnly
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                          />
                        ) : (
                          <select
                            id="unit"
                            name="unit"
                            defaultValue={viewData.unit}
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                            {...register("unit_id", {
                              required: "*",
                            })}
                          >
                          {/* {
                            dataUnit.map((item, i) => (
                              <option value={item.id}>{item.unit}</option>
                            ))
                          } */}

                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                          <option value="7">7</option>
                          <option value="8">8</option>
                          <option value="9">9</option>
                          </select>
                        )}
                      </div>
                      <div>
                        <label htmlFor="kmAwal" className="block font-medium">
                          Km Awal{" "}
                          {errors.km_awal && (
                            <span className="text-red-500">
                              {errors.km_awal.message}
                            </span>
                          )}
                        </label>
                        {modalMode === "view" ? (
                          <input
                            type="text"
                            id="kmAwal"
                            name="kmAwal"
                            value={viewData.km_awal}
                            readOnly
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                          />
                        ) : (
                          <input
                            type="text"
                            id="kmAwal"
                            name="kmAwal"
                            defaultValue={viewData.km_awal}
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                            {...register("km_awal", {
                              required: "*",
                            })}
                          />
                        )}
                      </div>
                      <div>
                        <label htmlFor="foto" className="block font-medium">
                          Foto{" "}
                          {errors.photo && (
                            <span className="text-red-500">
                              {errors.photo.message}
                            </span>
                          )}
                        </label>
                        {modalMode === "view" ? (
                          <a
                            href={viewData.photo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 w-full px-4 py-2 block"
                          >
                            Buka Foto
                          </a>
                        ) : (
                          <div>
                            <input
                              type="file"
                              id="foto"
                              name="foto"
                              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                              {...register("photo", {
                                required: "*",
                              })}
                              accept=".jpg, .jpeg, .png"
                            />
                            <a
                              href={viewData.photo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-bgBlack w-full px-4 py-2 block"
                            >
                              {viewData.photo}
                            </a>
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="kmAkhir" className="block font-medium">
                          Km Akhir{" "}
                          {errors.km_akhir && (
                            <span className="text-red-500">
                              {errors.km_akhir.message}
                            </span>
                          )}
                        </label>
                        {modalMode === "view" ? (
                          <input
                            type="text"
                            id="kmAkhir"
                            name="kmAkhir"
                            value={viewData.km_akhir}
                            readOnly
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                          />
                        ) : (
                          <input
                            type="text"
                            id="kmAkhir"
                            name="kmAkhir"
                            defaultValue={viewData.km_akhir}
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                            {...register("km_akhir", {
                              required: "*",
                            })}
                          />
                        )}
                      </div>
                      <div>
                        <label htmlFor="dokumen" className="block font-medium">
                          Dokumen{" "}
                          {errors.file && (
                            <span className="text-red-500">
                              {errors.file.message}
                            </span>
                          )}
                        </label>
                        {modalMode === "view" ? (
                          <a
                            href={viewData.document}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-red-500 w-full px-4 py-2 block"
                          >
                            Buka Document
                          </a>
                        ) : (
                          <div>
                            <input
                              type="file"
                              id="dokumen"
                              name="dokumen"
                              {...register("file", {
                                required: "*",
                              })}
                              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                              accept=".pdf, .docx, .pptx, .xlsx"
                            />
                            <a
                              href={viewData.document}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-bgBlack w-full px-4 py-2 block"
                            >
                              {viewData.document}
                            </a>
                          </div>
                        )}
                      </div>
                      <div>
                        <label htmlFor="status" className="block font-medium">
                          Status{" "}
                          {errors.status && (
                            <span className="text-red-500">
                              {errors.status.message}
                            </span>
                          )}
                        </label>
                        {modalMode === "view" ? (
                          <input
                            type="text"
                            id="status"
                            name="status"
                            value={viewData.status}
                            readOnly
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                          />
                        ) : (
                          <select
                            id="status"
                            name="status"
                            defaultValue={viewData.status}
                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                            {...register("status", {
                              required: "*",
                            })}
                          >
                            <option value="0">0</option>
                            <option value="1">1</option>
                          </select>
                        )}
                      </div>
                      {modalMode === "edit" ? (
                        <input
                          type="text"
                          value={viewData.id}
                          {...register("id", {})}
                          className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 hidden"
                        />
                      ) : null}

                      {/* .tambahkan lagi kalo ada form tambahan dsini */}
                    </div>
                    <DialogActions>
                      <div>
                        <button
                          onClick={(event) => {
                            if (modalMode === "view") {
                              event.preventDefault();
                            }
                            closeModal();
                          }}
                          className="bg-bgRed text-white w-24 rounded-md mr-1"
                        >
                          Tutup
                        </button>
                        {modalMode !== "view" && (
                          <button
                            type="submit"
                            className="bg-bgGreen border-2 border-slate-600 rounded-md w-24"
                          >
                            Simpan
                          </button>
                        )}
                      </div>
                    </DialogActions>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {/* End Modal CRUD*/}
          </div>
        </div>
      )}
    </div>
  );
}
