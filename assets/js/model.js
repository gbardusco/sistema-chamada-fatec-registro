class AttendanceModel {
    constructor() {
        this.DB = {
            students: [],
            attendance: []
        };
        this.load();
    }

    load() {
        const saved = localStorage.getItem('chamada_db_v3');
        if (saved) {
            this.DB = JSON.parse(saved);
        }
    }

    save() {
        localStorage.setItem('chamada_db_v3', JSON.stringify(this.DB));
    }

    // --- Student Logic ---
    addStudents(newStudents) {
        const map = new Map();
        // Preserva existentes
        this.DB.students.forEach(s => map.set(s.ra, s));
        // Adiciona/Atualiza novos
        newStudents.forEach(s => map.set(s.ra, s));

        this.DB.students = Array.from(map.values());
        this.save();
    }

    deleteStudent(ra) {
        this.DB.students = this.DB.students.filter(s => s.ra !== ra);
        this.save();
    }

    deleteBulkStudents(raList) {
        this.DB.students = this.DB.students.filter(s => !raList.includes(s.ra));
        this.save();
    }

    updateStudent(ra, data) {
        const student = this.DB.students.find(s => s.ra === ra);
        if (student) {
            student.nome = data.nome || student.nome;
            student.curso = data.curso || student.curso;
            student.periodo = data.periodo || student.periodo;
            this.save();
        }
    }

    // --- Attendance Logic ---
    addAttendance(record) {
        this.DB.attendance.push(record);
        this.save();
    }

    removeAttendance(id) {
        this.DB.attendance = this.DB.attendance.filter(r => r.id !== id);
        this.save();
    }

    updateAttendanceType(id) {
        const record = this.DB.attendance.find(r => r.id === id);
        if (record) {
            record.type = record.type === 'Entrada' ? 'Saída' : 'Entrada';
            this.save();
            return record;
        }
        return null;
    }

    checkDuplicity(date, course, period, type) {
        return this.DB.attendance.some(r =>
            r.date === date &&
            r.period === period &&
            r.course === course &&
            r.type === type
        );
    }

    // --- Getters ---
    getStudents(filter = {}) {
        return this.DB.students.filter(s => {
            let match = true;
            if (filter.curso) match = match && s.curso === filter.curso;
            if (filter.periodo) match = match && String(s.periodo) === String(filter.periodo);
            if (filter.search) {
                const term = filter.search.toLowerCase();
                match = match && (s.nome.toLowerCase().includes(term) || String(s.ra).includes(term));
            }
            return match;
        }).sort((a, b) => a.nome.localeCompare(b.nome));
    }

    getAllCourses() {
        return [...new Set(this.DB.students.map(s => s.curso))].sort();
    }

    getAllPeriods(course = null) {
        let list = this.DB.students;
        if (course) list = list.filter(s => s.curso === course);
        return [...new Set(list.map(s => s.periodo))].sort();
    }

    getAttendanceHistory(filter = {}) {
        let records = [...this.DB.attendance].reverse();
        if (filter.period) records = records.filter(r => String(r.period) === String(filter.period));
        if (filter.search) {
            const term = filter.search.toLowerCase();
            records = records.filter(r => {
                const [y, m, d] = r.date.split('-');
                const str = `${d}/${m}/${y} ${r.course} ${r.period} ${r.type}`.toLowerCase();
                return str.includes(term);
            });
        }
        return records;
    }

    clearAll() {
        this.DB = { students: [], attendance: [] };
        localStorage.removeItem('chamada_db_v3');
    }
}