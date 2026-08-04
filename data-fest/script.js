// =========================================================================
// 🔥 CONFIGURACIÓN DE FIREBASE
// =========================================================================
const firebaseConfig = {
  apiKey: "AIzaSyCnlaRrFJ8P7xuKsisN9ts7MQj_W6zaV1g",
  authDomain: "datafest-2026-c874a.firebaseapp.com",
  projectId: "datafest-2026-c874a",
  storageBucket: "datafest-2026-c874a.firebasestorage.app",
  messagingSenderId: "261695768132",
  appId: "1:261695768132:web:d0f0affe8e72b6bc4fde11"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const COLLECTION_NAME = 'datafest2026';

    // ============================================================
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
        }, 3500);
    }

    // ===== FECHA =====
    function actualizarFecha() {
        const ahora = new Date();
        const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        document.getElementById('fechaActual').textContent = ahora.toLocaleDateString('es-ES', opciones);
    }

    // ===== DATOS INICIALES =====
    const datosIniciales = [
        { dni: '70123456', nombres: 'Ana Lucía', apellidos: 'Mamani Colque', correo: 'ana.mamani@unap.edu.pe', telefono: '+51 952 123 456', institucion: 'Universidad Nacional del Altiplano', tipo: 'Ponente', modalidad: 'Presencial', dia: '15/06/2026', certificado: 'CERT-2026-001', estado: 'Certificado' },
        { dni: '71234567', nombres: 'Carlos Andrés', apellidos: 'Quispe Huanca', correo: 'carlos.quispe@unap.edu.pe', telefono: '+51 963 321 654', institucion: 'Universidad Nacional del Altiplano', tipo: 'Estudiante', modalidad: 'Virtual', dia: '16/06/2026', certificado: 'CERT-2026-002', estado: 'Certificado' },
        { dni: '72345678', nombres: 'Diana Marisol', apellidos: 'Paredes Flores', correo: 'diana.paredes@unap.edu.pe', telefono: '+51 974 567 890', institucion: 'Universidad Nacional del Altiplano', tipo: 'Investigador', modalidad: 'Híbrido', dia: '17/06/2026', certificado: 'CERT-2026-003', estado: 'Certificado' },
        { dni: '73456789', nombres: 'Jorge Luis', apellidos: 'Mendoza Rivera', correo: 'jorge.mendoza@unap.edu.pe', telefono: '+51 985 432 109', institucion: 'Universidad Nacional del Altiplano', tipo: 'Organizador', modalidad: 'Presencial', dia: '15/06/2026', certificado: 'CERT-2026-004', estado: 'Certificado' },
        { dni: '74567890', nombres: 'Rosa María', apellidos: 'Vargas Sotomayor', correo: 'rosa.vargas@unap.edu.pe', telefono: '+51 996 543 210', institucion: 'Universidad Nacional del Altiplano', tipo: 'Ponente', modalidad: 'Virtual', dia: '16/06/2026', certificado: 'CERT-2026-005', estado: 'Certificado' },
        { dni: '75678901', nombres: 'Miguel Ángel', apellidos: 'Torres Puma', correo: 'miguel.torres@unap.edu.pe', telefono: '+51 907 654 321', institucion: 'Universidad Nacional del Altiplano', tipo: 'Estudiante', modalidad: 'Híbrido', dia: '17/06/2026', certificado: 'CERT-2026-006', estado: 'Certificado' },
        { dni: '76789012', nombres: 'Patricia Isabel', apellidos: 'Flores Arapa', correo: 'patricia.flores@unap.edu.pe', telefono: '+51 918 765 432', institucion: 'Universidad Nacional del Altiplano', tipo: 'Investigador', modalidad: 'Presencial', dia: '15/06/2026', certificado: 'CERT-2026-007', estado: 'Certificado' },
        { dni: '77890123', nombres: 'Luis Fernando', apellidos: 'Cáceres Mamani', correo: 'luis.caceres@unap.edu.pe', telefono: '+51 929 876 543', institucion: 'Universidad Nacional del Altiplano', tipo: 'Organizador', modalidad: 'Virtual', dia: '16/06/2026', certificado: 'CERT-2026-008', estado: 'Certificado' },
        { dni: '78901234', nombres: 'Carmen Rosa', apellidos: 'Mamani Vilca', correo: 'carmen.mamani@unap.edu.pe', telefono: '+51 930 987 654', institucion: 'Universidad Nacional del Altiplano', tipo: 'Ponente', modalidad: 'Híbrido', dia: '17/06/2026', certificado: 'CERT-2026-009', estado: 'Certificado' },
        { dni: '79012345', nombres: 'José Antonio', apellidos: 'Quispe Calcina', correo: 'jose.quispe@unap.edu.pe', telefono: '+51 941 098 765', institucion: 'Universidad Nacional del Altiplano', tipo: 'Estudiante', modalidad: 'Presencial', dia: '15/06/2026', certificado: 'CERT-2026-010', estado: 'Certificado' },
        { dni: '80123456', nombres: 'María Fernanda', apellidos: 'Gutiérrez Rojas', correo: 'maria.gutierrez@unap.edu.pe', telefono: '+51 952 111 222', institucion: 'Universidad Nacional del Altiplano', tipo: 'Investigador', modalidad: 'Virtual', dia: '16/06/2026', certificado: 'CERT-2026-011', estado: 'Certificado' },
        { dni: '81234567', nombres: 'Roberto Carlos', apellidos: 'Mendoza Flores', correo: 'roberto.mendoza@unap.edu.pe', telefono: '+51 963 333 444', institucion: 'Universidad Nacional del Altiplano', tipo: 'Organizador', modalidad: 'Presencial', dia: '17/06/2026', certificado: 'CERT-2026-012', estado: 'Certificado' },
        { dni: '82345678', nombres: 'Laura Isabel', apellidos: 'Ramos Quispe', correo: 'laura.ramos@unap.edu.pe', telefono: '+51 974 555 666', institucion: 'Universidad Nacional del Altiplano', tipo: 'Ponente', modalidad: 'Híbrido', dia: '15/06/2026', certificado: 'CERT-2026-013', estado: 'Certificado' }
    ];

    let registros = [];
    let cargando = false;

    // ===== FUNCIONES DE CLOUD FIRESTORE =====

    // Cargar datos desde Firestore
    async function cargarDesdeCloud() {
        try {
            const tbody = document.getElementById('cuerpoTabla');
            tbody.innerHTML = `<tr class="empty-row"><td colspan="11">⏳ Cargando desde la nube...</td></tr>`;
            
            const snapshot = await db.collection(COLLECTION_NAME).orderBy('createdAt', 'desc').get();
            
            if (snapshot.empty) {
                // Si no hay datos en la nube, subir los datos iniciales
                await subirDatosIniciales();
                return;
            }
            
            registros = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                registros.push({
                    id: doc.id,
                    ...data
                });
            });
            
            renderizarTabla();
            showToast(`✅ Datos cargados desde la nube (${registros.length} registros)`, 'success');
            
        } catch (error) {
            console.error('Error al cargar desde Cloud:', error);
            showToast('❌ Error al cargar datos desde la nube', 'error');
            // Fallback: intentar cargar desde localStorage
            cargarDesdeLocal();
        }
    }

    // Subir datos iniciales a Firestore
    async function subirDatosIniciales() {
        try {
            showToast('📤 Subiendo datos iniciales a la nube...', 'info');
            
            const batch = db.batch();
            datosIniciales.forEach((dato) => {
                const docRef = db.collection(COLLECTION_NAME).doc();
                batch.set(docRef, {
                    ...dato,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
            
            await batch.commit();
            showToast('✅ Datos iniciales subidos a la nube', 'success');
            
            // Recargar datos
            await cargarDesdeCloud();
            
        } catch (error) {
            console.error('Error al subir datos iniciales:', error);
            showToast('❌ Error al subir datos a la nube', 'error');
            // Fallback a localStorage
            cargarDesdeLocal();
        }
    }

    // Guardar un nuevo registro en Firestore
    async function guardarEnCloud(registro) {
        try {
            const docRef = await db.collection(COLLECTION_NAME).add({
                ...registro,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            registro.id = docRef.id;
            showToast('✅ Registro guardado en la nube', 'success');
            return registro;
            
        } catch (error) {
            console.error('Error al guardar en Cloud:', error);
            showToast('❌ Error al guardar en la nube', 'error');
            throw error;
        }
    }

    // Eliminar un registro de Firestore
    async function eliminarDeCloud(id) {
        try {
            await db.collection(COLLECTION_NAME).doc(id).delete();
            showToast('🗑️ Registro eliminado de la nube', 'success');
            return true;
        } catch (error) {
            console.error('Error al eliminar de Cloud:', error);
            showToast('❌ Error al eliminar de la nube', 'error');
            throw error;
        }
    }

    // Actualizar un registro en Firestore
    async function actualizarEnCloud(id, datos) {
        try {
            await db.collection(COLLECTION_NAME).doc(id).update(datos);
            showToast('✅ Registro actualizado en la nube', 'success');
            return true;
        } catch (error) {
            console.error('Error al actualizar en Cloud:', error);
            showToast('❌ Error al actualizar en la nube', 'error');
            throw error;
        }
    }

    // Sincronizar todos los registros con la nube
    async function sincronizarCloud() {
        const btn = document.getElementById('btnSyncCloud');
        btn.classList.add('loading');
        btn.querySelector('.btn-text').textContent = 'Sincronizando...';
        
        try {
            await cargarDesdeCloud();
        } finally {
            btn.classList.remove('loading');
            btn.querySelector('.btn-text').textContent = 'Sincronizar Nube';
        }
    }

    // ===== FALLBACK: LOCALSTORAGE =====
    const STORAGE_KEY = 'datafest_local';

    function cargarDesdeLocal() {
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
        renderizarTabla();
        showToast('📱 Usando almacenamiento local (sin conexión a la nube)', 'info');
    }

    function guardarLocal() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
    }

    // ===== RENDERIZAR TABLA =====
    function renderizarTabla() {
        const tbody = document.getElementById('cuerpoTabla');

        if (registros.length === 0) {
            tbody.innerHTML = `<tr class="empty-row"><td colspan="11">📋 No hay registros.</td></tr>`;
            actualizarContadores();
            return;
        }

        let html = '';
        registros.forEach((r, index) => {
            const tipoClase = {
                'Estudiante': 'badge-estudiante',
                'Ponente': 'badge-ponente',
                'Investigador': 'badge-investigador',
                'Organizador': 'badge-organizador',
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

            const cloudId = r.id ? `<span style="font-size:0.55rem;color:#0d47a1;" title="ID en Cloud"><i class="fas fa-cloud"></i></span>` : '';

            html += `
                <tr data-id="${r.id || index}">
                    <td>${index + 1}</td>
                    <td><strong>${r.dni || ''}</strong> ${cloudId}</td>
                    <td>${r.nombres || ''}</td>
                    <td>${r.apellidos || ''}</td>
                    <td>${r.correo || ''}</td>
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
        actualizarContadores();
    }

    function actualizarContadores() {
        document.getElementById('totalRegistros').textContent = registros.length;
        document.getElementById('totalCertificados').textContent = registros.filter(r => r.estado === 'Certificado').length;
        document.getElementById('contadorRegistros').textContent = registros.length;
    }

    // ===== FUNCIONES DEL SISTEMA =====
    function generarCertificado() {
        const count = registros.filter(r => r.estado === 'Certificado').length + 1;
        return `CERT-2026-${String(count).padStart(3, '0')}`;
    }

    async function registrarParticipante(e) {
        e.preventDefault();

        const btn = document.getElementById('btnRegistrar');
        btn.classList.add('loading');

        try {
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
                dni,
                nombres,
                apellidos,
                correo,
                telefono: telefono || 'No especificado',
                institucion: institucion || 'Universidad Nacional del Altiplano',
                tipo,
                modalidad,
                dia,
                certificado: certificado || 'Pendiente',
                estado
            };

            // Guardar en la nube
            const registrado = await guardarEnCloud(nuevo);
            registros.push(registrado);
            renderizarTabla();
            guardarLocal();

            document.getElementById('registroForm').reset();
            document.getElementById('institucion').value = 'Universidad Nacional del Altiplano';
            document.getElementById('numCertificado').value = '';
            showToast(`✅ ${nombres} registrado exitosamente en la nube.`, 'success');

        } catch (error) {
            showToast('❌ Error al registrar. Verifica la conexión.', 'error');
        } finally {
            btn.classList.remove('loading');
        }
    }

    function limpiarFormulario() {
        document.getElementById('registroForm').reset();
        document.getElementById('institucion').value = 'Universidad Nacional del Altiplano';
        document.getElementById('numCertificado').value = '';
        document.getElementById('dni').focus();
        showToast('Formulario limpiado.', 'info');
    }

    async function eliminarRegistro() {
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
            try {
                const registro = registros[index];
                if (registro.id) {
                    await eliminarDeCloud(registro.id);
                }
                registros.splice(index, 1);
                guardarLocal();
                renderizarTabla();
                limpiarFormulario();
                showToast('🗑️ Registro eliminado.', 'success');
            } catch (error) {
                showToast('❌ Error al eliminar.', 'error');
            }
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
        a.download = `datafest_cloud_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('✅ JSON exportado.', 'success');
    }

    function exportarPDF() {
        if (registros.length === 0) {
            showToast('No hay datos para exportar a PDF.', 'error');
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF('landscape', 'mm', 'a4');

            doc.setFontSize(18);
            doc.setTextColor(10, 42, 92);
            doc.setFont('helvetica', 'bold');
            doc.text('UNIVERSIDAD NACIONAL DEL ALTIPLANO', 148, 20, { align: 'center' });

            doc.setFontSize(13);
            doc.setTextColor(184, 134, 11);
            doc.text('DATA FEST · FESTIVAL DE DATOS 2026', 148, 30, { align: 'center' });

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

            const headers = [
                ['#', 'DNI', 'Nombres', 'Apellidos', 'Correo', 'Tipo', 'Modalidad', 'Día', 'Certificado', 'Estado']
            ];

            const data = registros.map((r, i) => [
                (i + 1).toString(),
                r.dni || '',
                r.nombres || '',
                r.apellidos || '',
                r.correo || '',
                r.tipo || '',
                r.modalidad || '',
                r.dia || '',
                r.certificado && r.certificado !== 'Pendiente' ? r.certificado : '—',
                r.estado || 'Pendiente'
            ]);

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
                    5: { cellWidth: 22, halign: 'center' },
                    6: { cellWidth: 18, halign: 'center' },
                    7: { cellWidth: 18, halign: 'center' },
                    8: { cellWidth: 22, halign: 'center' },
                    9: { cellWidth: 18, halign: 'center' }
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 255]
                },
                didDrawPage: function(data) {
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

            doc.save(`datafest_cloud_${new Date().toISOString().slice(0,10)}.pdf`);
            showToast('✅ PDF exportado correctamente.', 'success');

        } catch (error) {
            console.error('Error al generar PDF:', error);
            showToast('❌ Error al generar el PDF.', 'error');
        }
    }

    async function certificarParticipante() {
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
        
        try {
            p.estado = 'Certificado';
            p.certificado = generarCertificado();
            
            if (p.id) {
                await actualizarEnCloud(p.id, { estado: p.estado, certificado: p.certificado });
            }
            
            guardarLocal();
            renderizarTabla();
            showToast(`✅ ${p.nombres} certificado con ${p.certificado}`, 'success');
        } catch (error) {
            showToast('❌ Error al certificar.', 'error');
        }
    }

    // ===== CERTIFICADO =====
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
                
                <div class="uni-seal">
                    <i class="fas fa-university"></i>
                </div>
                
                <div class="cert-title">UNIVERSIDAD NACIONAL DEL ALTIPLANO</div>
                <div class="cert-subtitle" style="font-size: 0.7rem; letter-spacing: 3px; border-bottom: 2px solid #b8860b; padding-bottom: 6px; margin-bottom: 10px;">
                    FACULTAD DE INGENIERÍA ESTADÍSTICA E INFORMÁTICA
                </div>
                
                <div style="text-align: center; margin: 8px 0 12px 0; position: relative; z-index: 1;">
                    <div style="background: linear-gradient(145deg, #fef3c7, #fde68a); display: inline-block; padding: 6px 30px; border-radius: 40px; border: 2px solid #b8860b;">
                        <span style="font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 700; color: #0a2a5c; letter-spacing: 3px;">
                            DATA FEST 2026
                        </span>
                    </div>
                    <div style="font-size: 0.7rem; color: #4a6a8a; margin-top: 4px; letter-spacing: 2px;">
                        FESTIVAL DE DATOS · INVESTIGACIÓN E INNOVACIÓN
                    </div>
                </div>
                
                <div class="cert-body-text">
                    <p style="font-size: 0.85rem; color: #2a4a6a; line-height: 1.8;">
                        La <strong>Universidad Nacional del Altiplano</strong> a través de la 
                        <strong>Facultad de Ingeniería Estadística e Informática</strong>
                    </p>
                    <p style="font-size: 0.8rem; color: #4a6a8a; margin: 4px 0;">
                        <i class="fas fa-certificate" style="color: #b8860b;"></i> 
                        <strong>OTORGA EL PRESENTE CERTIFICADO A:</strong>
                    </p>
                </div>
                
                <div class="cert-name">
                    ${p.nombres.toUpperCase()} ${p.apellidos.toUpperCase()}
                </div>
                
                <div class="cert-body-text">
                    <p style="font-size: 0.82rem; color: #2a4a6a; line-height: 1.8;">
                        Por su valiosa participación como 
                        <strong style="color: #0a2a5c; background: #fef3c7; padding: 2px 12px; border-radius: 20px;">
                            ${p.tipo}
                        </strong>
                        en el <strong>DATA FEST · Festival de Datos 2026</strong>
                    </p>
                    <p style="font-size: 0.7rem; color: #4a6a8a; margin-top: 4px; font-style: italic;">
                        "Aportando al desarrollo de la investigación científica a través del análisis de datos"
                    </p>
                </div>
                
                <div class="cert-details">
                    <span><i class="fas fa-id-card"></i> DNI: <strong>${p.dni}</strong></span>
                    <span><i class="fas fa-calendar-day"></i> Fecha: <strong>${p.dia}</strong></span>
                    <span><i class="fas fa-laptop"></i> Modalidad: <strong>${p.modalidad}</strong></span>
                    <span><i class="fas fa-certificate"></i> N° Certificado: <strong>${p.certificado}</strong></span>
                    <span><i class="fas fa-building"></i> Institución: <strong>${p.institucion || 'Universidad Nacional del Altiplano'}</strong></span>
                    <span><i class="fas fa-clock"></i> Emisión: <strong>${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
                </div>
                
                <div class="signatures">
                    <div class="signature-block">
                        <div class="firma">Dr. Juan Carlos Pérez</div>
                        <div class="sig-line"></div>
                        <div class="cargo">Director de Investigación</div>
                        <div style="font-size: 0.5rem; color: #6a8aaa; margin-top: 2px;">
                            <i class="fas fa-check-circle" style="color: #1a7a4a;"></i> Firma digital
                        </div>
                    </div>
                    <div class="signature-block">
                        <div class="firma">Dra. María Elena Flores</div>
                        <div class="sig-line"></div>
                        <div class="cargo">Coordinadora DATA FEST</div>
                        <div style="font-size: 0.5rem; color: #6a8aaa; margin-top: 2px;">
                            <i class="fas fa-check-circle" style="color: #1a7a4a;"></i> Firma digital
                        </div>
                    </div>
                    <div class="signature-block">
                        <div class="firma">Mg. Roberto Sánchez Mamani</div>
                        <div class="sig-line"></div>
                        <div class="cargo">Secretario Académico</div>
                        <div style="font-size: 0.5rem; color: #6a8aaa; margin-top: 2px;">
                            <i class="fas fa-check-circle" style="color: #1a7a4a;"></i> Firma digital
                        </div>
                    </div>
                </div>
                
                <div class="cert-footer-text">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                        <span>
                            <i class="fas fa-certificate" style="color: #b8860b;"></i> 
                            Resolución N° 001-2026-UNA
                        </span>
                        <span>
                            <i class="fas fa-qrcode" style="color: #0a2a5c;"></i> 
                            <span class="qr-sim">◆ ${p.certificado} ◆</span>
                        </span>
                        <span>
                            <i class="fas fa-globe"></i> 
                            <strong style="font-size: 0.55rem;">certificados.unap.edu.pe</strong>
                        </span>
                    </div>
                    <div style="font-size: 0.55rem; color: #6a8aaa; margin-top: 6px; border-top: 1px solid #e8edf6; padding-top: 6px;">
                        <i class="fas fa-university"></i> Ciudad Universitaria · Puno - Perú · 2026
                        <span style="margin: 0 8px;">|</span>
                        <i class="fas fa-check-circle" style="color: #1a7a4a;"></i> Certificado con valor curricular
                        <span style="margin: 0 8px;">|</span>
                        <i class="fas fa-cloud" style="color: #0d47a1;"></i> Verificado en la nube
                    </div>
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

    // ============================================================
    // ===== INICIALIZACIÓN =====
    // ============================================================

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
    document.getElementById('btnSyncCloud').addEventListener('click', sincronizarCloud);

    // ===== INICIAR =====
    actualizarFecha();
    setInterval(actualizarFecha, 60000);

    // Intentar cargar desde la nube primero
    cargarDesdeCloud();

    setTimeout(() => {
        showToast('☁️ Sistema con base de datos en la nube (Firebase)', 'info');
    }, 800);