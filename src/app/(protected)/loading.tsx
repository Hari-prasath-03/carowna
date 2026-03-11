export default function Loading() {
  return (
    <div className="fixed top-0.3 left-0 right-0 z-50 h-0.75 overflow-hidden">
      <div className="h-full w-full animate-progress-bar bg-primary/90 origin-left" />
    </div>
  );
}
