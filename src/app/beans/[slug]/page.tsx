import Image from "next/image";
import BeanSummary from "@/components/BeanSummary";

type Bean = {
  id: string;
  type: "bean" | "goods";
  name: string;
  price: number;
  weight?: string;
  image: string;
  cupnote?: string;
  desc?: string;
};

export default async function BeanDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE!;
  const res = await fetch(`${apiBase}/products/${params.slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return <div className="p-6">상품을 찾을 수 없습니다.</div>;
  const bean: Bean = await res.json();

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <nav className="mb-6 text-sm text-neutral-500">원두 / {bean.name}</nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border bg-white">
          <div className="relative h-full min-h-[320px] md:min-h-[520px]">
            <Image
              src={bean.image}
              alt={bean.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        <section className="space-y-4">
          <h1 className="text-2xl font-semibold">{bean.name}</h1>
          <p className="text-neutral-600">중량: {bean.weight}</p>
          <p className="text-xl font-bold">{bean.price.toLocaleString()}원</p>

          <div className="rounded-2xl border bg-white p-4">
            <h2 className="mb-2 text-sm font-medium text-neutral-700">
              컵노트
            </h2>
            <p className="leading-relaxed text-neutral-800">{bean.cupnote}</p>
          </div>

          <BeanSummary
            beanName={bean.name}
            cupnote={bean.cupnote}
            fallbackDesc={bean.desc}
          />

          <div className="flex gap-3 pt-2">
            <button className="rounded-xl bg-black px-4 py-2 text-white">
              장바구니
            </button>
            <button className="rounded-xl border px-4 py-2">구매하기</button>
          </div>
        </section>
      </div>
    </main>
  );
}
