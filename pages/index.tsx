import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../components/common/Layout";
import Loader from "../components/common/Loader";
import HomePageContainer from "../components/HomePageContainer";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!session?.user && status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, status]);

  const getStatus = () => {
    if (status === "loading" || !session?.user) return true;
    return false;
  };

  return (
    <>
      {getStatus() ? (
        <Loader />
      ) : (
        <Layout>
          <HomePageContainer />
        </Layout>
      )}
    </>
  );
}
