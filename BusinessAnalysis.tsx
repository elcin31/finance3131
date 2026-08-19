import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { BusinessAnalysisBlock } from "@/lib/types";

export function BusinessAnalysis({
  blocks,
}: {
  blocks: BusinessAnalysisBlock[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {blocks.map((block) => (
        <Card key={block.title}>
          <CardHeader title={block.title} />
          <CardBody>
            <p className="text-xs leading-relaxed text-ink-700">
              {block.summary}
            </p>
            {block.points.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {block.points.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-xs leading-relaxed text-ink-600"
                  >
                    <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-ink-400" />
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
