import {FC} from "react";
import View from "./View";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {SessionType} from "@/types";

interface Props {}

const HomePage: FC<Props> = async ({}) => {
  const session: SessionType = await getServerSession(authOptions);
  return <View session={session} />;
};
export default HomePage;
