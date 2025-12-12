// Inicialização
const model = new AttendanceModel();
const view = new AttendanceView();

window.onload = () => {
    initEventListeners();
    refreshUI();
    document.getElementById('chamadaData').valueAsDate = new Date();
};

function refreshUI() {
    view.updateStatus(model.DB.students.length);

    // Atualiza Selects
    const courses = model.getAllCourses();
    const periods = model.getAllPeriods();

    view.populateSelect('chamadaCurso', courses, document.getElementById('chamadaCurso').value);
    view.populateSelect('manageCurso', courses, document.getElementById('manageCurso').value);

    view.populateSelect('managePeriodo', periods, document.getElementById('managePeriodo').value);
    view.populateSelect('historyFilterPeriod', periods, document.getElementById('historyFilterPeriod').value);

    // Atualiza listas visíveis
    if (document.getElementById('tab-config').classList.contains('active')) renderDbTable();
    if (document.getElementById('tab-chamada').classList.contains('active')) updateStudentList();
    if (document.getElementById('tab-historico').classList.contains('active')) updateHistoryList();
}

function initEventListeners() {
    // Abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            view.toggleTab(e.target.dataset.tab);
            refreshUI();
        });
    });

    // Filtros Chamada
    document.getElementById('chamadaCurso').addEventListener('change', () => {
        // Atualiza períodos baseado no curso
        const curso = document.getElementById('chamadaCurso').value;
        const periodos = model.getAllPeriods(curso);
        view.populateSelect('chamadaPeriodo', periodos);
        updateStudentList();
    });
    document.getElementById('chamadaPeriodo').addEventListener('change', updateStudentList);

    // Checkbox Chamada
    document.getElementById('toggleAll').addEventListener('change', (e) => {
        document.querySelectorAll('.attendance-check').forEach(cb => cb.checked = e.target.checked);
        updateCounter();
    });

    // Contagem Chamada (delegação de evento para elementos dinâmicos)
    document.getElementById('studentListContainer').addEventListener('change', (e) => {
        if (e.target.classList.contains('attendance-check')) updateCounter();
    });

    // Botões Chamada
    document.getElementById('btnSaveAttendance').addEventListener('click', saveAttendance);
    document.getElementById('btnCopyText').addEventListener('click', copyToClipboard);

    // Gestão DB
    document.getElementById('btnProcessFile').addEventListener('click', processFile);
    document.getElementById('btnClearDb').addEventListener('click', () => {
        if (confirm('Tem certeza? Isso apaga tudo!')) {
            model.clearAll();
            refreshUI();
        }
    });

    // Filtros DB
    ['manageCurso', 'managePeriodo', 'manageSearch'].forEach(id => {
        document.getElementById(id).addEventListener(id === 'manageSearch' ? 'keyup' : 'change', renderDbTable);
    });

    // Bulk Actions DB
    document.getElementById('checkAllDB').addEventListener('change', (e) => {
        document.querySelectorAll('.db-check').forEach(cb => cb.checked = e.target.checked);
        updateDbSelection();
    });
    document.getElementById('btnDeleteBulk').addEventListener('click', deleteBulk);

    // Filtros Histórico
    ['historySearch', 'historyFilterPeriod'].forEach(id => {
        document.getElementById(id).addEventListener(id === 'historySearch' ? 'keyup' : 'change', updateHistoryList);
    });
    document.getElementById('btnClearHistoryFilters').addEventListener('click', () => {
        document.getElementById('historySearch').value = '';
        document.getElementById('historyFilterPeriod').value = '';
        updateHistoryList();
    });
}

// --- Funções de Controle Específicas ---

function updateStudentList() {
    const curso = document.getElementById('chamadaCurso').value;
    const periodo = document.getElementById('chamadaPeriodo').value;
    if (!curso || !periodo) {
        view.renderStudentList([]);
        return;
    }
    const students = model.getStudents({ curso, periodo });
    view.renderStudentList(students);
    updateCounter();
}

function updateCounter() {
    const count = document.querySelectorAll('.attendance-check:checked').length;
    view.updateAttendanceCounter(count);
}

function saveAttendance() {
    const date = document.getElementById('chamadaData').value;
    const curso = document.getElementById('chamadaCurso').value;
    const period = document.getElementById('chamadaPeriodo').value;
    const type = document.getElementById('chamadaTipo').value;

    if (!date || !period || !curso) return alert('Preencha todos os campos.');

    if (model.checkDuplicity(date, curso, period, type)) {
        if (!confirm(`Já existe lista de ${type} para esta turma/data. Criar duplicata?`)) return;
    }

    const presentRAs = Array.from(document.querySelectorAll('.attendance-check:checked')).map(cb => cb.value);

    model.addAttendance({
        id: Date.now(),
        date, course: curso, period, type, presentRAs,
        timestamp: new Date().toISOString()
    });

    alert('Salvo com sucesso!');
    // Não limpa para facilitar se for fazer a saída logo em seguida
}

// --- Histórico ---
function updateHistoryList() {
    const search = document.getElementById('historySearch').value;
    const period = document.getElementById('historyFilterPeriod').value;
    const records = model.getAttendanceHistory({ search, period });

    view.renderHistory(records,
        (id) => { // Delete
            if (confirm('Excluir lista?')) { model.removeAttendance(id); updateHistoryList(); }
        },
        (id) => { // Download
            downloadTxt(id);
        },
        (id) => { // Toggle Type
            const rec = model.DB.attendance.find(r => r.id === id);
            // Check conflito inverso
            const newType = rec.type === 'Entrada' ? 'Saída' : 'Entrada';
            if (model.checkDuplicity(rec.date, rec.course, rec.period, newType)) {
                return alert('Conflito: Já existe uma lista do tipo oposto.');
            }
            if (confirm(`Mudar para ${newType}?`)) {
                model.updateAttendanceType(id);
                updateHistoryList();
            }
        }
    );
}

function downloadTxt(id) {
    const rec = model.DB.attendance.find(r => r.id === id);
    if (!rec) return;

    const names = rec.presentRAs.map(ra => {
        const s = model.DB.students.find(st => st.ra == ra);
        return s ? s.nome : `RA:${ra}`;
    }).join('\n');

    const [a, m, d] = rec.date.split('-');
    const content = `Lista de Presença - ${rec.course} ${rec.period} - ${d}/${m}/${a}\nTipo: ${rec.type}\nTotal: ${rec.presentRAs.length}\n----------------\n${names}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = `Lista_${rec.course}_${rec.period}_${d}-${m}-${a}.txt`;
    document.body.appendChild(aLink);
    aLink.click();
    aLink.remove();
}

// --- Gestão DB ---
function renderDbTable() {
    const filter = {
        curso: document.getElementById('manageCurso').value,
        periodo: document.getElementById('managePeriodo').value,
        search: document.getElementById('manageSearch').value
    };
    const students = model.getStudents(filter);

    view.renderDatabaseTable(students,
        (ra) => { // Edit
            const s = model.DB.students.find(x => x.ra === ra);
            const nome = prompt('Novo nome:', s.nome);
            if (nome) model.updateStudent(ra, { nome });
            refreshUI();
        },
        (ra) => { // Delete
            if (confirm('Excluir aluno?')) { model.deleteStudent(ra); refreshUI(); }
        },
        () => { // On Check
            updateDbSelection();
        }
    );
}

function updateDbSelection() {
    const count = document.querySelectorAll('.db-check:checked').length;
    view.updateDbSelectionCount(count);
}

function deleteBulk() {
    const ras = Array.from(document.querySelectorAll('.db-check:checked')).map(cb => cb.value);
    if (ras.length && confirm(`Excluir ${ras.length} alunos?`)) {
        model.deleteBulkStudents(ras);
        refreshUI();
        document.getElementById('checkAllDB').checked = false;
    }
}

// --- Importação (Copiar a lógica do SheetJS anterior) ---
function processFile() {
    const input = document.getElementById('fileInput');
    if (!input.files.length) return alert('Selecione arquivo.');

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            let jsonData = [];
            if (file.name.endsWith('.json')) {
                jsonData = JSON.parse(e.target.result);
            } else {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            }

            const normalized = jsonData.map(row => {
                // Lógica de normalização de chaves (igual ao anterior)
                const getVal = (keys) => {
                    for (let k of Object.keys(row)) { if (keys.includes(k.toLowerCase())) return row[k]; }
                    return null;
                };
                return {
                    ra: String(getVal(['ra', 'id']) || Math.random().toString(36).substr(2, 9)),
                    nome: String(getVal(['nome', 'name', 'aluno']) || 'Sem Nome').trim(),
                    curso: String(getVal(['curso']) || 'DSM').trim().toUpperCase(),
                    periodo: String(getVal(['periodo', 'turma']) || '1').trim()
                };
            }).filter(s => s.nome !== 'Sem Nome');

            model.addStudents(normalized);
            alert(`${normalized.length} alunos processados.`);
            input.value = '';
            refreshUI();

        } catch (err) {
            console.error(err);
            alert('Erro ao ler arquivo.');
        }
    };

    if (file.name.endsWith('.json')) reader.readAsText(file);
    else reader.readAsBinaryString(file);
}

// --- Clipboard ---
function copyToClipboard() {
    const date = document.getElementById('chamadaData').value;
    const curso = document.getElementById('chamadaCurso').value;
    const period = document.getElementById('chamadaPeriodo').value;
    const type = document.getElementById('chamadaTipo').value;

    const checked = document.querySelectorAll('.attendance-check:checked');
    if (!checked.length) return alert('Ninguém selecionado.');

    const names = Array.from(checked).map(cb => cb.dataset.name);
    const [a, m, d] = date.split('-');
    const text = `Lista de Presença - ${curso} ${period} - ${d}/${m}/${a}\nTipo: ${type}\nTotal: ${names.length}\n----------------\n${names.join('\n')}`;

    navigator.clipboard.writeText(text).then(() => alert('Copiado!'));
}