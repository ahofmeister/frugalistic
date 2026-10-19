import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
				destructive: "bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90",
				outline:
					"border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
				secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				success: "bg-emerald-600 text-white shadow-xs hover:bg-emerald-600",
			},
			size: {
				sm: "px-3 py-1 h-8",
				md: "px-3.5 py-1.5 h-9",
				lg: "px-4 py-2 !text-body-lg-600 h-10",
				roundedIcon: "rounded-full size-9",
				icon: "h-6 w-6 [&_svg]:size-3",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "sm",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isSuccess?: boolean;
	successText?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			isSuccess = false,
			successText,
			children,
			disabled,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(
					buttonVariants({ variant: isSuccess ? "success" : variant, size, className }),
				)}
				ref={ref}
				disabled={disabled || isSuccess}
				{...props}
			>
				{isSuccess ? (
					<>
						<Check />
						{successText ?? "Success"}
					</>
				) : (
					children
				)}
			</Comp>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
