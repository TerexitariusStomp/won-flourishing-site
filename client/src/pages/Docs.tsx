import SiteLayout from "@/components/SiteLayout";

export default function DocsPage() {
  const basePath = import.meta.env.BASE_URL ?? "/";
  const docsUrl = basePath.endsWith("/")
    ? `${basePath}docs/templeearth-docs.html`
    : `${basePath}/docs/templeearth-docs.html`;

  return (
    <SiteLayout>
      <div className="min-h-screen bg-background">
        <iframe
          title="Temple Earth Documentation"
          src={docsUrl}
          className="w-full min-h-[85vh] border-0"
        />
      </div>
    </SiteLayout>
  );
}
