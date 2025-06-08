export const ariaDashboardProfileDetail = `
- heading "Detaily Profilu" [level=2]
- button "Upravit profil"
- strong: "Jméno:"
- text: /[^\\n]+/
- strong: "Příjmení:"
- text: /[^\\n]+/
- strong: "Email:"
- text: /[^\\n]+/
- strong: "Telefon:"
- text: /[^\\n]+/
- strong: "Věk:"
- text: /[^\\n]+/
`.trim();
export default ariaDashboardProfileDetail;
export type AriaDashboardProfileDetail = typeof ariaDashboardProfileDetail;