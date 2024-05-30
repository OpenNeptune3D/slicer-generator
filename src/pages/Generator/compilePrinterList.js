export default function compilePrinterList() {
    const printers = import.meta.glob('../../profiles/printers/*.json');
    return  Promise.all(Object.keys(printers).map(async (key) => {
        const profile = await printers[key]();
        return {
            "name": profile.name,
            "identifier": profile.name,
            "profile": profile
        }
    }));
}