// ===== TOAST =====
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastIcon = document.getElementById('toastIcon');
        const toastMessage = document.getElementById('toastMessage');

        toast.className = 'toast';
        if (type === 'success') {
            toast.classList.add('toast-success');
            toastIcon.className = 'fas fa-check-circle';
        } else if (type === 'error') {
            toast.classList.add('toast-error');
            toastIcon.className = 'fas fa-exclamation-circle';
        } else {
            toast.classList.add('toast-info');
            toastIcon.className = 'fas fa-info-circle';
        }

        toastMessage.textContent = message;
        toast.classList.add('show');

        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ===== FECHA =====
    function actualizarFecha() {
        const ahora = new Date();
        const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        document.getElementById('fechaActual').textContent = ahora.toLocaleDateString('es-ES', opciones);
    }

    // ===== DATOS INICIALES (13 registros) =====
    const datosIniciales = [
        { id: 1, dni: '70123456', nombres: 'Ana Lucía', apellidos: 'Mamani Colque', correo: 'ana.mamani@unap.edu.pe', telefono: '+51 952 123 456', institucion: 'Universidad Nacional del Antiplano', tipo: 'Docente', modalidad: 'Presencial', dia: '15/06/2026', certificado: 'CERT-2026-001', estado: 'Certificado' },
        { id: 2, dni: '71234567', nombres: 'Carlos Andrés', apellidos: 'Quispe Huanca', correo: 'carlos.quispe@unap.edu.pe', telefono: '+51 963 321 654', institucion: 'Universidad Nacional del Antiplano', tipo: 'Estudiante', modalidad: 'Virtual', dia: '16/06/2026', certificado: 'CERT-2026-002', estado: 'Certificado' },
        { id: 3, dni: '72345678', nombres: 'Diana Marisol', apellidos: 'Paredes Flores', correo: 'diana.paredes@unap.edu.pe', telefono: '+51 974 567 890', institucion: 'Universidad Nacional del Antiplano', tipo: 'Investigador', modalidad: 'Híbrido', dia: '17/06/2026', certificado: 'CERT-2026-003', estado: 'Certificado' },
        { id: 4, dni: '73456789', nombres: 'Jorge Luis', apellidos: 'Mendoza Rivera', correo: 'jorge.mendoza@unap.edu.pe', telefono: '+51 985 432 109', institucion: 'Universidad Nacional del Antiplano', tipo: 'Docente', modalidad: 'Presencial', dia: '15/06/2026', certificado: 'CERT-2026-004', estado: 'Certificado' },
        { id: 5, dni: '74567890', nombres: 'Rosa María', apellidos: 'Vargas Sotomayor', correo: 'rosa.vargas@unap.edu.pe', telefono: '+51 996 543 210', institucion: 'Universidad Nacional del Antiplano', tipo: 'Profesional', modalidad: 'Virtual', dia: '16/06/2026', certificado: 'CERT-2026-005', estado: 'Certificado' },
        { id: 6, dni: '75678901', nombres: 'Miguel Ángel', apellidos: 'Torres Puma', correo: 'miguel.torres@unap.edu.pe', telefono: '+51 907 654 321', institucion: 'Universidad Nacional del Antiplano', tipo: 'Estudiante', modalidad: 'Híbrido', dia: '17/06/2026', certificado: 'CERT-2026-006', estado: 'Certificado' },
        { id: 7, dni: '76789012', nombres: 'Patricia Isabel', apellidos: 'Flores Arapa', correo: 'patricia.flores@unap.edu.pe', telefono: '+51 918 765 432', institucion: 'Universidad Nacional del Antiplano', tipo: 'Investigador', modalidad: 'Presencial', dia: '15/06/2026', certificado: 'CERT-2026-007', estado: 'Certificado' },
        { id: 8, dni: '77890123', nombres: 'Luis Fernando', apellidos: 'Cáceres Mamani', correo: 'luis.caceres@unap.edu.pe', telefono: '+51 929 876 543', institucion: 'Universidad Nacional del Antiplano', tipo: 'Docente', modalidad: 'Virtual', dia: '16/06/2026', certificado: 'CERT-2026-008', estado: 'Certificado' },
        { id: 9, dni: '78901234', nombres: 'Carmen Rosa', apellidos: 'Mamani Vilca', correo: 'carmen.mamani@unap.edu.pe', telefono: '+51 930 987 654', institucion: 'Universidad Nacional del Antiplano', tipo: 'Profesional', modalidad: 'Híbrido', dia: '17/06/2026', certificado: 'CERT-2026-009', estado: 'Certificado' },
        { id: 10, dni: '79012345', nombres: 'José Antonio', apellidos: 'Quispe Calcina', correo: 'jose.quispe@unap.edu.pe', telefono: '+51 941 098 765', institucion: 'Universidad Nacional del Antiplano', tipo: 'Estudiante', modalidad: 'Presencial', dia: '15/06/2026', certificado: 'CERT-2026-010', estado: 'Certificado' },
        { id: 11, dni: '80123456', nombres: 'María Fernanda', apellidos: 'Gutiérrez Rojas', correo: 'maria.gutierrez@unap.edu.pe', telefono: '+51 952 111 222', institucion: 'Universidad Nacional del Antiplano', tipo: 'Docente', modalidad: 'Virtual', dia: '16/06/2026', certificado: 'CERT-2026-011', estado: 'Certificado' },
        { id: 12, dni: '81234567', nombres: 'Roberto Carlos', apellidos: 'Mendoza Flores', correo: 'roberto.mendoza@unap.edu.pe', telefono: '+51 963 333 444', institucion: 'Universidad Nacional del Antiplano', tipo: 'Investigador', modalidad: 'Presencial', dia: '17/06/2026', certificado: 'CERT-2026-012', estado: 'Certificado' },
        { id: 13, dni: '82345678', nombres: 'Laura Isabel', apellidos: 'Ramos Quispe', correo: 'laura.ramos@unap.edu.pe', telefono: '+51 974 555 666', institucion: 'Universidad Nacional del Antiplano', tipo: 'Profesional', modalidad: 'Híbrido', dia: '15/06/2026', certificado: 'CERT-2026-013', estado: 'Certificado' }
    ];

    const STORAGE_KEY = 'congresoEstadistica2026';
    let registros = [];

    function cargarDatos() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                registros = JSON.parse(stored);
                if (registros.length === 0) {
                    registros = JSON.parse(JSON.stringify(datosIniciales));
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
                }
            } catch (e) {
                registros = JSON.parse(JSON.stringify(datosIniciales));
                localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
            }
        } else {
            registros = JSON.parse(JSON.stringify(datosIniciales));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
        }
    }

    function guardarRegistros() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
    }

    // ===== RENDERIZAR TABLA =====
    function renderizarTabla() {
        const tbody = document.getElementById('cuerpoTabla');
        const contador = document.getElementById('contadorRegistros');
        const totalReg = document.getElementById('totalRegistros');
        const totalCert = document.getElementById('totalCertificados');

        if (registros.length === 0) {
            tbody.innerHTML = `<tr class="empty-row"><td colspan="12">📋 No hay registros.</td></tr>`;
            contador.textContent = '0';
            totalReg.textContent = '0';
            totalCert.textContent = '0';
            return;
        }

        let html = '';
        registros.forEach((r, index) => {
            const tipoClase = {
                'Estudiante': 'badge-estudiante',
                'Docente': 'badge-docente',
                'Profesional': 'badge-profesional',
                'Investigador': 'badge-investigador',
                'Otro': 'badge-otro'
            } [r.tipo] || 'badge-otro';

            const estadoClase = {
                'Activo': 'badge-activo',
                'Pendiente': 'badge-pendiente',
                'Certificado': 'badge-certificado'
            } [r.estado] || 'badge-pendiente';

            const certDisplay = r.certificado && r.certificado !== 'Pendiente' ? 
                `<span class="badge-cert"><i class="fas fa-certificate"></i> ${r.certificado}</span>` : 
                `<span style="color:#999;font-size:0.7rem;">—</span>`;

            html += `
                <tr data-id="${r.id}">
                    <td>${index + 1}</td>
                    <td><strong>${r.dni || ''}</strong></td>
                    <td>${r.nombres || ''}</td>
                    <td>${r.apellidos || ''}</td>
                    <td>${r.correo || ''}</td>
                    <td>${r.telefono || ''}</td>
                    <td><span class="badge-tipo ${tipoClase}">${r.tipo || 'Otro'}</span></td>
                    <td><span class="badge-tipo" style="background:#e8edf6;color:#0f3b70;">${r.modalidad || ''}</span></td>
                    <td>${r.dia || ''}</td>
                    <td>${certDisplay}</td>
                    <td><span class="badge-status ${estadoClase}">${r.estado || 'Pendiente'}</span></td>
                    <td>
                        <button class="btn-accion btn-accion-cert" onclick="verCertificado('${r.dni}')">
                            <i class="fas fa-certificate"></i> Ver
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
        contador.textContent = registros.length;
        totalReg.textContent = registros.length;
        totalCert.textContent = registros.filter(r => r.estado === 'Certificado').length;
    }

    // ===== FUNCIONES DEL SISTEMA =====
    function obtenerNuevoId() {
        if (registros.length === 0) return 1;
        return Math.max(...registros.map(r => r.id)) + 1;
    }

    function generarCertificado() {
        const count = registros.filter(r => r.estado === 'Certificado').length + 1;
        return `CERT-2026-${String(count).padStart(3, '0')}`;
    }

    function registrarParticipante(e) {
        e.preventDefault();

        const dni = document.getElementById('dni').value.trim();
        const nombres = document.getElementById('nombres').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const institucion = document.getElementById('institucion').value.trim();
        const tipo = document.getElementById('tipoParticipante').value;
        const modalidad = document.getElementById('modalidad').value;
        const dia = document.getElementById('dia').value;
        let certificado = document.getElementById('numCertificado').value.trim();
        const estado = document.getElementById('estado').value;

        if (!dni || !nombres || !apellidos || !correo) {
            showToast('DNI, Nombres, Apellidos y Correo son obligatorios.', 'error');
            return;
        }
        if (!/^\d{7,8}$/.test(dni)) {
            showToast('DNI debe tener 7 u 8 dígitos.', 'error');
            return;
        }
        if (!correo.includes('@') || !correo.includes('.')) {
            showToast('Correo inválido.', 'error');
            return;
        }
        if (registros.some(r => r.dni === dni)) {
            showToast(`DNI ${dni} ya registrado.`, 'error');
            return;
        }

        if (!certificado && estado === 'Certificado') {
            certificado = generarCertificado();
        }

        const nuevo = {
            id: obtenerNuevoId(),
            dni,
            nombres,
            apellidos,
            correo,
            telefono: telefono || 'No especificado',
            institucion: institucion || 'Universidad Nacional del Antiplano',
            tipo,
            modalidad,
            dia,
            certificado: certificado || 'Pendiente',
            estado
        };

        registros.push(nuevo);
        guardarRegistros();
        renderizarTabla();

        document.getElementById('registroForm').reset();
        document.getElementById('institucion').value = 'Universidad Nacional del Antiplano';
        document.getElementById('numCertificado').value = '';
        showToast(`✅ ${nombres} registrado exitosamente.`, 'success');
    }

    function limpiarFormulario() {
        document.getElementById('registroForm').reset();
        document.getElementById('institucion').value = 'Universidad Nacional del Antiplano';
        document.getElementById('numCertificado').value = '';
        document.getElementById('dni').focus();
        showToast('Formulario limpiado.', 'info');
    }

    function eliminarRegistro() {
        const dni = document.getElementById('dni').value.trim();
        if (!dni) {
            showToast('Ingrese un DNI para eliminar.', 'error');
            return;
        }
        const index = registros.findIndex(r => r.dni === dni);
        if (index === -1) {
            showToast(`DNI ${dni} no encontrado.`, 'error');
            return;
        }
        if (confirm(`¿Eliminar a ${registros[index].nombres} ${registros[index].apellidos}?`)) {
            registros.splice(index, 1);
            guardarRegistros();
            renderizarTabla();
            limpiarFormulario();
            showToast('🗑️ Registro eliminado.', 'success');
        }
    }

    function exportarJSON() {
        if (registros.length === 0) {
            showToast('No hay datos para exportar.', 'error');
            return;
        }
        const json = JSON.stringify(registros, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `congreso_2026_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('✅ JSON exportado.', 'success');
    }

    // ===== EXPORTAR PDF PROFESIONAL =====
    function exportarPDF() {
        if (registros.length === 0) {
            showToast('No hay datos para exportar a PDF.', 'error');
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('landscape', 'mm', 'a4');

            // ===== ENCABEZADO =====
            doc.setFontSize(18);
            doc.setTextColor(10, 42, 92);
            doc.setFont('helvetica', 'bold');
            doc.text('UNIVERSIDAD NACIONAL DEL ANTIPLANO', 148, 20, { align: 'center' });

            doc.setFontSize(13);
            doc.setTextColor(184, 134, 11);
            doc.text('CONGRESO DE ESTADÍSTICA 2026', 148, 30, { align: 'center' });

            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            doc.setFont('helvetica', 'normal');
            doc.text('LISTA DE PARTICIPANTES INSCRITOS', 148, 38, { align: 'center' });

            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            const fecha = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
            doc.text(`Fecha de emisión: ${fecha}`, 20, 46);
            doc.text(`Total de participantes: ${registros.length}`, 20, 52);
            doc.text(`Certificados emitidos: ${registros.filter(r => r.estado === 'Certificado').length}`, 20, 58);

            // ===== TABLA =====
            const headers = [
                ['#', 'DNI', 'Nombres', 'Apellidos', 'Correo', 'Teléfono', 'Tipo', 'Modalidad', 'Día', 'Certificado', 'Estado']
            ];

            const data = registros.map((r, i) => [
                (i + 1).toString(),
                r.dni || '',
                r.nombres || '',
                r.apellidos || '',
                r.correo || '',
                r.telefono || '',
                r.tipo || '',
                r.modalidad || '',
                r.dia || '',
                r.certificado && r.certificado !== 'Pendiente' ? r.certificado : '—',
                r.estado || 'Pendiente'
            ]);

            // Configuración de la tabla
            doc.autoTable({
                head: headers,
                body: data,
                startY: 65,
                theme: 'grid',
                styles: {
                    fontSize: 7,
                    cellPadding: 2.5,
                    lineColor: [180, 180, 180],
                    lineWidth: 0.3,
                },
                headStyles: {
                    fillColor: [10, 42, 92],
                    textColor: [255, 255, 255],
                    fontSize: 7,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                columnStyles: {
                    0: { cellWidth: 10, halign: 'center' },
                    1: { cellWidth: 20, halign: 'center' },
                    2: { cellWidth: 28 },
                    3: { cellWidth: 28 },
                    4: { cellWidth: 32 },
                    5: { cellWidth: 22 },
                    6: { cellWidth: 20, halign: 'center' },
                    7: { cellWidth: 18, halign: 'center' },
                    8: { cellWidth: 18, halign: 'center' },
                    9: { cellWidth: 22, halign: 'center' },
                    10: { cellWidth: 18, halign: 'center' }
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 255]
                },
                didDrawPage: function(data) {
                    // Pie de página
                    const pageCount = doc.internal.getNumberOfPages();
                    const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
                    
                    doc.setFontSize(7);
                    doc.setTextColor(150, 150, 150);
                    doc.text(`Página ${currentPage} de ${pageCount}`, 270, 195, { align: 'right' });
                    
                    doc.setFontSize(6);
                    doc.text('Ingeniería Estadística e Informática - UNA Puno', 20, 195);
                    doc.text('Resolución N° 001-2026-UNA', 148, 195, { align: 'center' });
                },
                margin: { top: 65, bottom: 20 }
            });

            // Guardar PDF
            doc.save(`participantes_congreso_2026_${new Date().toISOString().slice(0,10)}.pdf`);
            showToast('✅ PDF exportado correctamente.', 'success');

        } catch (error) {
            console.error('Error al generar PDF:', error);
            showToast('❌ Error al generar el PDF. Verifica la consola.', 'error');
        }
    }

    function certificarParticipante() {
        const dni = document.getElementById('dni').value.trim();
        if (!dni) {
            showToast('Ingrese un DNI para certificar.', 'error');
            return;
        }
        const p = registros.find(r => r.dni === dni);
        if (!p) {
            showToast(`DNI ${dni} no encontrado.`, 'error');
            return;
        }
        if (p.estado === 'Certificado') {
            showToast(`✅ ${p.nombres} ya está certificado.`, 'info');
            return;
        }
        p.estado = 'Certificado';
        p.certificado = generarCertificado();
        guardarRegistros();
        renderizarTabla();
        showToast(`✅ ${p.nombres} certificado con ${p.certificado}`, 'success');
    }

    // ===== CERTIFICADO REAL 100% =====
    function verCertificado(dni) {
        const p = registros.find(r => r.dni === dni);
        if (!p) {
            showToast(`DNI ${dni} no encontrado.`, 'error');
            return;
        }
        if (p.estado !== 'Certificado') {
            showToast('Este participante aún no está certificado.', 'error');
            return;
        }

        const container = document.getElementById('certificateContainer');
        container.innerHTML = `
            <div class="certificate-real" id="certReal">
                <div class="deco-border"></div>
                <div class="watermark">UNA</div>
                
                <div class="uni-seal-lg">
                    <i class="fas fa-university"></i>
                </div>
                
                <div class="cert-title-lg">CONGRESO DE ESTADÍSTICA 2026</div>
                <div class="cert-subtitle-lg">Universidad Nacional del Antiplano · Ingeniería Estadística e Informática</div>
                
                <div class="cert-body">
                    <p>La <strong>Universidad Nacional del Antiplano</strong> a través de la <strong>Escuela Profesional de Ingeniería Estadística e Informática</strong></p>
                    <p style="font-size: 0.8rem; color: #4a6a8a;">otorga el presente certificado a:</p>
                </div>
                
                <div class="cert-name-lg">${p.nombres} ${p.apellidos}</div>
                
                <div class="cert-body">
                    <p style="font-size: 0.85rem;">Por su participación en el <strong>Congreso Internacional de Estadística 2026</strong></p>
                    <p style="font-size: 0.75rem; color: #4a6a8a; margin-top: 3px;">
                        con la ponencia: <strong>"Aplicaciones de la Estadística en la Investigación Científica"</strong>
                    </p>
                </div>
                
                <div class="cert-details-lg">
                    <span><i class="fas fa-id-badge"></i> DNI: ${p.dni}</span>
                    <span><i class="fas fa-user-tag"></i> Tipo: ${p.tipo}</span>
                    <span><i class="fas fa-calendar-check"></i> Fecha: ${p.dia}</span>
                    <span><i class="fas fa-tag"></i> Modalidad: ${p.modalidad}</span>
                    <span><i class="fas fa-certificate"></i> N°: ${p.certificado}</span>
                    <span><i class="fas fa-clock"></i> Emisión: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                
                <div class="signatures-lg">
                    <div class="signature-block-lg">
                        <div class="firma-digital-lg">Dr. Juan Pérez</div>
                        <div class="sig-line-lg"></div>
                        <div class="cargo">Director de Investigación</div>
                        <div style="font-size: 0.5rem; color: #6a8aaa; margin-top: 2px;">
                            <i class="fas fa-check-circle" style="color: #1a7a4a;"></i> Firma digital
                        </div>
                    </div>
                    <div class="signature-block-lg">
                        <div class="firma-digital-lg">Dra. María Flores</div>
                        <div class="sig-line-lg"></div>
                        <div class="cargo">Coordinadora del Congreso</div>
                        <div style="font-size: 0.5rem; color: #6a8aaa; margin-top: 2px;">
                            <i class="fas fa-check-circle" style="color: #1a7a4a;"></i> Firma digital
                        </div>
                    </div>
                    <div class="signature-block-lg">
                        <div class="firma-digital-lg">Mg. Roberto Sánchez</div>
                        <div class="sig-line-lg"></div>
                        <div class="cargo">Secretario Académico</div>
                        <div style="font-size: 0.5rem; color: #6a8aaa; margin-top: 2px;">
                            <i class="fas fa-check-circle" style="color: #1a7a4a;"></i> Firma digital
                        </div>
                    </div>
                </div>
                
                <div class="cert-footer">
                    <i class="fas fa-certificate"></i> Certificado con valor curricular · Resolución N° 001-2026-UNA
                    <br>
                    <i class="fas fa-university"></i> Universidad Nacional del Antiplano · Ciudad Universitaria · Puno - Perú
                    <br>
                    <span class="qr-sim">◆ UNA-PUNO ◆ ${p.certificado} ◆</span>
                    <br>
                    <i class="fas fa-qrcode" style="color: #0a2a5c;"></i> Verificar en: <strong>certificados.unap.edu.pe/${p.certificado}</strong>
                </div>
            </div>
        `;

        document.getElementById('certModal').classList.add('show');
        document.body.style.overflow = 'hidden';
        showToast(`📄 Certificado de ${p.nombres} ${p.apellidos}`, 'info');
    }

    function cerrarModal() {
        document.getElementById('certModal').classList.remove('show');
        document.body.style.overflow = '';
    }

    function imprimirCertificado() {
        window.print();
    }

    // ===== EVENTOS =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarModal();
    });

    document.getElementById('certModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) cerrarModal();
    });

    document.getElementById('registroForm').addEventListener('submit', registrarParticipante);
    document.getElementById('btnLimpiar').addEventListener('click', limpiarFormulario);
    document.getElementById('btnEliminar').addEventListener('click', eliminarRegistro);
    document.getElementById('btnExportarJSON').addEventListener('click', exportarJSON);
    document.getElementById('btnExportarPDF').addEventListener('click', exportarPDF);
    document.getElementById('btnCertificar').addEventListener('click', certificarParticipante);

    // ===== INICIALIZAR =====
    cargarDatos();
    renderizarTabla();
    actualizarFecha();
    setInterval(actualizarFecha, 60000);

    setTimeout(() => {
        showToast('🎓 13 registros · Exporta a PDF profesional con el botón rojo', 'info');
    }, 500);