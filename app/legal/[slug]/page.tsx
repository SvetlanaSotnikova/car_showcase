const content: Record<string, { title: string; text: string }> = {
  privacy: {
    title: "Privacy & Policy",
    text: "We respect your privacy. We collect only the data necessary to provide our service (email for authentication) and do not share it with third parties, so don't worry, guys)))",
  },
  terms: {
    title: "Terms & Conditions",
    text: "By using CarHub you agree to use the platform responsibly. All car listings are for demonstration purposes only)",
  },
};

export default async function LegalPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const page = content[slug];
  if (!page) return <div className="padding-x padding-y">Page not found.</div>;

  return (
    <section className="overflow-x-hidden">
      <div className="padding-x padding-y max-width mt-12">
        <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
        <p className="text-gray-600 max-w-2xl">{page.text}</p>
      </div>
    </section>
  );
}
