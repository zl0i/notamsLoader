

import { Notam } from './notam';
import NotamFilter from './filter';
import FetchNotams from './fetchNotams';
import NotamsCache from './notamsCache';
import { nextTick } from 'process';
//import yaml from 'js-yaml';


const zona: string[] = ['KZAK', 'KZAB', 'PAZA', 'KZTL', 'KZBW', 'KZAU', 'KZOB', 'KZDV', 'KZFW', 'PGZU', 'PHZH', 'KZHU', 'KZID', 'KZJX', 'KZKC', 'KZLA', 'KZME', 'KZMA', 'KZMP', 'KZNY', 'KZWY', 'KZOA', 'KZLC', 'TJZS', 'KZSE', 'KZDC'] //data['notams']



async function downloadNotams(icao: string[]) {
    //for (let p of icao) {

    const cache = new NotamsCache(icao)

    const notams = await FetchNotams.fetch(icao)


    for (let n of notams) {
        const nt = new Notam(n.rawText)
        cache.append(nt);

        const filter = new NotamFilter;
        //filter.regexp = /BRAVO/
        filter.duration = '=3h'
        if (filter.check(nt))
            nt.print(console.log)
        //if (nt.duration_sec >= 3 * 60 * 60 && nt.fl_end < 300) {
        //console.log(nt)
        //}
    }
    cache.save()
    //}
}

downloadNotams(['KZAK', 'KZAB'])
    .then(_ => {
        console.log('All!')
    })
    .catch(err => {
        console.log(err.message)
    })

