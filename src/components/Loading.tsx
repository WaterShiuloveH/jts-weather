export default function Loading() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
        <h2 className="text-2xl font-bold">Loading Weather Data...</h2>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mt-4"></div>
      </div>
    );
  }
  