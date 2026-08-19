import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { PortfolioAlert } from "@/lib/types";

export function AlertsPanel({ alerts }: { alerts: PortfolioAlert[] }) {
  return (
    <Card>
      <CardHeader title="Alerts" subtitle={`${alerts.length} active`} />
      <CardBody className="space-y-2">
        {alerts.length === 0 ? (
          <p className="text-xs text-ink-400">
            No active alerts. Portfolio is within configured risk limits.
          </p>
        ) : (
          alerts.map((alert) => (
            <AlertBanner key={alert.id} severity={alert.severity} message={alert.message} />
          ))
        )}
      </CardBody>
    </Card>
  );
}
