import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./sign-up-form";

interface Props {
  searchParams: Promise<{ callbackUrl: string }>;
}

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async ({ searchParams }: Props) => {
  const session = await auth();
  const callbackUrlParam = (await searchParams).callbackUrl;
  const callbackUrl =
    typeof callbackUrlParam === "string" ? callbackUrlParam : "/";

  if (session) {
    return redirect(callbackUrl);
  }
  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="mx-2 sm:mx-0">
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
            <Image
              src={"/images/logo.svg"}
              alt={`${APP_NAME} logo`}
              width={100}
              height={100}
              priority
            />
          </Link>
          <CardTitle className="text-center">Sign Up</CardTitle>
          <CardDescription className="text-center">
            Enter your information below to sign up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm callbackUrl={callbackUrl} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
