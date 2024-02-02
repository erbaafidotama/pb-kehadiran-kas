import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";

function CatatKas() {
  const navigate = useNavigate();
  const [listCatatKas, setListCatatKas] = useState([]);
  const [nominalBalance, setNominalBalance] = useState(0);

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

  return (
    <>
      <h1 className="text-lg">Catat Kas</h1>
      <div className="flex justify-between">
        <button
          //   onClick={handleOpenModalMember}
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
                    <td className="px-6 py-4">
                      {kas.jenis_kas_id === 1 ? "Kehadiran" : "Lapangan"}
                    </td>
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
      </div>
    </>
  );
}

export default CatatKas;
