import "./App.css";
import { useNavigate } from "react-router-dom";

import { FaPeopleGroup } from "react-icons/fa6";
import { TbReportMoney } from "react-icons/tb";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { MdEmojiPeople } from "react-icons/md";

function App() {
  const navigate = useNavigate();

  function handleToMember() {
    navigate("/member");
  }

  function handleToKehadiran() {
    navigate("/kehadiran");
  }

  return (
    <>
      <div className="md:grid md:grid-cols-4 md:gap-5">
        <button
          onClick={handleToMember}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          <FaPeopleGroup style={{ fontSize: 100 }} />
          <div>Member</div>
        </button>

        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          <FaMoneyBillTransfer style={{ fontSize: 100 }} />
          <div>Catat Kas</div>
        </button>

        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          <TbReportMoney style={{ fontSize: 100 }} />
          <div>Rangkuman Kas</div>
        </button>

        <button
          onClick={handleToKehadiran}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          <MdEmojiPeople style={{ fontSize: 100 }} />
          <div>Kehadiran</div>
        </button>
      </div>
    </>
  );
}

export default App;
