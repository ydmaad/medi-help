interface Props<Case extends string | number> {
  value: Case;
  caseBy: Partial<Record<Case, JSX.Element | null>>;
  defaultComponent?: JSX.Element | null;
}

export const SwitchCase = <Case extends string | number>({
  value,
  caseBy,
  defaultComponent: defaultComponent = null,
}: Props<Case>) => {
  if (value == null) {
    return defaultComponent;
  }
  return caseBy[value] ?? defaultComponent;
};
