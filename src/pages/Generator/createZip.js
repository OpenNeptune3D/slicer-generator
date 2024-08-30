import JSZip from "jszip";

function addFile(zip, type, file) {
    let path = `${type}/${file.name}-OpenNept4une.json`;
    console.log(`Adding file to zip: ${path} with content:`, file.content);
    zip.file(path, JSON.stringify(file.content));  // Minified JSON output
}

function generateBundleStructure(printer_profiles, filament_profiles, process_profiles) {
    const currentDateTime = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);

    return {
        bundle_id: `offline_${printer_profiles[0].name}-OpenNept4une_${currentDateTime}`,
        bundle_type: "printer config bundle",
        filament_config: filament_profiles.map(file => `filament/${file.name}-OpenNept4une.json`),
        printer_config: printer_profiles.map(file => `printer/${file.name}-OpenNept4une.json`),
        printer_preset_name: `${printer_profiles[0].name}-OpenNept4une`,
        process_config: process_profiles.map(file => `process/${file.name}-OpenNept4une.json`),
        version: ""  // You can set a version if required
    };
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

    const bundleStructure = generateBundleStructure(printer_profiles, filament_profiles, process_profiles);
    zip.file("bundle_structure.json", JSON.stringify(bundleStructure));  // Minified JSON output

    return zip.generateAsync({ type: "blob" });
};
