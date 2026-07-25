import { Header } from "@/components/Header";
import { TimesheetDetail } from "@/components/TimesheetDetail";

export default async function TimesheetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="min-h-screen">
      <Header />
      <TimesheetDetail id={id} />
    </div>
  );
}
