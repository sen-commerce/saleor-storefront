/**
 * EditorJS block type definitions.
 *
 * These types mirror the backend Pydantic models for EditorJS blocks,
 * covering both the original 6 block types and the 6 extended types.
 */

// ── Base Types ──────────────────────────────────────────────────────────────

export interface EditorJSDocument {
	time?: number;
	version?: string;
	blocks: EditorJSBlock[];
}

export type EditorJSBlock =
	| ParagraphBlock
	| HeaderBlock
	| ListBlock
	| QuoteBlock
	| EmbedBlock
	| ImageBlock
	| DelimiterBlock
	| CodeBlock
	| TableBlock
	| WarningBlock
	| ChecklistBlock
	| RawBlock;

// ── Original Block Types ────────────────────────────────────────────────────

export interface ParagraphBlock {
	id?: string;
	type: "paragraph";
	data: {
		text?: string;
		alignment?: string;
		align?: string;
	};
}

export interface HeaderBlock {
	id?: string;
	type: "header";
	data: {
		text?: string;
		level?: number;
		alignment?: string;
		align?: string;
	};
}

export interface ListBlock {
	id?: string;
	type: "list";
	data: {
		style?: "ordered" | "unordered" | "checklist";
		items?: Array<string | NestedListItem>;
		meta?: Record<string, unknown>;
	};
}

export interface NestedListItem {
	content?: string;
	items?: NestedListItem[];
	meta?: Record<string, unknown>;
}

export interface QuoteBlock {
	id?: string;
	type: "quote";
	data: {
		text?: string;
		caption?: string;
		alignment?: string;
		align?: string;
	};
}

export interface EmbedBlock {
	id?: string;
	type: "embed";
	data: {
		embed?: string;
		source?: string;
		caption?: string;
		service?: string;
		width?: number;
		height?: number;
	};
}

export interface ImageBlock {
	id?: string;
	type: "image";
	data: {
		file?: { url?: string };
		url?: string;
		caption?: string;
		withBorder?: boolean;
		withBackground?: boolean;
		stretched?: boolean;
		width?: number;
		height?: number;
	};
}

// ── Extended Block Types ────────────────────────────────────────────────────

export interface DelimiterBlock {
	id?: string;
	type: "delimiter";
	data: Record<string, never>;
}

export interface CodeBlock {
	id?: string;
	type: "code";
	data: {
		code?: string;
	};
}

export interface TableBlock {
	id?: string;
	type: "table";
	data: {
		withHeadings?: boolean;
		content?: Array<Array<string | null>>;
	};
}

export interface WarningBlock {
	id?: string;
	type: "warning";
	data: {
		title?: string;
		message?: string;
	};
}

export interface ChecklistBlock {
	id?: string;
	type: "checklist";
	data: {
		items?: Array<{
			text?: string;
			checked?: boolean;
		}>;
	};
}

export interface RawBlock {
	id?: string;
	type: "raw";
	data: {
		html?: string;
	};
}
