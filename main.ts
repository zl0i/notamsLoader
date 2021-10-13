import fs from 'fs';
import axios from 'axios';
import * as HTMLParser from 'node-html-parser';
import qs from 'querystring';
import { Notam } from './notam';
import NotamFilter from './filter';
//import yaml from 'js-yaml';


const zona: string[] = ['KZAK', 'KZAB', 'PAZA', 'KZTL', 'KZBW', 'KZAU', 'KZOB', 'KZDV', 'KZFW', 'PGZU', 'PHZH', 'KZHU', 'KZID', 'KZJX', 'KZKC', 'KZLA', 'KZME', 'KZMA', 'KZMP', 'KZNY', 'KZWY', 'KZOA', 'KZLC', 'TJZS', 'KZSE', 'KZDC'] //data['notams']



async function downloadNotams(icao: string[]) {
    for (let p of icao) {
        const response = await axios.post('https://www.notams.faa.gov/dinsQueryWeb/queryRetrievalMapAction.do', qs.stringify({
            retrieveLocId: p,
            actionType: 'notamRetrievalByICAOs',
            submit: 'View NOTAMs',
            reportType: 'Report'
        }))

        const root = HTMLParser.parse(response.data.toString(), {
            lowerCaseTagName: true,  // convert tag name to lower case (hurt performance heavily)
            comment: false,            // retrieve comments (hurt performance slightly)
            blockTextElements: {
                script: true,	// keep text content when parsing
                noscript: true,	// keep text content when parsing
                style: true,		// keep text content when parsing
                pre: true			// keep text content when parsing
            }
        })
        const notams = root.querySelectorAll('pre')

        for (let n of notams) {
            const nt = new Notam(n.rawText)

            const filter = new NotamFilter;
            //filter.regexp = /BRAVO/
            filter.duration = '=3h'
            if (filter.check(nt))
                nt.print(console.log)
            //if (nt.duration_sec >= 3 * 60 * 60 && nt.fl_end < 300) {
            //console.log(nt)
            //}
        }
    }
}

downloadNotams(['KZAK'])
    .then(_ => {
        console.log('All!')
    })
    .catch(err => {
        console.log(err.message)
    })

