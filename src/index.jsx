import { useLocation } from 'preact-iso';
// Import statement for the logo is commented out because it's causing build issues
// import openneptuneLogo from '../assets/OpenNept4une.svg';

export function Header() {
	const { url } = useLocation();

	return (
		<header>
			<a href={import.meta.env.BASE_URL}>
				{/* Commenting out the logo image as it is causing build issues */}
				{/* <img src={openneptuneLogo} alt="OpenNeptune logo" class="logo" /> */}
			</a>
			<nav>
				<a href={import.meta.env.BASE_URL} class={url == import.meta.env.BASE_URL ? 'active' : ''}>
					Home
				</a>
				<a href={import.meta.env.BASE_URL+"about"} class={url == import.meta.env.BASE_URL+'about' ? 'active' : ''}>
					About
				</a>
			</nav>
		</header>
	);
}
