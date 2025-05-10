import React from "react";
import CategoryList from "../search/_components/CategoryList";

const layout = ({ children }) => {
  return (
    <div className="bg-gray-100">
      {/* <div className="hidden md:block md:col-span-1">
        <CategoryList />
      </div> */}
      {children}
    </div>
  );
};

export default layout;
