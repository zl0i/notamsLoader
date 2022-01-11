
export type Point = {
    x: number,
    y: number
}

export class Notam {
    public id: string
    public start_date: Date
    public end_date: Date
    public create_date: Date
    public text: string
    public fl_start: number
    public fl_end: number
    public isUNL: boolean = false
    public points: Array<Point[]> = new Array()
    public duration_sec: number
    public duration_str: string

    constructor(notam: string) {
        this.text = notam.replace(/\n/gm, ' ')
        this.parse(this.text)
    }

    public print(f: Function) {
        f(this)
    }

    private parse(text: string) {
        this.id = text.match(/(?<=(<b>))(.*)?(?=(<\/b>))/gm)[0]
        const fl_pos = text.match(/(SFC|FL\d+)(.){0,3}((FL)\d+|UNL)/gm)
        if (fl_pos) {
            if (/(FL\d+).{0,3}(FL\d+)/.test(fl_pos[0])) {
                this.fl_start = Number(fl_pos[0].match(/\d+/g)[0])
                this.fl_end = Number(fl_pos[0].match(/\d+/g)[1])
            } else if (/(SFC).{0,3}(FL\d+)/.test(fl_pos[0])) {
                this.fl_start = 0
                this.fl_end = Number(fl_pos[0].match(/\d+/g)[0])
            } else {
                this.fl_start = 0
                this.fl_end = Infinity
                this.isUNL = true
            }
        }

        const areas = text.match(/(\d+[NS]\d+[WE]\sTO\s){3,}(POINT OF ORIGIN)/gm) ?? []
        for (const area of areas) {
            const points_str = area.match(/\d+[NS]\d+[WE]/gm)
            this.points.push(
                points_str.map(
                    el => this.formatCoordinate(el.match((/\d+[NS]/))[0], el.match((/\d+[WE]/))[0])
                )
            )
        }

        const dates = text.match(/[\d+]{2}\s[A-Z]{3}\s[\d]{2}:[\d]{2}\s[\d]{4}/gm)
        if (dates) {
            if (dates.length == 1) {
                this.create_date = new Date(dates[0])
                this.start_date = new Date()
                this.end_date = new Date('2050-01-01')
            } else if (dates.length == 2) {
                this.start_date = new Date(dates[0])
                this.create_date = new Date(dates[1])
                this.end_date = new Date('2050-01-01')
            } else {
                this.start_date = new Date(dates[0])
                this.end_date = new Date(dates[1])
                this.create_date = new Date(dates[2])
            }
            this.duration_sec = (this.end_date.getTime() - this.start_date.getTime()) / 1000
            this.duration_str = this.formatDuration(this.duration_sec)
        }
    }

    private formatDuration(seconds: number): string {
        if (seconds == 0)
            return 'now'

        let s = seconds % 60
        seconds -= s

        seconds = seconds / 60;
        let m = seconds % 60
        seconds -= m

        seconds = seconds / 60
        let h = seconds % 24
        seconds -= h

        seconds = seconds / 24
        let d = seconds % 365
        seconds -= d

        let y = seconds / 365
        seconds -= y

        let arr = []
        let str = '';
        if (y != 0) {
            arr.push((y + " year") + (y > 1 ? "s" : ""))
        }

        if (d != 0) {
            arr.push((d + " day") + (d > 1 ? "s" : ""))
        }

        if (h != 0) {
            arr.push((h + " hour") + (h > 1 ? "s" : ""))
        }

        if (m != 0) {
            arr.push((m + " minute") + (m > 1 ? "s" : ""))
        }

        if (s != 0) {
            arr.push((s + " second") + (s > 1 ? "s" : ""))
        }
        if (arr.length == 1) {
            return arr.join('')
        }

        return arr.slice(0, -1).join(', ') + ' and ' + arr.pop()
    }

    private formatCoordinate(str_x: string, str_y: string): Point {
        const point: Point = { x: 0, y: 0 }

        const len_x = str_x.slice(0, -1).length
        point.x = Number(str_x.slice(0, -1)) / Math.pow(10, len_x - 2)
        if (str_x.slice(-1) == 'S') {
            point.x = -point.x
        }

        const len_y = str_y.slice(0, -1).length
        point.y = Number(str_y.slice(0, -1)) / Math.pow(10, len_y - 3)
        if (str_y.slice(-1) == 'E') {
            point.y = -point.y
        }
        return point
    }
}