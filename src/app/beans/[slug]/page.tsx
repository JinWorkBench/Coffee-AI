import Image from "next/image";
import BeanSummary from "@/components/BeanSummary";

const MOCK_BEANS = {
  "1": {
    name: "콜롬비아 알토 씨엘로 게이샤 워시드",
    price: 18000,
    weight: "100g, 200g",
    image: "/coffee/beans.jpg",
    cupnote: "자스민, 아카시아, 자몽, 화이트와인",
    desc: "게이샤의 맛과 향이 오롯이 느껴질 수 있도록 섬세하게 가공하여 꽃향들이 정갈하게 담겨있습니다.",
  },
  "2": {
    name: "인도네시아 가요 쁘가싱 CM 내추럴",
    price: 17000,
    weight: "100g, 200g",
    image: "/coffee/beans.jpg",
    cupnote: "적포도, 멜론, 카카오닙스, 레드와인",
    desc: "적포도 같은 산미와 멜론의 시원한 느낌의 단맛, 질감과 밸런스가 좋은 커피입니다.",
  },
} as const;

type Params = { params: { slug: keyof typeof MOCK_BEANS } };

export default function BeanDetailPage({ params }: Params) {
  const bean = MOCK_BEANS[params.slug];
  if (!bean) return <div className="p-6">상품을 찾을 수 없습니다.</div>;

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
