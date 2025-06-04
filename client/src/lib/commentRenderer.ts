export function getDisplayName(comment: any) {
  if (comment.author.displayName) {
    return comment.author.displayName;
  }
  return "Unknown Author";
}

export function getFormattedDate(dateString: string) {
  const date = new Date(dateString.replace(/(\+|-)(\d{2})(\d{2})$/, "$1$2:$3")); // Fix timezone format

  const now = new Date();

  const oneDayMs = 24 * 60 * 60 * 1000;
  const dateDay = date.toDateString();
  const nowDay = now.toDateString();
  const yesterdayDay = new Date(now.getTime() - oneDayMs).toDateString();

  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (dateDay === nowDay) return `Today at ${time}`;
  if (dateDay === yesterdayDay) return `Yesterday at ${time}`;

  return (
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) + ` at ${time}`
  );
}
