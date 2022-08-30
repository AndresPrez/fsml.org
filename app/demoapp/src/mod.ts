const JSON_DATA = [
  {
    "A": 10,
    "B": 20,
  },
  {
    "A": 11,
    "B": 21,
  },
  {
    "A": 12,
    "B": 22,
  },
];

async function remoteImport() {
  try {
    const moduleUrl = Deno.args;
    const { default: lodashFilter } = await import(moduleUrl[0]);
    const result = lodashFilter(
      JSON_DATA,
      (r: { A: number; B: number }) => r.A >= 11,
    );
    if (result.length === 2) {
      console.log("Lodash filter module imported successfully.");
    }
  } catch (error) {
    console.error(error);
  }
}

remoteImport();
