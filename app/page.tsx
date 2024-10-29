import { NextPage } from "next";

import { ConnectToNotion } from "@components/notion/ConnectToNotion";

const Home: NextPage = () => {
  return (
    <div>
      <ConnectToNotion />
    </div>
  );
};

export default Home;
