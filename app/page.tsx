import { ConnectToNotion } from "@components/notion/ConnectToNotion";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div>
      <ConnectToNotion />
    </div>
  );
};

export default Home;
