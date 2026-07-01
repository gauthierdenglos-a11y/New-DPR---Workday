import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";

export function ComingSoon({ title }: { title: string }) {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <Card>
          <CardContent>
            <p className="py-10 text-center text-sm text-muted-foreground">
              Bientôt disponible.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
