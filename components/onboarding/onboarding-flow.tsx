"use client";
import { CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { useState } from "react";

import { insertCategoriesFromDefaultCategories } from "@/components/categories/categories-api";
import { nextStep } from "@/components/onboarding/onboarding-actions";
import OnboardingCategories from "@/components/onboarding/onboarding-categories";
import { Button } from "@/components/ui/button";
import { DefaultCategory, OnboardingStep } from "@/types";

export const OnboardingFlow = ({ steps }: { steps: OnboardingStep[] }) => {
  const [selectedCategories, setSelectedCategories] = useState<
    DefaultCategory[]
  >([]);

  const handleNextStep = (step: OnboardingStep) => {
    switch (step.step_name) {
      case "categories":
        void insertCategoriesFromDefaultCategories(selectedCategories);
        break;
      case "welcome":
        // processWelcomeStep();
        break;
      default:
        break;
    }

    void nextStep(step.id);
  };

  return (
    <div className="">
      <ol role="list" className="flex">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="flex-1 relative">
            {stepIdx !== steps.length - 1 && (
              <div
                className="absolute top-4 left-1/2 w-full h-0.5 bg-muted-foreground"
                aria-hidden="true"
              />
            )}
            <div className="relative flex flex-col items-center group">
              <span
                className={`h-9 w-9 rounded-full flex items-center justify-center ${
                  step.status === "complete"
                    ? "bg-orange-500"
                    : step.status === "current"
                      ? "bg-orange-100 border-2 border-orange-500"
                      : "bg-background border-2 border-muted-foreground"
                }`}
              >
                {step.status === "complete" ? (
                  <CheckIcon
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                ) : step.status === "current" ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
                )}
              </span>
              <span
                className={`mt-3 text-sm font-medium text-center ${
                  step.status === "complete"
                    ? "text-orange-500"
                    : step.status === "current"
                      ? "text-orange-500"
                      : "text-muted-foreground"
                }`}
              >
                {step.step_name}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex flex-col">
        {steps
          .filter((step) => step.status === "current")
          .map((step) => (
            <div key={step.id} className="flex justify-between w-full">
              <div>
                {step.status === "current" &&
                  step.step_name === "categories" && (
                    <OnboardingCategories
                      onSelectCategory={(categories) =>
                        setSelectedCategories(categories)
                      }
                      selectedCategories={selectedCategories}
                    />
                  )}
                {step.status === "current" && step.step_name === "welcome" && (
                  <div>Welcome to Frugalistic!</div>
                )}

                <div className="flex justify-end">
                  {step.status === "current" && (
                    <Button
                      onClick={() => {
                        handleNextStep(step);
                      }}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>

              <div></div>
            </div>
          ))}
      </div>
    </div>
  );
};
