import React from "react";
import PatientDetails from "./_components/PatientDetails";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
const page = async () => {
  // const { isAuthenticated } = getKindeServerSession();
  // if (!(await isAuthenticated())) {
  //   redirect("/api/auth/login");
  // }

  // const { getClaim } = getKindeServerSession();
  // const result = await getClaim("roles");
  // console.log("Role: ", result);
  // if (!result?.value.some((role) => role.name === "mgood-partner")) {
  //   return <div>Access Denied</div>;
  // }
  return (
    <div>
      <PatientDetails />
    </div>
  );
};

export default page;
