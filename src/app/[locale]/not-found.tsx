import Link from "next/link";
import { PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 gap-6">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
        <PackageSearch className="w-12 h-12 text-muted-foreground" />
      </div>
      <div>
        <h1 className="font-heading text-5xl font-bold text-accent">404</h1>
        <h2 className="font-heading text-xl font-bold mt-2">Page non trouvée</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
      </div>
      <Link href="/" className="btn btn-primary px-8 py-3">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
