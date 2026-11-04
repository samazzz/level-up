import type { Metadata } from "next";
import { ResultsReport } from "@/components/results-report";

export const metadata: Metadata = {
  title: "Your results",
};

export default function ResultsPage() {
  return <ResultsReport />;
}
