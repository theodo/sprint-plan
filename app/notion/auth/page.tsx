"use client";
import { NextPage } from "next";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { getNotionListPath } from "@/lib/notion/routing";

import { setNotionTokenInCookies } from "./services";

const NotionAuthRedirect: NextPage = () => {
  return (
    <Suspense>
      <RedirectComponent />
    </Suspense>
  );
};

const RedirectComponent: React.FC = () => {
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
