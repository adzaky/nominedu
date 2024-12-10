"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { redirect } from "next/navigation";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { TitleContainer } from "@/components/ui/title-container";
import { useSubmitNomination } from "@/hooks/useSubmitNomination";
import { Trophy, Crown, Laugh, Meh, Coffee, Shirt } from "lucide-react";

const categoryLabels = {
  mostpopularKing: { label: "Most Popular (King)", icon: Crown },
  mostpopularQueen: { label: "Most Popular (Queen)", icon: Crown },
  mostkind: { label: "Most Kind", icon: Trophy },
  mostfunny: { label: "Most Funny", icon: Laugh },
  mostquiet: { label: "Most Quiet", icon: Meh },
  mostsleepy: { label: "Most Sleepy", icon: Coffee },
  mostfashionable: { label: "Most Fashionable", icon: Shirt },
};

export default function NominationForm() {
  const { user } = useUser();
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();

  useEffect(() => {
    if (isSignedIn && user) {
      localStorage.setItem("nominee_role", user?.publicMetadata?.role);
    } else {
      redirect("/sign-in");
    }
  }, [isSignedIn, user]);

  const form = useForm({
    defaultValues: {
      prefix_mentor: "",
      mostkind_mentor: "",
      mostpopularKing: "",
      mostpopularQueen: "",
      mostfunny: "",
      mostquiet: "",
      mostlate: "",
      mostsleepy: "",
      mostfashionable: "",
    },
  });

  const { submitNomination, loading, submitted } = useSubmitNomination();

  const onSubmit = async (values) => {
    await submitNomination(values);
  };

  if (!isLoaded) {
    return <Spinner size="lg" className="bg-white" />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <Card className="mx-auto w-full max-w-2xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-black">Nomination Intern MSIB 7</CardTitle>
          <Image src="/educourse.png" alt="Educourse Logo" width={200} height={200} className="mx-auto grayscale" />
        </CardHeader>
        <p className="mb-8 text-center text-sm font-bold italic text-destructive">
          &quot;Only One Name Per Category for Nomination.&quot;
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="mt-6 space-y-10">
              <div className="space-y-4">
                <TitleContainer className="text-sm font-bold lg:text-lg">Mentor&apos;s Nominee</TitleContainer>
                <div className="grid grid-cols-3 items-end gap-2">
                  <div className="col-span-3 lg:col-span-1">
                    <FormField
                      control={form.control}
                      name="prefix_mentor"
                      rules={{
                        required: "Please fill in the mentor prefix.",
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-sm font-semibold lg:text-base">
                            <Trophy className="size-4" />
                            Most Kind Mentor
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Please Select Mr/Ms" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mr">Mr</SelectItem>
                              <SelectItem value="Ms">Ms</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-3 lg:col-span-2">
                    <FormField
                      control={form.control}
                      name="mostkind_mentor"
                      rules={{
                        required: "Please fill in the nomination.",
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input id="mostkind_mentor" placeholder="Mentor's Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <TitleContainer className="text-sm font-bold lg:text-lg">Intern&apos;s Nominee</TitleContainer>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {Object.entries(categoryLabels).map(([category, { label, icon: Icon }]) => (
                    <div
                      key={category}
                      className={
                        category === "mostpopularKing" || category === "mostpopularQueen"
                          ? "col-span-2 lg:col-span-1"
                          : "col-span-2"
                      }
                    >
                      <FormField
                        control={form.control}
                        name={category}
                        rules={{
                          required: "Please fill in the nomination.",
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-semibold lg:text-base">
                              <Icon className="size-4" />
                              {label}
                            </FormLabel>
                            <FormControl>
                              <Input id={category} placeholder={label} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              {!submitted && (
                <LoadingButton type="submit" loading={loading} className="w-full">
                  Send Nomination
                </LoadingButton>
              )}
              {user?.publicMetadata?.role && (
                <Button variant="link" asChild>
                  <Link href="/result">Go to Result</Link>
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
      <footer>
        <Button variant="destructive" className="px-6 font-bold" onClick={() => signOut({ redirectUrl: "/sign-in" })}>
          Sign Out
        </Button>
      </footer>
    </main>
  );
}
