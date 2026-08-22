const STATS_PLACEHOLDER = <div className='mb-4 h-5 w-44 rounded bg-surface0' />;

export function TextSkeleton() {
  return (
    <div className='animate-pulse'>
      {STATS_PLACEHOLDER}
      <div className='flex flex-col gap-5'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='flex flex-col gap-2'>
            <div className='h-3 w-48 rounded bg-surface0' />
            <div className='h-5 w-72 rounded bg-surface0' />
            <div className='flex flex-col gap-1.5'>
              <div className='h-3 w-full rounded bg-surface0' />
              <div className='h-3 w-3/4 rounded bg-surface0' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ImageSkeleton() {
  return (
    <div className='animate-pulse'>
      {STATS_PLACEHOLDER}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className='rounded-lg overflow-hidden bg-surface0/50'>
            <div className='w-full h-32 bg-surface0' />
            <div className='px-2 py-1.5'>
              <div className='h-3 w-3/4 rounded bg-surface0' />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
