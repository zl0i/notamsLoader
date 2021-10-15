import fs from 'fs';
import md5 from 'md5'
import { Notam } from './notam';

interface cacheData {
    date: string,
    icaos: string[],
    notams: Notam[]
}

export default class NotamsCache {

    private fileName: string
    private path: string
    private data: cacheData

    constructor(notams: string[], path: string = '.') {
        this.path = path
        this.fileName = `t${new Date().getTime()}-${md5(notams.join(''))}`
        this.data = {
            date: new Date().toISOString(),
            icaos: notams,
            notams: []
        }
    }

    append(n: Notam) {
        this.data.notams.push(n)
    }

    save() {
        if (this.data.notams.length > 0)
            fs.writeFileSync(`${this.path}/${this.fileName}.json`, JSON.stringify(this.data))
    }
}