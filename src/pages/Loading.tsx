const Loading = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  );
};

export default Loading;
