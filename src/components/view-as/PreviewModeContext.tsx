import { createContext, ReactNode, useContext, useMemo } from 'react';
import { VisibilityTier } from '@models/viewAs';

interface PreviewModeContextValue {
  previewMode: boolean;
  viewAs: VisibilityTier | null;
}

const DEFAULT_VALUE: PreviewModeContextValue = {
  previewMode: false,
  viewAs: null,
};

const PreviewModeContext = createContext<PreviewModeContextValue>(DEFAULT_VALUE);

interface PreviewModeProviderProps {
  viewAs: VisibilityTier;
  children: ReactNode;
}

export function PreviewModeProvider({ viewAs, children }: PreviewModeProviderProps) {
  const value = useMemo(() => ({ previewMode: true, viewAs }), [viewAs]);

  return <PreviewModeContext.Provider value={value}>{children}</PreviewModeContext.Provider>;
}

export const useIsPreviewMode = (): boolean => useContext(PreviewModeContext).previewMode;
export const useViewAs = (): VisibilityTier | null => useContext(PreviewModeContext).viewAs;
