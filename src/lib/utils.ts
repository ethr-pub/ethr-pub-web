export const txtMiddleEllipsis = (text = '', start = 6, end = 4) => {
  return `${text.substring(0, start)}...${text.substring(text.length - end)}`;
};

export const Object2Message = (obj: Record<string, string>) => {
  const list: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    list.push(`${key}: ${value}`);
  }
  list.sort();
  return list.join('\r\n\n');
};

export const sleep = (ms = 100) => new Promise((r) => setTimeout(r, ms));
