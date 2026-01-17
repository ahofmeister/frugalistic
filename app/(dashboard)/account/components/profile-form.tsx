"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { updateAccount } from "@/app/(dashboard)/account/lib/account-actions";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { Profile, ProfileUpdate } from "@/types";

const ProfileForm = (props: { user?: Profile | null }) => {
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

	function handleSubmit(user: ProfileUpdate) {
		return updateAccount(user);
	}

	return (
		<div className="w-full">
			<Form {...form}>
				<form onSubmit={form.handleSubmit((user) => handleSubmit({ ...user }))}>
					<Card>
						<CardHeader>
							<CardTitle>Personal Information</CardTitle>
							<CardDescription>
								Update your personal details and contact information.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="space-y-4">
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

								<div className="grid grid-cols-2 gap-4">
									<div className="gap-2">
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
									</div>
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
							</div>

							<Button
								type="submit"
								disabled={
									form.formState.isSubmitting || !form.formState.isValid
								}
								className="w-full"
							>
								{form.formState.isSubmitting ? <Spinner /> : "Save"}
							</Button>
						</CardContent>
					</Card>
				</form>
			</Form>
		</div>
	);
};

export default ProfileForm;
