"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createCategory } from "@/components/categories/categories-api";
import LoadingSpinner from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NewCategory } from "@/types";

const CategoryForm = () => {
  const formSchema = z.object({
    name: z.string().min(2),
    color: z.string(),
    division: z.enum(["essentials", "leisure"]),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      division: "essentials",
      color: "#14121F",
      description: "",
    },
    mode: "onChange",
  });

  async function handleSubmit(newTransaction: NewCategory) {
    await createCategory(newTransaction);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((newCategory) => {
          return handleSubmit({ ...newCategory });
        })}
      >
        <div className="flex flex-col gap-y-10">
          <div className="flex gap-x-10 ">
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue>
                          {field.value
                            ? field.value === "essentials"
                              ? "Essentials"
                              : "Leisure"
                            : "Select division"}
                        </SelectValue>
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

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <div>
                    <Input {...field} onBlur={field.onBlur} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !form.formState.isValid}
            className="w-full"
          >
            {form.formState.isSubmitting ? (
              <LoadingSpinner />
            ) : (
              "Create Category"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
