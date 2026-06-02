interface ProductSkeletonProps {
  count?: number;
}

const ProductSkeleton = ({ count = 4 }: ProductSkeletonProps) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 h-[280px] sm:h-[340px] lg:h-[420px] mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
      </div>
    ))}
  </div>
);

export default ProductSkeleton;
