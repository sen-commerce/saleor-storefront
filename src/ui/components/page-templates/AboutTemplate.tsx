/**
 * About Us page template.
 *
 * Brand story layout with prominent hero section and large typography.
 */

import { EditorJSRenderer } from "@/ui/components/editorjs-renderer";
import type { PageTemplateProps } from "./types";

export function AboutTemplate({ page }: PageTemplateProps) {
	return (
		<article className="mx-auto max-w-4xl px-6 py-12 md:py-20">
			{/* Hero section */}
			<header className="mb-16 text-center">
				<h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 md:text-5xl lg:text-6xl">
					{page.title}
				</h1>
				<p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
					{page.seoDescription}
				</p>
				<div className="mx-auto mt-8 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
			</header>

			{/* Content */}
			<div className="prose prose-lg prose-neutral max-w-none dark:prose-invert prose-headings:text-center prose-headings:tracking-tight prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400">
				<EditorJSRenderer content={page.content} />
			</div>
		</article>
	);
}
