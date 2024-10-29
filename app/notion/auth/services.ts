export const setNotionTokenInCookies = async (code: string): Promise<void> => {
  await fetch("/api/notion/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code,
    }),
  }).then((res) => res.json());
};
