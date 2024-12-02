import React from "react";

type CategoryData = {
  category: string;
  total: number;
  fill: string;
};

interface HorizontalBarProps {
  groupedCategories: CategoryData[];
}

const HorizontalBarChart: React.FC<HorizontalBarProps> = ({
  groupedCategories,
}) => {
  const totalSum = groupedCategories.reduce(
    (sum, category) => sum + category.total,
    0,
  );

  return (
    <div className="w-full max-w-4xl">
      <span className="mr-4 text-sm font-bold whitespace-nowrap">
        Categories
      </span>
      <div className="flex items-center mb-4">
        <div className="flex-grow h-6 bg-gray-200 rounded overflow-hidden flex">
          {groupedCategories.map((category) => (
            <div
              key={category.category}
              className="h-full transition-all"
              style={{
                width: `${(category.total / totalSum) * 100}%`,
                backgroundColor: category.fill,
              }}
              title={`${category.category}: ${category.total.toFixed(2)}`}
            />
          ))}
        </div>
        <span className="ml-4 text-sm">{totalSum.toFixed(2)}</span>
      </div>
      <div className="flex justify-between mt-2 text-sm">
        {groupedCategories.map((category) => (
          <div key={category.category} className="flex items-center">
            <span
              className="w-4 h-4 mr-2"
              style={{ backgroundColor: category.fill }}
            ></span>
            {category.category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalBarChart;
