import React from "react";

const CategoryColor = ({ color }: { color: string }) => {
  return (
    <div
      className="w-3 h-3 rounded-full"
      style={{ backgroundColor: color }}
    ></div>
  );
};

export default CategoryColor;
