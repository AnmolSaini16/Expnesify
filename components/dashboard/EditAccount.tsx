import { Grid } from "@mui/material";
import { doc, DocumentData, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useContext, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import { useToasts } from "react-toast-notifications";
import {
  AccountContextType,
  AccountsContext,
} from "../../context/AccountContext";
import { db } from "../../firebaseConfig";
import { AccountsData } from "../../interfaces";
import styles from "../../styles/popup.module.css";
import { StyledTextField } from "../utils/TextField";

interface props {
  handleOpenEditContainer: React.Dispatch<React.SetStateAction<boolean>>;
}

const EditAccount: React.FC<props> = ({ handleOpenEditContainer }) => {
  const { data: session } = useSession();
  const { addToast } = useToasts();
  const [disabled, setDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>();
  const { accountData } = useContext(AccountsContext) as AccountContextType;
  const initialValues = { ...accountData };
  const [formValues, setFormValues] = useState<AccountsData | DocumentData>(
    accountData!
  );
  const docRef = doc(db, "users", session?.user?.email!);

  const handleFormChange = (key: string, value: any) => {
    const updatedFormValues = { ...formValues, [key]: value };
    setFormValues(updatedFormValues);
  };

  const formValidate = () => {
    if (JSON.stringify(initialValues) === JSON.stringify(formValues))
      return false;

    return true;
  };

  useEffect(() => {
    if (formValidate()) setDisabled(false);
    else setDisabled(true);
  });

  const handleEdit = async () => {
    try {
      setLoading(true);
      await updateDoc(docRef, {
        ...formValues,
        totalBalance:
          Number(formValues.account1Balance) +
          Number(formValues.account2Balance) +
          Number(formValues.cash),
      });
      addToast("Edit Saved Successfully", {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      handleOpenEditContainer(false);
    }
  };

  return (
    <>
      <div
        className={styles.popupContainerBG}
        onClick={() => handleOpenEditContainer(false)}
      />
      <div className={styles.centered}>
        <div className={styles.popUp}>
          <div
            className={styles.popupClose}
            onClick={() => handleOpenEditContainer(false)}
          >
            <MdClose />
          </div>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h3>Edit Accounts</h3>
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
              />
            </Grid>
            {formValues.account2 && (
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
            )}
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
            <Grid item xs={12}>
              <button
                className={styles.addExpenseButton}
                onClick={handleEdit}
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
                {!loading && "Save Changes"}
              </button>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default EditAccount;
