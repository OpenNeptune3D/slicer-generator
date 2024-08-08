export default async function compileProcessList() {
    try {
        const processes = import.meta.glob('../../profiles/processes/*.json');
        const processList = await Promise.all(Object.keys(processes).map(async (key) => {
            const profile = await processes[key]();
            return {
                name: profile.name.replace("-OpenNept4une", ""),
                identifier: profile.name,
                profile: profile
            };
        }));
        return processList;
    } catch (error) {
        console.error("Error compiling process list:", error);
        throw error;
    }
}
