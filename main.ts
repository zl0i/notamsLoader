import { Notam } from "./notam";
import NotamFilter from "./filter";
import FetchNotams from "./fetchNotams";
import NotamsCache from "./notamsCache";
import yargs from "yargs";
//import yaml from 'js-yaml';

const zona: string[] = [
  "KZAK",
  "KZAB",
  "PAZA",
  "KZTL",
  "KZBW",
  "KZAU",
  "KZOB",
  "KZDV",
  "KZFW",
  "PGZU",
  "PHZH",
  "KZHU",
  "KZID",
  "KZJX",
  "KZKC",
  "KZLA",
  "KZME",
  "KZMA",
  "KZMP",
  "KZNY",
  "KZWY",
  "KZOA",
  "KZLC",
  "TJZS",
  "KZSE",
  "KZDC",
]; //data['notams']

async function handleGet(argv: any) {
  if (!argv.notams)
    throw new Error("notams undefined. use --notams");

  const notams = await FetchNotams.fetch(argv.notams);


  const filter = parseFilter(argv.filter)
  const arr: Notam[] = new Array()
  for (let n of notams) {
    const nt = new Notam(n.rawText);
    if (filter.check(nt))
      arr.push(nt)
  }


  if (argv.output == "console") {
    console.log(JSON.stringify(arr))
  } else {
    const file = new NotamsCache(argv.notams);
  }
}

function parseFilter(filters: string[]) {
  const filter = new NotamFilter()
  for (const f of filters) {
    const [key, val] = f.split('=')
    filter.set(key, val)
  }
  return filter;
}

const y = yargs(process.argv.slice(2))
  .usage("Usage: notam <command> [options]")
  .command(
    "get",
    "get notams by ",
    (yargs) => {
      return yargs.positional("output", {
        alias: "o",
        description: "output data. maybe console or file",
        type: "string",
        default: "console",
      });
    },
    (argv) => {
      console.log(argv);
      //if (argv.verbose) console.info(`start server on :${argv.port}`);
      console.log("get notams....");
      handleGet(argv);
    }
  )
  .option("notams", {
    alias: "n",
    description: "Get this notams",
    type: "array",
  })
  .option("verbose", {
    description: "Run with verbose logging",
  })
  .option("filter", {
    description: "filter notam",
    type: "array",
  })
  .help("h")
  .alias("h", "help")
  .version("v1.0.0")
  .alias("version", "v").argv;
