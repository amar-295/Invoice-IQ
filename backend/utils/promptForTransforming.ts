type ParsedDateResult = {
	isoDate: string;
	displayDate: string;
};

export type PromptTransformItem = {
	name: string;
	normalizedName: string;
	unit: string;
	quantity: string;
	price: string;
	date: string;
	rawText: string;
};

const datePattern = /(\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/;
const quantityUnitPattern = /(\d+(?:\.\d+)?)\s*([a-zA-Z]{1,10})\b/;

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

const parseDate = (value?: string): ParsedDateResult | null => {
	if (!value) {
		return null;
	}

	const trimmedValue = value.trim();
	if (!trimmedValue) {
		return null;
	}

	if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
		const parsed = new Date(trimmedValue);
		if (!Number.isNaN(parsed.getTime())) {
			return {
				isoDate: parsed.toISOString(),
				displayDate: trimmedValue
			};
		}
	}

	const match = trimmedValue.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
	if (!match) {
		return null;
	}

	const day = Number(match[1]);
	const month = Number(match[2]);
	const year = Number(match[3].length === 2 ? `20${match[3]}` : match[3]);
	const parsed = new Date(year, month - 1, day);

	if (
		Number.isNaN(parsed.getTime()) ||
		parsed.getDate() !== day ||
		parsed.getMonth() !== month - 1 ||
		parsed.getFullYear() !== year
	) {
		return null;
	}

	const isoMonth = String(month).padStart(2, "0");
	const isoDay = String(day).padStart(2, "0");

	return {
		isoDate: parsed.toISOString(),
		displayDate: `${year}-${isoMonth}-${isoDay}`
	};
};

const sanitizeName = (value: string): string => {
	return normalizeWhitespace(
		value
			.replace(/^[\-•*\d.)\s]+/, "")
			.replace(/[,:;]+$/g, "")
	);
};

const parsePromptLine = (line: string, fallbackDate: string): PromptTransformItem | null => {
	const cleanedLine = normalizeWhitespace(line.replace(/^[\-•*\s]+/, ""));
	if (!cleanedLine) {
		return null;
	}

	const commaParts = cleanedLine.split(",").map((part) => normalizeWhitespace(part)).filter(Boolean);

	let name = "";
	let quantity = "";
	let unit = "";
	let price = "";
	let date = fallbackDate;

	if (commaParts.length >= 3) {
		name = sanitizeName(commaParts[0] || "");

		const quantityMatch = (commaParts[1] || "").match(quantityUnitPattern);
		if (quantityMatch) {
			quantity = quantityMatch[1] || "";
			unit = quantityMatch[2] || "";
		}

		price = normalizeWhitespace((commaParts[2] || "").replace(/^(rs\.?|inr|₹)\s*/i, ""));

		const parsedDate = parseDate(commaParts[3]);
		if (parsedDate) {
			date = parsedDate.displayDate;
		}
	} else {
		const detectedDate = cleanedLine.match(datePattern)?.[0];
		const parsedDate = parseDate(detectedDate);
		if (parsedDate) {
			date = parsedDate.displayDate;
		}

		const withoutDate = detectedDate ? cleanedLine.replace(detectedDate, " ") : cleanedLine;
		const compactLine = normalizeWhitespace(withoutDate);

		const quantityMatch = compactLine.match(quantityUnitPattern);
		if (!quantityMatch) {
			return null;
		}

		quantity = quantityMatch[1] || "";
		unit = quantityMatch[2] || "";

		const quantityIndex = quantityMatch.index ?? 0;
		name = sanitizeName(compactLine.slice(0, quantityIndex));

		const trailingText = normalizeWhitespace(compactLine.slice(quantityIndex + quantityMatch[0].length));
		const priceMatch = trailingText.match(/(?:rs\.?|inr|₹)?\s*([\d.]+(?:,\d{3})*(?:\.\d+)?)$/i);
		if (priceMatch) {
			price = normalizeWhitespace(priceMatch[1] || "");
		}
	}

	if (!name || !quantity || !unit || !price) {
		return null;
	}

	return {
		name,
		normalizedName: name.toLowerCase(),
		unit: unit.trim(),
		quantity: quantity.trim(),
		price: price.trim(),
		date,
		rawText: cleanedLine
	};
};

export const transformPromptToDeliveryItems = (prompt: string, fallbackDate: string): PromptTransformItem[] => {
	const normalizedPrompt = prompt
		.split(/\r?\n|;/)
		.map((line) => line.trim())
		.filter(Boolean);

	return normalizedPrompt
		.map((line) => parsePromptLine(line, fallbackDate))
		.filter((item): item is PromptTransformItem => Boolean(item));
};
