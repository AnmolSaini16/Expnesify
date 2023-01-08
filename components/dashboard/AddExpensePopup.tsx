import React, { useContext, useEffect, useState } from "react";
import styles from "../../styles/popup.module.css";
import { MdClose } from "react-icons/md";
import { Grid, TextFieldProps, Theme } from "@mui/material";
import { AddExpense } from "../../interfaces/AddEditDelete";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useSession } from "next-auth/react";
import { StyledTextField, StyledAutocomplete } from "../utils/TextField";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useToasts } from "react-toast-notifications";
import moment from "moment";
import ClipLoader from "react-spinners/ClipLoader";
import {
  AccountContextType,
  AccountsContext,
} from "../../context/AccountContext";
import { MUIStyledCommonProps } from "@mui/system";
import { categories, paymentTypeOptions } from "../utils/constants";

interface props {
  handleClose: () => void;
}

const initialValues = {
  amount: 0,
  account: "",
  category: "",
  dateTime: new Date(),
  note: "",
  paymentType: "",
};

const AddExpensePopup: React.FC<props> = ({ handleClose }) => {
  const { data: session } = useSession();
  const { addToast } = useToasts();
  const [disableButton, setDisableButton] = useState<boolean>(true);
  const [addLoading, setAddLoading] = useState<boolean>();
  const [formValues, setFormValues] = useState<AddExpense>({
    ...initialValues,
    dateTime: new Date(),
  });
  const { accountData } = useContext(AccountsContext) as AccountContextType;

  const docRef = doc(db, "users", session?.user?.email!);
  const colRef = collection(docRef, "expenses");

  const handleFormChange = (key: string, value: any) => {
    const updatedFormValues = { ...formValues, [key]: value };
    if (key === "amount") {
      updatedFormValues.amount = parseInt(value, 10);
    }
    setFormValues(updatedFormValues);
  };

  const formValidate = () => {
    if (
      !formValues.account ||
      !formValues.amount ||
      !formValues.category ||
      !formValues.dateTime ||
      !formValues.dateTime ||
      !formValues.paymentType
    ) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    if (formValidate()) setDisableButton(false);
    else setDisableButton(true);
  }, [formValues]);

  const handleAdd = async () => {
    const account1Balance =
      formValues.account === accountData?.account1
        ? accountData.account1Balance - formValues.amount
        : accountData?.account1Balance;
    const account2Balance =
      formValues.account === accountData?.account2
        ? accountData.account2Balance - formValues.amount
        : accountData?.account2Balance;
    const cash =
      formValues.account === "Cash"
        ? accountData?.cash - formValues.amount
        : accountData?.cash;
    try {
      setAddLoading(true);
      await addDoc(colRef, {
        ...formValues,
        dateTime: moment(formValues.dateTime).format("DD-MM-YYYY h:mm:ss"),
        totalBalance:
          Number(accountData?.totalBalance) - Number(formValues.amount),
      });
      await updateDoc(docRef, {
        account1Balance: account1Balance,
        account2Balance: account2Balance,
        cash: cash,
        totalBalance:
          Number(accountData?.totalBalance) - Number(formValues.amount),
      });
      addToast("Expense Added Successfully", {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (error) {
      console.log(error);
      addToast("Some error occurred", {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setAddLoading(false);
      handleClose();
    }
  };

  const accountOptions = [accountData?.account1, accountData?.account2, "Cash"];

  const color = "whitesmoke";
  return (
    <>
      <div className={styles.popupContainerBG} onClick={handleClose} />
      <div className={styles.centered}>
        <div className={styles.popUp}>
          <div className={styles.popupClose} onClick={handleClose}>
            <MdClose />
          </div>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h3>Add Expense</h3>
            </Grid>

            <Grid item md={4} xs={6}>
              <StyledTextField
                label="Amount ₹"
                fullWidth
                type="number"
                value={formValues.amount}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  handleFormChange("amount", event.target.value);
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={4} xs={6}>
              <StyledAutocomplete
                autoHighlight
                options={categories}
                renderInput={(
                  params: JSX.IntrinsicAttributes &
                    ((TextFieldProps & MUIStyledCommonProps<Theme>) & {})
                ) => (
                  <StyledTextField
                    {...params}
                    label="Category"
                    variant="outlined"
                    required
                  />
                )}
                onChange={(event: any, value: any) => {
                  handleFormChange("category", value);
                }}
                value={formValues.category}
              />
            </Grid>

            <Grid item md={4} xs={6}>
              <StyledAutocomplete
                autoHighlight
                options={accountOptions}
                renderInput={(
                  params: JSX.IntrinsicAttributes &
                    ((TextFieldProps & MUIStyledCommonProps<Theme>) & {})
                ) => (
                  <StyledTextField
                    {...params}
                    label="Account"
                    variant="outlined"
                    required
                  />
                )}
                onChange={(event: any, value: any) => {
                  handleFormChange("account", value);
                }}
                value={formValues.account}
              />
            </Grid>
            <Grid item md={4} xs={6}>
              <StyledAutocomplete
                autoHighlight
                options={paymentTypeOptions}
                renderInput={(
                  params: JSX.IntrinsicAttributes &
                    ((TextFieldProps & MUIStyledCommonProps<Theme>) & {})
                ) => (
                  <StyledTextField
                    {...params}
                    label="Payment Type"
                    variant="outlined"
                    required
                  />
                )}
                onChange={(event: any, value: any) => {
                  handleFormChange("paymentType", value);
                }}
                value={formValues.paymentType}
              />
            </Grid>
            <Grid item md={5} xs={12}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Date and Time *"
                  value={formValues.dateTime}
                  onChange={(value: any) => {
                    handleFormChange("dateTime", value);
                  }}
                  renderInput={(params: any) => (
                    <StyledTextField
                      fullWidth
                      {...params}
                      sx={{
                        svg: { color },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <StyledTextField
                fullWidth
                label="Note"
                variant="outlined"
                value={formValues.note}
                multiline
                onChange={(event) => {
                  handleFormChange("note", event.target.value);
                }}
                rows={5}
              />
            </Grid>
            <Grid item>
              <button
                disabled={disableButton || addLoading}
                className={styles.addExpenseButton}
                onClick={handleAdd}
              >
                {addLoading && (
                  <ClipLoader
                    size={15}
                    color={"#FD5E74"}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                )}
                {!addLoading && "Add"}
              </button>
            </Grid>
            <Grid item>
              <button
                className={styles.addExpenseButton}
                onClick={() => handleClose()}
              >
                Discard
              </button>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  );
};

export default AddExpensePopup;
