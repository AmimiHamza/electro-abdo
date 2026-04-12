// Root layout — html/body are provided by [locale]/layout.tsx
// This pattern is used by next-intl for i18n routing with App Router
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
