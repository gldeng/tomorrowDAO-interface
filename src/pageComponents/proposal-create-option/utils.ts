export const formmatDescription = (alias: string[]) => {
  const aliasStr = alias.map((item) => `{${item}}`).join(',');
  return `##GameRanking:${aliasStr}`;
};
