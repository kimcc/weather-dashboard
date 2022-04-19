import { Outlet } from "@remix-run/react";
export default function Weather() {
  return (
    <>
      {/* Outlet will look for the folder that matches the name of this file and embed the pages inside the main page */}
      <Outlet />
    </>
  );
}