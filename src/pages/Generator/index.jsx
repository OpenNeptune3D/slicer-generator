import "./style.css";
import { useEffect, useState } from "preact/hooks";
import compilePrinterList from "./compilePrinterList";
import compileFilamentList from "./compileFilamentList";
import compileProcessList from "./compileProcessList";
import { createZip } from "./createZip";
import { saveAs } from "file-saver";

export function Generator() {
  const [type, setType] = useState("base");
  const [printerList, setPrinterList] = useState([]);
  const [selectedPrinters, setSelectedPrinters] = useState([]);
  const [filamentList, setFilamentList] = useState([]);
  const [selectedFilament, setSelectedFilament] = useState([]);
  const [processesList, setProcessesList] = useState([]);
  const [filteredProcessesList, setFilteredProcessesList] = useState([]);
  const [selectedProcesses, setSelectedProcesses] = useState([]);
  const [slicerList] = useState([{ name: "OrcaSlicer", identifier: "orcaslicer" }]);
  const [selectedSlicer, setSelectedSlicer] = useState("orcaslicer");

  useEffect(() => {
    compilePrinterList().then((list) => setPrinterList(list));
    compileFilamentList().then((list) => setFilamentList(list));
    compileProcessList().then((list) => setProcessesList(list));
  }, []);

  useEffect(() => {
    const extractPrinterName = (printer) => printer.split(" (")[0].replace(/ /g, "").toLowerCase();

    const getFilamentMatchKeyword = (filament) => {
      if (filament.toLowerCase().includes("pla")) {
        return "standard";
      }
      if (filament.toLowerCase().includes("petg")) {
        return "petg";
      }
      return filament.split(" ").pop().replace(/-/g, "").replace("opennept4une", "").trim().toLowerCase();
    };

    const filtered = processesList.filter((process) => {
      const processPrinterName = process.identifier
        .split("@")[1]
        .split(" (")[0]
        .replace(/ /g, "")
        .toLowerCase();
    
      const printerMatch = selectedPrinters.some((printer) => {
        const printerName = extractPrinterName(printer);
        return printerName === processPrinterName;
      });

      const filamentMatch = selectedFilament.length === 0 || selectedFilament.some((filament) => {
        const filamentKeyword = getFilamentMatchKeyword(filament);
        return process.identifier.toLowerCase().includes(filamentKeyword);
      });

      return printerMatch && filamentMatch;
    });

    setFilteredProcessesList(filtered);
  }, [selectedPrinters, selectedFilament, processesList]);

  const isValidSelection = () => selectedPrinters.length > 0 && selectedSlicer !== null;

  const updateSelectedPrinters = (printer) => {
    setSelectedPrinters((prevSelected) =>
      prevSelected.includes(printer) ? prevSelected.filter((p) => p !== printer) : [...prevSelected, printer]
    );
  };

  const updateSelectedFilaments = (filament) => {
    setSelectedFilament((prevSelected) =>
      prevSelected.includes(filament) ? prevSelected.filter((p) => p !== filament) : [...prevSelected, filament]
    );
  };

  const updateSelectedProcesses = (process) => {
    setSelectedProcesses((prevSelected) =>
      prevSelected.includes(process) ? prevSelected.filter((p) => p !== process) : [...prevSelected, process]
    );
  };

  const generateTapped = async () => {
    const selectedFilamentProfiles = selectedFilament.length > 0 ? 
      filamentList.filter((filament) => selectedFilament.includes(filament.identifier)) : 
      filamentList;

    const selectedProcessProfiles = selectedProcesses.length > 0 ? 
      filteredProcessesList.filter((process) => selectedProcesses.includes(process.identifier)) : 
      filteredProcessesList;

    const zip = await createZip(
      printerList.filter((printer) => selectedPrinters.includes(printer.identifier)).map((printer) => ({ name: printer.name, content: printer.profile })),
      filamentList.filter((filament) => selectedFilament.includes(filament.identifier) || selectedFilament.length === 0).map((filament) => ({ name: filament.name, content: filament.profile })),
      filteredProcessesList.filter((process) => selectedProcesses.includes(process.identifier) || selectedProcesses.length === 0).map((process) => ({ name: process.name, content: process.profile }))
    );
    saveAs(zip, "OpenNept4une.orca_printer");
  };

  return (
    <div class="home">
      <h1>OpenNeptune Slicer profile generator</h1>
      <section class="type-picker">
        <TypeSection
          title="Base Config"
          type="base"
          isActive={type === "base"}
          onClick={setType}
        />
        <TypeSection
          title="Custom"
          type="custom"
          isActive={type === "custom"}
          onClick={setType}
        />
      </section>
      <section>
        <MultiSelectionSection
          title="Printer Model"
          options={printerList}
          select={updateSelectedPrinters}
          selectedOptions={selectedPrinters}
        />
        {type === "custom" && (
          <MultiSelectionSection
            title="Filament"
            options={filamentList}
            select={updateSelectedFilaments}
            selectedOptions={selectedFilament}
          />
        )}
        {type === "custom" && (
          <MultiSelectionSection
            title="Print Settings"
            options={filteredProcessesList}
            select={updateSelectedProcesses}
            selectedOptions={selectedProcesses}
          />
        )}
        {slicerList.length > 1 && (
          <SelectionSection
            title="Slicer"
            options={slicerList}
            select={setSelectedSlicer}
            selectedOption={selectedSlicer}
          />
        )}
        {<SummarySection />}
      </section>
      <div
        class={isValidSelection() ? "generate-button" : "generate-button disabled"}
        onClick={generateTapped}
      >
        Generate Profile
      </div>
    </div>
  );
}

function Selection(props) {
  const handleClick = () => props.select(props.identifier);

  return (
    <label>
      <input type="radio" checked={props.checked} onClick={handleClick} />
      {props.label}
    </label>
  );
}

function MultiSelectionSection(props) {
  const emptyText = props.emptyText || "No options available";
  return (
    <div class="resource box">
      <h2>{props.title}</h2>
      {props.options.length === 0 ? (
        <p class="empty">{emptyText}</p>
      ) : (
        <ul>
          {props.options.map((option) => (
            <li key={option.identifier}>
              <Selection
                label={option.name}
                identifier={option.identifier}
                checked={props.selectedOptions.includes(option.identifier)}
                select={props.select}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SelectionSection(props) {
  return (
    <div class="resource box">
      <h2>{props.title}</h2>
      <ul>
        {props.options.map((option) => (
          <li key={option.identifier}>
            <Selection
              label={option.name}
              identifier={option.identifier}
              checked={props.selectedOption === option.identifier}
              select={props.select}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function TypeSection(props) {
  return (
    <div
      class={props.isActive ? "generator-type box active" : "generator-type box"}
      onClick={() => props.onClick(props.type)}
    >
      <h1>{props.title}</h1>
    </div>
  );
}

function SummarySection() {
  return (
    <div class="resource box">
      <h2>Summary</h2>
    </div>
  );
}
