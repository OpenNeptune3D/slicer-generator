import { useLocation } from 'preact-iso';
import openneptuneLogo from '../assets/OpenNept4une.svg';
import githubLogo from '../assets/github-mark.svg';

export function Header() {
	const { url } = useLocation();

	// @ts-ignore
	// eslint-disable-next-line no-undef
	const githubRepo = __GITHUB_REPO__;

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
				<a href={githubRepo}>
					<img src={githubLogo} class="github" />
				</a>
			</nav>
		</header>
	);
}
