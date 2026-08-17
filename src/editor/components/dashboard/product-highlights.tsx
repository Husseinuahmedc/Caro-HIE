const HIGHLIGHTS = [
  { number: "01", color: "text-brand-accent", title: "إطارات ثابتة", description: "مربع، عمودي، وستوري بقياسات واضحة." },
  { number: "02", color: "text-[#ef8058]", title: "تحرير بصري", description: "طبقات، محاذاة، تجميع، وتحريك مباشر." },
  { number: "03", color: "text-[#c7bdf2]", title: "خطوط عربية", description: "خطوط مضمّنة وخيارات مناسبة للمحتوى العربي." },
  { number: "04", color: "text-[#eee0c5]", title: "تصدير مرن", description: "JSON وSVG وPNG وPDF من نفس المستند." },
];

export function ProductHighlights() {
  return (
    <section id="features" className="-mx-4 scroll-mt-28 bg-primary px-4 py-14 text-white sm:-mx-8 sm:px-8 sm:py-16 lg:-mx-12 lg:px-12" aria-labelledby="features-title">
      <div className="mx-auto max-w-[1296px]">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <span className="text-xs font-black text-white/60">أدوات قليلة، بمكانها الصحيح</span>
            <h2 id="features-title" className="mt-2 text-3xl font-black sm:text-4xl">محرر مركز على الكاروسيل فقط.</h2>
          </div>
          <span className="text-6xl font-black text-brand-accent sm:text-8xl">04</span>
        </div>

        <div className="grid border-y border-white/15 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item, index) => (
            <article key={item.title} className={`flex min-h-56 flex-col px-5 py-6 ${index ? "border-t border-white/15 sm:border-s" : ""} ${index === 2 ? "sm:border-t lg:border-t-0" : ""}`}>
              <span className={`text-sm font-black ${item.color}`}>{item.number}</span>
              <div className="mt-auto">
                <h3 className="text-lg font-black">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
