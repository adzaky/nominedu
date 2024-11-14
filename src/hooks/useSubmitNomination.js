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
    const nominees = Object.values(values).filter((nominee) => nominee !== "-");
    const uniqueNominees = new Set(nominees);

    if (uniqueNominees.size !== nominees.length) {
      toast({
        title: "Nominasi Gagal",
        description:
          "Setiap kategori harus memiliki nama nominee yang berbeda.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await nomineeService.postNominee({
        userId: user.id,
        ...values,
      });

      setSubmitted(true);
      toast({
        title: "Nominasi Berhasil",
        description: `Terima kasih atas nominasi Anda!`,
      });
    } catch (err) {
      toast({
        title: "Nominasi Gagal",
        description: `${
          err.data?.message || "Terjadi kesalahan saat mengirim nominasi."
        } Kode Error: ${err.status || "N/A"}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { submitNomination, loading, submitted };
}
