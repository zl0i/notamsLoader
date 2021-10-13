import { Notam, Point } from "./notam";


export default class NotamFilter {

    public fl_start: number
    public fl_end: number
    public start_date: Date
    public end_date: Date
    public duration: string
    public regexp: RegExp

    public point: Point

    constructor() { }

    check(n: Notam) {
        if (this.fl_start) {
            if (!n.fl_start)
                return false
            if (n.fl_start < this.fl_start)
                return false
        }
        if (this.fl_end) {
            if (!n.fl_end)
                return false
            if (n.fl_end > this.fl_end)
                return false
        }

        if (this.start_date) {
            if (!n.start_date)
                return false
            if (n.start_date > this.start_date)
                return false
        }
        if (this.end_date) {
            if (!n.end_date)
                return false
            if (n.end_date > this.end_date)
                return false
        }

        if (this.duration) {
            const seconds = this.getSecondsByType(this.duration.slice(-1)) * Number(this.duration.slice(1, -1))
            if (this.duration.slice(0, 1) == '<') {
                if (n.duration_sec > seconds)
                    return false
            } else if (this.duration.slice(0, 1) == '>') {
                if (n.duration_sec < seconds)
                    return false
            } else if (this.duration.slice(0, 1) == '=') {
                if (n.duration_sec != seconds)
                    return false
            }
        }

        if (this.regexp)
            return this.regexp.test(n.text)

        return true

    }


    private getSecondsByType(t: string): number {
        switch (t) {
            case 's':
                return 1
            case 'm':
                return 60
            case 'h':
                return 3600
            case 'd':
                return 86400
        }
    }

}