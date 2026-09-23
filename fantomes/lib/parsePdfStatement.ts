import {
  type Transaction,
  type DetectionResult,
  parseFrenchNumber,
  parseDate,
  detectSubscriptions,
} from "./detectSubscriptions";

// Une ligne de relevé ressemble en général à :
// "12/03/2026  PRLV SEPA NETFLIX.COM  1234567AB  -13,99"
// On cherche : une date en début de ligne, un montant signé en fin de ligne,
// et on garde tout ce qu'il y a entre les deux comme libellé.
const LINE_PATTERN =
  /(\d{1,2}[/.]\d{1,2}[/.]\d{2,4})\s+(.+?)\s+(-?\d[\d\s]*[.,]\d{2})\s*€?\s*$/;

async function extractPdfLines(file: File): Promise<string[]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const lines: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    type Item = { str: string; x: number; y: number };
    const items: Item[] = content.items
      .filter((it): it is typeof it & { str: string } => "str" in it && !!it.str.trim())
      .map((it) => ({
        str: it.str,
        x: it.transform[4],
        y: it.transform[5],
      }));

    // Regroupe les fragments de texte par ligne (même hauteur, à ~3px près)
    const rows = new Map<number, Item[]>();
    for (const item of items) {
      const key = Math.round(item.y / 3) * 3;
      if (!rows.has(key)) rows.set(key, []);
      rows.get(key)!.push(item);
    }

    const sortedRows = [...rows.entries()].sort((a, b) => b[0] - a[0]);
    for (const [, rowItems] of sortedRows) {
      const line = rowItems
        .sort((a, b) => a.x - b.x)
        .map((it) => it.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (line) lines.push(line);
    }
  }

  return lines;
}

function linesToTransactions(lines: string[]): Transaction[] {
  const transactions: Transaction[] = [];

  for (const line of lines) {
    const match = line.match(LINE_PATTERN);
    if (!match) continue;

    const [, rawDate, rawLabel, rawAmount] = match;
    const date = parseDate(rawDate);
    const amount = parseFrenchNumber(rawAmount);
    if (!date || amount === null) continue;

    transactions.push({ date, label: rawLabel.trim(), amount });
  }

  return transactions;
}

export async function parsePdfStatement(file: File): Promise<DetectionResult> {
  let lines: string[];
  try {
    lines = await extractPdfLines(file);
  } catch {
    return {
      ok: false,
      error: "Impossible de lire ce PDF — il est peut-être scanné (image) plutôt que texte.",
    };
  }

  const transactions = linesToTransactions(lines);

  if (!transactions.length) {
    return {
      ok: false,
      error:
        "Aucune ligne de transaction reconnue dans ce PDF. La mise en page de ce relevé n'est peut-être pas encore prise en charge.",
    };
  }

  return {
    ok: true,
    subscriptions: detectSubscriptions(transactions),
    transactionCount: transactions.length,
  };
}
