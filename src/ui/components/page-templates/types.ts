/**
 * Page template type definitions.
 *
 * Defines the common props interface that all page templates receive,
 * and the template registry for the Dispatcher pattern.
 */

import type { PageGetBySlugQuery } from "@/gql/graphql";

/** The page data passed to every template component */
export type PageData = NonNullable<PageGetBySlugQuery["page"]>;

/** Props interface for all page template components */
export interface PageTemplateProps {
	page: PageData;
}

/** A page template component type */
export type PageTemplateComponent = React.ComponentType<PageTemplateProps>;
