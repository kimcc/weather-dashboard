import { redirect } from "@remix-run/node";

// Redirect to the weather route
export const loader = async () => {
  return redirect("/weather");
}

export default function Index() {
  return null;
}