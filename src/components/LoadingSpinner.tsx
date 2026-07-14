export default function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-pink-100 animate-spin border-t-laken-500" />
        <span className="absolute inset-0 flex items-center justify-center text-lg">
          💕
        </span>
      </div>
      {text && (
        <p className="text-gray-500 text-sm animate-pulse-soft">{text}</p>
      )}
    </div>
  );
}
