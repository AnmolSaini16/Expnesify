import React, { useEffect, useState } from "react";
import TopBar from "./common/TopBar";
import styles from "../styles/Home.module.css";
import AddExpensePopup from "./dashboard/AddExpensePopup";
import { setDoc, doc, collection, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useSession } from "next-auth/react";
import ExpensesContainer from "./dashboard/ExpensesContainer";
import { Grid } from "@mui/material";
import FirstTimePopup from "./dashboard/FirstTimePopup";
import AccountsContainer from "./dashboard/AccountsContainer";
import ChartContainer from "./dashboard/ChartContainer";
import EditAccount from "./dashboard/EditAccount";

const HomePageContainer: React.FC = () => {
  const { data: session } = useSession();
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [firstTimeSignedIn, setFirstTimeSignedIn] = useState<boolean>(false);
  const [openEditContainer, handleOpenEditContainer] = useState<boolean>(false);

  const handleOpen = () => {
    setOpenPopup(true);
  };

  const handleClose = () => {
    setOpenPopup(false);
  };
  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", session?.user?.email!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFirstTimeSignedIn(docSnap.data().isFirstTime);
      } else {
        setFirstTimeSignedIn(true);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const body = document.querySelector("body");
    body!.style.overflow = openPopup ? "hidden" : "auto";
  }, [openPopup]);

  return (
    <div className={styles.homePage}>
      <TopBar handleOpen={handleOpen} />
      <Grid container spacing={2} style={{ marginTop: 4 }}>
        <Grid item xs={12}>
          <AccountsContainer
            handleOpenEditContainer={handleOpenEditContainer}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ExpensesContainer title="Latest Expenses" orderByValue="dateTime" />
        </Grid>
        <Grid item xs={12} md={6}>
          <ExpensesContainer title="Top Expenses" orderByValue="amount" />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartContainer pieChart={true} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ChartContainer pieChart={false} />
        </Grid>
      </Grid>

      {openPopup && <AddExpensePopup handleClose={handleClose} />}
      {firstTimeSignedIn && (
        <FirstTimePopup setFirstTimeSignedIn={setFirstTimeSignedIn} />
      )}
      {openEditContainer && (
        <EditAccount handleOpenEditContainer={handleOpenEditContainer} />
      )}
    </div>
  );
};

export default HomePageContainer;
