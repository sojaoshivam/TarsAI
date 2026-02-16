export default function BounceLoader() {
  return (
    <div className="flex mt-2 mr-2 items-center justify-center space-x-1">
      <div className="bg-primary h-1 w-1 animate-bounce rounded-full [animation-delay:-0.3s]"></div>
      <div className="bg-primary h-1 w-1 animate-bounce rounded-full [animation-delay:-0.13s]"></div>
      <div className="bg-primary h-1 w-1 animate-bounce rounded-full"></div>
    </div>
  );
}