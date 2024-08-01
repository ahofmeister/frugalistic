"use client";
import React from "react";

const MonthSwitcher = ({
  currentDate,
  onUpdate,
}: {
  currentDate: Date;
  onUpdate: (date: Date) => void;
}) => {
  const goToPreviousMonth = () => {
    onUpdate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    onUpdate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const formattedMonth = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="flex flex-row gap-4">
        <button onClick={goToPreviousMonth}>Prev</button>
        <div className="text-2xl">{formattedMonth}</div>
        <button onClick={goToNextMonth}>Next</button>
      </div>
    </div>
  );
};

export default MonthSwitcher;
