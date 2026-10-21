// ui/src/app/plans/[id]/page.jsx
import { headers } from "next/headers";
import ClientPage from "./ClientPage";

export default async function PlanDetailPage() {
  // This forces Next.js to treat this route as dynamic 
  
  await headers();
  
  return <ClientPage />;
}