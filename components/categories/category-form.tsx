"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { NewCategory } from "@/types";
import { createCategory } from "@/components/categories/categories-api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";

const CategoryForm = () => {
  const formSchema = z.object({
    name: z.string(),
    color: z.string(),
    division: z.enum(["essentials", "leisure"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: "",
      division: "essentials",
      color: "#FF00FF",
    },
    mode: "onChange",
  });

  async function handleSubmit(newTransaction: NewCategory) {
    await createCategory(newTransaction).then((x) => console.log(x));
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((newCategory) =>
          handleSubmit({ ...newCategory }),
        )}
      >
        <div className={"flex flex-col gap-y-10"}>
          <div className={"flex gap-x-10 "}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="division"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select division" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="essentials">Essentials</SelectItem>
                      <SelectItem value="leisure">Leisure</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div>
                      <ColorPicker {...field} onBlur={field.onBlur} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className={"w-full"}>Create Category</Button>
        </div>
      </form>
    </Form>
  );
};
export default CategoryForm;
