"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { OctagonAlertIcon } from "lucide-react";
import { FaGoogle, FaGithub } from "react-icons/fa";

import { useForm, Controller } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldSeparator,
  FieldGroup,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import Link from "next/link";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/authClient";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const SignUpView = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);

    authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setError(error.message);
          setPending(false);
        },
      },
    );
  };

  const onSocial = (provider: "github" | "google") => {
    setError(null);
    setPending(true);

    authClient.signIn.social(
      {
        provider,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: ({ error }) => {
          setError(error.message);
          setPending(false);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid md:grid-cols-1 p-0">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 md:p-8"
            autoComplete="on"
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Let&apos;s get started</h1>
                <p className="text-muted-foreground text-balance">
                  Create your account
                </p>
              </div>
              <div className="grid gap-3">
                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="name"
                    render={({ field, fieldState, formState }) => {
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="name">Name</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...field}
                              id="name"
                              type="text"
                              placeholder="e.g. John Doe"
                              aria-invalid={fieldState.invalid}
                              disabled={formState.isSubmitting}
                              autoComplete="given-name"
                            />
                          </InputGroup>
                          {fieldState.invalid && (
                            <FieldError
                              className="text-xs"
                              errors={[fieldState.error]}
                            />
                          )}
                        </Field>
                      );
                    }}
                  />
                  <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState, formState }) => {
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="email">Email</FieldLabel>
                          <InputGroup>
                            <InputGroupInput
                              {...field}
                              id="email"
                              type="email"
                              placeholder="m@example.com"
                              aria-invalid={fieldState.invalid}
                              disabled={formState.isSubmitting}
                              autoComplete="email"
                            />
                          </InputGroup>
                          {fieldState.invalid && (
                            <FieldError
                              className="text-xs"
                              errors={[fieldState.error]}
                            />
                          )}
                        </Field>
                      );
                    }}
                  />
                  <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState, formState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id="password"
                            type="password"
                            placeholder="********"
                            aria-invalid={fieldState.invalid}
                            disabled={formState.isSubmitting}
                            autoComplete="new-password"
                          />
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    control={form.control}
                    name="confirmPassword"
                    render={({ field, fieldState, formState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="confirmPassword">
                          Confirm Password
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            {...field}
                            id="confirmPassword"
                            type="password"
                            placeholder="********"
                            aria-invalid={fieldState.invalid}
                            disabled={formState.isSubmitting}
                            autoComplete="new-password"
                          />
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </div>
              {!!error && (
                <Alert className="bg-destructive/10 border-none">
                  <OctagonAlertIcon className="size-4 text-destructive!" />
                  <AlertTitle>{error}</AlertTitle>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Spinner />}
                {isPending ? "Submitting ..." : "Sign up"}
              </Button>
              <FieldSeparator>Or continue with</FieldSeparator>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  disabled={isPending}
                  onClick={() => onSocial("google")}
                >
                  <FaGoogle />
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="w-full"
                  disabled={isPending}
                  onClick={() => onSocial("github")}
                >
                  <FaGithub />
                </Button>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Already have an account?&nbsp;&nbsp;
                <Link href="/sign-in" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>

          {/* <div className="bg-radial from-sidebar-accent to-sidebar relative hidden md:flex flex-col gap-y-4 items-center justify-center">
            <Image
              src="/logo.svg"
              alt="logo"
              width={92}
              height={92}
              className="h-23 w-23"
            />
            <p className="text-2xl font-semibold text-white">Meet AI</p>
          </div> */}
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-xs text-center [&>a]:underline [&>a]:underline-offset-4 [&>a]:hover:text-primary text-balance">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
};
