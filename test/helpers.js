export function isExpanded(element) {
	return element.classList.contains('o-drawer-open') &&
		element.getAttribute('aria-expanded') === 'true';
}
