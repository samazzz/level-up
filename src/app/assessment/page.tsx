import type { Metadata } from "next";
import { AssessmentRunner } from "@/components/assessment-runner";

export const metadata: Metadata = {
  title: "Assessment",
};

export default function AssessmentPage() {
  return <AssessmentRunner />;
}
