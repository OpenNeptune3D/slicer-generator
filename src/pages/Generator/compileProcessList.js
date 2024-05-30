export default function compileProcessList() {
    const processes = import.meta.glob('../../profiles/processes/*.json');
    return  Promise.all(Object.keys(processes).map(async (key) => {
        const profile = await processes[key]();
        return {
            "name": profile.name,
            "identifier": key.split('/')[4],
            "profile": profile
        }
    }));
}