// ui/src/app/plans/[id]/page.jsx
import { headers } from "next/headers";
import ClientPage from "./ClientPage";

export default async function PlanDetailPage() {
  // This forces Next.js to treat this route as dynamic 
  // and skip static prerendering during the build.
  await headers();
  
  return <ClientPage />;
}