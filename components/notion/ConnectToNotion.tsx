import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export const ConnectToNotion: React.FC = () => {
  return (
    <div>
      <Link
        className={buttonVariants({ variant: "outline" })}
        href={process.env.NOTION_AUTHORIZATION_URL ?? ""}
      >
        Connect to your Notion workspace
      </Link>
    </div>
  );
};
