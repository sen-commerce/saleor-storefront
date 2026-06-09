/**
 * Shipping page template.
 *
 * Focuses on delivery information with clear sections for shipping methods,
 * timelines, and regional details.
 */

import { EditorJSRenderer } from "@/ui/components/editorjs-renderer";
import type { PageTemplateProps } from "./types";

export function ShippingTemplate({ page }: PageTemplateProps) {
	return (
		<article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
			{/* Header */}
			<header className="mb-10">
				<div className="flex items-center gap-3">
					<span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-xl dark:bg-green-900/30">
						🚚
					</span>
					<h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-4xl">
						{page.title}
					</h1>
				</div>
				{page.seoDescription && (
					<p className="mt-4 text-neutral-600 dark:text-neutral-400">{page.seoDescription}</p>
				)}
			</header>

			{/* Content */}
			<div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-h2:mt-10 prose-h2:flex prose-h2:items-center prose-h2:gap-2 prose-a:text-blue-600 dark:prose-a:text-blue-400">
				<EditorJSRenderer content={page.content} />
			</div>
		</article>
	);
}
