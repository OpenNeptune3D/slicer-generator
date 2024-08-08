export default async function compileFilamentList() {
    try {
        const filaments = import.meta.glob('../../profiles/filaments/*.json');
        const filamentList = await Promise.all(Object.keys(filaments).map(async (key) => {
            const profile = await filaments[key]();
            return {
                name: profile.name.replace("-OpenNept4une", ""),
                identifier: key.split('/').pop().replace('.json', ''), // Use the file name without the extension as identifier
                profile: profile
            };
        }));
        return filamentList;
    } catch (error) {
        console.error("Error compiling filament list:", error);
        throw error;
    }
}
