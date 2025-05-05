import React from "react";

interface StepItem {
  label: string;
  action: () => void;
}

interface StepsProps {
  items: StepItem[];
  currentStep: number; // active step index
}

const Steps: React.FC<StepsProps> = ({ items, currentStep }) => {
  return (
    <ol className="flex items-center w-full justify-between px-4 sm:px-10 mb-8">
      {items.map((item, index) => {
        const isActive = index + 1 === currentStep;
        const isNext = index + 1 === currentStep + 1;
        const isCompleted = index + 1 < currentStep;

        return (
          <li
            key={index}
            className="flex-1 flex flex-col items-center group cursor-pointer"
            onClick={item.action}
          >
            <div className="relative flex items-center justify-center w-full h-8 sm:w-10 sm:h-10">
              <div
                className={`absolute w-[154px]  h-[2px] top-1/2 left-full inset-0 transform -translate-y-1/2 ${
                  index < items.length - 1
                    ? isActive || isCompleted
                      ? "bg-orange-500"
                      : "bg-gray-200"
                    : ""
                }`}
              ></div>

              <div
                className={`rounded-full flex items-center justify-center  w-[38px] h-[38px] border-2 transition-all duration-300 ${
                  isCompleted || currentStep === 6
                    ? "bg-orange-500 border-orange-500 text-white"
                    : isActive
                    ? "border-orange-500 text-orange-500"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {isCompleted || currentStep === 6 ? (
                  <svg
                    width="14"
                    height="11"
                    viewBox="0 0 14 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 6L4.33333 9.33333L12.6667 1"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ) : isActive ? (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="5" cy="5" r="5" fill="#F66135" />
                  </svg>
                ) : isNext ? (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="5" cy="5" r="5" fill="#D1D5DB" />
                  </svg>
                ) : (
                  ""
                )}
              </div>
            </div>
            <span
              className={`mt-5 text-[14px] font-medium sm:text-sm text-gray-900 }`}
            >
              {item.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default Steps;
