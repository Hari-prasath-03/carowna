import { Loader } from "@/components/ui/loader";

export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <Loader size={40} />
    </div>
  );
}
