import { AdPostingProvider } from "./_context/AdPostingContext";

export default function PostAdLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdPostingProvider>{children}</AdPostingProvider>;
}
