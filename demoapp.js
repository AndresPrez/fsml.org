// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const JSON_DATA = [
    {
        "A": 10,
        "B": 20
    },
    {
        "A": 11,
        "B": 21
    },
    {
        "A": 12,
        "B": 22
    }, 
];
async function remoteImport() {
    try {
        const moduleUrl = Deno.args;
        const { default: lodashFilter  } = await import(moduleUrl[0]);
        const result = lodashFilter(JSON_DATA, (r)=>r.A >= 11);
        if (result.length === 2) {
            console.log("Lodash filter module imported successfully.");
        }
    } catch (error) {
        console.error(error);
    }
}
remoteImport();
