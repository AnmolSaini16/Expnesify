import { Box, Grid, Typography } from "@mui/material";
import { collection, doc, DocumentData, onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import {
  AccountContextType,
  AccountsContext,
} from "../../context/AccountContext";
import { db } from "../../firebaseConfig";
import { AccountsData } from "../../interfaces/AddEditDelete";
import styles from "../../styles/accountContainer.module.css";
import EditIcon from "@mui/icons-material/Edit";

interface props {
  handleOpenEditContainer: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccountsContainer: React.FC<props> = ({ handleOpenEditContainer }) => {
  const { data: session } = useSession();
  const [data, setData] = useState<AccountsData | DocumentData>();
  const [loading, setLoading] = useState<boolean>(true);
  const { setAccountData } = useContext(AccountsContext) as AccountContextType;

  const docRef = doc(db, "users", session?.user?.email!);
  // const colRef = collection(docRef, "accountsBalances");

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(docRef, (snapshot) => {
      const snapShotData = snapshot.data();
      setData(snapShotData);
      setLoading(false);
      setAccountData(snapShotData!);
    });

    return () => {
      unsub();
    };
  }, []);

  const accounts = [
    { account: data?.account1, balance: data?.account1Balance },
    { account: data?.account2, balance: data?.account2Balance },
    { account: "Cash", balance: data?.cash },
    { account: "Total Balance", balance: data?.totalBalance },
  ];

  return (
    <div
      style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
    >
      {accounts
        .filter((item) => item.account)
        .map((item, index) => (
          <Box
            borderRadius={4}
            p={1.5}
            m={2}
            className={styles.accountContainer}
            key={`${index}-${item.account}`}
          >
            <Grid container spacing={2}>
              <Grid item md={10} xs={9}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    color={"#FD5E74"}
                    style={{ fontWeight: "bold" }}
                  >
                    {item.account || "- -"}
                  </Typography>
                </Box>
              </Grid>
              {item.account && item.account !== "Total Balance" && (
                <Grid item md={2} xs={3}>
                  <Box
                    className={styles.editIcon}
                    onClick={() => handleOpenEditContainer(true)}
                  >
                    <EditIcon fontSize="small" />
                  </Box>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box>
                  <Typography
                    variant="h6"
                    color={"whitesmoke"}
                    style={{ fontWeight: "500" }}
                  >
                    ₹
                    {item?.balance > 0
                      ? Number(item.balance)?.toLocaleString()
                      : 0 || 0}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
    </div>
  );
};

export default AccountsContainer;
