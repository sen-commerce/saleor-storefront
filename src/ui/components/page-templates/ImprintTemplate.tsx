/**
 * Imprint (Legal Notice) page template.
 *
 * Company legal information with structured data display,
 * common in EU/German e-commerce sites (Impressum).
 */

import { EditorJSRenderer } from "@/ui/components/editorjs-renderer";
import type { PageTemplateProps } from "./types";

export function ImprintTemplate({ page }: PageTemplateProps) {
	return (
		<article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
			{/* Header */}
			<header className="mb-10 border-b border-neutral-200 pb-8 dark:border-neutral-800">
				<h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-4xl">
					{page.title}
				</h1>
				<p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
					Legal information as required by applicable law.
				</p>
			</header>

			{/* Legal content — structured, formal appearance */}
			<div className="prose prose-sm prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-h2:mt-8 prose-h2:text-lg prose-h2:font-semibold prose-h2:uppercase prose-h2:tracking-wider prose-h2:text-neutral-500 prose-a:text-blue-600 dark:prose-h2:text-neutral-400 dark:prose-a:text-blue-400">
				<EditorJSRenderer content={page.content} />
			</div>
		</article>
	);
}
