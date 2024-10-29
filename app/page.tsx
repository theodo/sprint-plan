import { NextPage } from "next";

import { ConnectToNotion } from "@/app/components/ConnectToNotion";

const Home: NextPage = () => {
  return (
    <div>
      <ConnectToNotion />
    </div>
  );
};

export default Home;
