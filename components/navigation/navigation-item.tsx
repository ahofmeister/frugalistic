import Link from "next/link";
import React from "react";

const NavigationItem = ({
  title,
  pathname,
}: {
  title: string;
  pathname: string;
}) => {
  return (
    <Link
      className={`font-medium text-neutral-400 hover:text-neutral-500" ${"a" === pathname ? "text-primary" : ""}`}
      href={pathname}
    >
      {title}
    </Link>
  );
};
export default NavigationItem;
