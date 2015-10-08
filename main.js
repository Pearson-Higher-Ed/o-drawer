import Drawer from './src/js/Drawer';

export default Drawer;

const constructAll = () => {
	Drawer.init();
	document.removeEventListener('o.DOMContentLoaded', constructAll);
};

document.addEventListener('o.DOMContentLoaded', constructAll);
