import { notFound } from "next/navigation";
import { Compositions } from "./compositions";

// Dev-only: the X marketing images are screenshots of this page, one 1200×1200 section each.
export default function MarketingPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Compositions />;
}
