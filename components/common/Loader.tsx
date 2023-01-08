import React from "react";
import { SyncLoader } from "react-spinners";

const Loader = () => {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      <SyncLoader
        size={18}
        color={"#FD5E74"}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
