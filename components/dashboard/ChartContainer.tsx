import { Box } from "@mui/material";
import { collection, doc, onSnapshot } from "firebase/firestore";
import moment from "moment";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { db } from "../../firebaseConfig";
import { Expenses } from "../../interfaces/AddEditDelete";
import styles from "../../styles/charts.module.css";

interface props {
  pieChart: boolean;
}

const ChartContainer: React.FC<props> = ({ pieChart }) => {
  const { data: session } = useSession();
  const [data, setData] = useState<Expenses[]>([]);
  const docRef = doc(db, "users", session?.user?.email!);
  const colRef = collection(docRef, "expenses");

  useEffect(() => {
    const unsub = onSnapshot(colRef, (snapshot) => {
      let list: any = [];
      snapshot.docs.forEach(async (doc) => await list.push({ ...doc.data() }));
      setData(list);
    });

    return () => {
      unsub();
    };
  }, []);

  const counts = data.reduce((p, c) => {
    //@ts-ignore
    var name = c.category;
    if (!p.hasOwnProperty(name)) {
      //@ts-ignore
      p[name] = 0;
    }
    //@ts-ignore
    p[name]++;
    return p;
  }, {});

  const categoriesData = Object.keys(counts).map((k) => {
    //@ts-ignore
    return { name: k, value: counts[k] };
  });

  const balanceTrendsData = data
    .sort(function (left, right) {
      return moment.utc(left.dateTime).diff(moment.utc(right.dateTime));
    })
    .map((item: any) => {
      return {
        name: moment(item.dateTime).format("M[/]D"),
        Balance: item.totalBalance,
      };
    })
    .slice(-10);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const renderPieToopTip = (props: any) => {
    console.log(props);
    if (props.active && props.payload && props.payload.length) {
      return (
        <Box
          style={{
            backgroundColor: "#151515",
            color: "whitesmoke",
            border: "1px solid whitesmoke",
          }}
          borderRadius={4}
          p={1}
        >
          <p className="label">{`${
            props.payload[0].name
          } : ${props.payload[0].value.toLocaleString()} records`}</p>
        </Box>
      );
    }

    return null;
  };

  const renderAreaToopTip = (props: any) => {
    console.log(props);
    if (props.active && props.payload && props.payload.length) {
      return (
        <Box
          style={{
            backgroundColor: "#151515",
            color: "whitesmoke",
            border: "1px solid whitesmoke",
          }}
          borderRadius={4}
          p={1}
        >
          <p className="label">
            ₹{`${props.payload[0].payload.Balance.toLocaleString()}`}
          </p>
        </Box>
      );
    }

    return null;
  };

  return (
    <Box className={styles.chartContainer} borderRadius={4} p={1.5}>
      {pieChart ? (
        <>
          <h3>Most Spendings</h3>
          {data.length <= 0 ? (
            <p style={{ color: "#717171" }}>
              No Data Available, Please Add Expense.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={categoriesData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={4}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  <LabelList dataKey="name" position="outside" />
                </Pie>
                <Tooltip
                  wrapperStyle={{ outline: "none" }}
                  content={renderPieToopTip}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </>
      ) : (
        <>
          <h3>Balance Trends</h3>
          {data.length <= 0 ? (
            <p style={{ color: "#717171" }}>
              No Data Available, Please Add Expense.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart
                data={balanceTrendsData}
                margin={{ top: 20, left: 10, right: 30, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FD5E74" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FD5E74" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name"></XAxis>
                <YAxis dataKey="Balance" />
                <Legend verticalAlign="top" height={16} />
                <Tooltip
                  wrapperStyle={{ outline: "none" }}
                  content={renderAreaToopTip}
                />
                <Area
                  type="monotone"
                  dataKey="Balance"
                  stroke="#FD5E74"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default ChartContainer;
