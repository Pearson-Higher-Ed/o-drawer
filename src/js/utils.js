export function dispatchEvent(element, name) {
	if (document.createEvent && element.dispatchEvent) {
		const event = document.createEvent('Event');

		event.initEvent(name, true, true);
		element.dispatchEvent(event);
	}
};
