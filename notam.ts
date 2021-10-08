
export type Point = {
    x: number,
    y: number
}

export class Notam {
    public start_date: Date
    public end_date: Date
    public create_date: Date
    public text: string
    public flight_level: number
    public points: Point[] = new Array()
    public duration_sec: number
    public duration_str: string

    constructor(notam: string) {
        this.text = notam.replace(/\n/gm, ' ')
        this.parse(notam)
    }

    public print(f: Function) {
        f(this.flight_level)
    }

    private parse(text: string) {
        const fl_pos = text.match(/(SFC)(.){0,3}((FL)\d+|UNL)/gm)
        if (fl_pos) {
            this.flight_level = Number(fl_pos[0].match(/(\d+|UNL)/)[0]) || 1000000
        }

        const point_arr = text.match(/\d+[NS]\d+[WE]/gm)
        if (point_arr) {
            this.points = point_arr.map(el => this.formatCoordinate(el.match((/\d+[NS]/))[0], el.match((/\d+[WE]/))[0]))
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
        if (str_x.slice(-1) == 'N') {
            point.x = Number(str_x.slice(0, -1)) / Math.pow(100, len_x - 3)
        } else {
            point.x = -Number(str_x.slice(0, -1)) / Math.pow(100, len_x - 3)
        }

        const len_y = str_y.slice(0, -1).length
        if (str_y.slice(-1) == 'W') {
            point.y = Number(str_y.slice(0, -1)) / Math.pow(100, len_y - 4)
        } else {
            point.y = -Number(str_y.slice(0, -1)) / Math.pow(100, len_y - 4)
        }
        return point
    }
}