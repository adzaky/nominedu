import { useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import { nomineeService } from "@/services/nominee";
import { useUser } from "@clerk/nextjs";

export function useSubmitNomination() {
  const { toast } = useToast();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitNomination = async (values) => {
    const nomineeNames = Object.values(values);
    const hasDuplicateNames = new Set(nomineeNames).size !== nomineeNames.length;

    if (hasDuplicateNames) {
      toast({
        title: "Nominasi Gagal",
        description: "Setiap kategori harus memiliki nama nominee yang berbeda.",
        variant: "destructive",
      });
      return;
    }

    const nominees = {
      userId: user.id,
      mentor_terbaik: `${values.prefix_mentor} ${values.mentor_terbaik}`,
      terpopulerKing: values.terpopulerKing,
      terpopulerQueen: values.terpopulerQueen,
      terkocak: values.terkocak,
      terdiam: values.terdiam,
      terlambat: values.terlambat,
      terngantuk: values.terngantuk,
      termodis: values.termodis,
    };

    setLoading(true);

    try {
      await nomineeService.postNominee(nominees);

      setSubmitted(true);
      toast({
        title: "Saving Nomination Successfully",
        description: "Thank you for your participation.",
      });
    } catch (err) {
      toast({
        title: "Saving Nomination Failed",
        description: "Something went wrong. Contact the IT team",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { submitNomination, loading, submitted };
}
