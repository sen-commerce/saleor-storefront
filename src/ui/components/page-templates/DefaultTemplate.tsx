/**
 * Default page template — fallback for unrecognized PageType slugs.
 *
 * Renders the page title + EditorJS content with clean typography.
 */

import { EditorJSRenderer } from "@/ui/components/editorjs-renderer";
import type { PageTemplateProps } from "./types";

export function DefaultTemplate({ page }: PageTemplateProps) {
	return (
		<article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
			{/* Page header */}
			<header className="mb-10">
				<h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-4xl">
					{page.title}
				</h1>
				{page.publishedAt && (
					<time
						dateTime={page.publishedAt}
						className="mt-3 block text-sm text-neutral-500 dark:text-neutral-400"
					>
						{new Date(page.publishedAt).toLocaleDateString(undefined, {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</time>
				)}
			</header>

			{/* Content body */}
			<div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400">
				<EditorJSRenderer content={page.content} />
			</div>
		</article>
	);
}
