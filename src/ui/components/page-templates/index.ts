/**
 * Page Template Registry & Dispatcher.
 *
 * Maps PageType slugs (from Saleor Dashboard) to specific React template
 * components. The Dispatcher pattern allows different page types to have
 * completely different layouts, structures, and styling.
 *
 * To add a new template:
 * 1. Create a new component (e.g., FaqTemplate.tsx)
 * 2. Add its PageType slug to the registry below
 * 3. Create the corresponding PageType in Saleor Dashboard with that slug
 */

import { AboutTemplate } from "./AboutTemplate";
import { AffiliateTemplate } from "./AffiliateTemplate";
import { ContactTemplate } from "./ContactTemplate";
import { DefaultTemplate } from "./DefaultTemplate";
import { ImprintTemplate } from "./ImprintTemplate";
import { PrivacyTemplate } from "./PrivacyTemplate";
import { ReturnPolicyTemplate } from "./ReturnPolicyTemplate";
import { ShippingTemplate } from "./ShippingTemplate";
import type { PageTemplateComponent } from "./types";

/**
 * Template registry — maps PageType.slug to a React component.
 *
 * The slugs here must match exactly with the PageType slugs
 * configured in the Saleor Dashboard (Content → Page Types).
 */
const templateRegistry: Record<string, PageTemplateComponent> = {
	// Core content pages
	"about-us": AboutTemplate,
	about: AboutTemplate, // alternative slug

	// Legal / compliance pages
	"privacy-policy": PrivacyTemplate,
	privacy: PrivacyTemplate,

	"return-policy": ReturnPolicyTemplate,
	"return-refund-policy": ReturnPolicyTemplate,
	returns: ReturnPolicyTemplate,

	// Logistics
	shipping: ShippingTemplate,
	"shipping-policy": ShippingTemplate,

	// Contact
	"contact-us": ContactTemplate,
	contact: ContactTemplate,

	// Legal notice (EU)
	imprint: ImprintTemplate,
	impressum: ImprintTemplate,

	// Marketing
	"affiliate-program": AffiliateTemplate,
	affiliate: AffiliateTemplate,
};

/**
 * Get the template component for a given PageType slug.
 *
 * Falls back to DefaultTemplate if no specific template is registered.
 */
export function getTemplateForPageType(pageTypeSlug: string): PageTemplateComponent {
	return templateRegistry[pageTypeSlug] ?? DefaultTemplate;
}

// Re-export types for convenience
export type { PageTemplateProps, PageData } from "./types";
