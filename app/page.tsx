import { NextPage } from "next";

import { ConnectToNotion } from "@components/notion/ConnectToNotion";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center gap-4">
      <ConnectToNotion />
    </div>
  );
};

export default Home;
