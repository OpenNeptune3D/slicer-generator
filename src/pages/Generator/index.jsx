import openneptuneLogo from '../../assets/OpenNept4une.svg';
import './style.css';
import { useState } from 'preact/hooks';
import compilePrinterList from './compilePrinterList';

export function Generator() {
	const [type, setType] = useState('base');
	const [selectedPrinter, setSelectedPrinter] = useState(null);
	const [selectedSlicer, setSelectedSlicer] = useState("orcaslicer");

	const printerList = compilePrinterList();

	const isValidSelection = () => {
		return selectedPrinter !== null && selectedSlicer !== null;
	}

	return (
		<div class="home">
			<a href="https://github.com/openneptune3D" target="_blank">
				<img src={openneptuneLogo} alt="OpenNeptune logo" class="logo" />
			</a>
			<h1>OpenNeptune Slicer profile generator</h1>
			<section class="type-picker">
				<TypeSection title="Base Config" type="base" isActive={type == "base"} onClick={setType} />
				<TypeSection title="Extended Config" type="extended" isActive={type == "extended"} onClick={setType} />
				<TypeSection title="Custom" type="custom" isActive={type == "custom"} onClick={setType} />
			</section>
			<section>
				<SelectionSection title="Printer Model" options={printerList} select={setSelectedPrinter} selectedOption={selectedPrinter} />
			{type == "custom" && <SelectionSection title="Filament" />}
			<SelectionSection title="Slicer" options={[{"name": "OrcaSlicer", "identifier": "orcaslicer"}]} select={setSelectedSlicer} selectedOption={selectedSlicer} />
			<SummarySection />
			</section>
			<div class={(isValidSelection() ? "generate-button" : "generate-button disabled")}>Generate Profile</div>
		</div>
	);
}

function Selection(props) {
	const handleClick = () => {
		props.select(props.identifier);
	}

	return (<label>
        <input
          type="radio"
          checked={props.checked}
          onClick={handleClick}
        />
        {props.label}
      </label>)
}

function SelectionSection(props) {
	return (
		<div class="resource">
			<h2>{props.title}</h2>
			<ul>
				{props.options && props.options.map(option => (
					<li key={option.identifier}>
						<Selection label={option.name} identifier={option.identifier} checked={props.selectedOption == option.identifier} select={props.select} />
					</li>
				))}
			</ul>
		</div>
	);
}

function TypeSection(props) {
	function handleClick() {
		props.onClick(props.type);
	}

	return (
		<div class={props.isActive ? 'generator-type active' : 'generator-type'} onClick={handleClick}>
			<h1>{props.title}</h1>
		</div>
	);
}

function SummarySection(props) {
	return (
		<div class="resource">
			<h2>Summary</h2>
		</div>
	)
}