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
        title: "Sending Nomination Failed",
        description: "Only One Name Per Category for Nomination.",
        variant: "destructive",
      });
      return;
    }

    const nominees = {
      userId: user.id,
      mostkind_mentor: `${values.prefix_mentor} ${values.mostkind_mentor}`,
      mostpopularKing: values.mostpopularKing,
      mostpopularQueen: values.mostpopularQueen,
      mostkind: values.mostkind,
      mostfunny: values.mostfunny,
      mostquiet: values.mostquiet,
      mostsleepy: values.mostsleepy,
      mostfashionable: values.mostfashionable,
    };

    setLoading(true);

    try {
      await nomineeService.postNominee(nominees);

      setSubmitted(true);
      toast({
        title: "Sending Nomination Successfully",
        description: "Thank you for your participation.",
      });
    } catch (err) {
      toast({
        title: "Sending Nomination Failed",
        description: "Something went wrong. Contact the IT team",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { submitNomination, loading, submitted };
}
