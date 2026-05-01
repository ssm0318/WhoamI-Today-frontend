/**
 * Renderer registry — maps a distribution `kind` to its React component.
 *
 * To add a new view type:
 *   1. Add the new variant to the `SurveyDistribution` discriminated union in
 *      src/models/survey.ts (mirror surveys/aggregation.py STRATEGIES key).
 *   2. Drop a new component at src/components/survey/results/<Kind>Renderer.tsx
 *      that takes a single `{ distribution }` prop typed to that variant.
 *   3. Register the kind → component pair below.
 *
 * The dispatcher in `SurveyResultsChart` reads from this map; everything else is
 * existing infrastructure.
 */
import { ComponentType } from 'react';

import { SurveyDistribution } from '@models/survey';

import { AggregatedLikertRenderer } from './AggregatedLikertRenderer';
import { OptionCountsRenderer } from './OptionCountsRenderer';
import { WordcloudRenderer } from './WordcloudRenderer';

type RendererProps<K extends SurveyDistribution['kind']> = {
  distribution: Extract<SurveyDistribution, { kind: K }>;
};

type RendererComponent = ComponentType<{ distribution: SurveyDistribution }>;

export const RENDERER_REGISTRY: Record<SurveyDistribution['kind'], RendererComponent> = {
  aggregated_likert: AggregatedLikertRenderer as RendererComponent,
  option_counts: OptionCountsRenderer as RendererComponent,
  wordcloud: WordcloudRenderer as RendererComponent,
};

export type AnyRendererProps = RendererProps<SurveyDistribution['kind']>;
