/**
 * EditorJS Renderer — Main component.
 *
 * Parses EditorJS JSON content and renders each block using dedicated
 * React components with Tailwind CSS styling. Replaces the old
 * `editorjs-html` + `xss()` pipeline with a type-safe, component-based approach.
 *
 * Usage:
 *   <EditorJSRenderer content={page.content} />
 */

import { BlockRenderer } from "./blocks";
import type { EditorJSBlock, EditorJSDocument } from "./types";

interface EditorJSRendererProps {
	/** Raw JSON string from Saleor's `page.content` field */
	content: string | null | undefined;
	/** Optional wrapper className for the content container */
	className?: string;
}

function parseContent(content: string): EditorJSBlock[] {
	try {
		const doc = JSON.parse(content) as EditorJSDocument;
		if (doc.blocks && Array.isArray(doc.blocks)) {
			return doc.blocks;
		}
		return [];
	} catch {
		return [];
	}
}

export function EditorJSRenderer({ content, className }: EditorJSRendererProps) {
	if (!content) return null;

	const blocks = parseContent(content);
	if (blocks.length === 0) return null;

	return (
		<div className={`space-y-4 ${className || ""}`}>
			{blocks.map((block, index) => (
				<BlockRenderer key={block.id || `block-${index}`} block={block} />
			))}
		</div>
	);
}
