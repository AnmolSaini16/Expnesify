import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import styles from "../../styles/layout.module.css";
import { Grid, Box } from "@mui/material";
import { GiHamburgerMenu } from "react-icons/gi";

interface props {
  children: any;
}

const Layout: React.FC<props> = ({ children }) => {
  const [toggleMenu, setToggleMenu] = useState<boolean>();
  const [screenWidth, setScreenWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const toggleNav = () => {
    setToggleMenu(!toggleMenu);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const changeWidth = () => {
        setScreenWidth(window.innerWidth);
      };
      window.addEventListener("resize", changeWidth);
      return () => {
        window.removeEventListener("resize", changeWidth);
      };
    }
  }, []);

  useEffect(() => {
    const body = document.querySelector("body");
    body!.style.overflow = toggleMenu ? "hidden" : "auto";
  }, [toggleMenu]);

  return (
    <Grid container className={styles.layoutContainer}>
      {screenWidth < 900 && (
        <Box className={styles.navToggle}>
          <GiHamburgerMenu onClick={toggleNav} style={{ width: "100%" }} />
        </Box>
      )}
      {(toggleMenu || screenWidth > 900) && (
        <Grid item xl={2.2} md={2.8} className={styles.sidebar}>
          <SideBar />
        </Grid>
      )}
      <Grid item xl={9.4} md={9.2} xs={12} style={{ height: "100vh" }}>
        {children}
      </Grid>
    </Grid>
  );
};

export default Layout;
