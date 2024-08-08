import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function createZip(printers, filaments, processes) {
    const zip = new JSZip();
    printers.forEach((printer, index) => {
        zip.file(`printers/Printer_${index + 1}.json`, JSON.stringify(printer, null, 2));
    });
    filaments.forEach((filament, index) => {
        zip.file(`filaments/Filament_${index + 1}.json`, JSON.stringify(filament, null, 2));
    });

    processes.forEach((process, index) => {
        zip.file(`processes/Process_${index + 1}.json`, JSON.stringify(process, null, 2));
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'OpenNept4uneProfiles.zip');
}
