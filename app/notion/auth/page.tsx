"use client";
import { NextPage } from "next";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { setNotionTokenInCookies } from "./services";

const NotionAuthRedirect: NextPage = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    void (async () => {
      if (code === null) return;
      await setNotionTokenInCookies(code);
      redirect("/");
    })();
  }, [code]);

  return <div></div>;
};

export default NotionAuthRedirect;
