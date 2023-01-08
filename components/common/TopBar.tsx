import React from "react";
import styles from "../../styles/topbar.module.css";
import { FiSearch } from "react-icons/fi";
import { MdAdd } from "react-icons/md";

interface props {
  handleOpen: () => void;
}
const TopBar: React.FC<props> = ({ handleOpen }) => {
  return (
    <>
      <div className={styles.topbar}>
        <div className={styles.searchbar}>
          <FiSearch style={{ color: "#717171" }} />
          <input placeholder="Search your expenses" />
        </div>
        <div>
          <button className={styles.addButton} onClick={() => handleOpen()}>
            <span>
              <MdAdd
                style={{ paddingTop: 4, paddingRight: 5, fontSize: "1.4rem" }}
              />
            </span>
            Add Expense
          </button>
        </div>
      </div>
    </>
  );
};

export default TopBar;
