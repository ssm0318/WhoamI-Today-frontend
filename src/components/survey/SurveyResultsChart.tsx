import { SurveyDistribution } from '@models/survey';

import { RENDERER_REGISTRY } from './results/registry';

interface Props {
  distribution: SurveyDistribution;
}

/**
 * Thin dispatcher — looks up the renderer in RENDERER_REGISTRY by `distribution.kind`.
 * Add new kinds in src/components/survey/results/registry.ts (and the mirrored
 * backend strategy in surveys/aggregation.py).
 */
export function SurveyResultsChart({ distribution }: Props) {
  const Renderer = RENDERER_REGISTRY[distribution.kind];
  if (!Renderer) return null;
  return <Renderer distribution={distribution} />;
}
