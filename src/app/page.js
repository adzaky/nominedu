"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSubmitNomination } from "@/hooks/useSubmitNomination";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { LoadingButton } from "@/components/ui/loading-button";

const categoryLabels = {
  terkocak: "Terkocak",
  terbucin: "Terbucin",
  tergaul: "Tergaul",
  terpintar: "Terpintar",
  terrajin: "Terrajin",
};

export default function NominationForm() {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      redirect("/sign-in");
    }
  }, [isSignedIn]);

  const form = useForm({
    defaultValues: {
      terkocak: "",
      terbucin: "",
      tergaul: "",
      terpintar: "",
      terrajin: "",
    },
  });

  const { submitNomination, loading, submitted } = useSubmitNomination();

  const onSubmit = async (values) => {
    await submitNomination(values);
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <main className="min-h-screen flex flex-col gap-4 items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Nominasi Ter-Ter Intern
          </CardTitle>
        </CardHeader>
        {submitted ? (
          <CardContent className="text-center text-green-600">
            Terima kasih atas nominasi Anda!
          </CardContent>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 py-6">
                <p className="text-sm italic text-muted-foreground">
                  Jika tidak tahu ingin mengisi siapa, gunakan strip
                  &quot;-&quot;.
                </p>
                {Object.entries(categoryLabels).map(([category, label]) => (
                  <FormField
                    key={category}
                    control={form.control}
                    name={category}
                    rules={{
                      required: `Tidak boleh kosong.`,
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <Input
                            id={category}
                            placeholder={`Masukkan nama nominee`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </CardContent>
              <CardFooter>
                {!submitted && (
                  <LoadingButton
                    type="submit"
                    loading={loading}
                    className="w-full"
                  >
                    Kirim Nominasi
                  </LoadingButton>
                )}
              </CardFooter>
            </form>
          </Form>
        )}
      </Card>
      <footer>
        <Button
          variant="destructive"
          className="px-6 font-bold"
          onClick={() => signOut({ redirectUrl: "/sign-in" })}
        >
          Sign Out
        </Button>
      </footer>
    </main>
  );
}
