import { Box } from "@mui/material";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { Expenses } from "../../interfaces";
import styles from "../../styles/latestExpense.module.css";
import Loader from "../common/Loader";

interface props {
  title: string;
  orderByValue: string;
}

const ExpensesContainer: React.FC<props> = ({ title, orderByValue }) => {
  const { data: session } = useSession();
  const [data, setData] = useState<Expenses[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const docRef = doc(db, "users", session?.user?.email!);
  const colRef = collection(docRef, "expenses");
  const LatesExpenses = query(colRef, orderBy(orderByValue, "desc"), limit(10));

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(LatesExpenses, (snapshot) => {
      let list: any = [];
      snapshot.docs.forEach(async (doc) => await list.push({ ...doc.data() }));
      setData(list);
      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <Box className={styles.latesExpenseContainer} borderRadius={4} p={1.5}>
      <h3>{title}</h3>

      <div className={styles.expensesRow}>
        {loading ? (
          <Loader />
        ) : data.length <= 0 ? (
          <p style={{ color: "#717171" }}>
            No Data Available, Please Add Expense.
          </p>
        ) : (
          data.map((item: Expenses, index: number) => (
            <Box
              className={styles.expenseItem}
              key={`${item.account}-${index}-${item.category}`}
              borderRadius={4}
              p={1.5}
            >
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  color: "whitesmoke",
                  marginBottom: "6px",
                }}
              >
                ₹ {item.amount?.toLocaleString()}
              </p>
              <p>{item.category}</p>
              <p>{item.paymentType}</p>
            </Box>
          ))
        )}
      </div>
    </Box>
  );
};

export default ExpensesContainer;
