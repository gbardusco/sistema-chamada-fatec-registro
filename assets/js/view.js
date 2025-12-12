class AttendanceView {
    constructor() {
        // Elementos DOM
        this.els = {
            dbStatus: document.getElementById('dbStatus'),
            studentList: document.getElementById('studentListContainer'),
            counter: document.getElementById('counter'),
            historyList: document.getElementById('historyList'),
            dbTableBody: document.getElementById('databaseTableBody'),
            dbSelectionCount: document.getElementById('dbSelectionCount'),
            selects: {
                chamadaCurso: document.getElementById('chamadaCurso'),
                chamadaPeriodo: document.getElementById('chamadaPeriodo'),
                manageCurso: document.getElementById('manageCurso'),
                managePeriodo: document.getElementById('managePeriodo'),
                historyFilter: document.getElementById('historyFilterPeriod')
            }
        };
    }

    updateStatus(count) {
        this.els.dbStatus.textContent = count > 0 ? `${count} Alunos na Base` : 'Base Vazia';
    }

    populateSelect(elementId, items, selectedValue = null) {
        const select = document.getElementById(elementId);
        const firstText = select.options[0].text;
        select.innerHTML = `<option value="">${firstText}</option>`;

        items.forEach(item => {
            if (item) {
                const opt = document.createElement('option');
                opt.value = item;
                opt.textContent = item; // Para períodos, pode adicionar "Período " antes
                select.appendChild(opt);
            }
        });
        if (selectedValue && items.includes(selectedValue)) select.value = selectedValue;
    }

    renderStudentList(students) {
        this.els.studentList.innerHTML = '';
        if (students.length === 0) {
            this.els.studentList.innerHTML = '<div class="empty-state">Nenhum aluno encontrado para os filtros.</div>';
            return;
        }

        students.forEach(student => {
            const div = document.createElement('div');
            div.className = 'student-item';
            div.innerHTML = `
                <input type="checkbox" value="${student.ra}" data-name="${student.nome}" class="attendance-check" style="margin-right:12px; transform:scale(1.2)">
                <div style="display:flex; flex-direction:column">
                    <span style="font-weight:bold; color:var(--cps-grey)">${student.nome}</span>
                    <span style="font-size:0.75rem; color:#888">RA: ${student.ra}</span>
                </div>
            `;
            this.els.studentList.appendChild(div);
        });
    }

    updateAttendanceCounter(count) {
        this.els.counter.textContent = `${count} presentes`;
    }

    renderHistory(records, onDelete, onDownload, onToggleType) {
        this.els.historyList.innerHTML = '';
        if (records.length === 0) {
            this.els.historyList.innerHTML = '<p style="text-align:center; padding:20px;">Nenhum histórico encontrado.</p>';
            return;
        }

        records.forEach(rec => {
            const [ano, mes, dia] = rec.date.split('-');
            const div = document.createElement('div');
            div.className = 'history-card student-item'; // Reutilizando estilo
            div.style.justifyContent = 'space-between';

            div.innerHTML = `
                <div>
                    <div style="font-weight:bold; color:var(--cps-black);">
                       ${dia}/${mes}/${ano} - ${rec.course || 'DSM'} <span style="color:#666">Período ${rec.period}</span>
                    </div>
                    <div style="margin-top:6px; display:flex; align-items:center; gap:10px;">
                        <span class="tag ${rec.type === 'Entrada' ? 'entrada' : 'saida'}" id="type-${rec.id}">
                            ${rec.type} <i class="fas fa-sync-alt" style="font-size:0.7rem; margin-left:4px; opacity:0.5"></i>
                        </span>
                        <span style="font-size:0.85rem; color:#666;">
                            ${rec.presentRAs.length} alunos
                        </span>
                    </div>
                </div>
                <div>
                   <button class="btn btn-outline btn-sm btn-download"><i class="fas fa-download"></i></button>
                   <button class="btn btn-outline btn-sm btn-delete" style="color:red; border-color:#fee2e2"><i class="fas fa-trash"></i></button>
                </div>
            `;

            // Event Listeners isolados
            div.querySelector('.tag').onclick = () => onToggleType(rec.id);
            div.querySelector('.btn-download').onclick = () => onDownload(rec.id);
            div.querySelector('.btn-delete').onclick = () => onDelete(rec.id);

            this.els.historyList.appendChild(div);
        });
    }

    renderDatabaseTable(students, onEdit, onDelete, onSelect) {
        const tbody = this.els.dbTableBody;
        tbody.innerHTML = '';

        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px;">Nada encontrado.</td></tr>';
            return;
        }

        students.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" class="db-check" value="${s.ra}"></td>
                <td>${s.ra}</td>
                <td>${s.nome}</td>
                <td>${s.curso}</td>
                <td>${s.periodo}</td>
                <td class="text-right">
                    <button class="btn btn-outline btn-sm btn-edit"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm btn-del"><i class="fas fa-trash"></i></button>
                </td>
            `;

            tr.querySelector('.db-check').onchange = onSelect;
            tr.querySelector('.btn-edit').onclick = () => onEdit(s.ra);
            tr.querySelector('.btn-del').onclick = () => onDelete(s.ra);

            tbody.appendChild(tr);
        });
    }

    updateDbSelectionCount(count) {
        this.els.dbSelectionCount.textContent = `${count} selecionados`;
    }

    toggleTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

        document.getElementById(`tab-${tabId}`).classList.add('active');
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    }
}