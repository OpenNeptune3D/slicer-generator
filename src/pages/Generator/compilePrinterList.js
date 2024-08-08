export default async function compilePrinterList() {
    try {
        const printers = import.meta.glob('../../profiles/printers/*.json');
        const printerList = await Promise.all(Object.keys(printers).map(async (key) => {
            const profile = await printers[key]();
            return {
                name: profile.name.replace("-OpenNept4une", ""),
                identifier: key.split('/').pop().replace('.json', ''), // Use the file name without the extension as identifier
                profile: profile
            };
        }));
        return printerList;
    } catch (error) {
        console.error("Error compiling printer list:", error);
        throw error;
    }
}
