function getOffset(timezone: string): string {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: timezone,
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date())
    .find((p) => p.type === "timeZoneName")?.value

  if (!parts) return "+07:00"
  const match = parts.match(/GMT([+-]\d+)(?::(\d+))?/)
  if (!match) return "+07:00"
  const h = String(Math.abs(Number(match[1]))).padStart(2, "0")
  const sign = match[1].startsWith("-") ? "-" : "+"
  return `${sign}${h}:00`
}

export function getTodayRange(timezone = "Asia/Jakarta") {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  const dateStr = formatter.format(new Date())
  const offset = getOffset(timezone)

  return {
    startOfDay: `${dateStr}T00:00:00${offset}`,
    endOfDay: `${dateStr}T23:59:59${offset}`,
  }
}
