"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createCategory } from "@/components/categories/categories-api";
import DeleteCategory from "@/components/categories/delete-category";
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
import { Category, NewCategory } from "@/types";

const CategoryForm = (props: { category?: Category }) => {
  const formSchema = z.object({
    name: z.string().min(2),
    color: z.string(),
    description: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: props.category?.name ?? "",
      color: props.category?.color ?? "",
      description: props.category?.description ?? "",
    },
    mode: "onBlur",
  });

  async function handleSubmit(newCategory: NewCategory) {
    await createCategory({
      ...newCategory,
      id: props.category ? props.category.id : undefined,
    });
    redirect("/dashboard/categories");
  }

  return (
    <div className="max-w-2xl mx-auto px-2 py-4">
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

            <div className="flex flex-col gap-y-4">
              {props.category && <DeleteCategory category={props.category} />}

              <Button
                type="submit"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
                className="w-full"
              >
                {form.formState.isSubmitting ? (
                  <LoadingSpinner />
                ) : props.category ? (
                  "Save"
                ) : (
                  "Create Category"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
