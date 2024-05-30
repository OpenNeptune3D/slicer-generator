export default function compileFilamentList() {
    const filament = import.meta.glob('../../profiles/filaments/*.json');
    return  Promise.all(Object.keys(filament).map(async (key) => {
        const profile = await filament[key]();
        return {
            "name": profile.name.replace("-OpenNept4une", ""),
            "identifier": profile.name,
            "profile": profile
        }
    }));
}