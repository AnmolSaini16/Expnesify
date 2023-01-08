import {
  Box,
  Grid,
  LinearProgress,
  linearProgressClasses,
  styled,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../../styles/popup.module.css";
import { StyledTextField } from "../utils/TextField";
import { FirstTimePopup } from "../../interfaces";
import { useSession } from "next-auth/react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { ClipLoader } from "react-spinners";

interface props {
  setFirstTimeSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialValues = {
  account1: "",
  account2: "",
  account1Balance: 0,
  account2Balance: 0,
  cash: 0,
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#FD5E74",
  },
}));

const FirstTimePopup: React.FC<props> = ({ setFirstTimeSignedIn }) => {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<number>(0);
  const [step, setStep] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>();
  const [formValues, setFormValues] = useState<FirstTimePopup>({
    ...initialValues,
  });

  const docRef = doc(db, "users", session?.user?.email!);
  const colRef = collection(docRef, "accountsBalances");

  const handleFormChange = (key: string, value: any) => {
    const updatedFormValues = { ...formValues, [key]: value };
    if (key === "account1Balance") {
      updatedFormValues.account1Balance = parseInt(value, 10);
    }
    if (key === "account2Balace") {
      updatedFormValues.account2Balance = parseInt(value, 10);
    }
    if (key === "cash") {
      updatedFormValues.cash = parseInt(value, 10);
    }
    setFormValues(updatedFormValues);
  };

  const handleSetProgress = async () => {
    if (progress < 100) {
      setProgress(progress + 50);
      setStep(step + 1);
      return;
    }
    try {
      setLoading(true);
      await setDoc(doc(db, "users", session?.user?.email!), {
        ...formValues,
        account2Balace: !formValues.account2Balance
          ? 0
          : formValues.account2Balance,
        cash: !formValues.cash ? 0 : formValues.cash,
        email: session?.user?.email,
        isFirstTime: false,
        totalBalance:
          Number(formValues.account1Balance) +
          Number(formValues.account2Balance) +
          Number(formValues.cash),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setFirstTimeSignedIn(false);
    }
  };

  const formValidate = () => {
    let hasNoError = true;
    if (step === 0) {
      if (!formValues.account1) hasNoError = false;
    }
    if (step === 1) {
      if (formValues.account1 && !formValues.account1Balance)
        hasNoError = false;
      if (formValues.account2 && !formValues.account2Balance)
        hasNoError = false;
    }
    return hasNoError;
  };

  useEffect(() => {
    if (formValidate()) setDisabled(false);
    else setDisabled(true);
  });

  const renderInnerComponent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <Grid item xs={12}>
              <Box style={{ fontWeight: "bold" }} mt={2}>
                Add your Accounts
              </Box>
            </Grid>
            <Grid item xs={6}>
              <StyledTextField
                fullWidth
                label="Account 1"
                variant="outlined"
                value={formValues.account1}
                inputProps={{
                  style: { color: "whitesmoke", borderColor: "whitesmoke" },
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleFormChange("account1", event.target.value);
                }}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <StyledTextField
                fullWidth
                label="Account 2"
                variant="outlined"
                value={formValues.account2}
                inputProps={{
                  style: { color: "whitesmoke", borderColor: "whitesmoke" },
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleFormChange("account2", event.target.value);
                }}
              />
            </Grid>
          </>
        );

      case 1:
        return (
          <>
            <Grid item xs={12}>
              <Box style={{ fontWeight: "bold" }} mt={2}>
                Add Balances for your Accounts
              </Box>
            </Grid>
            <Grid item xs={6}>
              <StyledTextField
                fullWidth
                label="Account 1 Balance"
                variant="outlined"
                value={formValues.account1Balance}
                inputProps={{
                  style: { color: "whitesmoke", borderColor: "whitesmoke" },
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleFormChange("account1Balance", event.target.value);
                }}
                type="number"
                required
              />
            </Grid>
            {formValues.account2 && (
              <Grid item xs={6}>
                <StyledTextField
                  fullWidth
                  label="Account 2 Balance"
                  variant="outlined"
                  value={formValues.account2Balance}
                  inputProps={{
                    style: { color: "whitesmoke", borderColor: "whitesmoke" },
                  }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleFormChange("account2Balance", event.target.value);
                  }}
                  type="number"
                  {...(formValues.account2 && { required: true })}
                />
              </Grid>
            )}
            <Grid item xs={6}>
              <StyledTextField
                fullWidth
                label="Cash"
                variant="outlined"
                value={formValues.cash}
                inputProps={{
                  style: { color: "whitesmoke", borderColor: "whitesmoke" },
                }}
                type="number"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleFormChange("cash", event.target.value);
                }}
              />
            </Grid>
          </>
        );

      case 2:
        return (
          <Grid item xs={12}>
            <Box>
              <Typography variant="h4" style={{ fontWeight: "bold" }}>
                Woohoo 🎉....You are all Set
              </Typography>
            </Box>
          </Grid>
        );
    }
  };
  return (
    <>
      <div className={styles.popupContainerBG} />
      <div className={styles.centered}>
        <div className={styles.popUp}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h2 style={{ color: "#FD5E74" }}>Welcome to epensify 🥳</h2>
            </Grid>

            <Grid item container spacing={3} xs={12}>
              {renderInnerComponent()}
            </Grid>

            <Grid item xs={12} style={{ marginTop: 40, marginBottom: 30 }}>
              <Box sx={{ width: "100%" }}>
                <BorderLinearProgress variant="determinate" value={progress} />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <button
                className={styles.addExpenseButton}
                onClick={handleSetProgress}
                disabled={disabled || loading}
              >
                {loading && (
                  <ClipLoader
                    size={15}
                    color={"#FD5E74"}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                )}
                {progress === 100 && !loading && "Let's Start Expensifying"}
                {progress < 100 && !loading && "Next"}
              </button>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default FirstTimePopup;
