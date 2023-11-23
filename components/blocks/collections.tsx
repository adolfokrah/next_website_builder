import { ImageT, LinkT } from 'visio-cms';
import Image from 'next/image';

type CollectionsT = {
  title: string;
  headline: string;
  image: ImageT;
  key: string;
  link: LinkT;
};

export default function Collections({ collections, title }: { collections: CollectionsT[]; title: string }) {
  return (
    <div className="bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

          <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
            {collections.map((collection) => (
              <div key={collection.key} className="group relative">
                <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                  <Image
                    src={collection.image?.url || ''}
                    alt={collection.image?.alt || ''}
                    fill
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <h3 className="mt-6 text-sm text-gray-500">
                  <a href={collection?.link?.url} target={collection?.link?.target}>
                    <span className="absolute inset-0" />
                    {collection.headline}
                  </a>
                </h3>
                <p className="text-base font-semibold text-gray-900">{collection.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
