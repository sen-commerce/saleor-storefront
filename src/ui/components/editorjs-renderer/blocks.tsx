/**
 * EditorJS block renderer components.
 *
 * Each EditorJS block type maps to a dedicated React component that renders
 * it with Tailwind CSS styling. HTML content from EditorJS is sanitized
 * using DOMPurify before being rendered via dangerouslySetInnerHTML.
 */

import xss from "xss";
import type {
	ChecklistBlock,
	CodeBlock,
	DelimiterBlock,
	EditorJSBlock,
	EmbedBlock,
	HeaderBlock,
	ImageBlock,
	ListBlock,
	NestedListItem,
	ParagraphBlock,
	QuoteBlock,
	RawBlock,
	TableBlock,
	WarningBlock,
} from "./types";

// ── HTML Sanitization ───────────────────────────────────────────────────────

function sanitize(html: string): string {
	return xss(html, {
		whiteList: {
			b: [],
			i: [],
			em: [],
			strong: [],
			a: ["href", "target", "rel", "class"],
			br: [],
			u: [],
			s: [],
			mark: [],
			code: [],
			span: [],
			sub: [],
			sup: [],
		},
	});
}

// ── Paragraph ───────────────────────────────────────────────────────────────

export function ParagraphRenderer({ block }: { block: ParagraphBlock }) {
	if (!block.data.text) return null;
	const align = block.data.alignment || block.data.align;
	return (
		<p
			className={`text-base leading-relaxed text-neutral-700 dark:text-neutral-300 ${
				align === "center" ? "text-center" : align === "right" ? "text-right" : ""
			}`}
			dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }}
		/>
	);
}

// ── Header ──────────────────────────────────────────────────────────────────

const headerStyles: Record<number, string> = {
	1: "text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-10 mb-4",
	2: "text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 mt-8 mb-3",
	3: "text-xl md:text-2xl font-semibold text-neutral-800 dark:text-neutral-200 mt-6 mb-2",
};

export function HeaderRenderer({ block }: { block: HeaderBlock }) {
	if (!block.data.text) return null;
	const level = block.data.level ?? 2;
	const Tag = `h${Math.min(Math.max(level, 1), 6)}` as any;
	const align = block.data.alignment || block.data.align;
	return (
		<Tag
			className={`${headerStyles[level] || headerStyles[3]} ${
				align === "center" ? "text-center" : align === "right" ? "text-right" : ""
			}`}
			dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }}
		/>
	);
}

// ── List ────────────────────────────────────────────────────────────────────

function renderListItems(items: Array<string | NestedListItem>, isOrdered: boolean) {
	const Tag = isOrdered ? "ol" : "ul";
	return (
		<Tag
			className={`space-y-1.5 ${
				isOrdered ? "list-decimal" : "list-disc"
			} pl-6 text-neutral-700 dark:text-neutral-300`}
		>
			{items.map((item, i) => {
				if (typeof item === "string") {
					return <li key={i} dangerouslySetInnerHTML={{ __html: sanitize(item) }} />;
				}
				return (
					<li key={i}>
						{item.content && <span dangerouslySetInnerHTML={{ __html: sanitize(item.content) }} />}
						{item.items && item.items.length > 0 && renderListItems(item.items, isOrdered)}
					</li>
				);
			})}
		</Tag>
	);
}

export function ListRenderer({ block }: { block: ListBlock }) {
	if (!block.data.items || block.data.items.length === 0) return null;
	const isOrdered = block.data.style === "ordered";
	return renderListItems(block.data.items, isOrdered);
}

// ── Quote ───────────────────────────────────────────────────────────────────

export function QuoteRenderer({ block }: { block: QuoteBlock }) {
	if (!block.data.text) return null;
	return (
		<blockquote className="relative my-6 border-l-4 border-neutral-300 bg-neutral-50 py-4 pl-6 pr-4 italic text-neutral-600 dark:border-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-400">
			<div dangerouslySetInnerHTML={{ __html: sanitize(block.data.text) }} />
			{block.data.caption && (
				<cite className="mt-2 block text-sm font-medium not-italic text-neutral-500 dark:text-neutral-500">
					— <span dangerouslySetInnerHTML={{ __html: sanitize(block.data.caption) }} />
				</cite>
			)}
		</blockquote>
	);
}

// ── Embed ───────────────────────────────────────────────────────────────────

export function EmbedRenderer({ block }: { block: EmbedBlock }) {
	if (!block.data.embed) return null;
	return (
		<figure className="my-6">
			<div className="relative aspect-video overflow-hidden rounded-lg">
				<iframe
					src={block.data.embed}
					className="absolute inset-0 h-full w-full"
					allowFullScreen
					loading="lazy"
					title={block.data.caption || "Embedded content"}
				/>
			</div>
			{block.data.caption && (
				<figcaption className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
					<span dangerouslySetInnerHTML={{ __html: sanitize(block.data.caption) }} />
				</figcaption>
			)}
		</figure>
	);
}

// ── Image ───────────────────────────────────────────────────────────────────

export function ImageRenderer({ block }: { block: ImageBlock }) {
	const url = block.data.file?.url || block.data.url;
	if (!url) return null;

	const borderClass = block.data.withBorder ? "border border-neutral-200 dark:border-neutral-700" : "";
	const bgClass = block.data.withBackground ? "bg-neutral-100 dark:bg-neutral-800 p-4" : "";
	const stretchClass = block.data.stretched ? "w-full" : "max-w-2xl mx-auto";

	return (
		<figure className={`my-6 ${stretchClass} ${bgClass}`}>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={url}
				alt={block.data.caption || ""}
				className={`w-full rounded-lg ${borderClass}`}
				loading="lazy"
			/>
			{block.data.caption && (
				<figcaption className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
					<span dangerouslySetInnerHTML={{ __html: sanitize(block.data.caption) }} />
				</figcaption>
			)}
		</figure>
	);
}

// ── Delimiter ───────────────────────────────────────────────────────────────

export function DelimiterRenderer({ block: _block }: { block: DelimiterBlock }) {
	return (
		<div className="my-8 flex items-center justify-center gap-2">
			<span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
			<span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
			<span className="h-1.5 w-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
		</div>
	);
}

// ── Code ────────────────────────────────────────────────────────────────────

export function CodeRenderer({ block }: { block: CodeBlock }) {
	if (!block.data.code) return null;
	return (
		<pre className="my-6 overflow-x-auto rounded-lg bg-neutral-900 p-4 text-sm text-neutral-100 dark:bg-neutral-950">
			<code>{block.data.code}</code>
		</pre>
	);
}

// ── Table ───────────────────────────────────────────────────────────────────

export function TableRenderer({ block }: { block: TableBlock }) {
	if (!block.data.content || block.data.content.length === 0) return null;

	const hasHeadings = block.data.withHeadings;
	const [headRow, ...bodyRows] = hasHeadings
		? [block.data.content[0], ...block.data.content.slice(1)]
		: [null, ...block.data.content];

	return (
		<div className="my-6 overflow-x-auto">
			<table className="w-full border-collapse text-sm">
				{headRow && (
					<thead>
						<tr className="border-b-2 border-neutral-200 dark:border-neutral-700">
							{headRow.map((cell, i) => (
								<th
									key={i}
									className="px-4 py-2.5 text-left font-semibold text-neutral-900 dark:text-neutral-100"
									dangerouslySetInnerHTML={{ __html: sanitize(cell || "") }}
								/>
							))}
						</tr>
					</thead>
				)}
				<tbody>
					{bodyRows.map((row, ri) =>
						row ? (
							<tr
								key={ri}
								className="border-b border-neutral-100 even:bg-neutral-50 dark:border-neutral-800 dark:even:bg-neutral-900/30"
							>
								{row.map((cell, ci) => (
									<td
										key={ci}
										className="px-4 py-2.5 text-neutral-700 dark:text-neutral-300"
										dangerouslySetInnerHTML={{ __html: sanitize(cell || "") }}
									/>
								))}
							</tr>
						) : null,
					)}
				</tbody>
			</table>
		</div>
	);
}

// ── Warning ─────────────────────────────────────────────────────────────────

export function WarningRenderer({ block }: { block: WarningBlock }) {
	if (!block.data.title && !block.data.message) return null;
	return (
		<div className="my-6 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
			{block.data.title && (
				<p className="mb-1 font-semibold text-amber-800 dark:text-amber-300">
					⚠️ <span dangerouslySetInnerHTML={{ __html: sanitize(block.data.title) }} />
				</p>
			)}
			{block.data.message && (
				<p
					className="text-sm text-amber-700 dark:text-amber-400"
					dangerouslySetInnerHTML={{ __html: sanitize(block.data.message) }}
				/>
			)}
		</div>
	);
}

// ── Checklist ───────────────────────────────────────────────────────────────

export function ChecklistRenderer({ block }: { block: ChecklistBlock }) {
	if (!block.data.items || block.data.items.length === 0) return null;
	return (
		<ul className="my-4 space-y-2">
			{block.data.items.map((item, i) => (
				<li key={i} className="flex items-start gap-2.5">
					<span
						className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border ${
							item.checked
								? "border-green-500 bg-green-500 text-white"
								: "border-neutral-300 dark:border-neutral-600"
						}`}
					>
						{item.checked && (
							<svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
						)}
					</span>
					<span
						className={`text-neutral-700 dark:text-neutral-300 ${
							item.checked ? "line-through opacity-60" : ""
						}`}
						dangerouslySetInnerHTML={{ __html: sanitize(item.text || "") }}
					/>
				</li>
			))}
		</ul>
	);
}

// ── Raw HTML ────────────────────────────────────────────────────────────────

export function RawRenderer({ block }: { block: RawBlock }) {
	if (!block.data.html) return null;
	// Raw HTML is sanitized using xss with added iframe support
	const cleanHtml = xss(block.data.html, {
		whiteList: {
			iframe: [
				"src",
				"width",
				"height",
				"frameborder",
				"allow",
				"allowfullscreen",
				"class",
				"style",
				"scrolling",
			],
			div: ["class", "style"],
			p: ["class", "style"],
			span: ["class", "style"],
		},
	});
	return <div className="my-6" dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
}

// ── Block Router ────────────────────────────────────────────────────────────

export function BlockRenderer({ block }: { block: EditorJSBlock }) {
	switch (block.type) {
		case "paragraph":
			return <ParagraphRenderer block={block} />;
		case "header":
			return <HeaderRenderer block={block} />;
		case "list":
			return <ListRenderer block={block} />;
		case "quote":
			return <QuoteRenderer block={block} />;
		case "embed":
			return <EmbedRenderer block={block} />;
		case "image":
			return <ImageRenderer block={block} />;
		case "delimiter":
			return <DelimiterRenderer block={block} />;
		case "code":
			return <CodeRenderer block={block} />;
		case "table":
			return <TableRenderer block={block} />;
		case "warning":
			return <WarningRenderer block={block} />;
		case "checklist":
			return <ChecklistRenderer block={block} />;
		case "raw":
			return <RawRenderer block={block} />;
		default:
			// Unknown block type — gracefully skip
			return null;
	}
}
