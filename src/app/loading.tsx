import { LoadingState } from "@/components/ui/LoadingState";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <LoadingState
        message="Loading SecuTrail..."
        subMessage="Preparing verified resources and safety environment"
      />
    </div>
  );
}
