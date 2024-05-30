import { useLocation } from 'preact-iso';
import openneptuneLogo from '../assets/OpenNept4une.svg';

export function Header() {
	const { url } = useLocation();

	return (
		<header>
			<a href="/">
			<img src={openneptuneLogo} alt="OpenNeptune logo" class="logo" />
			</a>
			<nav>
				<a href="/" class={url == '/' && 'active'}>
					Home
				</a>
				<a href="/about" class={url == '/about' && 'active'}>
					About
				</a>
			</nav>
		</header>
	);
}
