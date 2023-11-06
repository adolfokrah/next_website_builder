import { Loader2 } from 'lucide-react';

const Loading = () => (
  <div className="h-screen w-full grid place-items-center">
    <Loader2 size={25} className="mr-2 animate-spin text-brand-green-50" />
  </div>
);

export default Loading;
