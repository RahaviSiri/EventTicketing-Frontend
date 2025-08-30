import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}) {
  return (
    <Card
      className={cn("shadow-sm", className)}
      style={{ borderColor: "hsl(var(--border))" }}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            {trend && (
              <p
                className={cn(
                  "text-xs font-medium flex items-center gap-1",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                <span>{trend.isPositive ? "↗" : "↘"}</span>
                {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "hsl(var(--primary)/0.1)" }}
          >
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
