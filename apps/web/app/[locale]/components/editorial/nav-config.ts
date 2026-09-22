/**
 * The public navigation contract (NatGeo-hybrid v6 handoff, §navigation).
 *
 * Two facts here are contractual rather than editorial, and both are
 * asserted in tests:
 *  - the bottom bar carries EXACTLY three destinations ("nunca adicionar
 *    um 4º item"), because a fourth breaks the thumb-reach layout the
 *    handoff measured;
 *  - the footer never repeats the main navigation.
 */

export interface NavItem {
  readonly href: string;
  readonly label: string;
}

/** Desktop inline navigation, shown at ≥900px alongside the category rail. */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Blog", href: "/blog" },
  { label: "Mapa", href: "/mapa" },
  { label: "Frameworks", href: "/frameworks" },
  { label: "Oficina", href: "/oficina" },
  { label: "VERA", href: "/vera" },
] as const;

/**
 * Bottom bar, shown below 900px. Three items, by contract.
 * `BOTTOM_NAV.length === 3` is enforced by test, not by convention.
 */
export const BOTTOM_NAV: readonly NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Oficina", href: "/oficina" },
] as const;

/** Secondary links — footer only, never duplicated into the main nav. */
export const FOOTER_NAV: readonly NavItem[] = [
  { label: "Sobre", href: "/sobre" },
  { label: "Conceitos", href: "/conceitos" },
  { label: "Learn", href: "/oficina/learn" },
] as const;
