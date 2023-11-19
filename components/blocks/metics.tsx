type MetricsT = {
  figure: string | undefined;
  caption: string | undefined;
  key: string | undefined;
};
export default function Metrics({ metrics }: { metrics: MetricsT[] }) {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl className="flex flex-wrap gap-2 justify-center text-center">
          {metrics.map((stat) => (
            <div key={stat?.key || ''} className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">{stat?.caption || ''}</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                {stat?.figure || ''}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
