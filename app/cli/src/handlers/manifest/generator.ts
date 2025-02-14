import { uuid } from "@fsml/cli/deps/mod.ts";
import { set } from "@fsml/cli/deps/lodash.ts";
import { ManifestTypes } from "@fsml/cli/types/enums.ts";
import {
  createValueForType,
  jsonToText,
  read,
} from "@fsml/packages/utils/mod.ts";
import { selectParser } from "./utils.ts";

import {
  Manifest,
  TManifest,
} from "@fsml/packages/standard/manifest/manifest.ts";
import {
  Provenance,
  TProvenance,
} from "@fsml/packages/standard/manifest/provenance.ts";
import {
  SupplementalData,
  TSupplementalData,
} from "@fsml/packages/standard/manifest/data/supplemental-data.ts";
import {
  FileData,
  TFileData,
} from "@fsml/packages/standard/manifest/data/file-data.ts";
import {
  TabularData,
  TTabularData,
} from "@fsml/packages/standard/manifest/data/tabular/mod.ts";

const FSML_UUID = "0db4fe89-155e-4484-a09f-a8955294de1b";

type ManifestGeneratorOpts = {
  type?: ManifestTypes;
};

const ManifestGenerator = (
  _manifest?: TManifest,
  _opts?: ManifestGeneratorOpts,
) => {
  // Make an instance of the manifest if none is passed.
  const manifest = _manifest || <TManifest> createValueForType(Manifest);

  function author(author: string): TProvenance {
    const provenanceObject = <TProvenance> createValueForType(Provenance);
    set(provenanceObject, "author", author);
    return provenanceObject;
  }

  /**
   * Generates the Manifest's ID based on its content.
   */
  async function id(): Promise<TManifest> {
    const manifestUint8Array = new TextEncoder().encode(
      jsonToText({ format: "json", content: manifest }),
    );
    const manifestID = await uuid.v5.generate(FSML_UUID, manifestUint8Array);
    set(manifest, "id", manifestID);
    return manifest;
  }

  async function data(
    filepath: string,
    parser?: string | string[],
  ): Promise<TSupplementalData> {
    const parserPlugin = await selectParser(filepath, parser);

    const SupplementalDataObject = <TSupplementalData> (
      createValueForType(SupplementalData)
    );

    let dataObject: TFileData | TTabularData;

    // When no parser is available a 'TFileData' data object
    // will be generated.
    if (!parserPlugin) {
      dataObject = <TFileData> createValueForType(FileData);
    } else {
      const result = await parserPlugin.parse(filepath);
      dataObject = (result.data ||
        createValueForType(TabularData)) as TTabularData;
      if (!result.data && result.filepath) {
        dataObject = JSON.parse(await read(result.filepath));
      }
    }
    SupplementalDataObject.data.push(dataObject);

    return SupplementalDataObject;
  }

  async function generate(args: {
    author: string;
    filepath: string;
    parser: string | string[];
  }): Promise<TManifest> {
    const { author: _author, filepath, parser } = args;
    const provenanceObject = author(_author);
    const SupplementalDataObject = await data(filepath, parser);

    set(SupplementalDataObject, "provenance", provenanceObject);
    set(manifest, "supplementalInfo", SupplementalDataObject);

    await id();

    return manifest;
  }

  return { generate };
};

export default ManifestGenerator;
