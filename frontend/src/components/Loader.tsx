export default function Loading() {
  return (
    <div className='flex gap-2 min-h-full items-center justify-center'>
      {/* <p>Loading ...</p> */}
      <div className='flex gap-2'>
        <div className=' animate-spin w-2 h-2 bg-accent-green'></div>
        <div className=' animate-spin w-2 h-2 bg-accent-red'></div>
        <div className=' animate-spin w-2 h-2 bg-accent-green'></div>
        <div className=' animate-spin w-2 h-2 bg-accent-red'></div>
      </div>
    </div>
  )
}
