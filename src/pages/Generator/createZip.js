import JSZip from "jszip";

function addFile(zip, type, file) {
    let path = type + "/" + file.name;
    if (path.indexOf(".json") === -1) {
        path += ".json";
    }
    console.log(`Adding file to zip: ${path} with content:`, file.content); // Log file content to verify it is not empty
    zip.file(path, JSON.stringify(file.content, null, 2)); // Ensure content is correctly stringified
}

export const createZip = async (printer_profiles, filament_profiles, process_profiles) => {
    const zip = new JSZip();

    printer_profiles.forEach((file) => {
        addFile(zip, "printers", file);
    });

    filament_profiles.forEach((file) => {
        addFile(zip, "filaments", file);
    });

    process_profiles.forEach((file) => {
        addFile(zip, "processes", file);
    });

    return zip.generateAsync({ type: "blob" });
};
