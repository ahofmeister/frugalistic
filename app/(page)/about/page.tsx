import { BarChart2, DollarSign, Lock, Users } from "lucide-react";
import Link from "next/link";
import React, { ReactNode, Suspense } from "react";

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
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center text-lg">
        {icon}
        <span className="ml-2">{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p>{description}</p>
    </CardContent>
  </Card>
);

type TechItemProps = {
  name: string;
};

const TechItem: React.FC<TechItemProps> = ({ name }) => (
  <Badge className="flex items-center space-x-2 bg-secondary rounded-full px-3 py-1">
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
];

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <h1 className="text-5xl font-bold text-center mb-8 text-primary">
        Frugalistic
      </h1>

      <div className="mb-12 text-center text-xl">
        Your open-source companion for financial clarity and growth.
      </div>

      <Card className="mb-12">
        <CardContent>
          Frugalistic is a free and open-source financial management tool
          designed to help you take control of your finances. Managing money
          should be simple, transparent, and accessible to everyone. With
          Frugalistic, you can effortlessly track expenses, analyze spending
          habits, and gain meaningful insights—all without hidden costs or
          limitations.
        </CardContent>
      </Card>

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

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl">Built with</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {technologies?.map((tech) => <TechItem key={tech} name={tech} />)}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center mb-12">
        <Button asChild size="lg" className="text-lg">
          <Link
            href="https://github.com/ahofmeister/frugalistic/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <GitHub className="text-white" />
            Explore on GitHub
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <DollarSign className="w-6 h-6 text-primary mr-2" />
            Get Started
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">
            Take charge of your finances today with Frugalistic. Whether you are
            tracking monthly expenses or planning for the future, Frugalistic
            provides the tools you need—powered by the transparency and
            flexibility of open source.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center mt-2">
          <Suspense>
            <AppButton />
          </Suspense>
        </CardFooter>
      </Card>
    </div>
  );
};

export default About;
