const generateTapped = async () => {
    let filament;
    let processes;

    if (type === "base") {
        filament = filamentList;
        processes = processesList;
    } else {
        filament = filamentList.filter(filament => selectedFilament.includes(filament.identifier));

        // Filter processes based on matching printer names only
        processes = processesList.filter(process => {
            // Extract and trim the printer name from the process identifier
            const processPrinterName = process.identifier.split('@')[1].split(' (')[0].replace(/ /g, '');
            
            // Check if any of the selected printers match the printer name in the process
            return selectedPrinters.some(printer => {
                const printerName = extractPrinterName(printer).replace(/ /g, ''); // Also trim spaces from selected printer names
                console.log(`Comparing printer name: ${printerName} with process printer name: ${processPrinterName}`);
                return printerName === processPrinterName;
            });
        });
    }

    // Create the ZIP file with selected printers, filaments, and processes
    const zip = await createZip(
        printerList.filter(printer => selectedPrinters.includes(printer.identifier)).map(printer => printer.profile),
        filament.map(filament => filament.profile),
        processes.map(process => process.profile)
    );

    // Save the ZIP file
    saveAs(zip, "OpenNept4une.orca_printer");
};
