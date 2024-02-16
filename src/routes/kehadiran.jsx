import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";

import { FaRupiahSign } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import supabase from "../utils/supabase";
import { getToday } from "../utils/date";

function Kehadiran() {
  const navigate = useNavigate();
  const [listKehadiran, setListKehadiran] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [suksesSimpan, setSuksesSimpan] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalSubmit, setShowModalSubmit] = useState(false);
  const [totalBayar, setTotalBayar] = useState(0);
  const [totalKalkulasi, setTotalKalkulasi] = useState(0);
  const [dataGetOne, setDataGetOne] = useState({});
  const { register, handleSubmit, reset, getValues, setValue } = useForm();

  useEffect(() => {
    getListKehadiran();
    getMembers();
    setValue("tanggal_filter", getToday);
  }, []);

  function handleKalkulasi(dataForm) {
    if (
      dataForm.member_id &&
      dataForm.jumlah_kok &&
      dataForm.patungan_lapangan
    ) {
      const totalBayar =
        Number(dataForm.jumlah_kok) * 3000 + Number(dataForm.patungan_lapangan);
      setValue("hasil_kalkulasi", totalBayar);
    }
  }

  useEffect(() => {
    if (suksesSimpan) {
      getListKehadiran();
      setSuksesSimpan(false);
    }
  }, [suksesSimpan]);

  async function getListKehadiran() {
    const { data } = await supabase
      .from("tbl_kehadiran")
      .select(`*, member:tbl_member(id, nama)`)
      .eq("tanggal_main", getToday);
    setListKehadiran(data);

    let totalMasuk = 0;
    for (let index = 0; index < data.length; index++) {
      totalMasuk = totalMasuk + data[index].total_bayar;
    }
    setTotalBayar(totalMasuk);
  }
  console.log("totalBayar", totalBayar);
  async function getMembers() {
    const { data } = await supabase.from("tbl_member").select();
    setMembers(data);
  }

  function handleOpenModalKehadiran() {
    setShowModal(true);
  }

  async function handleSimpanKehadiran(dataForm) {
    if (Object.keys(dataGetOne).length > 0) {
      const { error } = await supabase
        .from("tbl_kehadiran")
        .update({
          jumlah_kok: dataForm.jumlah_kok,
          patungan_lapangan: dataForm.patungan_lapangan,
          total_bayar: dataForm.total_bayar || 0,
          hasil_kalkulasi: dataForm.hasil_kalkulasi,
        })
        .eq("kehadiran_uuid", dataGetOne.kehadiran_uuid)
        .select();
      if (error === null) {
        toast("Data Kehadiran Terupdate");
        setShowModal(false);
        reset({
          member_id: "",
          jumlah_kok: "",
          patungan_lapangan: "",
          total_bayar: "",
          hasil_kalkulasi: "",
        });
        setSuksesSimpan(true);
        setDataGetOne({});
      }
    } else {
      const uuid = uuidv4();
      const { error } = await supabase.from("tbl_kehadiran").insert([
        {
          kehadiran_uuid: uuid,
          member_id: dataForm.member_id,
          jumlah_kok: dataForm.jumlah_kok,
          patungan_lapangan: dataForm.patungan_lapangan,
          total_bayar: dataForm.total_bayar || 0,
          hasil_kalkulasi: dataForm.hasil_kalkulasi,
          tanggal_main: getToday,
        },
      ]);

      if (error === null) {
        toast("Data Kehadiran Tersimpan");
        setShowModal(false);
        reset({
          member_id: "",
          jumlah_kok: "",
          patungan_lapangan: "",
          total_bayar: "",
          hasil_kalkulasi: "",
        });
        setSuksesSimpan(true);
        setDataGetOne({});
      }
    }
  }

  async function handleSearch() {
    const tanggalFilter = getValues("tanggal_filter");
    const { data } = await supabase
      .from("tbl_kehadiran")
      .select(`*, member:tbl_member(id, nama)`)
      .eq("tanggal_main", tanggalFilter);
    setListKehadiran(data);

    let totalMasuk = 0;
    for (let index = 0; index < data.length; index++) {
      totalMasuk = totalMasuk + data[index].total_bayar;
    }
    setTotalBayar(totalMasuk);

    let hasilKalkulasi = 0;
    for (let index = 0; index < data.length; index++) {
      hasilKalkulasi = hasilKalkulasi + data[index].hasil_kalkulasi;
    }
    setTotalKalkulasi(hasilKalkulasi);
  }

  async function handleGetOneKehadiran(dataRow) {
    const { data } = await supabase
      .from("tbl_kehadiran")
      .select(`*, member:tbl_member(id, nama)`)
      .eq("kehadiran_uuid", dataRow.kehadiran_uuid);

    if (data.length > 0) {
      setShowModal(true);
      setDataGetOne(data[0]);
      setValue("member_id", data[0].member.id);
      setValue("jumlah_kok", data[0].jumlah_kok);
      setValue("patungan_lapangan", data[0].patungan_lapangan);
      setValue("hasil_kalkulasi", data[0].hasil_kalkulasi);
      setValue("total_bayar", data[0].total_bayar);
    }
  }

  function handleOpenModalDelete() {
    setShowModalDelete(true);
  }

  async function handleDeleteDataKehadiran() {
    const { error } = await supabase
      .from("tbl_kehadiran")
      .delete()
      .eq("kehadiran_uuid", dataGetOne.kehadiran_uuid);

    if (error === null) {
      toast("Data Kehadiran Berhasil Dihapus");
      setShowModal(false);
      reset({
        member_id: "",
        jumlah_kok: "",
        patungan_lapangan: "",
        total_bayar: "",
        hasil_kalkulasi: "",
      });
      setShowModalDelete(false);
      setDataGetOne({});
      getListKehadiran();
    }
  }

  async function handleSubmitToCataKas() {
    const uuid = uuidv4();
    const { error } = await supabase.from("tbl_catat_kas").insert([
      {
        catat_kas_uuid: uuid,
        tipe_kas_id: 1,
        jenis_kas_id: 1,
        nominal: totalBayar,
        tanggal_transaksi: getToday,
      },
    ]);

    if (error === null) {
      toast("Data Kas Berhasil Disubmit");
      setShowModalSubmit(false);
    } else {
      toast(error.message);
    }
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} closeOnClick />
      <h1 className="text-lg">Kehadiran</h1>
      <div className="flex mb-5">
        <input
          name="tanggal_filter"
          placeholder="YYYY-MM-DD"
          className="bg-gray-50 mr-3 h-10 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          required
          {...register("tanggal_filter")}
        />
        <button
          onClick={handleSearch}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Search
        </button>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleOpenModalKehadiran}
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
                Nama
              </th>
              <th scope="col" className="px-6 py-3">
                Jumlah Kok
              </th>
              <th scope="col" className="px-6 py-3">
                Total Harga Kok
              </th>
              <th scope="col" className="px-6 py-3">
                Patungan
              </th>
              <th scope="col" className="px-6 py-3">
                Kalkulasi
              </th>
              <th scope="col" className="px-6 py-3">
                Pembayaran
              </th>
            </tr>
          </thead>
          <tbody>
            {listKehadiran.length > 0 &&
              listKehadiran.map((kehadiran) => {
                return (
                  <tr
                    key={kehadiran.kehadiran_uuid}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    onClick={() => handleGetOneKehadiran(kehadiran)}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {kehadiran.member.nama}
                    </th>
                    <td className="px-6 py-4">{kehadiran.jumlah_kok}</td>
                    <td className="px-6 py-4">
                      {Number(kehadiran.jumlah_kok) * 3000}
                    </td>
                    <td className="px-6 py-4">{kehadiran.patungan_lapangan}</td>
                    <td className="px-6 py-4">{kehadiran.hasil_kalkulasi}</td>
                    <td
                      className={
                        kehadiran.total_bayar < kehadiran.hasil_kalkulasi
                          ? "px-6 py-4 text-red-500"
                          : "px-6 py-4 text-green-500"
                      }
                    >
                      {kehadiran.total_bayar}
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
              <td className="px-6 py-4"></td>
              <td className="px-6 py-4 text-gray-900 font-medium">Total</td>
              <td className="px-6 py-4">{totalKalkulasi}</td>
              <td
                className={
                  totalBayar < totalKalkulasi
                    ? "px-6 py-4 text-red-500"
                    : "px-6 py-4 text-green-500"
                }
              >
                {totalBayar}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        onClick={() => setShowModalSubmit(true)}
        type="button"
        className={
          Number(totalBayar) <= 0
            ? "mt-10 cursor-not-allowed w-full text-white bg-green-500  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            : "mt-10 w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        }
        disabled={Number(totalBayar) <= 0}
      >
        Submit
      </button>

      {/* MODAL */}
      {showModal && (
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
                  Sign in to our platform
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    reset();
                    setDataGetOne({});
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
                      Select an option
                    </label>
                    <select
                      {...register("member_id")}
                      id="member"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      disabled={Object.keys(dataGetOne).length > 0}
                    >
                      <option selected>Pilih Member</option>
                      {members.length > 0 &&
                        members.map((member) => {
                          return (
                            <option key={member.member_uuid} value={member.id}>
                              {member.nama}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="jumlah_kok"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Jumlah Kok
                    </label>
                    <input
                      name="jumlah_kok"
                      id="jumlah_kok"
                      placeholder="Masukkan Jumlah Kok"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      {...register("jumlah_kok")}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="patungan_lapangan"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Patungan Lapangan
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                        <FaRupiahSign />
                      </span>
                      <input
                        type="text"
                        id="patungan_lapangan"
                        className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Masukkan Patungan Lapangan"
                        {...register("patungan_lapangan")}
                      />
                    </div>
                    <button
                      onClick={handleOpenModalDelete}
                      type="button"
                      className="mt-3 mb-10 py-2.5 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-red-400 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Hapus
                    </button>
                    <button
                      onClick={handleSubmit(handleKalkulasi)}
                      type="button"
                      className="mt-3  py-2.5 px-5 me-2 text-sm font-medium text-gray-900 focus:outline-none bg-gray-200 rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Kalkulasi
                    </button>
                    <div>
                      <label
                        htmlFor="hasil_kalkulasi"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Hasil Kalkulasi
                      </label>
                      <input
                        name="kalkulasi"
                        id="hasil_kalkulasi"
                        placeholder="hasil_kalkulasi"
                        className="bg-gray-50 border mb-10 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        {...register("hasil_kalkulasi")}
                        disabled
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="total_bayar"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Pembayaran
                      </label>
                      <input
                        name="total_bayar"
                        id="jumlatotal_bayarh_kok"
                        placeholder="Pembayaran"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        required
                        {...register("total_bayar")}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit(handleSimpanKehadiran)}
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

      {/* Modal DELETE */}
      {showModalDelete && (
        <div
          id="popup-modal"
          className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                onClick={() => setShowModalDelete(false)}
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal"
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
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this Data?
                </h3>
                <button
                  onClick={handleDeleteDataKehadiran}
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={() => setShowModalDelete(false)}
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal SUBMIT TO CATAT KAS */}
      {showModalSubmit && (
        <div
          id="popup-modal"
          className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                onClick={() => setShowModalSubmit(false)}
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="popup-modal"
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
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Are you sure you want to Submit to Catat Kas for This Data?
                  Nominal {totalBayar}
                </h3>
                <button
                  onClick={handleSubmit(handleSubmitToCataKas)}
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={() => setShowModalSubmit(false)}
                  data-modal-hide="popup-modal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Kehadiran;
