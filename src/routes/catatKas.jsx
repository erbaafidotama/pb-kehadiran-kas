import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import { useForm } from "react-hook-form";
import { jenisKasKeluar, jenisKasMasuk, tipeKas } from "../utils/lookup";
import { FaRupiahSign } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import { getToday } from "../utils/date";
import { ToastContainer, toast } from "react-toastify";

function CatatKas() {
  const navigate = useNavigate();
  const [listCatatKas, setListCatatKas] = useState([]);
  const [nominalBalance, setNominalBalance] = useState(0);
  const [showModalCatatKas, setShowModalCatatKas] = useState(false);
  const [valueTipeKas, setValueTipeKas] = useState("");

  const { register, handleSubmit, reset, getValues, setValue } = useForm();
  console.log("valueTipekas", valueTipeKas);
  useEffect(() => {
    getListCatatKas();
  }, []);

  async function getListCatatKas() {
    const { data } = await supabase.from("tbl_catat_kas").select();
    setListCatatKas(data);

    const dataTipeMasuk = data.filter((x) => x.tipe_kas_id === 1);
    const dataTipeKeluar = data.filter((x) => x.tipe_kas_id === 2);

    let totalNominalMasuk = 0;
    for (let index = 0; index < dataTipeMasuk.length; index++) {
      totalNominalMasuk = totalNominalMasuk + dataTipeMasuk[index].nominal;
    }

    let totalNominalKeluar = 0;
    for (let index = 0; index < dataTipeKeluar.length; index++) {
      totalNominalKeluar = totalNominalKeluar + dataTipeKeluar[index].nominal;
    }

    const balance = Number(totalNominalMasuk) - Number(totalNominalKeluar);
    setNominalBalance(balance);
  }

  function handleOpenModalCatatKas() {
    setShowModalCatatKas(true);
  }

  async function handleSimpanCatatKas(dataForm) {
    console.log("dataForm simpan", dataForm);
    const uuid = uuidv4();
    const { error } = await supabase.from("tbl_catat_kas").insert([
      {
        catat_kas_uuid: uuid,
        tipe_kas_id: dataForm.tipe_kas_id,
        jenis_kas_id: dataForm.jenis_kas_id,
        nominal: dataForm.nominal,
        tanggal_transaksi: getToday,
      },
    ]);

    if (error === null) {
      toast("Data Kehadiran Tersimpan");
      setShowModalCatatKas(false);
      reset({
        tipe_kas_id: "",
        jenis_kas_id: "",
        patungan_lapangan: "",
        nominal: "",
      });
      // setSuksesSimpan(true);
      // setDataGetOne({});
      getListCatatKas();
    }
  }

  function generateTipeKas(kas) {
    if (kas.tipe_kas_id === 1) {
      if (kas.jenis_kas_id === 1) {
        return "Patungan";
      } else if (kas.jenis_kas_id === 2) {
        return "Kas Bulanan";
      }
    } else if (kas.tipe_kas_id === 2) {
      if (kas.jenis_kas_id === 1) {
        return "Bayar Lapangan";
      } else if (kas.jenis_kas_id === 2) {
        return "Beli Kok";
      } else if (kas.jenis_kas_id === 3) {
        return "Mas Nur - Gak Main";
      }
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} closeOnClick />
      <h1 className="text-lg">Catat Kas</h1>
      <div className="flex justify-between">
        <button
          onClick={handleOpenModalCatatKas}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Tambah
        </button>
        <button
          onClick={() => navigate("/")}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Kembali
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tanggal Transaksi
              </th>
              <th scope="col" className="px-6 py-3">
                Tipe Kas
              </th>
              <th scope="col" className="px-6 py-3">
                Jenis Kas
              </th>
              <th scope="col" className="px-6 py-3">
                Nominal
              </th>
            </tr>
          </thead>
          <tbody>
            {listCatatKas.length > 0 &&
              listCatatKas.map((kas) => {
                return (
                  <tr
                    key={kas.catat_kas_uuid}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {kas.tanggal_transaksi}
                    </th>
                    <td
                      className={
                        kas.tipe_kas_id === 1
                          ? "px-6 py-4 text-green-600"
                          : "px-6 py-4 text-red-600"
                      }
                    >
                      {kas.tipe_kas_id === 1 ? "Masuk" : "Keluar"}
                    </td>
                    <td className="px-6 py-4">{generateTipeKas(kas)}</td>
                    <td
                      className={
                        kas.tipe_kas_id === 1
                          ? "px-6 py-4 text-green-600"
                          : "px-6 py-4 text-red-600"
                      }
                    >
                      {kas.nominal}
                    </td>
                  </tr>
                );
              })}
            <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              ></th>
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-gray-900 font-medium">Balance</td>
              <td className="px-6 py-4">{nominalBalance}</td>
            </tr>
          </tbody>
        </table>

        {showModalCatatKas && (
          <div
            id="authentication-modal"
            // tabIndex="-1"
            aria-hidden="true"
            className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
          >
            <div className="relative p-4 w-full max-w-md max-h-full">
              {/* <!-- Modal content --> */}
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                {/* <!-- Modal header --> */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Catat Kas
                  </h3>
                  <button
                    onClick={() => {
                      setShowModalCatatKas(false);
                      reset();
                      setValueTipeKas("");
                      // setDataGetOne({});
                    }}
                    type="button"
                    className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-hide="authentication-modal"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                {/* <!-- Modal body --> */}
                <div className="p-4 md:p-5">
                  <form className="space-y-4" action="#">
                    <div>
                      <label
                        htmlFor="member"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Pilih Tipe Kas
                      </label>
                      <select
                        {...register("tipe_kas_id")}
                        id="member"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        // disabled={Object.keys(dataGetOne).length > 0}
                        onChange={(event) => {
                          setValueTipeKas(event.target.value);
                        }}
                      >
                        <option>Tipe Kas</option>
                        {tipeKas.map((kas) => {
                          return (
                            <option key={kas.value} value={kas.value}>
                              {kas.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {valueTipeKas === "1" && (
                      <div>
                        <label
                          htmlFor="member"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Pilih Jenis Kas Masuk
                        </label>
                        <select
                          {...register("jenis_kas_id")}
                          id="member"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          // disabled={Object.keys(dataGetOne).length > 0}
                        >
                          <option selected>Tipe Kas Masuk</option>
                          {jenisKasMasuk.map((kas) => {
                            return (
                              <option key={kas.value} value={kas.value}>
                                {kas.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}

                    {valueTipeKas === "2" && (
                      <div>
                        <label
                          htmlFor="member"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Pilih Jenis Kas Keluar
                        </label>
                        <select
                          {...register("jenis_kas_id")}
                          id="member"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          // disabled={Object.keys(dataGetOne).length > 0}
                        >
                          <option selected>Tipe Kas Keluar</option>
                          {jenisKasKeluar.map((kas) => {
                            return (
                              <option key={kas.value} value={kas.value}>
                                {kas.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}

                    <div>
                      <label
                        htmlFor="nominal"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nominal
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                          <FaRupiahSign />
                        </span>
                        <input
                          type="text"
                          id="nominal"
                          className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Masukkan Nominal Kas"
                          {...register("nominal")}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSubmit(handleSimpanCatatKas)}
                      type="button"
                      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Simpan
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CatatKas;
