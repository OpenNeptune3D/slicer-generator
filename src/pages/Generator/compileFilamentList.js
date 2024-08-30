export default async function compileFilamentList() {
    try {
        const filaments = import.meta.glob('../../profiles/filaments/*.json');
        const filamentList = await Promise.all(Object.keys(filaments).map(async (key) => {
            const profile = await filaments[key]();
            console.log("Loaded filament profile:", profile); // Log the loaded profile content
            return {
                name: profile.name.replace("-OpenNept4une", ""),
                identifier: key.split('/').pop().replace('.json', ''),
                profile: profile // Ensure the profile is fully loaded
            };
        }));
        return filamentList;
    } catch (error) {
        console.error("Error compiling filament list:", error);
        throw error;
    }
}
