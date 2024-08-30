import JSZip from "jszip";

function addFile(zip, type, file) {
    // Add "-OpenNept4une" to the file name before the .json extension
    let path = `${type}/${file.name}-OpenNept4une.json`;

    console.log(`Adding file to zip: ${path} with content:`, file.content); // Log file content to verify it is not empty
    zip.file(path, JSON.stringify(file.content, null, 2)); // Ensure content is correctly stringified
}

export const createZip = async (printer_profiles, filament_profiles, process_profiles) => {
    const zip = new JSZip();

    printer_profiles.forEach((profile) => {
        const file = { name: profile.name, content: profile };
        addFile(zip, "printers", file);
    });

    filament_profiles.forEach((profile) => {
        const file = { name: profile.name, content: profile };
        addFile(zip, "filaments", file);
    });

    process_profiles.forEach((profile) => {
        const file = { name: profile.name, content: profile };
        addFile(zip, "processes", file);
    });

    return zip.generateAsync({ type: "blob" });
};
