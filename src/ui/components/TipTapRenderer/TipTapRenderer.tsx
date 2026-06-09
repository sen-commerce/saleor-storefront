import React from "react";
import Link from "next/link";

interface TipTapMark {
	type: string;
	attrs?: Record<string, any>;
}

interface TipTapNode {
	type: string;
	text?: string;
	marks?: TipTapMark[];
	attrs?: Record<string, any>;
	content?: TipTapNode[];
}

interface TipTapRendererProps {
	node: TipTapNode | string | null | undefined;
}

const renderTextNode = (node: TipTapNode, index: number): React.ReactNode => {
	let element: React.ReactNode = node.text || "";

	if (node.marks) {
		// Sort marks to ensure proper nesting order if needed
		for (const mark of node.marks) {
			if (mark.type === "bold") {
				element = <strong key={index}>{element}</strong>;
			} else if (mark.type === "italic") {
				element = <em key={index}>{element}</em>;
			} else if (mark.type === "underline") {
				element = <u key={index}>{element}</u>;
			} else if (mark.type === "strike") {
				element = <s key={index}>{element}</s>;
			} else if (mark.type === "code") {
				element = (
					<code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-rose-600" key={index}>
						{element}
					</code>
				);
			} else if (mark.type === "link" && mark.attrs?.href) {
				element = (
					<Link
						key={index}
						href={mark.attrs.href}
						target={mark.attrs.target || "_blank"}
						rel={mark.attrs.rel || "noopener noreferrer"}
						className="text-blue-600 hover:underline"
					>
						{element}
					</Link>
				);
			}
		}
	}

	return <React.Fragment key={index}>{element}</React.Fragment>;
};

const renderNode = (node: TipTapNode, index: number): React.ReactNode => {
	if (node.type === "text") {
		return renderTextNode(node, index);
	}

	const children = node.content ? node.content.map((child, i) => renderNode(child, i)) : null;

	switch (node.type) {
		case "doc":
			return <div className="tiptap-doc space-y-4">{children}</div>;
		case "paragraph":
			const isCentered = node.attrs?.textAlign === "center";
			const isRight = node.attrs?.textAlign === "right";
			return (
				<p
					key={index}
					className={`my-4 leading-relaxed text-slate-700 ${
						isCentered ? "text-center" : isRight ? "text-right" : "text-left"
					}`}
				>
					{children || <br />}
				</p>
			);
		case "heading":
			const level = node.attrs?.level || 2;
			const headingAlign =
				node.attrs?.textAlign === "center"
					? "text-center"
					: node.attrs?.textAlign === "right"
						? "text-right"
						: "";
			const headingClasses = `font-bold text-slate-900 my-6 ${headingAlign}`;

			if (level === 1)
				return (
					<h1 key={index} className={`${headingClasses} mt-8 text-3xl md:text-4xl`}>
						{children}
					</h1>
				);
			if (level === 2)
				return (
					<h2 key={index} className={`${headingClasses} mt-6 border-b pb-2 text-2xl md:text-3xl`}>
						{children}
					</h2>
				);
			if (level === 3)
				return (
					<h3 key={index} className={`${headingClasses} mt-5 text-xl md:text-2xl`}>
						{children}
					</h3>
				);
			return (
				<h4 key={index} className={`${headingClasses} mt-4 text-lg md:text-xl`}>
					{children}
				</h4>
			);

		case "bulletList":
			return (
				<ul key={index} className="my-4 list-disc space-y-2 pl-6 text-slate-700">
					{children}
				</ul>
			);
		case "orderedList":
			return (
				<ol key={index} className="my-4 list-decimal space-y-2 pl-6 text-slate-700">
					{children}
				</ol>
			);
		case "listItem":
			return (
				<li key={index} className="leading-relaxed">
					{children}
				</li>
			);
		case "blockquote":
			return (
				<blockquote
					key={index}
					className="my-6 rounded-r border-l-4 border-blue-500 bg-slate-50 py-2 pl-4 italic text-slate-600"
				>
					{children}
				</blockquote>
			);
		case "codeBlock":
			return (
				<pre
					key={index}
					className="my-6 overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-sm text-slate-100"
				>
					<code>{children}</code>
				</pre>
			);
		case "horizontalRule":
			return <hr key={index} className="my-8 border-t border-dashed border-slate-300" />;
		case "hardBreak":
			return <br key={index} />;
		case "image":
			if (!node.attrs?.src) return null;
			return (
				<div key={index} className="my-8 flex flex-col items-center">
					<img
						src={node.attrs.src}
						alt={node.attrs.alt || ""}
						title={node.attrs.title || ""}
						className="h-auto max-w-full rounded-lg shadow-md"
					/>
					{node.attrs.alt && <span className="mt-2 text-sm italic text-slate-500">{node.attrs.alt}</span>}
				</div>
			);
		case "table":
			return (
				<div key={index} className="my-6 overflow-x-auto rounded-lg border">
					<table className="min-w-full divide-y divide-slate-200">{children}</table>
				</div>
			);
		case "tableRow":
			return (
				<tr key={index} className="divide-x divide-slate-200">
					{children}
				</tr>
			);
		case "tableHeader":
			return (
				<th
					key={index}
					className="border-b bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900"
				>
					{children}
				</th>
			);
		case "tableCell":
			return (
				<td key={index} className="border-b px-4 py-3 text-sm text-slate-700">
					{children}
				</td>
			);
		default:
			return children;
	}
};

export const TipTapRenderer = ({ node }: TipTapRendererProps) => {
	if (!node) {
		return null;
	}

	let parsedNode: TipTapNode | null = null;

	if (typeof node === "string") {
		try {
			parsedNode = JSON.parse(node) as TipTapNode;
		} catch (e) {
			console.error("Failed to parse TipTap JSON string", e);
			return null;
		}
	} else {
		parsedNode = node as TipTapNode;
	}

	if (!parsedNode) {
		return null;
	}

	// If top level is not a document, wrap it
	if (parsedNode.type !== "doc") {
		parsedNode = {
			type: "doc",
			content: [parsedNode],
		};
	}

	return (
		<div className="tiptap-rendered-content prose prose-slate max-w-none">{renderNode(parsedNode, 0)}</div>
	);
};
