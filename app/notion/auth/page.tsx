"use client";
import { NextPage } from "next";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { getNotionListPath } from "@/lib/notion/routing";

import { setNotionTokenInCookies } from "./services";

const NotionAuthRedirect: NextPage = () => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    void (async () => {
      if (code === null) return;
      await setNotionTokenInCookies(code);
      redirect(getNotionListPath());
    })();
  }, [code]);

  return <div></div>;
};

export default NotionAuthRedirect;
