import {
  type Transaction,
  type DetectionResult,
  parseFrenchNumber,
  parseDate,
  detectSubscriptions,
} from "./detectSubscriptions";

type RawItem = { str: string; x: number; y: number };

const DATE_PATTERN = /^\d{1,2}[/.]\d{1,2}[/.]\d{2,4}$/;
const AMOUNT_ITEM_PATTERN = /^(-?\d[\d\s]*[.,]\d{2})\s*(EUR|€)?$/i;
const EUR_ONLY_PATTERN = /^(EUR|€)$/i;

function stripAccents(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function extractPdfItemsByPage(file: File): Promise<RawItem[][]> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  const pages: RawItem[][] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const rawItems = content.items as Array<{ str?: string; transform?: number[] }>;
    const items: RawItem[] = rawItems
      .filter(
        (it): it is { str: string; transform: number[] } =>
          typeof it.str === "string" && it.str.trim().length > 0 && !!it.transform
      )
      .map((it) => ({ str: it.str.trim(), x: it.transform[4], y: it.transform[5] }));
    pages.push(items);
  }

  return pages;
}

function groupIntoRows(items: RawItem[]): RawItem[][] {
  const rows = new Map<number, RawItem[]>();
  for (const item of items) {
    const key = Math.round(item.y / 3) * 3;
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key)!.push(item);
  }
  return [...rows.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([, rowItems]) => rowItems.sort((a, b) => a.x - b.x));
}

function findColumnX(rows: RawItem[][], keyword: string): number | null {
  for (const row of rows) {
    const match = row.find((it) => stripAccents(it.str).startsWith(keyword));
    if (match) return match.x;
  }
  return null;
}

export async function parsePdfStatement(file: File): Promise<DetectionResult> {
  let pages: RawItem[][];
  try {
    pages = await extractPdfItemsByPage(file);
  } catch {
    return {
      ok: false,
      error:
        "Impossible de lire ce PDF — il est peut-être scanné (image) plutôt que texte.",
    };
  }

  const transactions: Transaction[] = [];
  let debitX: number | null = null;
  let creditX: number | null = null;

  for (const items of pages) {
    const rows = groupIntoRows(items);

    const pageDebitX = findColumnX(rows, "debit");
    const pageCreditX = findColumnX(rows, "credit");
    if (pageDebitX !== null) debitX = pageDebitX;
    if (pageCreditX !== null) creditX = pageCreditX;

    for (const row of rows) {
      const dateItem = row[0];
      if (!dateItem || !DATE_PATTERN.test(dateItem.str)) continue;

      const amountItems = row.filter((it) => AMOUNT_ITEM_PATTERN.test(it.str));
      if (amountItems.length !== 1) continue; // ligne ambiguë (0 ou plusieurs montants) : on l'ignore

      const amountItem = amountItems[0];
      const match = amountItem.str.match(AMOUNT_ITEM_PATTERN);
      const date = parseDate(dateItem.str);
      const rawAmount = match ? parseFrenchNumber(match[1]) : null;
      if (!date || rawAmount === null) continue;

      let signedAmount: number;
      if (debitX !== null && creditX !== null) {
        const distToDebit = Math.abs(amountItem.x - debitX);
        const distToCredit = Math.abs(amountItem.x - creditX);
        signedAmount = distToDebit <= distToCredit ? -Math.abs(rawAmount) : Math.abs(rawAmount);
      } else {
        // Colonnes Débit/Crédit non repérées : on suppose une sortie d'argent
        signedAmount = -Math.abs(rawAmount);
      }

      const label = row
        .slice(1)
        .filter((it) => it !== amountItem && !EUR_ONLY_PATTERN.test(it.str))
        .map((it) => it.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (!label) continue;

      transactions.push({ date, label, amount: signedAmount });
    }
  }

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
