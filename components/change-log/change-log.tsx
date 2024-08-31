import { format } from "date-fns";
import React from "react";

const events = [
  {
    date: new Date(2024, 7, 30),
    heading:
      "Congratulations to Ronaldo Playing Chess for winning the Streamers Battle August 2024!",
    details:
      "Congrats also to runners-up IM YOSEPH AND FRIENDS, Zhigalko_Sergei & Friends for taking 3rd place and IM Manitodeplomo Fan Club for 4th place. Thanks to all participating streamers and 1,852 registered players!",
  },
  {
    date: new Date(2024, 8, 31),
    heading:
      "Hovering over player names in broadcast games will now display additional information.",
    details:
      "This information is also available in the new Players tab, which you can sort by clicking on one of the column titles.",
  },
  {
    date: new Date(2024, 8, 31),
    heading:
      "The first of six FIDE Women’s Grand Prix 2024-25 tournaments started in Tbilisi, Georgia!",
    details:
      "Some of the strongest women, including former World Champions Alexandra Kosteniuk and Mariya Muzychuk, GMs R Vaishali, Anna Muzychuk and IM Sara Khadem, will try to earn points for the WGP Series.",
  },
  {
    date: new Date(2024, 8, 31),
    heading:
      "Congrats to @Schmobi on winning the Lichess Game of the Month July 2024!",
    details: "Thank you for all your countless submissions!",
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
