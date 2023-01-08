import { signIn } from "next-auth/react";
import React from "react";

const login = () => {
  return (
    <div>
      <button
        onClick={() =>
          signIn("google", { callbackUrl: window.location.origin })
        }
      >
        {" "}
        Sign in with google
      </button>
    </div>
  );
};

export default login;
