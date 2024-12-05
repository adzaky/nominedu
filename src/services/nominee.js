import { fetcher } from "@/lib/instance";

export const nomineeService = {
  getNominees() {
    return fetcher.get("/nominees");
  },
  postNominee(data) {
    return fetcher.post("/nominees", data);
  },
  getTopNominees() {
    return fetcher.get("/result");
  },
};
