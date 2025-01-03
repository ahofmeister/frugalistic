"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateSettings } from "@/app/dashboard/settings/settings-actions";
import { useSetting } from "@/app/dashboard/settings/use-setting";
import LoadingSpinner from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type FormData = {
  date_format: string;
};

export default function SettingsPage() {
  const setting = useSetting();

  const formSchema = z.object({
    date_format: z
      .string()
      .max(20, "Date format must be 20 characters or less.")
      .refine((formatString) => isValidDateFormat(formatString), {
        message: "Invalid date format",
      }),
  });

  const form = useForm<FormData>({
    defaultValues: { date_format: setting.date_format },
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const dateFormat = form.watch("date_format");

  const onSubmit = async (data: FormData) => {
    const newSetting = { ...data, id: setting ? setting.id : undefined };
    await updateSettings(newSetting);
  };

  return (
    <div className="flex flex-col ml-2 mt-2 gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((newCategory) =>
            onSubmit({ ...newCategory }),
          )}
        >
          <div className="flex flex-col gap-y-10">
            <div className="flex gap-x-10 ">
              <FormField
                control={form.control}
                name="date_format"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-x-20">
                      <div className="flex flex-col">
                        <FormLabel>Date Format</FormLabel>
                        <FormDescription>
                          Recommend to use dd mm yyyy
                        </FormDescription>
                      </div>
                      <FormControl>
                        <div className="flex flex-col">
                          <Input placeholder="yyyy-MM-dd" {...field} />
                          <div className="text-muted-foreground self-end">
                            {isValidDateFormat(dateFormat) ? (
                              <div>{format(new Date(), dateFormat)}</div>
                            ) : (
                              <span className="text-destructive"></span>
                            )}
                          </div>
                          <FormMessage />
                        </div>
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Button type="submit">
            {form.formState.isSubmitting ? <LoadingSpinner /> : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  );

  function isValidDateFormat(formatString: string): boolean {
    try {
      format(new Date(), formatString);
      return true;
    } catch {
      return false;
    }
  }
}
