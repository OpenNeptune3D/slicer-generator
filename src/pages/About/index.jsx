import './style.css';

export function About() {
	// @ts-ignore
	// eslint-disable-next-line no-undef
	const githubRepo = __GITHUB_REPO__;
	// @ts-ignore
	// eslint-disable-next-line no-undef
	const discordInvite = __DISCORD_INVITE__;
	return (
		<div class="about">
			<h1>About</h1>
			<div class="about_box box">
				<p>The OpenNeptune3D Slicer Generator is a simple tool to generate configuration profiles for slicers supported by the OpenNeptune3D project.</p>
				<p>It is designed to be a simple way to generate a configuration profile for your printer, with the ability to select the filaments and print processes you want to include in your profile.</p>
			</div>

			<div class="about_box box">
				<h2>Community Contributed Profiles</h2>
				<p>We are also collecting a list of community contributed profiles to include in this tool.</p>
				<p>You can create a <a href={githubRepo + "/pulls"} target="_blank">Pull Request on Github</a> with your printer, filament or print process profiles to contribute to this list.</p>
				<p>Alternatively you can provide your profile in our <a href={discordInvite} target="_blank">Discord</a> if you do not have a Github account.</p>
			</div>
		</div>
	);
}