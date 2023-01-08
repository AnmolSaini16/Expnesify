import { Box, Grid } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import styles from "../../styles/sidebar.module.css";
import { MdDashboard } from "react-icons/md";
import { HiCash } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  {
    name: "Dashboard",
    link: "/",
    icon: (
      <MdDashboard
        style={{ paddingTop: 0, marginRight: 8, fontSize: "1.2rem" }}
      />
    ),
  },
  {
    name: "Expenses",
    link: "/expenses",
    icon: (
      <HiCash style={{ paddingTop: 2, marginRight: 8, fontSize: "1.2rem" }} />
    ),
  },
];

const SideBar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <div className={styles.sidebar}>
      <Grid container justifyContent={"center"}>
        <Grid item xs={12} style={{ marginTop: 80 }}>
          <img className={styles.userIMG} src={session?.user?.image!} alt="" />
          <p style={{ margin: 10, fontWeight: "bold" }}>
            Hello, {session?.user?.name}.
          </p>
        </Grid>
        <Grid item xs={6} style={{ marginBottom: 20, marginTop: 10 }}>
          <hr />
        </Grid>

        <Grid item xs={12}>
          <button className={styles.logoutBTN} onClick={() => signOut()}>
            Sign out
          </button>
        </Grid>

        <Grid item xs={6} style={{ marginTop: 50 }}>
          {navItems.map((item) => (
            <Link
              href={item.link}
              className={`${styles.sidebarLinks} ${
                router.pathname === item.link ? styles.activesidebarLink : ""
              }`}
              key={item.name}
            >
              <Box mb={2}>
                <Grid container justifyItems={"center"}>
                  <Grid item>{item.icon}</Grid>
                  <Grid item xs={6}>
                    {item.name}
                  </Grid>
                </Grid>
              </Box>
            </Link>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default SideBar;
