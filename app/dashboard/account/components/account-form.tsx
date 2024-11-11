"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateAccount } from "@/app/dashboard/account/lib/account-actions";
import LoadingSpinner from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserAccount, UserAccountUpdate } from "@/types";

const AccountForm = (props: { user?: UserAccount | null }) => {
  const formSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().readonly().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: props.user?.firstName ?? "",
      lastName: props.user?.lastName ?? "",
      email: props.user?.email ?? "",
    },
    mode: "onChange",
  });

  function handleSubmit(user: UserAccountUpdate) {
    return updateAccount(user);
  }

  return (
    <div className="w-full flex justify-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((user) => handleSubmit({ ...user }))}>
          <div className="flex flex-col gap-y-4">
            <div>
              <FormField
                disabled={true}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-x-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              className="w-full"
            >
              {form.formState.isSubmitting ? <LoadingSpinner /> : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AccountForm;
