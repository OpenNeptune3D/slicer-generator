import { useLocation } from 'preact-iso';
import openneptuneLogo from 'https://raw.githubusercontent.com/OpenNeptune3D/slicer-generator/main/src/assets/OpenNept4une.svg';

export function Header() {
	const { url } = useLocation();

	return (
		<header>
			<a href={import.meta.env.BASE_URL}>
			<img src={openneptuneLogo} alt="OpenNeptune logo" class="logo" />
			</a>
			<nav>
				<a href={import.meta.env.BASE_URL} class={url == import.meta.env.BASE_URL && 'active'}>
					Home
				</a>
				<a href={import.meta.env.BASE_URL+"about"} class={url == import.meta.env.BASE_URL+'about' && 'active'}>
					About
				</a>
			</nav>
		</header>
	);
}
