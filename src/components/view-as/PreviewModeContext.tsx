import { createContext, ReactNode, useContext, useMemo } from 'react';
import { VisibilityTier } from '@models/viewAs';

interface PreviewModeContextValue {
  previewMode: boolean;
  viewAs: VisibilityTier | null;
  viewAsUser: string | null;
}

const DEFAULT_VALUE: PreviewModeContextValue = {
  previewMode: false,
  viewAs: null,
  viewAsUser: null,
};

const PreviewModeContext = createContext<PreviewModeContextValue>(DEFAULT_VALUE);

interface PreviewModeProviderProps {
  viewAs?: VisibilityTier | null;
  viewAsUser?: string | null;
  children: ReactNode;
}

export function PreviewModeProvider({
  viewAs = null,
  viewAsUser = null,
  children,
}: PreviewModeProviderProps) {
  const value = useMemo(() => ({ previewMode: true, viewAs, viewAsUser }), [viewAs, viewAsUser]);
  return <PreviewModeContext.Provider value={value}>{children}</PreviewModeContext.Provider>;
}

export const useIsPreviewMode = (): boolean => useContext(PreviewModeContext).previewMode;
export const useViewAs = (): VisibilityTier | null => useContext(PreviewModeContext).viewAs;
export const useViewAsUser = (): string | null => useContext(PreviewModeContext).viewAsUser;
