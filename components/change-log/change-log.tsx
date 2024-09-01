import { format } from "date-fns";
import React from "react";

const events = [
  {
    date: new Date(2024, 8, 1),
    heading: "Frugalistic Goes Public!",
    details:
      "We're thrilled to announce that Frugalistic is now live and open to everyone! After months of preparation and development, we are excited to invite all individuals to sign up and become part of the Frugalistic community. Whether you're looking to save more, spend smarter, or manage your finances better, Frugalistic is here to help you achieve your goals. Join us today and take control of your financial future—it's free, it's easy, and it's for everyone!\n" +
      "\n\n" +
      "Sign up now and start your journey towards smarter living with Frugalistic!",
  },
];

const ChangeLog = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="relative border-l border-gray-200 dark:border-gray-700">
        {events.map((event, index) => (
          <div className="mb-10 ml-4" key={index}>
            <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900"></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              {format(event.date, "yyyy-MM-dd")}
            </time>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {event.heading}
            </h3>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              {event.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChangeLog;
