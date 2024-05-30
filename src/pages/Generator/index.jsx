import './style.css';
import { useEffect, useState } from 'preact/hooks';
import compilePrinterList from './compilePrinterList';
import compileFilamentList from './compileFilamentList';
import compileProcessList from './compileProcessList';
import { createZip } from './createZip';
import { saveAs } from 'file-saver';

export function Generator() {
	const [type, setType] = useState('base');
	const [printerList, setPrinterList] = useState([]);
	const [selectedPrinters, setSelectedPrinters] = useState([]);
	const [filamentList, setFilamentList] = useState([]);
	const [selectedFilament, setSelectedFilament] = useState([]);
	const [processesList, setProcessesList] = useState([]);
	const [selectedProcesses, setSelectedProcesses] = useState([]);
	const [selectedSlicer, setSelectedSlicer] = useState("orcaslicer");

	useEffect(() => {
		compilePrinterList().then(async (list) => {
			setPrinterList(list);
		});

		compileFilamentList().then(async (list) => {
			setFilamentList(list);
		});
		compileProcessList().then(async (list) => {
			setProcessesList(list);
		});
	}, []);

	useEffect(() => {
		compileProcessList().then(async (list) => {
			setProcessesList(list.filter(process => {
				for (let i = 0; i < selectedPrinters.length; i++) {
					if (process.name.indexOf(selectedPrinters[i]) !== -1) {
						return true;
					}
				}
				return false;
			}));
		});
	}, [selectedPrinters]);

	const isValidSelection = () => {
		return selectedPrinters !== null && selectedSlicer !== null;
	}

	const updateSelectedPrinters = (printer) => {
		if (selectedPrinters.includes(printer)) {
			setSelectedPrinters(selectedPrinters.filter(p => p !== printer));
		} else {
			setSelectedPrinters([...selectedPrinters, printer]);
		}
	}

	const updateSelectedFilaments = (filament) => {
		if (selectedFilament.includes(filament)) {
			setSelectedFilament(selectedFilament.filter(p => p !== filament));
		} else {
			setSelectedFilament([...selectedFilament, filament]);
		}
	}

	const updateSelectedProcesses = (process) => {
		if (selectedProcesses.includes(process)) {
			setSelectedProcesses(selectedProcesses.filter(p => p !== process));
		} else {
			setSelectedProcesses([...selectedProcesses, process]);
		}
	}

	const generateTapped = async () => {
		let filament;
		let processes;
		if (type == "base") {
			filament = filamentList;
			processes = processesList;
		} else {
			filament = filamentList.filter(filament => selectedFilament.includes(filament.identifier));
			processes = processesList.filter(process => selectedProcesses.includes(process.identifier));
		}
		const zip = await createZip(
			printerList.filter(printer => selectedPrinters.includes(printer.identifier)).map(printer => printer.profile),
			filament.map(filament => filament.profile),
			processes.map(process => process.profile)
		);
		saveAs(zip, "OpenNept4une.orca_printer");
	}

	return (
		<div class="home">
			<h1>OpenNeptune Slicer profile generator</h1>
			<section class="type-picker">
				<TypeSection title="Base Config" type="base" isActive={type == "base"} onClick={setType} />
				<TypeSection title="Custom" type="custom" isActive={type == "custom"} onClick={setType} />
			</section>
			<section>
				<MultiSelectionSection title="Printer Model" options={printerList} select={updateSelectedPrinters} selectedOptions={selectedPrinters} />
			{type == "custom" && <MultiSelectionSection title="Filament" options={filamentList} select={updateSelectedFilaments} selectedOptions={selectedFilament}  />}
			{type == "custom" && <MultiSelectionSection title="Print Settings" options={processesList} select={updateSelectedProcesses} selectedOptions={selectedProcesses} />}
			<SelectionSection title="Slicer" options={[{"name": "OrcaSlicer", "identifier": "orcaslicer"}]} select={setSelectedSlicer} selectedOption={selectedSlicer} />
			<SummarySection />
			</section>
			<div class={(isValidSelection() ? "generate-button" : "generate-button disabled")} onClick={generateTapped}>Generate Profile</div>
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

function MultiSelectionSection(props) {
	return (
		<div class="resource">
			<h2>{props.title}</h2>
			<ul>
				{props.options && props.options.map(option => (
					<li key={option.identifier}>
						<Selection label={option.name} identifier={option.identifier} checked={props.selectedOptions.includes(option.identifier)} select={props.select} />
					</li>
				))}
			</ul>
		</div>
	);
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