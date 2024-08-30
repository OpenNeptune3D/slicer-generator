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
  const [slicerList] = useState([
    { name: "OrcaSlicer", identifier: "orcaslicer" },
  ]);
  const [selectedSlicer, setSelectedSlicer] = useState("orcaslicer");

  useEffect(() => {
    console.log("Selected Printers:", selectedPrinters);
    console.log("Selected Filament:", selectedFilament);
    console.log("Processes List:", processesList);
  
    const extractPrinterName = (printer) => {
      return printer.split(" (")[0].replace(/ /g, "");
    };
  
    const getFilamentMatchKeyword = (filament) => {
      if (filament.includes("PLA")) {
        return "PLA";
      }
      if (filament.includes("PETG")) {
        return "PETG";
      }
      return filament.split(" ").pop().replace(/-/g, "").replace("OpenNept4une", "").trim();
    };
  
    const filtered = processesList.filter((process) => {
      const processPrinterName = process.identifier
        .split("@")[1]
        .split(" (")[0]
        .replace(/ /g, "");

console.log("Filtered Processes List:", filtered);
setFilteredProcessesList(filtered);
  
      const printerMatch = selectedPrinters.some((printer) => {
        const printerName = extractPrinterName(printer);
        console.log(`Comparing printer name: ${printerName} with process printer name: ${processPrinterName}`);
        return printerName === processPrinterName;
      });
  
      const filamentMatch = selectedFilament.some((filament) => {
        const filamentKeyword = getFilamentMatchKeyword(filament);
        console.log(`Checking if process identifier: ${process.identifier} includes filament keyword: ${filamentKeyword}`);
        return process.identifier.toLowerCase().includes(filamentKeyword.toLowerCase());
      });
  
      console.log(`Process: ${process.identifier}, Printer Match: ${printerMatch}, Filament Match: ${filamentMatch}`);
      return printerMatch && filamentMatch;
    });
  
    console.log("Filtered Processes List:", filtered);
    setFilteredProcessesList(filtered);
  }, [selectedPrinters, selectedFilament, processesList]);

  const isValidSelection = () => {
    return selectedPrinters.length > 0 && selectedSlicer !== null;
  };

  const updateSelectedPrinters = (printer) => {
    if (selectedPrinters.includes(printer)) {
      setSelectedPrinters(selectedPrinters.filter((p) => p !== printer));
    } else {
      setSelectedPrinters([...selectedPrinters, printer]);
    }
  };

  const updateSelectedFilaments = (filament) => {
    if (selectedFilament.includes(filament)) {
      setSelectedFilament(selectedFilament.filter((p) => p !== filament));
    } else {
      setSelectedFilament([...selectedFilament, filament]);
    }
  };

  const updateSelectedProcesses = (process) => {
    if (selectedProcesses.includes(process)) {
      setSelectedProcesses(selectedProcesses.filter((p) => p !== process));
    } else {
      setSelectedProcesses([...selectedProcesses, process]);
    }
  };

  const generateTapped = async () => {
    let filament;
    let processes;

    if (type === "base") {
      filament = filamentList;
      processes = processesList;
    } else {
      filament = filamentList.filter((filament) =>
        selectedFilament.includes(filament.identifier)
      );

      // Filter processes based on exact printer name match
      processes = processesList.filter((process) => {
        const processPrinterName = process.identifier
          .split("@")[1]
          .split(" (")[0]
          .replace(/ /g, "")
          .toLowerCase(); // Normalize the process printer name for consistent comparison

        // Check if the selected printer matches exactly with the process printer name
        return selectedPrinters.some((printer) => {
          const printerName = extractPrinterName(printer).replace(/ /g, "").toLowerCase();
          return printerName === processPrinterName;
        });
      });
    }

    // Map the filtered processes to their profiles
    const zip = await createZip(
      printerList
        .filter((printer) => selectedPrinters.includes(printer.identifier))
        .map((printer) => printer.profile),
      filament.map((filament) => filament.profile),
      processes.map((process) => process.profile) // Only map the filtered processes
    );

    // Save the ZIP file
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
        class={
          isValidSelection() ? "generate-button" : "generate-button disabled"
        }
        onClick={generateTapped}
      >
        Generate Profile
      </div>
    </div>
  );
}

function Selection(props) {
  const handleClick = () => {
    props.select(props.identifier);
  };

  return (
    <label>
      <input type="radio" checked={props.checked} onClick={handleClick} />
      {props.label}
    </label>
  );
}

function MultiSelectionSection(props) {
  let emptyText = props.emptyText ? props.emptyText : "No options available";
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
        {props.options &&
          props.options.map((option) => (
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
  function handleClick() {
    props.onClick(props.type);
  }

  return (
    <div
      class={
        props.isActive ? "generator-type box active" : "generator-type box"
      }
      onClick={handleClick}
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
