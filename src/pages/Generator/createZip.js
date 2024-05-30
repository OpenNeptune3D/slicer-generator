import JSZip from "jszip";

function addFile(zip, type, file) {
    let path = type + "/" + file.name
        if (path.indexOf(".json") === -1) {
            path += ".json";
        }
        zip.file(path, file.content);
}

export const createZip = async (printer_profiles, filament_profiles, process_profiles) => {
    const zip = new JSZip();
    console.log(printer_profiles, filament_profiles, process_profiles);
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