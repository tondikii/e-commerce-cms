import {FC} from "react";
import View from "./View";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";

interface Props {}

const DashboardPage: FC<Props> = async ({}) => {
  const session = await getServerSession(authOptions);
  const name: string = session?.user?.name || "";

  return <View name={name} />;
};
export default DashboardPage;
