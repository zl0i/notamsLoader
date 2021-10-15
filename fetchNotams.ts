import axios from 'axios';
import * as HTMLParser from 'node-html-parser';
import qs from 'querystring';

export default class FetchNotams {

    static async fetch(icao: string[]): Promise<HTMLParser.HTMLElement[]> {
        try {
            const response = await axios.post('https://www.notams.faa.gov/dinsQueryWeb/queryRetrievalMapAction.do', qs.stringify({
                retrieveLocId: icao,
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

            return root.querySelectorAll('pre')
        } catch (error) {
            console.log(error)
        }
    }
}