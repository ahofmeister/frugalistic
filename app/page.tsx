import {
	ArrowRight,
	BarChart2,
	Check,
	Lock,
	Repeat,
	Sparkles,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { type ReactNode, Suspense } from "react";
import GitHub from "@/app/git-hub";
import AppButton from "@/components/auth/app-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
	const features = [
		{
			title: "Transaction Tracking & Categorization",
			description: "Easily track and categorize finances.",
			icon: TrendingUp,
		},
		{
			title: "Personalized Insights",
			description: "Get financial insights and reports to guide decisions.",
			icon: Sparkles,
		},
		{
			title: "Recurring Transactions",
			description: "Automate monthly transactions.",
			icon: Repeat,
		},
	];

	type FeatureCardProps = {
		icon: ReactNode;
		title: string;
		description: string;
	};

	const FeatureCard: React.FC<FeatureCardProps> = ({
		icon,
		title,
		description,
	}) => (
		<Card className="h-full group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
			<CardHeader className="pb-3">
				<div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
					{icon}
				</div>
				<CardTitle className="text-lg">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);

	type TechItemProps = {
		name: string;
	};

	const TechItem: React.FC<TechItemProps> = ({ name }) => (
		<Badge
			variant="secondary"
			className="rounded-full px-4 py-1.5 text-sm font-medium"
		>
			{name}
		</Badge>
	);

	const technologies = [
		"Next.js",
		"Vercel",
		"TypeScript",
		"Tailwind",
		"shadcn/ui",
		"Supabase",
		"Biome",
	];

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
				<div className="relative max-w-5xl mx-auto px-6 pt-24 pb-20 lg:pt-36 lg:pb-28 text-center">
					<p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
						Free Financial Management
					</p>
					<h1 className="text-4xl font-bold tracking-tight lg:text-6xl text-balance">
						Take Control of Your Finances with{" "}
						<span className="text-primary">Frugalistic</span>
					</h1>
					<p className="text-muted-foreground mt-6 text-lg lg:text-xl max-w-2xl mx-auto text-balance">
						Track your expenses, savings, and income effortlessly. Visualize
						your financial health and stay on top of your finances.
					</p>

					<div className="mt-10 w-fit justify-self-center">
						<Suspense>
							<AppButton />
						</Suspense>
					</div>

					<div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<Check className="h-4 w-4 text-primary" />
							No credit card required
						</span>
						<span className="flex items-center gap-1.5">
							<Check className="h-4 w-4 text-primary" />
							100% free forever
						</span>
						<Link
							href="https://github.com/ahofmeister/frugalistic/"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-1.5 hover:text-foreground transition-colors"
						>
							<GitHub className="h-4 w-4" />
							Open source
						</Link>
					</div>
				</div>
			</section>

			<section className="py-16 lg:py-24 border-t border-border/50">
				<div className="max-w-5xl mx-auto px-6">
					<div className="text-center mb-12">
						<h2 className="text-2xl font-bold lg:text-3xl">Why Frugalistic?</h2>
						<p className="text-muted-foreground mt-3 max-w-xl mx-auto">
							Simple, powerful tools to manage your money better
						</p>
					</div>
					<div className="grid gap-6 md:grid-cols-3">
						{features.map((feature) => (
							<Card
								key={feature.title}
								className="text-center border-border/50 hover:shadow-md transition-shadow"
							>
								<CardHeader className="pb-2">
									<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
										<feature.icon className="w-6 h-6 text-primary" />
									</div>
									<CardTitle className="text-lg">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">{feature.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="py-16 lg:py-24 bg-muted/30">
				<div className="max-w-4xl mx-auto px-6">
					<div className="text-center mb-12">
						<h2 className="text-3xl lg:text-4xl font-bold mb-4">
							Built for Your Financial Success
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Frugalistic is a free and open-source financial management tool
							designed to help you take control of your finances. Managing money
							should be simple, transparent, and accessible to everyone.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-6 mb-12">
						<FeatureCard
							icon={<Lock className="w-6 h-6 text-primary" />}
							title="Accessible"
							description="Free for everyone to use, ensuring financial tools are available to all."
						/>
						<FeatureCard
							icon={<GitHub className="w-6 h-6 text-primary" />}
							title="Transparent"
							description="Fully open-source and community-driven, fostering trust and collaboration."
						/>
						<FeatureCard
							icon={<Users className="w-6 h-6 text-primary" />}
							title="Flexible"
							description="Customizable to fit your unique financial needs and goals."
						/>
						<FeatureCard
							icon={<BarChart2 className="w-6 h-6 text-primary" />}
							title="Insightful"
							description="Powerful analytics to visualize your spending habits and financial trends."
						/>
					</div>

					<Card className="mb-12 border-border/50">
						<CardHeader>
							<CardTitle className="text-xl">Built with</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2">
								{technologies?.map((tech) => (
									<TechItem key={tech} name={tech} />
								))}
							</div>
						</CardContent>
					</Card>

					<Card className="border-primary/30 bg-primary/5 shadow-xl">
						<CardHeader className="text-center pb-2 pt-10">
							<CardTitle className="text-3xl font-bold">
								Ready to Take Control?
							</CardTitle>
						</CardHeader>
						<CardContent className="text-center pb-4">
							<p className="text-lg text-muted-foreground max-w-lg mx-auto">
								Take charge of your finances today with Frugalistic. Whether you
								are tracking monthly expenses or planning for the future,
								Frugalistic provides the tools you need—powered by the
								transparency and flexibility of open source.
							</p>
						</CardContent>
						<CardFooter className="flex-col gap-4 pb-10">
							<Suspense>
								<AppButton />
							</Suspense>
							<Link
								href="https://github.com/ahofmeister/frugalistic/"
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
							>
								<GitHub className="h-4 w-4" />
								View source on GitHub
							</Link>
						</CardFooter>
					</Card>
				</div>
			</section>

			<section className="py-16 lg:py-24 border-t border-border/50">
				<div className="max-w-3xl mx-auto px-6 text-center">
					<h2 className="text-2xl font-bold lg:text-3xl mb-4">
						Start Managing Your Money Today
					</h2>
					<p className="text-muted-foreground text-lg mb-8">
						Join Frugalistic and gain full control over your financial health.
					</p>
					<Button asChild size="lg" className="text-base px-8">
						<Link href="/login">
							Get started
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>
			</section>
		</div>
	);
}
