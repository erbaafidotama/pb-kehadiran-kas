import { useEffect, useState } from "react";

import { FaPeopleGroup } from "react-icons/fa6";
import { TbReportMoney } from "react-icons/tb";
import { FaMoneyBillTransfer } from "react-icons/fa6";

import { createClient } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

function Member() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [suksesSimpan, setSuksesSimpan] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    getMembers();
  }, []);

  useEffect(() => {
    if (suksesSimpan) {
      getMembers();
      setSuksesSimpan(false);
    }
  }, [suksesSimpan]);

  async function getMembers() {
    const { data } = await supabase.from("tbl_member").select();
    setMembers(data);
  }

  function handleOpenModalMember() {
    setShowModal(true);
  }

  async function handleTambahMember(dataMember) {
    const uuid = uuidv4();
    const { data, error } = await supabase
      .from("tbl_member")
      .insert([
        { member_uuid: uuid, nama: dataMember.nama, alamat: dataMember.alamat },
      ])
      .select();

    if (error === null) {
      toast("Data Member Tersimpan");
      setShowModal(false);
      reset({ nama: "", alamat: "" });
      setSuksesSimpan(true);
    }
  }
  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} closeOnClick />
      <h1 className="text-lg">Member</h1>

      <div className="flex justify-between">
        <button
          onClick={handleOpenModalMember}
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
          Kemabli
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
                Alamat
              </th>
            </tr>
          </thead>
          <tbody>
            {members.length > 0 &&
              members.map((member) => {
                return (
                  <tr
                    key={member.member_uuid}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {member.nama}
                    </th>
                    <td className="px-6 py-4">{member.alamat}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

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
                  onClick={() => setShowModal(false)}
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
                      htmlFor="nama"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Nama
                    </label>
                    <input
                      name="nama"
                      id="nama"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Masukkan Nama"
                      required
                      {...register("nama")}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="alamat"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Alamat
                    </label>
                    <input
                      name="alamat"
                      id="alamat"
                      placeholder="Masukkan ALamat"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      required
                      {...register("alamat")}
                    />
                  </div>
                  <button
                    onClick={handleSubmit(handleTambahMember)}
                    type="submit"
                    className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Tambah
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Member;
